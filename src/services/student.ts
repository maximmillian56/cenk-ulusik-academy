import { createClient } from '@/lib/supabase/server'
import { calculateProgress } from '@/lib/utils'
import type { AttemptRow, CourseRow, LessonRow, ModuleRow, NotificationRow, QuizRow } from '@/types/models'

/** All reads here run as the signed-in user, so RLS limits results to their own data. */

export interface EnrolledCourse {
  enrollment_id: string
  status: 'active' | 'completed' | 'suspended'
  enrolled_at: string
  course: Pick<CourseRow, 'id' | 'title' | 'slug' | 'cover_image_url' | 'cefr_level' | 'category' | 'duration_hours' | 'certificate_enabled'>
  total_lessons: number
  completed_lessons: number
  progress: number
  next_lesson_id: string | null
  next_lesson_title: string | null
}

export async function getEnrolledCourses(studentId: string): Promise<EnrolledCourse[]> {
  const supabase = await createClient()
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id,status,enrolled_at,course:courses(id,title,slug,cover_image_url,cefr_level,category,duration_hours,certificate_enabled)')
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false })
  const rows = (enrollments ?? []) as unknown as {
    id: string
    status: EnrolledCourse['status']
    enrolled_at: string
    course: EnrolledCourse['course'] | null
  }[]
  const courseIds = rows.map((r) => r.course?.id).filter(Boolean) as string[]
  if (!courseIds.length) return []

  const [{ data: lessons }, { data: progress }, { data: modules }] = await Promise.all([
    supabase.from('lessons').select('id,course_id,module_id,title,order_index').in('course_id', courseIds).eq('is_published', true),
    supabase.from('lesson_progress').select('lesson_id,course_id,is_completed').eq('student_id', studentId).in('course_id', courseIds),
    supabase.from('course_modules').select('id,order_index').in('course_id', courseIds),
  ])
  const modOrder = new Map(((modules ?? []) as { id: string; order_index: number }[]).map((m) => [m.id, m.order_index]))
  const done = new Set(((progress ?? []) as { lesson_id: string; is_completed: boolean }[]).filter((p) => p.is_completed).map((p) => p.lesson_id))
  const ls = ((lessons ?? []) as { id: string; course_id: string; module_id: string; title: string; order_index: number }[]).sort(
    (a, b) => (modOrder.get(a.module_id) ?? 0) - (modOrder.get(b.module_id) ?? 0) || a.order_index - b.order_index
  )

  return rows
    .filter((r) => r.course)
    .map((r) => {
      const courseLessons = ls.filter((l) => l.course_id === r.course!.id)
      const completed = courseLessons.filter((l) => done.has(l.id)).length
      const next = courseLessons.find((l) => !done.has(l.id)) ?? null
      return {
        enrollment_id: r.id,
        status: r.status,
        enrolled_at: r.enrolled_at,
        course: r.course!,
        total_lessons: courseLessons.length,
        completed_lessons: completed,
        progress: calculateProgress(completed, courseLessons.length),
        next_lesson_id: next?.id ?? courseLessons[0]?.id ?? null,
        next_lesson_title: next?.title ?? null,
      }
    })
}

export async function getRecentAttempts(studentId: string, limit = 5) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quiz_attempts')
    .select('id,quiz_id,score,passed,status,started_at,completed_at,correct_answers,total_questions,quiz:quizzes(title,difficulty)')
    .eq('student_id', studentId)
    .eq('status', 'submitted')
    .order('completed_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as (AttemptRow & { quiz: { title: string; difficulty: string | null } | null })[]
}

export async function getNotifications(userId: string, limit = 50) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('notifications')
    .select('id,title,message,type,is_read,link,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as NotificationRow[]
}

/** Lessons completed per day for the last N days (activity graph). */
export async function getActivitySeries(studentId: string, days = 14) {
  const supabase = await createClient()
  const since = new Date(Date.now() - days * 86400000)
  const { data } = await supabase
    .from('lesson_progress')
    .select('completed_at')
    .eq('student_id', studentId)
    .eq('is_completed', true)
    .gte('completed_at', since.toISOString())
  const buckets: { date: string; label: string; lessons: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      lessons: 0,
    })
  }
  for (const r of (data ?? []) as { completed_at: string | null }[]) {
    if (!r.completed_at) continue
    const b = buckets.find((x) => x.date === r.completed_at!.slice(0, 10))
    if (b) b.lessons++
  }
  return buckets
}

