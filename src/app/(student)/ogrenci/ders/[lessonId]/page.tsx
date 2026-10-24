'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { DEMO_COURSES, DEMO_QUIZZES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  PlayCircle,
  CheckCircle2,
  FileText,
  Download,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Video,
  Sparkles,
  Award,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { setLessonCompleted } from '@/features/learning/actions'

export default function LessonPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = (params?.lessonId as string) || 'les-1'

  // Find lesson across all demo courses
  let currentCourse = DEMO_COURSES[0]
  let currentLesson = currentCourse.modules[0].lessons[0]
  let allCourseLessons: typeof currentLesson[] = []

  for (const c of DEMO_COURSES) {
    for (const m of c.modules) {
      for (const l of m.lessons) {
        allCourseLessons.push(l)
        if (l.id === lessonId) {
          currentCourse = c
          currentLesson = l
        }
      }
    }
  }

  const [isCompleted, setIsCompleted] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Find next & previous lesson in the current course
  const currentIdx = allCourseLessons.findIndex((l) => l.id === currentLesson.id)
  const prevLesson = currentIdx > 0 ? allCourseLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allCourseLessons.length - 1 ? allCourseLessons[currentIdx + 1] : null

  const handleToggleComplete = async () => {
    const nextState = !isCompleted
    setIsCompleted(nextState)
    try {
      await setLessonCompleted(lessonId, nextState)
    } catch {
      // Graceful fallback for demo lessons
    }
    if (nextState) {
      toast({
        title: 'Tebrikler! Ders Tamamlandı 🎉',
        description: 'İlerlemeniz başarıyla kaydedildi.',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/ogrenci/kurslarim" className="hover:text-foreground">
              Kurslarım
            </Link>
            <span>/</span>
            <Link href={`/ogrenci/kurs/${currentCourse.id}`} className="hover:text-foreground">
              {currentCourse.title}
            </Link>
          </div>
          <h1 className="font-display font-black text-xl sm:text-2xl text-foreground">
            {currentLesson.title}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isCompleted ? 'default' : 'outline'}
            onClick={handleToggleComplete}
            className={`gap-1.5 rounded-xl font-semibold ${
              isCompleted ? 'bg-green-600 hover:bg-green-700 text-white' : ''
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isCompleted ? 'Tamamlandı' : 'Tamamlandı Olarak İşaretle'}
          </Button>

          {currentLesson.quiz_id && (
            <Link href={`/ogrenci/testlerim?quiz=${currentLesson.quiz_id}`}>
              <Button size="sm" variant="gold" className="text-navy-900 font-bold gap-1.5 rounded-xl">
                <HelpCircle className="h-4 w-4" />
                Ders Testi
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Video & Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player Frame */}
          <div className="rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 aspect-video relative group">
            <video
              ref={videoRef}
              src={currentLesson.video_url}
              controls
              className="w-full h-full object-contain"
              poster={currentCourse.cover_image_url}
              onEnded={() => setIsCompleted(true)}
            />

            {/* Demo mode badge overlay */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <Badge className="bg-navy-900/80 text-white backdrop-blur-md border border-white/20 text-xs gap-1.5">
                <Video className="h-3 w-3 text-gold-400" />
                Güvenli Video Akışı (Demo Modu)
              </Badge>
            </div>
          </div>

          {/* Navigation Prev / Next */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70">
            {prevLesson ? (
              <Link href={`/ogrenci/ders/${prevLesson.id}`}>
                <Button variant="outline" size="sm" className="gap-1 rounded-xl text-xs">
                  <ChevronLeft className="h-4 w-4" /> Önceki Ders
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link href={`/ogrenci/ders/${nextLesson.id}`}>
                <Button size="sm" className="bg-royal-600 hover:bg-royal-700 text-white gap-1 rounded-xl text-xs font-semibold">
                  Sonraki Ders <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/ogrenci/panel">
                <Button size="sm" variant="gold" className="text-navy-900 font-bold rounded-xl text-xs">
                  Kursu Bitir & Panele Dön
                </Button>
              </Link>
            )}
          </div>

          {/* Lesson Tabs: Notes & Materials */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <Tabs defaultValue="notes" className="space-y-6">
              <TabsList className="rounded-2xl p-1 bg-muted/60">
                <TabsTrigger value="notes" className="rounded-xl font-semibold text-xs sm:text-sm">
                  <FileText className="h-4 w-4 mr-1.5" /> Ders Notları & Açıklama
                </TabsTrigger>
                <TabsTrigger value="resources" className="rounded-xl font-semibold text-xs sm:text-sm">
                  <Download className="h-4 w-4 mr-1.5" /> İndirilebilir Kaynaklar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="space-y-4">
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                  {currentLesson.content}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-3">
                {currentLesson.resources && currentLesson.resources.length > 0 ? (
                  currentLesson.resources.map((res, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-border/60 bg-muted/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600">
                          <Download className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">
                            {res.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">{res.size}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-xl text-xs">
                        İndir
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-4">
                    Bu ders için ek PDF veya çalışma materyali bulunmamaktadır.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-display font-bold text-base text-foreground">
                Kurs İçeriği
              </h3>
              <Badge variant="gold" className="text-xs font-bold">
                {currentCourse.cefr_level}
              </Badge>
            </div>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {currentCourse.modules.map((m) => (
                <div key={m.id} className="space-y-1.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block px-2">
                    {m.title}
                  </span>

                  <div className="space-y-1">
                    {m.lessons.map((les) => {
                      const isCurrent = les.id === currentLesson.id
                      return (
                        <Link
                          key={les.id}
                          href={`/ogrenci/ders/${les.id}`}
                          className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-xs ${
                            isCurrent
                              ? 'bg-royal-600 text-white font-bold shadow-md'
                              : 'hover:bg-muted text-foreground/80'
                          }`}
                        >
                          <PlayCircle className={`h-4 w-4 shrink-0 ${isCurrent ? 'text-white' : 'text-royal-600'}`} />
                          <span className="line-clamp-1 flex-1">{les.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
