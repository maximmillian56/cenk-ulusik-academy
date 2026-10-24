import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/course/course-card'
import { DEMO_COURSES } from '@/lib/demo-data'

export function CoursesPreviewSection() {
  const featuredCourses = DEMO_COURSES.slice(0, 3)

  return (
    <section className="section-padding bg-muted/40">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-royal-600 dark:text-royal-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <BookOpen className="h-4 w-4" />
              Müfredatımız
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Öne Çıkan Kurslarımız
            </h2>
            <p className="text-base text-muted-foreground mt-2 max-w-xl">
              Hedefinize en uygun seviyeden başlayarak akıcı İngilizce konuşma yolculuğunuza adım atın.
            </p>
          </div>

          <Link href="/kurslar">
            <Button variant="outline" className="gap-2 rounded-xl group border-royal-600/30 text-royal-600 dark:text-royal-400">
              Tüm Kursları Gör
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
