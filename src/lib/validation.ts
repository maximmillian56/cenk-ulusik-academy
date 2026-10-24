import { z } from 'zod'

export const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export const CATEGORIES = [
  'general_english',
  'beginner',
  'elementary',
  'intermediate',
  'upper_intermediate',
  'advanced',
  'speaking',
  'grammar',
  'vocabulary',
  'exam_preparation',
] as const

const uuid = z.string().uuid('Geçersiz kimlik.')
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null))

export const slugSchema = z
  .string()
  .trim()
  .min(3, 'Slug en az 3 karakter olmalı.')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug yalnızca küçük harf, rakam ve tire içerebilir.')

export const applicationSchema = z.object({
  full_name: z.string().trim().min(2, 'Ad soyad en az 2 karakter olmalıdır.').max(80),
  email: z.string().trim().email('Geçerli bir e-posta adresi girin.').max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[+0-9 ()-]*$/, 'Geçerli bir telefon numarası girin.')
    .optional()
    .transform((v) => (v ? v : null)),
  interested_course: optionalText(160),
  english_level: z.enum(['unknown', ...CEFR]).default('unknown'),
  message: optionalText(2000),
  privacy_consent: z.literal(true, {
    errorMap: () => ({ message: 'Devam etmek için KVKK aydınlatma metnini onaylamalısınız.' }),
  }),
  // Honeypot: real users never fill this
  website: z.string().max(0).optional(),
})

export const courseSchema = z.object({
  title: z.string().trim().min(3, 'Başlık en az 3 karakter olmalı.').max(160),
  slug: slugSchema,
  short_description: optionalText(300),
  description: optionalText(8000),
  cefr_level: z.enum(CEFR).nullable().optional(),
  category: z.enum(CATEGORIES),
  duration_hours: z.coerce.number().min(0).max(1000).nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  visibility: z.enum(['public', 'unlisted', 'private']),
  enrollment_open: z.coerce.boolean(),
  certificate_enabled: z.coerce.boolean(),
  is_featured: z.coerce.boolean(),
  prerequisites: z.array(z.string().trim().min(1).max(160)).max(10).default([]),
  meta_title: optionalText(70),
  meta_description: optionalText(170),
})

export const moduleSchema = z.object({
  course_id: uuid,
  title: z.string().trim().min(2).max(160),
  description: optionalText(1000),
})

export const lessonSchema = z.object({
  module_id: uuid,
  course_id: uuid,
  title: z.string().trim().min(2).max(160),
  description: optionalText(2000),
  lesson_type: z.enum(['video', 'text', 'quiz', 'assignment']),
  video_provider: z.enum(['demo', 'mux', 'cloudflare', 'external']),
  video_url: optionalText(500),
  video_duration_seconds: z.coerce.number().int().min(0).max(36000).default(0),
  content: optionalText(20000),
  is_preview: z.coerce.boolean(),
  is_published: z.coerce.boolean(),
  resources_downloadable: z.coerce.boolean().default(true),
})

export const quizSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: optionalText(1000),
  course_id: uuid.nullable().optional(),
  lesson_id: uuid.nullable().optional(),
  difficulty: z.enum(CEFR),
  time_limit_minutes: z.coerce.number().int().min(0).max(300),
  passing_percentage: z.coerce.number().int().min(1).max(100),
  max_attempts: z.coerce.number().int().min(0).max(50),
  randomize_questions: z.coerce.boolean(),
  show_results_immediately: z.coerce.boolean(),
  is_published: z.coerce.boolean(),
})

export const questionSchema = z
  .object({
    quiz_id: uuid,
    question_text: z.string().trim().min(3, 'Soru metni gerekli.').max(1000),
    explanation: optionalText(2000),
    options: z.array(z.string().trim().min(1, 'Seçenek boş olamaz.').max(300)).length(4, 'Tam olarak 4 seçenek gerekir.'),
    correct_index: z.coerce.number().int().min(0).max(3),
  })
  .refine((q) => new Set(q.options.map((o) => o.toLowerCase())).size === 4, {
    message: 'Seçenekler birbirinden farklı olmalı.',
    path: ['options'],
  })

export const announcementSchema = z.object({
  title: z.string().trim().min(3).max(160),
  content: z.string().trim().min(3).max(4000),
  course_id: uuid.nullable().optional(),
  is_published: z.coerce.boolean(),
})

export const blogSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: slugSchema,
  excerpt: optionalText(400),
  content: optionalText(50000),
  category: optionalText(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  is_published: z.coerce.boolean(),
  published_at: z.string().optional().transform((v) => (v ? new Date(v).toISOString() : null)),
  meta_title: optionalText(70),
  meta_description: optionalText(170),
})

export const testimonialSchema = z.object({
  student_name: z.string().trim().min(2).max(80),
  student_title: optionalText(80),
  content: z.string().trim().min(10).max(1500),
  rating: z.coerce.number().int().min(1).max(5),
  course_id: uuid.nullable().optional(),
  is_approved: z.coerce.boolean(),
})

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Ad soyad en az 2 karakter olmalıdır.').max(80),
  phone: optionalText(20),
  bio: optionalText(500),
  english_level: z.enum(CEFR).nullable().optional(),
  preferred_language: z.enum(['tr', 'en']),
})

export const enrollmentSchema = z.object({ student_id: uuid, course_id: uuid })
export const idSchema = uuid

/** Validates an uploaded image file on the server. */
export function validateImageFile(file: File | null, maxBytes = 5 * 1024 * 1024): string | null {
  if (!file || file.size === 0) return 'Dosya seçilmedi.'
  if (file.size > maxBytes) return 'Dosya boyutu 5 MB sınırını aşıyor.'
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Yalnızca JPG, PNG veya WEBP yükleyebilirsiniz.'
  return null
}

export function validateResourceFile(file: File | null, maxBytes = 25 * 1024 * 1024): string | null {
  if (!file || file.size === 0) return 'Dosya seçilmedi.'
  if (file.size > maxBytes) return 'Dosya boyutu 25 MB sınırını aşıyor.'
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'audio/mpeg', 'application/zip']
  if (!allowed.includes(file.type)) return 'Desteklenmeyen dosya türü.'
  return null
}

/** Magic-byte sniffing so a renamed executable cannot pass as an image. */
export async function sniffImage(file: File): Promise<boolean> {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const jpg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
  const webp = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45
  return jpg || png || webp
}

export function fieldErrors(error: z.ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>
}
