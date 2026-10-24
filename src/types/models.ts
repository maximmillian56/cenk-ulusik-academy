import type { CEFRLevel, CourseCategory, CourseStatus } from '@/types'

export interface CourseRow {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  cover_image_url: string | null
  cefr_level: CEFRLevel | null
  category: CourseCategory
  teacher_id: string | null
  duration_hours: number | null
  status: CourseStatus
  visibility: 'public' | 'unlisted' | 'private'
  enrollment_open: boolean
  certificate_enabled: boolean
  is_featured: boolean
  is_free: boolean
  prerequisites: string[]
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface ModuleRow {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
}

export interface LessonRow {
  id: string
  module_id: string
  course_id: string
  title: string
  description: string | null
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment'
  video_url: string | null
  video_provider: 'demo' | 'mux' | 'cloudflare' | 'external'
  video_duration_seconds: number
  content: string | null
  order_index: number
  is_preview: boolean
  is_published: boolean
  resources_downloadable: boolean
}

export interface CatalogLesson {
  id: string
  module_id: string
  course_id: string
  title: string
  lesson_type: string
  video_duration_seconds: number
  order_index: number
  is_preview: boolean
}

export interface QuizRow {
  id: string
  course_id: string | null
  lesson_id: string | null
  title: string
  description: string | null
  difficulty: CEFRLevel | null
  time_limit_minutes: number
  passing_percentage: number
  max_attempts: number
  randomize_questions: boolean
  is_published: boolean
  show_results_immediately: boolean
  created_at: string
}

export interface AttemptRow {
  id: string
  quiz_id: string
  student_id: string
  score: number | null
  passed: boolean | null
  status: 'in_progress' | 'submitted'
  started_at: string
  completed_at: string | null
  correct_answers: number | null
  total_questions: number | null
  time_spent_seconds: number | null
}

export interface NotificationRow {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  link: string | null
  created_at: string
}

export interface StudentQuizPayload {
  attempt_id: string
  expires_at: string | null
  quiz: { id: string; title: string; description: string | null; difficulty: string | null; time_limit_minutes: number; passing_percentage: number }
  questions: { id: string; question_text: string; options: { id: string; option_text: string }[] }[]
  saved_answers: Record<string, string | null>
}

export interface AttemptReview {
  hidden: boolean
  score: number
  passed: boolean
  quiz_title?: string
  correct_answers?: number
  total_questions?: number
  items?: {
    question_id: string
    question_text: string
    explanation: string | null
    selected_option_id: string | null
    is_correct: boolean
    options: { id: string; option_text: string; is_correct: boolean }[]
  }[]
}
