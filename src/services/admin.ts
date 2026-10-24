import { createClient } from '@/lib/supabase/server'
import type { CourseRow, QuizRow } from '@/types/models'

/** Admin reads. Callers MUST have passed requireAdmin(); RLS enforces it again in the DB. */

export const PAGE_SIZE = 20

export function pageRange(page: number) {
  const p = Math.max(1, Math.floor(page) || 1)
  return { from: (p - 1) * PAGE_SIZE, to: p * PAGE_SIZE - 1, page: p }
}

async function count(table: string, apply?: (q: any) => any): Promise<number> {
  const supabase = await createClient()
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (apply) q = apply(q)
  const { count: c } = await q
  return c ?? 0
}

export async function getAdminStats() {
  const supabase = await createClient()
  const [students, activeEnrollments, completedEnrollments, totalEnrollments, publishedCourses, lessons, attempts, pendingApps] =
    await Promise.all([
      count('user_roles', (q) => q.eq('role', 'student')),
      count('enrollments', (q) => q.eq('status', 'active')),
      count('enrollments', (q) => q.eq('status', 'completed')),
      count('enrollments'),
      count('courses', (q) => q.eq('status', 'published')),
      count('lessons'),
      count('quiz_attempts', (q) => q.eq('status', 'submitted')),
      count('course_applications', (q) => q.eq('status', 'pending')),
    ])

  const since = new Date(Date.now() - 180 * 86400000).toISOString()
  const [{ data: profiles }, { data: activity }, { data: courses }, { data: enrollments }] = await Promise.all([
    supabase.from('profiles').select('created_at').gte('created_at', since),
    supabase.from('audit_logs').select('id,action,entity_type,created_at').order('created_at', { ascending: false }).limit(8),
    supabase.from('courses').select('id,title').eq('status', 'published'),
    supabase.from('enrollments').select('course_id,status'),
  ])

  const months: { label: string; key: string; students: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    months.push({ key: d.toISOString().slice(0, 7), label: d.toLocaleDateString('tr-TR', { month: 'short' }), students: 0 })
  }
  for (const p of (profiles ?? []) as { created_at: string }[]) {
    const m = months.find((x) => x.key === p.created_at.slice(0, 7))
    if (m) m.students++
  }

  const en = (enrollments ?? []) as { course_id: string; status: string }[]
  const engagement = ((courses ?? []) as { id: string; title: string }[]).map((c) => ({
    name: c.title.length > 22 ? c.title.slice(0, 22) + '…' : c.title,
    enrollments: en.filter((e) => e.course_id === c.id).length,
    completed: en.filter((e) => e.course_id === c.id && e.status === 'completed').length,
  }))

  return {
    students,
    activeEnrollments,
    publishedCourses,
    lessons,
    attempts,
    pendingApps,
    completionRate: totalEnrollments ? Math.round((completedEnrollments / totalEnrollments) * 100) : null,
    growth: months,
    engagement,
    activity: (activity ?? []) as { id: string; action: string; entity_type: string | null; created_at: string }[],
  }
}

export async function listCoursesAdmin(opts: { status?: string; q?: string } = {}) {
  const supabase = await createClient()
  let q = supabase.from('courses').select('*').order('updated_at', { ascending: false })
  if (opts.status) q = q.eq('status', opts.status)
  if (opts.q) q = q.ilike('title', `%${opts.q.replace(/[%_]/g, '')}%`)
  const [{ data: courses }, { data: enr }, { data: les }] = await Promise.all([
    q,
    supabase.from('enrollments').select('course_id,status'),
    supabase.from('lessons').select('course_id'),
  ])
  const e = (enr ?? []) as { course_id: string; status: string }[]
  const l = (les ?? []) as { course_id: string }[]
  return ((courses ?? []) as CourseRow[]).map((c) => {
    const ce = e.filter((x) => x.course_id === c.id)
    return {
      ...c,
      enrollment_count: ce.length,
      completion_rate: ce.length ? Math.round((ce.filter((x) => x.status === 'completed').length / ce.length) * 100) : null,
      lesson_count: l.filter((x) => x.course_id === c.id).length,
    }
  })
}

export async function getCourseForEdit(id: string) {
  const supabase = await createClient()
  const [{ data: course }, { data: modules }, { data: lessons }] = await Promise.all([
    supabase.from('courses').select('*').eq('id', id).maybeSingle(),
    supabase.from('course_modules').select('*').eq('course_id', id).order('order_index'),
    supabase.from('lessons').select('*').eq('course_id', id).order('order_index'),
  ])
  return { course: course as CourseRow | null, modules: modules ?? [], lessons: lessons ?? [] }
}

export async function listCourseOptions() {
  const supabase = await createClient()
  const { data } = await supabase.from('courses').select('id,title,status').neq('status', 'archived').order('title')
  return (data ?? []) as { id: string; title: string; status: string }[]
}

