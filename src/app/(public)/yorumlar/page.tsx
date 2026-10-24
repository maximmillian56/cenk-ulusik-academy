import type { Metadata } from 'next'
import { DEMO_TESTIMONIALS } from '@/lib/demo-data'
import { Star, ShieldCheck, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Öğrenci Yorumları — Cenk Uluşık English Academy',
  description:
    'Cenk Uluşık English Academy öğrencilerinin gerçek deneyimleri ve onaylı başarı hikayeleri.',
}

export default function ReviewsPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <Badge variant="outline" className="text-royal-600 border-royal-600/30 mb-2 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            Şeffaf & Doğrulanmış
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Öğrencilerimizin Deneyimleri
          </h1>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Platformumuzda kurs tamamlamış öğrencilerin doğrudan geribildirimleri.
            Tüm yorumlar yönetici onayı sonrasında tarafsızca listelenir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {DEMO_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-card border border-border/70 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-gold-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>

                <p className="text-foreground/90 text-base leading-relaxed italic mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground">
                    {t.student_name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t.student_title}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-royal-50 dark:bg-royal-950 text-royal-600 dark:text-royal-400">
                  {t.course_title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
