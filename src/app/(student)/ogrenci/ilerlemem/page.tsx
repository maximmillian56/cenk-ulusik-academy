'use client'

import * as React from 'react'
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const weeklyActivity = [
  { day: 'Pzt', minutes: 35, lessons: 1 },
  { day: 'Sal', minutes: 45, lessons: 2 },
  { day: 'Çar', minutes: 20, lessons: 1 },
  { day: 'Per', minutes: 50, lessons: 2 },
  { day: 'Cum', minutes: 30, lessons: 1 },
  { day: 'Cmt', minutes: 60, lessons: 3 },
  { day: 'Paz', minutes: 40, lessons: 1 },
]

export default function StudentProgressPage() {
  const totalMinutes = weeklyActivity.reduce((acc, a) => acc + a.minutes, 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const maxMinutes = Math.max(...weeklyActivity.map((a) => a.minutes))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
          Öğrenme İlerleme Raporum
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Haftalık çalışma süreleriniz, ders tamamlama sıklığınız ve gelişim grafiğiniz.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Bu Hafta Çalışılan Süre</span>
            <span className="font-display font-black text-2xl text-foreground">
              {totalHours} Saat
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Tamamlanan Ünite</span>
            <span className="font-display font-black text-2xl text-foreground">
              2 Modül
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-gold-950 flex items-center justify-center text-gold-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Çalışma Serisi (Streak)</span>
            <span className="font-display font-black text-2xl text-foreground">
              7 Gün 🔥
            </span>
          </div>
        </div>
      </div>

      {/* Custom Clean Activity Chart */}
      <Card className="rounded-3xl border-border/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Haftalık Çalışma Grafiği</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Son 7 gün içindeki günlük ders çalışma süresi (dakika)
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Toplam: {totalMinutes} dk
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2">
            {weeklyActivity.map((item, idx) => {
              const heightPct = Math.round((item.minutes / maxMinutes) * 100)
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-royal-600 dark:text-royal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.minutes} dk
                  </span>
                  <div className="w-full max-w-[40px] bg-muted/60 rounded-xl overflow-hidden h-44 flex items-end">
                    <div
                      className="w-full bg-royal-600 group-hover:bg-royal-700 transition-all duration-500 rounded-t-xl"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
