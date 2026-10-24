'use client'

import { motion } from 'motion/react'
import { CheckCircle2, Zap, Shield, Laptop, Brain, HeartHandshake } from 'lucide-react'

const benefits = [
  {
    title: 'Çevirisiz Düşünme Becerisi',
    desc: 'Türkçeden İngilizceye kelime kelime çeviri tuzağını kırarak doğrudan hedef dilde düşünme refleksi edinin.',
    icon: Brain,
  },
  {
    title: '7/24 Esnek Erişim',
    desc: 'Telefon, tablet veya bilgisayarınızdan dilediğiniz hızda dersleri izleyin; durdurun, tekrar edin.',
    icon: Laptop,
  },
  {
    title: 'Doğrulanabilir İlerleme',
    desc: 'Tamamlanan dersler, çözülen quizler ve detaylı karne analizi ile gelişiminizin her anını takip edin.',
    icon: Zap,
  },
  {
    title: 'Öğrenci Odaklı Destek',
    desc: 'Takıldığınız gramer konularında ve kurs seçiminde doğrudan eğitmen desteği ve rehberlik.',
    icon: HeartHandshake,
  },
  {
    title: 'Güvenli ve Modern Altyapı',
    desc: 'Kişisel verileriniz KVKK standartlarında güvenle korunur, şifreli oturum yönetimi sağlanır.',
    icon: Shield,
  },
  {
    title: 'Sürekli Güncellenen İçerik',
    desc: 'Gerçek hayatta kullanılan güncel konuşma kalıpları, deyimler ve iş dünyası senaryoları.',
    icon: CheckCircle2,
  },
]

export function BenefitsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400 block mb-2">
              Neden Biz?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Geleneksel Kursları Unutun, <br />
              <span className="text-royal-600 dark:text-royal-400">Sonuç Odaklı</span> Öğrenin
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Yıllarca süren ve ezbere dayalı kursların aksine, Cenk Uluşık English Academy
              size dili yaşayarak ve pratikle benimsetir.
            </p>

            <div className="mt-8 p-6 rounded-3xl bg-royal-600 text-white shadow-xl">
              <h4 className="font-display font-bold text-xl mb-2">
                Hedefimiz: Özgüvenle Konuşmanız
              </h4>
              <p className="text-sm text-blue-100 leading-relaxed">
                İster iş mülakatı, ister yurt dışı seyahati, ister akademik sınavlar...
                Akıcı ve duraksamadan iletişim kurmanız için yanınızdayız.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-5 rounded-3xl bg-card border border-border/70 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-4">
                  <b.icon className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-base text-foreground mb-1.5">
                  {b.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
