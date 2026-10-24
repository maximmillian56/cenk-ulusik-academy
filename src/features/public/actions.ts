'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured, NOT_CONFIGURED_MESSAGE } from '@/lib/env'
import { applicationSchema, fieldErrors } from '@/lib/validation'
import { fail, rateLimit, guard, audit, safeDbError, type ActionResult } from '@/lib/server-action'
import { PLACEMENT_QUESTIONS } from '@/lib/demo-data'
import { PLACEMENT_LEVELS } from '@/lib/placement'
import { estimatePlacementLevel, scoreAnswers } from '@/lib/scoring'
import { getSession } from '@/lib/auth'

export async function submitApplication(input: unknown): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse(input)
  if (!parsed.success) return fail('Lütfen form alanlarını kontrol edin.', fieldErrors(parsed.error))
  if (parsed.data.website) return { ok: true } // honeypot: silently drop bots
  if (!isSupabaseConfigured()) return fail(NOT_CONFIGURED_MESSAGE)
  if (!(await rateLimit('application', 5, 3600))) return fail('Çok fazla başvuru gönderdiniz. Lütfen daha sonra tekrar deneyin.')

  const { website: _hp, ...row } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('course_applications').insert({ ...row, status: 'pending' })
  if (error) return fail(safeDbError(error))
  return { ok: true, message: 'Başvurunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.' }
}

export async function updateApplicationStatus(id: string, status: 'reviewed' | 'accepted' | 'rejected', notes?: string): Promise<ActionResult> {
  const g = await guard('application:review')
  if (!g.ok) return g.result
  if (!['reviewed', 'accepted', 'rejected'].includes(status)) return fail('Geçersiz durum.')
  const { error } = await g.supabase
    .from('course_applications')
    .update({ status, admin_notes: notes?.slice(0, 2000) ?? null, reviewed_at: new Date().toISOString(), reviewed_by: g.session.user.id })
    .eq('id', id)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, `application.${status}`, 'course_application', id)
  revalidatePath('/admin/basvurular')
  return { ok: true, message: 'Başvuru güncellendi.' }
}

export interface PlacementResult {
  level: 'A1' | 'A2' | 'B1' | 'B2'
  correct: number
  total: number
  percentage: number
  saved: boolean
}

/** Placement test is scored on the server; the answer key never reaches the browser. */
export async function submitPlacement(answers: Record<string, string>): Promise<ActionResult<PlacementResult>> {
  if (!(await rateLimit('placement', 20, 3600))) return fail('Çok fazla deneme. Lütfen biraz sonra tekrar deneyin.')
  const key = PLACEMENT_QUESTIONS.map((q) => ({
    questionId: q.id,
    correctOptionId: q.correct_option_id,
    level: PLACEMENT_LEVELS[q.id],
  }))
  const safe: Record<string, string> = {}
  for (const k of key) if (typeof answers?.[k.questionId] === 'string') safe[k.questionId] = answers[k.questionId].slice(0, 8)
  const s = scoreAnswers(key, safe)
  const level = estimatePlacementLevel(key, safe)

  let saved = false
  if (isSupabaseConfigured()) {
    const session = await getSession()
    const supabase = await createClient()
    const { error } = await supabase.from('placement_attempts').insert({
      user_id: session?.user.id ?? null,
      session_id: crypto.randomUUID(),
      score: s.percentage,
      estimated_level: level,
      total_questions: s.total,
      correct_answers: s.correct,
    })
    saved = !error
    if (session && !error) await supabase.from('profiles').update({ english_level: level }).eq('id', session.user.id)
  }
  return { ok: true, data: { level, correct: s.correct, total: s.total, percentage: s.percentage, saved } }
}
