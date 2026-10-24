'use client'

import { motion } from 'motion/react'
import { Target, PlaySquare, HelpCircle, Trophy } from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Seviye Belirleme',
    desc: '20 soruluk ücretsiz online seviye testimizi çözün, CEFR seviyenizi ve eksik olduğunuz konuları anında öğrenin.',
    icon: Target,
  },
  {
    step: '02',
    title: 'Yapılandırılmış Video Dersler',
    desc: 'Cenk Uluşık ile çekilmiş yüksek çözünürlüklü, mantık ve konuşma odaklı video dersleri kendi hızınızda takip edin.',
    icon: PlaySquare,
  },
  {
    step: '03',
    title: 'İnteraktif Sınav & Pratik',
    desc: 'Her ünitenin ardından modül testlerini çözerek öğrendiklerinizi pekiştirin; anlık geribildirim ve açıklamalarla ilerleyin.',
    icon: HelpCircle,
  },
  {
    step: '04',
    title: 'Sertifika & Özgüven',
    desc: 'Kursu başarıyla tamamladığınızda platform onaylı doğrulama kodlu mezuniyet sertifikanızı alın ve özgüvenle konuşun.',
    icon: Trophy,
  },
]

export function LearningJourneySection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400 block mb-2">
            Adım Adım Başarı
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Dört Aşamalı Öğrenme Yolculuğu
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Karmaşık teoriler yok. Sistematik, ölçülebilir ve hedefe ulaştıran 4 temel adım.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 rounded-3xl bg-card border border-border/70 hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Step counter */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600 dark:text-royal-400 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-4xl font-black text-slate-200 dark:text-slate-800">
                  {item.step}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
