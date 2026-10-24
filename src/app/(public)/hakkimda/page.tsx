import type { Metadata } from 'next'
import { GraduationCap, Award, BookOpen, CheckCircle, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Cenk Uluşık Hakkında',
  description:
    'Cenk Uluşık English Academy kurucusu Cenk Uluşık hakkında bilgi edinin. Öğretim felsefesi ve metotları.',
}

export default function AboutPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-royal-600 border-royal-600/30 mb-3 px-3 py-1">
              Eğitmen & Kurucu
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Cenk Uluşık
            </h1>
            <p className="text-xl text-royal-600 dark:text-royal-400 font-semibold mt-2">
              İngilizce Öğretmeni & Eğitim Danışmanı
            </p>
          </div>

          {/* Teacher Visual Card */}
          <div className="p-8 sm:p-12 rounded-3xl gradient-navy text-white text-center mb-12 relative overflow-hidden shadow-xl">
            <div className="w-28 h-28 rounded-full bg-white/10 border-2 border-gold-400/40 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <GraduationCap className="w-14 h-14 text-gold-400" />
            </div>
            <h3 className="font-display font-bold text-2xl">Cenk Uluşık</h3>
            <p className="text-gold-400 font-medium text-sm mt-1">
              &ldquo;İngilizceyi Sadece Öğrenme, Özgüvenle Konuş!&rdquo;
            </p>
          </div>

          {/* Biography Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/90 leading-relaxed">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Öğretim Felsefemiz
            </h2>
            <p>
              Yıllarca Türkiye&apos;deki geleneksel İngilizce öğretim yöntemlerini gözlemledikten
              sonra gördüğümüz en büyük eksiklik: Gramere boğulan ve konuşma fırsatı bulamayan
              öğrencilerin dilden soğumasıdır.
            </p>
            <p>
              Cenk Uluşık English Academy olarak misyonumuz, öğrencilere teorik kurallar yığını
              sunmak yerine, dili doğal reflekslerle kullanabilecekleri iletişimsel bir zemin
              oluşturmaktır.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground pt-4">
              Eğitim Metodolojimiz
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
              {[
                { title: 'Bağlamsal Öğrenme', desc: 'Kelimeleri listelerden değil, gerçek hayat hikayelerinden öğrenin.' },
                { title: 'Çevirisiz Konuşma', desc: 'Beyninizde Türkçe aracı olmadan doğrudan İngilizce düşünün.' },
                { title: 'Aktif Geri Bildirim', desc: 'Her modül sonu testlerle anında başarı ve eksik analizi.' },
                { title: 'Özgüven İnşası', desc: 'Hata yapmaktan korkmayan, akıcı bir konuşma psikolojisi edinin.' },
              ].map((m, i) => (
                <div key={i} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                    <CheckCircle className="h-4 w-4 text-royal-600 shrink-0" />
                    <span>{m.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Content integrity warning */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 not-prose">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm mb-1">Doğrulanmış Bilgi Şeffaflığı</h4>
                  <p className="leading-relaxed">
                    Eğitmen Cenk Uluşık&apos;a ait üniversite mezuniyeti, sertifikasyonlar ve
                    kurumsal tecrübeler admin panelinden güncellenmektedir. Platformumuzda
                    asılsız veya abartılı başarı iddialarına yer verilmez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
