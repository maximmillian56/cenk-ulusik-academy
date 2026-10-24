import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { DEMO_COURSES } from '@/lib/demo-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Award,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react'
import { COURSE_CATEGORIES } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = DEMO_COURSES.find((c) => c.slug === slug)

  if (!course) {
    return { title: 'Kurs Bulunamadı' }
  }

  return {
    title: `${course.title} — Cenk Uluşık English Academy`,
    description: course.short_description,
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const course = DEMO_COURSES.find((c) => c.slug === slug)

  if (!course) {
    notFound()
  }

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  )

  return (
    <div className="py-12 lg:py-16">
      <div className="container-custom">
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href="/kurslar" className="hover:text-foreground">
            Kurslar
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {course.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="gold" className="font-bold">
                  {course.cefr_level} Seviyesi
                </Badge>
                <Badge variant="secondary">
                  {COURSE_CATEGORIES[course.category] || course.category}
                </Badge>
                {course.is_free && (
                  <Badge variant="success">Ücretsiz Kayıt</Badge>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border/60 mt-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-royal-600" />
                  <span>Eğitmen: <strong className="text-foreground">{course.teacher_name}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-royal-600" />
                  <span>Toplam Süre: <strong className="text-foreground">{course.duration_hours} Saat</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-royal-600" />
                  <span>{totalLessons} Ders & Test</span>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Kurs Hakkında
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="p-6 rounded-3xl bg-muted/30 border border-border/70">
                <h3 className="font-display font-bold text-base text-foreground mb-3">
                  Ön Koşullar ve Hedef Kitle
                </h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Curriculum */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Kurs Müfredatı
                </h2>
                <span className="text-xs text-muted-foreground font-semibold">
                  {course.modules.length} Modül • {totalLessons} Ders
                </span>
              </div>

              <div className="space-y-4">
                {course.modules.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-border/70 bg-card overflow-hidden"
                  >
                    <div className="p-4 bg-muted/40 border-b border-border/50 flex items-center justify-between">
                      <h3 className="font-display font-bold text-base text-foreground">
                        {m.title}
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium">
                        {m.lessons.length} Ders
                      </span>
                    </div>

                    <div className="divide-y divide-border/40">
                      {m.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="h-4 w-4 text-royal-600 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lesson.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {lesson.is_preview ? (
                              <Badge variant="outline" className="text-xs border-green-500/40 text-green-600 dark:text-green-400">
                                Önizleme
                              </Badge>
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl border-2 border-border/80 bg-card p-6 shadow-xl space-y-6">
              {/* Media Preview */}
              <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.cover_image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-3xl font-extrabold text-foreground">
                    {course.is_free ? 'Ücretsiz' : 'Başvuru İle Kayıt'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kayıt sonrası tüm ders videolarına ve quizlere anında erişim.
                </p>
              </div>

              <div className="space-y-3">
                <Link href={`/ogrenci/kurs/${course.id}`} className="block">
                  <Button size="xl" className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2 shadow-lg">
                    {course.is_free ? 'Hemen Derse Başla' : 'Kursa Kaydol / Başvur'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/iletisim" className="block">
                  <Button size="lg" variant="outline" className="w-full text-xs">
                    Öğretmene Soru Sor
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Ömür boyu sınırsız erişim</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Mobil, tablet ve bilgisayar uyumlu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gold-500 shrink-0" />
                  <span>Platform bitirme başarı sertifikası</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-royal-500 shrink-0" />
                  <span>Doğrulanmış müfredat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