export async function listStudents(opts: { q?: string; level?: string; status?: string; from?: string; page?: number }) {
  const supabase = await createClient()
  const { from, to, page } = pageRange(opts.page ?? 1)
  const { data: roleRows } = await supabase.from('user_roles').select('user_id').eq('role', 'student')
  const ids = ((roleRows ?? []) as { user_id: string }[]).map((r) => r.user_id)
  if (!ids.length) return { rows: [], total: 0, page }
  let q = supabase
    .from('profiles')
    .select('id,email,full_name,english_level,status,created_at', { count: 'exact' })
    .in('id', ids)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (opts.q) {
    const s = opts.q.replace(/[%_,()]/g, '')
    q = q.or(`full_name.ilike.%${s}%,email.ilike.%${s}%`)
  }
  if (opts.level) q = q.eq('english_level', opts.level)
  if (opts.status) q = q.eq('status', opts.status)
  if (opts.from) q = q.gte('created_at', new Date(opts.from).toISOString())
  const { data, count: total } = await q
  return {
    rows: (data ?? []) as { id: string; email: string; full_name: string | null; english_level: string | null; status: string; created_at: string }[],
    total: total ?? 0,
    page,
  }
}

export async function getStudentDetail(id: string) {
  const supabase = await createClient()
  const [{ data: profile }, { data: enrollments }, { data: attempts }, { data: progress }, { data: roles }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
    supabase.from('enrollments').select('id,status,enrolled_at,course_id,course:courses(title)').eq('student_id', id),
    supabase.from('quiz_attempts').select('id,score,passed,status,completed_at,quiz:quizzes(title)').eq('student_id', id).order('started_at', { ascending: false }).limit(20),
    supabase.from('lesson_progress').select('course_id,is_completed').eq('student_id', id),
    supabase.from('user_roles').select('role').eq('user_id', id),
  ])
  return {
    profile,
    enrollments: (enrollments ?? []) as unknown as { id: string; status: string; enrolled_at: string; course_id: string; course: { title: string } | null }[],
    attempts: (attempts ?? []) as unknown as { id: string; score: number | null; passed: boolean | null; status: string; completed_at: string | null; quiz: { title: string } | null }[],
    progress: (progress ?? []) as { course_id: string; is_completed: boolean }[],
    roles: ((roles ?? []) as { role: string }[]).map((r) => r.role),
  }
}

export async function listQuizzesAdmin() {
  const supabase = await createClient()
  const [{ data: quizzes }, { data: qs }, { data: at }] = await Promise.all([
    supabase.from('quizzes').select('*, course:courses(title), lesson:lessons(title)').order('created_at', { ascending: false }),
    supabase.from('quiz_questions').select('quiz_id'),
    supabase.from('quiz_attempts').select('quiz_id,score,passed').eq('status', 'submitted'),
  ])
  const q = (qs ?? []) as { quiz_id: string }[]
  const a = (at ?? []) as { quiz_id: string; score: number; passed: boolean }[]
  return ((quizzes ?? []) as unknown as (QuizRow & { course: { title: string } | null; lesson: { title: string } | null })[]).map((z) => {
    const za = a.filter((x) => x.quiz_id === z.id)
    return {
      ...z,
      question_count: q.filter((x) => x.quiz_id === z.id).length,
      attempt_count: za.length,
      avg_score: za.length ? Math.round(za.reduce((s, x) => s + Number(x.score), 0) / za.length) : null,
      pass_rate: za.length ? Math.round((za.filter((x) => x.passed).length / za.length) * 100) : null,
    }
  })
}

export async function getQuizWithQuestions(quizId: string) {
  const supabase = await createClient()
  const [{ data: quiz }, { data: questions }] = await Promise.all([
    supabase.from('quizzes').select('*').eq('id', quizId).maybeSingle(),
    supabase
      .from('quiz_questions')
      .select('id,question_text,explanation,order_index,options:quiz_options(id,option_text,is_correct,order_index)')
      .eq('quiz_id', quizId)
      .order('order_index'),
  ])
  return {
    quiz: quiz as QuizRow | null,
    questions: (questions ?? []) as unknown as {
      id: string
      question_text: string
      explanation: string | null
      order_index: number
      options: { id: string; option_text: string; is_correct: boolean; order_index: number }[]
    }[],
  }
}

export async function listQuizAttempts(quizId?: string) {
  const supabase = await createClient()
  let q = supabase
    .from('quiz_attempts')
    .select('id,score,passed,completed_at,time_spent_seconds,quiz:quizzes(title),student:profiles(full_name,email)')
    .eq('status', 'submitted')
    .order('completed_at', { ascending: false })
    .limit(100)
  if (quizId) q = q.eq('quiz_id', quizId)
  const { data } = await q
  return (data ?? []) as unknown as {
    id: string
    score: number
    passed: boolean
    completed_at: string
    time_spent_seconds: number
    quiz: { title: string } | null
    student: { full_name: string | null; email: string } | null
  }[]
}

export async function listLessonOptions() {
  const supabase = await createClient()
  const { data } = await supabase.from('lessons').select('id,title,course_id').order('title')
  return (data ?? []) as { id: string; title: string; course_id: string }[]
}
