export type UserRole = 'guest' | 'student' | 'teacher' | 'admin'

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type CourseCategory =
  | 'general_english'
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced'
  | 'speaking'
  | 'grammar'
  | 'vocabulary'
  | 'exam_preparation'

export type CourseStatus = 'draft' | 'published' | 'archived'

export type LessonType = 'video' | 'text' | 'quiz' | 'assignment'

export type QuizDifficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type ApplicationStatus =
  | 'pending'
  | 'reviewed'
  | 'accepted'
  | 'rejected'

export type EnrollmentStatus = 'active' | 'completed' | 'suspended'

export interface LocalizedString {
  tr: string
  en?: string
}

export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
}

export interface CourseCardData {
  id: string
  title: string
  slug: string
  description: string
  cover_image_url: string | null
  cefr_level: CEFRLevel | null
  category: CourseCategory
  teacher_name: string
  duration_hours: number | null
  lesson_count: number
  enrolled_count: number
  status: CourseStatus
}

export interface QuizQuestion {
  id: string
  question_text: string
  options: QuizOption[]
  explanation?: string
  order_index: number
}

export interface QuizOption {
  id: string
  option_text: string
  // correct_answer is NEVER sent to client before submission
}

export interface QuizResult {
  score: number
  passed: boolean
  total_questions: number
  correct_answers: number
  feedback: {
    question_id: string
    selected_option_id: string
    is_correct: boolean
    correct_option_id: string
    explanation?: string
  }[]
}

export interface DashboardStats {
  enrolled_courses: number
  completed_lessons: number
  total_lessons: number
  quiz_attempts: number
  average_score: number
  streak_days: number
}

export interface AdminStats {
  total_students: number
  active_enrollments: number
  published_courses: number
  total_lessons: number
  quiz_attempts: number
  pending_applications: number
  completion_rate: number
}
