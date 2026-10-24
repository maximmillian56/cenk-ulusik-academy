import Link from 'next/link'
import { Clock, BookOpen, ArrowRight, PlayCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COURSE_CATEGORIES } from '@/lib/utils'

export interface CourseCardProps {
  course: {
    id: string
    title: string
    slug: string
    short_description: string | null
    cover_image_url: string | null
    cefr_level: string | null
    category: string
    duration_hours: number | null
    is_free?: boolean
    teacher_name?: string
    profiles?: { full_name: string | null } | null
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const teacher = course.teacher_name || (course.profiles as any)?.full_name || 'Cenk Uluşık'

  return (
    <div className="group rounded-3xl overflow-hidden border border-border/70 bg-card hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
        {course.cover_image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.cover_image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-900 to-royal-900">
            <BookOpen className="h-12 w-12 text-royal-400" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Level & Free Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          {course.cefr_level && (
            <Badge variant="gold" className="font-bold text-xs shadow-md">
              {course.cefr_level}
            </Badge>
          )}
          {course.is_free && (
            <Badge variant="success" className="font-semibold text-xs shadow-md">
              Ücretsiz
            </Badge>
          )}
        </div>

        {course.duration_hours && (
          <div className="absolute bottom-3 right-3 text-xs font-semibold text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gold-400" />
            <span>{course.duration_hours} Saat</span>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-royal-600 dark:text-royal-400">
            {COURSE_CATEGORIES[course.category] || course.category}
          </span>
        </div>

        <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-2 group-hover:text-royal-600 transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {course.short_description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed flex-1">
            {course.short_description}
          </p>
        )}

        <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-royal-100 dark:bg-royal-900/60 flex items-center justify-center text-xs font-bold text-royal-700 dark:text-royal-300">
              CU
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {teacher}
            </span>
          </div>

          <Link href={`/kurslar/${course.slug}`}>
            <Button size="sm" variant="ghost" className="gap-1 text-royal-600 hover:text-royal-700 hover:bg-royal-50 dark:hover:bg-royal-950 p-2 font-semibold">
              İncele <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
