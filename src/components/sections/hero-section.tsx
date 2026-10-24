'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { label: 'Eğitim Seviyeleri', value: 'A1 - C1', note: 'Kapsamlı CEFR Müfredatı' },
  { label: 'Öğrenme Metodu', value: 'Aktif Konuşma', note: 'Çeviri Yapmadan Konuş' },
  { label: 'Ders Materyalleri', value: 'Video & Quiz', note: 'İnteraktif Alıştırmalar' },
  { label: 'Başarı Belgesi', value: 'Sertifika', note: 'Platform Doğrulamalı' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden gradient-navy text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-royal-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gold-500/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-700/10 blur-[100px]" />

        {/* Floating words background */}
        <div className="absolute top-16 left-12 text-white/5 font-display font-black text-6xl select-none hidden lg:block">
          FLUENT
        </div>
        <div className="absolute top-36 right-16 text-white/5 font-display font-black text-7xl select-none hidden lg:block">
          CONFIDENCE
        </div>
        <div className="absolute bottom-24 left-24 text-white/5 font-display font-black text-6xl select-none hidden lg:block">
          SPEAKING
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 mb-8 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-gold-400" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
              Cenk Uluşık ile Birebir & Dijital Akademi
            </span>
          </motion.div>

          {/* Slogan */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6"
          >
            İngilizceyi Sadece Öğrenme, <br />
            <span className="gradient-text-gold">Özgüvenle Konuş!</span>
          </motion.h1>

          {/* Secondary Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-blue-200 font-medium tracking-wide mb-4 italic"
          >
            Learn English. Unlock Your Future.
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Ezbere dayalı değil; mantığını kavrayarak ve aktif pratikle İngilizce öğrenin.
            A1&apos;den C1&apos;e yapılandırılmış video dersler, modüler sınavlar ve kişisel
            ilerleme takibi tek bir platformda.
          </motion.p>

          {/* Two Key Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/kayit" className="w-full sm:w-auto">
              <Button size="xl" variant="gold" className="w-full sm:w-auto group text-navy-900 font-bold px-8 shadow-xl">
                Hemen Ücretsiz Başla
                <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/seviye-testi" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/60 bg-white/5 backdrop-blur-sm px-8"
              >
                <Play className="h-4 w-4 mr-2 text-gold-400 fill-gold-400" />
                Seviye Testini Yap
              </Button>
            </Link>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md"
              >
                <span className="text-xl sm:text-2xl font-bold font-display text-gold-400">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-white mt-1 text-center">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 text-center">
                  {stat.note}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative divider wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 text-background"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L80,37.3C160,43,320,53,480,48C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32L1440,60L1360,60C1280,60,1120,60,960,60C800,60,640,60,480,60C320,60,160,60,80,60L0,60Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}
