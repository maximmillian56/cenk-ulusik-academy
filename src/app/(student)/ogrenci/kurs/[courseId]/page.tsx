import Link from 'next/link'
import { DEMO_COURSES } from '@/lib/demo-data'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Clock, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function StudentCourseOverviewPage({ params }: PageProps) {
  const { courseId } = await params
  const course = DEMO_COURSES.find((c) => c.id === courseId) || DEMO_COURSES[0]

  if (!course) {
    notFound()
  }

  const firstLessonId = course.modules[0]?.lessons[0]?.id || 'les-1'

  return (
    <div className="space-y-8">
      {/* Course Header Banner */}
      <div className="p-8 rounded-3xl gradient-navy text-white relative overflow-hidden shadow-xl border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <Badge variant="gold" className="font-bold text-xs">
            {course.cefr_level} Seviyesi
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
            {course.title}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            {course.short_description}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link href={`/ogrenci/ders/${firstLessonId}`}>
              <Button size="lg" variant="gold" className="text-navy-900 font-bold gap-2">
                <PlayCircle className="h-5 w-5" /> Derslere Başla
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modules and Lessons List */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-xl text-foreground">
          Kurs Müfredat Takvimi
        </h2>

        <div className="space-y-6">
          {course.modules.map((m) => (
            <div
              key={m.id}
              className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm"
            >
              <div className="p-5 bg-muted/40 border-b border-border/60 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {m.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {m.lessons.length} Ders
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border/40">
                {m.lessons.map((les, i) => (
                  <div
                    key={les.id}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600 shrink-0">
                        <PlayCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">
                          {les.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {les.description}
                        </p>
                      </div>
                    </div>

                    <Link href={`/ogrenci/ders/${les.id}`}>
                      <Button size="sm" variant="outline" className="text-xs rounded-xl gap-1">
                        Derse Git <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
