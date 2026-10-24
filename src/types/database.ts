export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          preferred_language: 'tr' | 'en'
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          preferred_language?: 'tr' | 'en'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          preferred_language?: 'tr' | 'en'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'student' | 'teacher' | 'admin'
          assigned_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'student' | 'teacher' | 'admin'
          assigned_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'student' | 'teacher' | 'admin'
          assigned_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          cover_image_url: string | null
          cefr_level: string | null
          category: string
          teacher_id: string | null
          duration_hours: number | null
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          is_free: boolean
          prerequisites: string[] | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          short_description?: string | null
          cover_image_url?: string | null
          cefr_level?: string | null
          category?: string
          teacher_id?: string | null
          duration_hours?: number | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          is_free?: boolean
          prerequisites?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          cover_image_url?: string | null
          cefr_level?: string | null
          category?: string
          teacher_id?: string | null
          duration_hours?: number | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          is_free?: boolean
          prerequisites?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'course_modules_course_id_fkey'
            columns: ['course_id']
            referencedRelation: 'courses'
            referencedColumns: ['id']
          }
        ]
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          course_id: string
          title: string
          description: string | null
          lesson_type: 'video' | 'text' | 'quiz' | 'assignment'
          video_url: string | null
          video_provider: string | null
          video_duration_seconds: number | null
          content: string | null
          order_index: number
          is_preview: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          course_id: string
          title: string
          description?: string | null
          lesson_type?: 'video' | 'text' | 'quiz' | 'assignment'
          video_url?: string | null
          video_provider?: string | null
          video_duration_seconds?: number | null
          content?: string | null
          order_index?: number
          is_preview?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          course_id?: string
          title?: string
          description?: string | null
          lesson_type?: 'video' | 'text' | 'quiz' | 'assignment'
          video_url?: string | null
          video_provider?: string | null
          video_duration_seconds?: number | null
          content?: string | null
          order_index?: number
          is_preview?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          status: 'active' | 'completed' | 'suspended'
          enrolled_at: string
          completed_at: string | null
          assigned_by: string | null
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          status?: 'active' | 'completed' | 'suspended'
          enrolled_at?: string
          completed_at?: string | null
          assigned_by?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          status?: 'active' | 'completed' | 'suspended'
          enrolled_at?: string
          completed_at?: string | null
          assigned_by?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          id: string
          student_id: string
          lesson_id: string
          course_id: string
          is_completed: boolean
          progress_seconds: number
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          lesson_id: string
          course_id: string
          is_completed?: boolean
          progress_seconds?: number
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          lesson_id?: string
          course_id?: string
          is_completed?: boolean
          progress_seconds?: number
          completed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          id: string
          course_id: string | null
          lesson_id: string | null
          title: string
          description: string | null
          difficulty: string | null
          time_limit_minutes: number | null
          passing_percentage: number
          max_attempts: number | null
          randomize_questions: boolean
          is_published: boolean
          show_results_immediately: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          lesson_id?: string | null
          title: string
          description?: string | null
          difficulty?: string | null
          time_limit_minutes?: number | null
          passing_percentage?: number
          max_attempts?: number | null
          randomize_questions?: boolean
          is_published?: boolean
          show_results_immediately?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          lesson_id?: string | null
          title?: string
          description?: string | null
          difficulty?: string | null
          time_limit_minutes?: number | null
          passing_percentage?: number
          max_attempts?: number | null
          randomize_questions?: boolean
          is_published?: boolean
          show_results_immediately?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          explanation: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          explanation?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          explanation?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      quiz_options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          order_index: number
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          order_index?: number
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          order_index?: number
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          id: string
          quiz_id: string
          student_id: string
          score: number | null
          passed: boolean | null
          started_at: string
          completed_at: string | null
          time_spent_seconds: number | null
        }
        Insert: {
          id?: string
          quiz_id: string
          student_id: string
          score?: number | null
          passed?: boolean | null
          started_at?: string
          completed_at?: string | null
          time_spent_seconds?: number | null
        }
        Update: {
          id?: string
          quiz_id?: string
          student_id?: string
          score?: number | null
          passed?: boolean | null
          started_at?: string
          completed_at?: string | null
          time_spent_seconds?: number | null
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_option_id: string | null
          is_correct: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_option_id?: string | null
          is_correct?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_option_id?: string | null
          is_correct?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      course_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          interested_course: string | null
          english_level: string | null
          message: string | null
          privacy_consent: boolean
          status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          admin_notes: string | null
          created_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          interested_course?: string | null
          english_level?: string | null
          message?: string | null
          privacy_consent: boolean
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          interested_course?: string | null
          english_level?: string | null
          message?: string | null
          privacy_consent?: boolean
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          cover_image_url: string | null
          author_id: string | null
          category: string | null
          tags: string[] | null
          is_published: boolean
          meta_title: string | null
          meta_description: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          cover_image_url?: string | null
          author_id?: string | null
          category?: string | null
          tags?: string[] | null
          is_published?: boolean
          meta_title?: string | null
          meta_description?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          cover_image_url?: string | null
          author_id?: string | null
          category?: string | null
          tags?: string[] | null
          is_published?: boolean
          meta_title?: string | null
          meta_description?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          student_name: string
          student_title: string | null
          content: string
          rating: number
          course_id: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_name: string
          student_title?: string | null
          content: string
          rating?: number
          course_id?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_name?: string
          student_title?: string | null
          content?: string
          rating?: number
          course_id?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          id: string
          student_id: string
          course_id: string
          verification_id: string
          issued_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          verification_id: string
          issued_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          verification_id?: string
          issued_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          target_audience: 'all' | 'students' | 'specific'
          is_published: boolean
          created_by: string | null
          created_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          target_audience?: 'all' | 'students' | 'specific'
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          target_audience?: 'all' | 'students' | 'specific'
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          published_at?: string | null
        }
        Relationships: []
      }
      placement_attempts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string
          score: number
          estimated_level: string
          total_questions: number
          correct_answers: number
          completed_at: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id: string
          score: number
          estimated_level: string
          total_questions: number
          correct_answers: number
          completed_at?: string
          ip_address?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string
          score?: number
          estimated_level?: string
          total_questions?: number
          correct_answers?: number
          completed_at?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