/** Quizzes available to the student (RLS: published + enrolled course). */
export async function getAvailableQuizzes(studentId: string) {
  const supabase = await createClient()
  const [{ data: quizzes }, { data: attempts }] = await Promise.all([
    supabase
      .from('quizzes')
      .select('id,title,description,difficulty,time_limit_minutes,passing_percentage,max_attempts,course_id,lesson_id,course:courses(title)')
      .eq('is_published', true)
      .order('created_at'),
    supabase.from('quiz_attempts').select('quiz_id,score,passed,status').eq('student_id', studentId),
  ])
  const at = (attempts ?? []) as { quiz_id: string; score: number | null; passed: boolean | null; status: string }[]
  return ((quizzes ?? []) as unknown as (QuizRow & { course: { title: string } | null })[]).map((q) => {
    const mine = at.filter((a) => a.quiz_id === q.id)
    const submitted = mine.filter((a) => a.status === 'submitted')
    return {
      ...q,
      attempts_used: mine.length,
      in_progress: mine.some((a) => a.status === 'in_progress'),
      best_score: submitted.length ? Math.max(...submitted.map((a) => Number(a.score ?? 0))) : null,
      passed: submitted.some((a) => a.passed),
    }
  })
}

export interface LessonPageData {
  lesson: LessonRow
  course: Pick<CourseRow, 'id' | 'title' | 'slug'>
  modules: (ModuleRow & { lessons: Pick<LessonRow, 'id' | 'title' | 'order_index' | 'video_duration_seconds' | 'lesson_type'>[] })[]
  completedIds: string[]
  progress: { progress_seconds: number; is_completed: boolean; notes: string | null } | null
  resources: { id: string; title: string; file_url: string; file_size: string | null; storage_path: string | null }[]
  quizzes: Pick<QuizRow, 'id' | 'title' | 'difficulty'>[]
  prevId: string | null
  nextId: string | null
  enrolled: boolean
}

/** Returns null if the lesson does not exist OR the user is not allowed to see it (RLS). */
export async function getLessonPageData(lessonId: string, studentId: string): Promise<LessonPageData | null> {
  const supabase = await createClient()
  const { data: lesson } = await supabase.from('lessons').select('*').eq('id', lessonId).maybeSingle()
  if (!lesson) return null
  const l = lesson as LessonRow

  const [{ data: course }, { data: modules }, { data: lessons }, { data: progress }, { data: resources }, { data: quizzes }, { data: enr }] =
    await Promise.all([
      supabase.from('courses').select('id,title,slug').eq('id', l.course_id).maybeSingle(),
      supabase.from('course_modules').select('*').eq('course_id', l.course_id).order('order_index'),
      supabase.from('lessons').select('id,module_id,title,order_index,video_duration_seconds,lesson_type').eq('course_id', l.course_id).eq('is_published', true).order('order_index'),
      supabase.from('lesson_progress').select('lesson_id,progress_seconds,is_completed,notes').eq('student_id', studentId).eq('course_id', l.course_id),
      supabase.from('lesson_resources').select('id,title,file_url,file_size,storage_path').eq('lesson_id', l.id),
      supabase.from('quizzes').select('id,title,difficulty').eq('lesson_id', l.id).eq('is_published', true),
      supabase.from('enrollments').select('status').eq('student_id', studentId).eq('course_id', l.course_id).maybeSingle(),
    ])
  if (!course) return null

  const mods = ((modules ?? []) as ModuleRow[]).map((m) => ({
    ...m,
    lessons: ((lessons ?? []) as (LessonPageData['modules'][number]['lessons'][number] & { module_id: string })[]).filter((x) => x.module_id === m.id),
  }))
  const flat = mods.flatMap((m) => m.lessons)
  const idx = flat.findIndex((x) => x.id === l.id)
  const prog = (progress ?? []) as { lesson_id: string; progress_seconds: number; is_completed: boolean; notes: string | null }[]
  const mine = prog.find((p) => p.lesson_id === l.id) ?? null

  return {
    lesson: l,
    course: course as LessonPageData['course'],
    modules: mods,
    completedIds: prog.filter((p) => p.is_completed).map((p) => p.lesson_id),
    progress: mine,
    resources: (resources ?? []) as LessonPageData['resources'],
    quizzes: (quizzes ?? []) as LessonPageData['quizzes'],
    prevId: idx > 0 ? flat[idx - 1].id : null,
    nextId: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1].id : null,
    enrolled: ['active', 'completed'].includes((enr as { status?: string } | null)?.status ?? ''),
  }
}

export async function getCertificates(studentId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('certificates')
    .select('id,verification_id,issued_at,course:courses(id,title,cefr_level)')
    .eq('student_id', studentId)
    .order('issued_at', { ascending: false })
  return (data ?? []) as unknown as { id: string; verification_id: string; issued_at: string; course: { id: string; title: string; cefr_level: string | null } | null }[]
}
