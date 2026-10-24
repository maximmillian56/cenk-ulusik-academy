'use client'

import { motion } from 'motion/react'
import { GraduationCap, Award, BookCheck, ShieldAlert, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function TeacherSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Avatar / Photo Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-tr from-navy-900 via-royal-900 to-royal-700 shadow-2xl flex flex-col items-center justify-center p-8 text-center border-4 border-royal-500/20">
              <div className="relative mb-6">
                <div className="w-36 h-36 rounded-full bg-white/10 border-2 border-gold-400/40 flex items-center justify-center backdrop-blur-md">
                  <GraduationCap className="w-18 h-18 text-gold-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-royal-600 rounded-full p-2 border-2 border-navy-900 shadow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>

              <h3 className="font-display font-bold text-2xl text-white">
                Cenk Uluşık
              </h3>
              <p className="text-gold-400 font-semibold text-sm mt-1">
                İngilizce Eğitmeni & Kurucu
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 w-full text-left text-xs text-slate-300">
                <span className="font-bold text-white block mb-1">
                  📌 Öğretmen Profili:
                </span>
                Konuşma odaklı interaktif metot, CEFR standartlarında müfredat tasarımı ve
                öğrenci mentörlüğü.
              </div>
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-5 -right-2 sm:right-6 bg-card border border-border shadow-xl rounded-2xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Eğitim Yaklaşımı</p>
                <p className="text-sm font-bold text-foreground">İletişim Odaklı</p>
              </div>
            </div>
          </motion.div>

          {/* Teacher Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <Badge variant="outline" className="mb-4 text-royal-600 border-royal-600/30 font-semibold px-3 py-1">
              Eğitmeninizle Tanışın
            </Badge>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              &ldquo;Dil ezberlenmez; yaşanır, konuşulur ve hayatın parçası olur.&rdquo;
            </h2>

            <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
              <p>
                Cenk Uluşık English Academy, yıllardır süregelen &ldquo;anlıyorum ama konuşamıyorum&rdquo;
                çıkmazını kökünden çözmek üzere tasarlanmış özgün bir eğitim platformudur.
              </p>
              <p>
                Geleneksel kursların aksine, dilbilgisi kurallarını teorik formüller yerine pratik
                bağlamlar içerisinde sunarak beyninizin doğrudan İngilizce düşünmesini sağlamayı
                amaçlar.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8">
              <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600 shrink-0">
                  <BookCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Yapılandırılmış İlerleme</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    A1&apos;den C1&apos;e her seviyede net kazanım hedefleri.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-gold-100 dark:bg-gold-950 flex items-center justify-center text-gold-600 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Ölçülebilir Başarı</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Her ünite sonunda testlerle eksiksiz pekiştirme.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Note: editable placeholder warning required by instructions */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Şeffaflık İlkesi:</span>
                Eğitmen Cenk Uluşık&apos;ın mezun olduğu üniversite, resmi sertifikaları ve
                ayrıntılı mesleki özgeçmişi yönetici paneli üzerinden güncellenebilir formatta
                saklanmakta olup asılsız veya doğrulanmamış veri sunulmamaktadır.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
