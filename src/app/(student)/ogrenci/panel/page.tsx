'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BookOpen,
  CheckCircle2,
  Trophy,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DEMO_COURSES } from '@/lib/demo-data'

export default function StudentDashboardPage() {
  const currentCourse = DEMO_COURSES[0] // A1 Beginner
  const progressPct = 40 // demo progress
  const completedLessons = 2
  const totalLessons = 5

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl gradient-navy text-white relative overflow-hidden shadow-xl border border-slate-700">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="gold" className="font-bold text-xs mb-3 px-3 py-1">
            Öğrenci Paneli
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Hoş Geldin, Ahmet Yılmaz! 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Öğrenme yolculuğuna kaldığın yerden devam et. Düzenli günlük 20 dakika
            pratik akıcı konuşmanın anahtarıdır.
          </p>

          <Link href={`/ogrenci/ders/les-1`}>
            <Button size="lg" variant="gold" className="text-navy-900 font-bold gap-2 shadow-lg">
              <PlayCircle className="h-5 w-5" />
              Kaldığım Yerden Devam Et
            </Button>
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold-500/20 blur-3xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground block">
              Kayıtlı Kurslar
            </span>
            <span className="font-display font-black text-3xl text-foreground mt-1 block">
              1
            </span>
            <span className="text-[11px] text-royal-600 font-medium">A1 Seviyesi Aktif</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground block">
              Tamamlanan Ders
            </span>
            <span className="font-display font-black text-3xl text-foreground mt-1 block">
              {completedLessons} / {totalLessons}
            </span>
            <span className="text-[11px] text-green-600 font-medium">%40 Tamamlandı</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground block">
              Quiz Başarı Oranı
            </span>
            <span className="font-display font-black text-3xl text-foreground mt-1 block">
              %92
            </span>
            <span className="text-[11px] text-gold-600 font-medium">Harika Başarı!</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-gold-950 flex items-center justify-center text-gold-600">
            <Trophy className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground block">
              Başarı Sertifikaları
            </span>
            <span className="font-display font-black text-3xl text-foreground mt-1 block">
              1
            </span>
            <span className="text-[11px] text-purple-600 font-medium">Doğrulanabilir</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Learning Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Course Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-foreground">
              Aktif Eğitimim
            </h2>
            <Link
              href="/ogrenci/kurslarim"
              className="text-xs font-semibold text-royal-600 hover:underline"
            >
              Tüm Kurslarım →
            </Link>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="aspect-video w-full md:w-56 rounded-2xl overflow-hidden relative shrink-0 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentCourse.cover_image_url}
                alt={currentCourse.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="gold" className="text-[10px] font-bold">
                  {currentCourse.cefr_level}
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <span className="text-xs font-bold text-royal-600 uppercase tracking-wider block">
                Devam Eden Kurs
              </span>
              <h3 className="font-display font-bold text-lg text-foreground leading-snug">
                {currentCourse.title}
              </h3>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Genel İlerleme</span>
                  <span>{progressPct}%</span>
                </div>
                <Progress value={progressPct} className="h-2" />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href={`/ogrenci/ders/les-1`}>
                  <Button size="sm" className="bg-royal-600 hover:bg-royal-700 text-white font-semibold gap-1.5 rounded-xl">
                    <PlayCircle className="h-4 w-4" /> Sıradaki Derse Git
                  </Button>
                </Link>
                <Link href={`/ogrenci/kurs/${currentCourse.id}`}>
                  <Button size="sm" variant="outline" className="rounded-xl">
                    Müfredatı Gör
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Quiz Showcase */}
          <div className="p-6 rounded-3xl bg-muted/40 border border-border/70 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-royal-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-foreground">
                  Modül 1 Değerlendirme Testi Seni Bekliyor!
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  İlk üniteyi bitirdiysen hemen bilgini test et ve ilerleme puanını yükselt.
                </p>
              </div>
            </div>
            <Link href="/ogrenci/testlerim">
              <Button size="sm" variant="gold" className="shrink-0 text-navy-900 font-bold">
                Testi Çöz
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar Info & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-display font-bold text-xl text-foreground">
            Duyurular & Bildirimler
          </h2>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm space-y-4">
            <div className="p-4 rounded-2xl bg-royal-50 dark:bg-royal-950/40 border border-royal-200 dark:border-royal-800 text-xs space-y-1">
              <span className="font-bold text-royal-700 dark:text-royal-300 block">
                📢 Yeni Konuşma Kulübü
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Bu hafta sonu B1 seviyesi için online konuşma simülasyonu odası açılıyor.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
              <span className="font-bold text-foreground block">
                🎯 Hedef Hatırlatıcı
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Bu hafta 2 ders videosu tamamlayarak haftalık hedefinize ulaşabilirsiniz.
              </p>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/ogrenci/bildirimler"
                className="text-xs font-semibold text-royal-600 hover:underline"
              >
                Tüm Bildirimleri Görüntüle →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
