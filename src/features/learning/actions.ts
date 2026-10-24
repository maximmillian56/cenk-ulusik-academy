'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { fail, guard, audit, rateLimit, safeDbError, type ActionResult } from '@/lib/server-action'
import { profileSchema, fieldErrors } from '@/lib/validation'
import type { AttemptReview, StudentQuizPayload } from '@/types/models'

const uuid = z.string().uuid()

/* ----------------------------- Lesson progress ----------------------------- */

async function lessonCourse(supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>, lessonId: string) {
  // RLS: returns null unless the user may view this lesson
  const { data } = await supabase.from('lessons').select('course_id').eq('id', lessonId).maybeSingle()
  return (data as { course_id: string } | null)?.course_id ?? null
}

export async function saveLessonPosition(lessonId: string, seconds: number): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(lessonId).success) return fail('Geçersiz ders.')
  const courseId = await lessonCourse(g.supabase, lessonId)
  if (!courseId) return fail('Ders bulunamadı.')
  const { data: existing } = await g.supabase
    .from('lesson_progress')
    .select('id')
    .eq('student_id', g.session.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()
  const pos = Math.max(0, Math.min(36000, Math.floor(seconds)))
  const { error } = existing
    ? await g.supabase.from('lesson_progress').update({ progress_seconds: pos }).eq('id', (existing as { id: string }).id)
    : await g.supabase.from('lesson_progress').insert({ student_id: g.session.user.id, lesson_id: lessonId, course_id: courseId, progress_seconds: pos })
  // RLS rejects non-enrolled users (preview viewers) — that's expected, not an error to surface.
  if (error) return fail(safeDbError(error))
  return { ok: true }
}

export async function setLessonCompleted(lessonId: string, completed: boolean): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(lessonId).success) return fail('Geçersiz ders.')
  const courseId = await lessonCourse(g.supabase, lessonId)
  if (!courseId) return fail('Ders bulunamadı.')
  const { error } = await g.supabase.from('lesson_progress').upsert(
    {
      student_id: g.session.user.id,
      lesson_id: lessonId,
      course_id: courseId,
      is_completed: completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: 'student_id,lesson_id' }
  )
  if (error) return fail(error.code === '42501' ? 'İlerleme kaydı için kursa kayıtlı olmalısınız.' : safeDbError(error))
  revalidatePath('/ogrenci', 'layout')
  return { ok: true, message: completed ? 'Ders tamamlandı olarak işaretlendi.' : 'Tamamlanma işareti kaldırıldı.' }
}

export async function saveLessonNotes(lessonId: string, notes: string): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(lessonId).success) return fail('Geçersiz ders.')
  const courseId = await lessonCourse(g.supabase, lessonId)
  if (!courseId) return fail('Ders bulunamadı.')
  const { error } = await g.supabase
    .from('lesson_progress')
    .upsert({ student_id: g.session.user.id, lesson_id: lessonId, course_id: courseId, notes: notes.slice(0, 10000) }, { onConflict: 'student_id,lesson_id' })
  if (error) return fail(error.code === '42501' ? 'Not kaydetmek için kursa kayıtlı olmalısınız.' : safeDbError(error))
  return { ok: true, message: 'Notlarınız kaydedildi.' }
}

/** Short-lived signed URL for a private resource. RLS on lesson_resources enforces enrollment. */
export async function getResourceUrl(resourceId: string): Promise<ActionResult<{ url: string }>> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(resourceId).success) return fail('Geçersiz kaynak.')
  const { data } = await g.supabase.from('lesson_resources').select('file_url,storage_path').eq('id', resourceId).maybeSingle()
  const r = data as { file_url: string; storage_path: string | null } | null
  if (!r) return fail('Bu kaynağa erişiminiz yok.')
  if (!r.storage_path) return { ok: true, data: { url: r.file_url } }
  const admin = createAdminClient()
  if (!admin) return fail('Depolama yapılandırılmamış.')
  const { data: signed } = await admin.storage.from('lesson-resources').createSignedUrl(r.storage_path, 300, { download: true })
  if (!signed?.signedUrl) return fail('Dosya bulunamadı.')
  return { ok: true, data: { url: signed.signedUrl } }
}

