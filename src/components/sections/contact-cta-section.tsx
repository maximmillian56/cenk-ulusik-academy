import Link from 'next/link'
import { ArrowRight, MessageSquare, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactCTASection() {
  return (
    <section className="section-padding bg-muted/40 border-t border-border/40">
      <div className="container-custom">
        <div className="rounded-3xl bg-card border border-border/80 p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600 dark:text-royal-400 mx-auto mb-6">
            <MessageSquare className="h-7 w-7" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Doğru Eğitimi Seçmek İçin Bize Danışın
          </h2>

          <p className="text-muted-foreground text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Seviyeniz, hedefleriniz ve zaman planınız hakkında bizimle iletişime geçin.
            Size en uygun kurs programını birlikte belirleyelim.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/iletisim" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2">
                Hemen İletişime Geçin <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/kurslar" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto border-border">
                Kursları İncele
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground pt-6 border-t border-border/60">
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-royal-600" />
              info@cenkulusik.com
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-gold-600" />
              +90 555 123 45 67 (WhatsApp)
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
