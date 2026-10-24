'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PlacementTestCTASection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl gradient-navy text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-slate-700"
        >
          {/* Background glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-royal-600/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Ücretsiz Seviye Tespit Sınavı
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              İngilizce Seviyenizi <br />
              <span className="text-gold-400">10 Dakikada</span> Öğrenin
            </h2>

            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl">
              Hangi kursun size uygun olduğunu bilmiyor musunuz? A1&apos;den C1&apos;e orijinal
              sorularla hazırlanmış seviye testimizi çözün, anında sonuç ve kurs tavsiyesi alın.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <Clock className="h-4 w-4 text-gold-400 shrink-0" />
                <span>10-15 Dakika</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                <span>20 Çoktan Seçmeli Soru</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                <span>Anında Detaylı Sonuç</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/seviye-testi">
                <Button size="xl" variant="gold" className="text-navy-900 font-bold px-8 shadow-xl w-full sm:w-auto group">
                  Teste Başla
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <span className="text-xs text-slate-400 self-center sm:self-auto">
                *Kayıt gerektirmez, hemen başlayabilirsiniz.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