/* --------------------------------- Quizzes --------------------------------- */

export async function startQuiz(quizId: string): Promise<ActionResult<StudentQuizPayload>> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(quizId).success) return fail('Geçersiz test.')
  if (!(await rateLimit(`quiz-start:${g.session.user.id}`, 30, 600))) return fail('Çok fazla istek. Lütfen biraz bekleyin.')
  const { data, error } = await g.supabase.rpc('start_quiz_attempt', { p_quiz_id: quizId })
  if (error) return fail(safeDbError(error))
  return { ok: true, data: data as StudentQuizPayload }
}

export async function saveQuizAnswer(attemptId: string, questionId: string, optionId: string | null): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(attemptId).success || !uuid.safeParse(questionId).success || (optionId && !uuid.safeParse(optionId).success)) {
    return fail('Geçersiz yanıt.')
  }
  const { error } = await g.supabase.rpc('save_quiz_answer', { p_attempt_id: attemptId, p_question_id: questionId, p_option_id: optionId })
  if (error) return fail(safeDbError(error))
  return { ok: true }
}

export async function submitQuiz(attemptId: string): Promise<ActionResult<{ attempt_id: string }>> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(attemptId).success) return fail('Geçersiz deneme.')
  const { data, error } = await g.supabase.rpc('submit_quiz_attempt', { p_attempt_id: attemptId })
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, 'quiz.submitted', 'quiz_attempt', attemptId, { score: (data as { score?: number })?.score })
  revalidatePath('/ogrenci', 'layout')
  return { ok: true, data: { attempt_id: attemptId } }
}

export async function getAttemptReview(attemptId: string): Promise<ActionResult<AttemptReview>> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(attemptId).success) return fail('Geçersiz deneme.')
  const { data, error } = await g.supabase.rpc('get_attempt_review', { p_attempt_id: attemptId })
  if (error) return fail(safeDbError(error))
  return { ok: true, data: data as AttemptReview }
}

/* ------------------------------ Certificates ------------------------------- */

export async function claimCertificate(courseId: string): Promise<ActionResult<{ verification_id: string }>> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(courseId).success) return fail('Geçersiz kurs.')
  const { data, error } = await g.supabase.rpc('claim_certificate', { p_course_id: courseId })
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, 'certificate.issued', 'course', courseId)
  revalidatePath('/ogrenci/sertifikalarim')
  return { ok: true, data: data as { verification_id: string }, message: 'Sertifikanız oluşturuldu.' }
}

/* ----------------------------- Notifications ------------------------------- */

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  if (!uuid.safeParse(id).success) return fail('Geçersiz bildirim.')
  const { error } = await g.supabase.from('notifications').update({ is_read: true }).eq('id', id).eq('user_id', g.session.user.id)
  if (error) return fail(safeDbError(error))
  revalidatePath('/ogrenci', 'layout')
  return { ok: true }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  const { error } = await g.supabase.from('notifications').update({ is_read: true }).eq('user_id', g.session.user.id).eq('is_read', false)
  if (error) return fail(safeDbError(error))
  revalidatePath('/ogrenci', 'layout')
  return { ok: true, message: 'Tüm bildirimler okundu olarak işaretlendi.' }
}

/* -------------------------------- Profile ---------------------------------- */

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return fail('Lütfen alanları kontrol edin.', fieldErrors(parsed.error))
  const { error } = await g.supabase.from('profiles').update(parsed.data).eq('id', g.session.user.id)
  if (error) return fail(safeDbError(error))
  revalidatePath('/ogrenci', 'layout')
  return { ok: true, message: 'Profiliniz güncellendi.' }
}

/** KVKK: records a deletion request; an admin completes it via the documented workflow. */
export async function requestAccountDeletion(): Promise<ActionResult> {
  const g = await guard()
  if (!g.ok) return g.result
  const { error } = await g.supabase
    .from('profiles')
    .update({ deletion_requested_at: new Date().toISOString() })
    .eq('id', g.session.user.id)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, 'account.deletion_requested', 'profile', g.session.user.id)
  return { ok: true, message: 'Hesap silme talebiniz alındı. 30 gün içinde işleme alınacaktır.' }
}
