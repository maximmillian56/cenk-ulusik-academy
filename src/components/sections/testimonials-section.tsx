import { Star, ShieldCheck } from 'lucide-react'
import { DEMO_TESTIMONIALS } from '@/lib/demo-data'

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400 mb-2">
            <ShieldCheck className="h-4 w-4" />
            Doğrulanmış Öğrenci Yorumları
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Öğrencilerimiz Neler Söylüyor?
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Sadece sistemde kurs tamamlamış öğrencilerin onaylanmış samimi geri bildirimleri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {DEMO_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-card border border-border/70 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
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
    </section>
  )
}
