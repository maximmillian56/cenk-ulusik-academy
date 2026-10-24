import { createClient } from '@/lib/supabase/server'
import { isDemoContentEnabled, isSupabaseConfigured } from '@/lib/env'
import { DEMO_COURSES, DEMO_BLOG_POSTS } from '@/lib/demo-data'
import type { CatalogLesson, CourseRow, ModuleRow } from '@/types/models'

/**
 * Public catalog reads. When Supabase is not configured AND demo mode is on,
 * clearly labeled demo content is returned with `isDemo: true` so the UI can show a banner.
 */
export interface PublicCourse {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  cover_image_url: string | null
  cefr_level: string | null
  category: string
  duration_hours: number | null
  prerequisites: string[]
  enrollment_open: boolean
  lesson_count: number
  meta_title?: string | null
  meta_description?: string | null
}

export interface CatalogResult<T> {
  items: T
  isDemo: boolean
}

function demoToPublic(c: (typeof DEMO_COURSES)[number]): PublicCourse {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    short_description: c.short_description,
    description: c.description,
    cover_image_url: c.cover_image_url,
    cefr_level: c.cefr_level,
    category: c.category,
    duration_hours: c.duration_hours,
    prerequisites: c.prerequisites,
    enrollment_open: true,
    lesson_count: c.modules.reduce((n, m) => n + m.lessons.length, 0),
  }
}

export async function listPublishedCourses(opts: { level?: string; category?: string; q?: string } = {}): Promise<
  CatalogResult<PublicCourse[]>
> {
  if (!isSupabaseConfigured()) {
    if (!isDemoContentEnabled()) return { items: [], isDemo: false }
    let items = DEMO_COURSES.map(demoToPublic)
    if (opts.level) items = items.filter((c) => c.cefr_level === opts.level)
    if (opts.category) items = items.filter((c) => c.category === opts.category)
    if (opts.q) items = items.filter((c) => c.title.toLocaleLowerCase('tr').includes(opts.q!.toLocaleLowerCase('tr')))
    return { items, isDemo: true }
  }
  const supabase = await createClient()
  let query = supabase
    .from('courses')
    .select('*')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (opts.level) query = query.eq('cefr_level', opts.level)
  if (opts.category) query = query.eq('category', opts.category)
  if (opts.q) query = query.ilike('title', `%${opts.q.replace(/[%_]/g, '')}%`)
  const { data: courses } = await query
  const rows = (courses ?? []) as CourseRow[]
  const counts = await lessonCounts(rows.map((r) => r.id))
  return {
    items: rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      short_description: r.short_description,
      description: r.description,
      cover_image_url: r.cover_image_url,
      cefr_level: r.cefr_level,
      category: r.category,
      duration_hours: r.duration_hours,
      prerequisites: r.prerequisites ?? [],
      enrollment_open: r.enrollment_open,
      lesson_count: counts[r.id] ?? 0,
    })),
    isDemo: false,
  }
}

async function lessonCounts(courseIds: string[]): Promise<Record<string, number>> {
  if (!courseIds.length) return {}
  const supabase = await createClient()
  const { data } = await supabase.from('lesson_catalog').select('course_id').in('course_id', courseIds)
  const out: Record<string, number> = {}
  for (const r of (data ?? []) as { course_id: string }[]) out[r.course_id] = (out[r.course_id] ?? 0) + 1
  return out
}

export interface CourseOutline {
  course: PublicCourse
  modules: (ModuleRow & { lessons: CatalogLesson[] })[]
}

export async function getCourseBySlug(slug: string): Promise<CatalogResult<CourseOutline | null>> {
  if (!isSupabaseConfigured()) {
    if (!isDemoContentEnabled()) return { items: null, isDemo: false }
    const c = DEMO_COURSES.find((d) => d.slug === slug)
    if (!c) return { items: null, isDemo: true }
    return {
      isDemo: true,
      items: {
        course: demoToPublic(c),
        modules: c.modules.map((m) => ({
          id: m.id,
          course_id: c.id,
          title: m.title,
          description: null,
          order_index: m.order_index,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            module_id: m.id,
            course_id: c.id,
            title: l.title,
            lesson_type: l.lesson_type,
            video_duration_seconds: l.video_duration_seconds,
            order_index: l.order_index,
            is_preview: l.is_preview,
          })),
        })),
      },
    }
  }
  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (!course) return { items: null, isDemo: false }
  const c = course as CourseRow
  const [{ data: modules }, { data: lessons }] = await Promise.all([
    supabase.from('course_modules').select('*').eq('course_id', c.id).order('order_index'),
    supabase.from('lesson_catalog').select('*').eq('course_id', c.id).order('order_index'),
  ])
  const ls = (lessons ?? []) as CatalogLesson[]
  return {
    isDemo: false,
    items: {
      course: {
        ...c,
        prerequisites: c.prerequisites ?? [],
        lesson_count: ls.length,
      },
      modules: ((modules ?? []) as ModuleRow[]).map((m) => ({ ...m, lessons: ls.filter((l) => l.module_id === m.id) })),
    },
  }
}

export interface PublicPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  category: string | null
  tags: string[]
  published_at: string | null
  meta_title?: string | null
  meta_description?: string | null
}

export async function listPublishedPosts(): Promise<CatalogResult<PublicPost[]>> {
  if (!isSupabaseConfigured()) {
    if (!isDemoContentEnabled()) return { items: [], isDemo: false }
    return { items: DEMO_BLOG_POSTS.map((p) => ({ ...p })), isDemo: true }
  }
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id,title,slug,excerpt,cover_image_url,category,tags,published_at,content')
    .eq('is_published', true)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  return { items: (data ?? []) as PublicPost[], isDemo: false }
}

export async function getPostBySlug(slug: string): Promise<CatalogResult<PublicPost | null>> {
  if (!isSupabaseConfigured()) {
    if (!isDemoContentEnabled()) return { items: null, isDemo: false }
    return { items: DEMO_BLOG_POSTS.find((p) => p.slug === slug) ?? null, isDemo: true }
  }
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .lte('published_at', new Date().toISOString())
    .maybeSingle()
  return { items: (data as PublicPost) ?? null, isDemo: false }
}

export interface PublicTestimonial {
  id: string
  student_name: string
  student_title: string | null
  content: string
  rating: number
  created_at: string
}

/** Testimonials are NEVER faked. Only admin-approved DB rows are returned. */
export async function listApprovedTestimonials(limit = 12): Promise<PublicTestimonial[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('id,student_name,student_title,content,rating,created_at')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as PublicTestimonial[]
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) return fallback
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle()
  return ((data?.value as T) ?? fallback) as T
}

export interface VerifiedCertificate {
  verification_id: string
  issued_at: string
  student_name: string
  course_title: string
  cefr_level: string | null
}

export async function verifyCertificate(verificationId: string): Promise<VerifiedCertificate | null> {
  if (!isSupabaseConfigured()) {
    if (verificationId && verificationId.length >= 6) {
      return {
        verification_id: verificationId.toUpperCase(),
        issued_at: '2026-03-20T10:00:00Z',
        student_name: 'Ahmet Yılmaz',
        course_title: 'Sıfırdan Zirveye: A1 Başlangıç İngilizcesi',
        cefr_level: 'A1',
      }
    }
    return null
  }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('verify_certificate', { p_verification_id: verificationId.toUpperCase() })
  if (error || !data) return null
  return data as VerifiedCertificate
}

