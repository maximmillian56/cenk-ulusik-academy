'use client'

import * as React from 'react'
import { BarChart3, TrendingUp, Users, Award, BookOpen, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const levelDistribution = [
  { level: 'A1 Başlangıç', students: 14, pct: 45 },
  { level: 'A2 Temel', students: 6, pct: 20 },
  { level: 'B1 Orta', students: 8, pct: 25 },
  { level: 'B2 Üst Orta', students: 3, pct: 10 },
]

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Akademi İstatistik & Başarı Raporları
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Öğrenci seviye dağılımı, kurs tamamlama oranları ve platform metrikleri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Level Distribution Card */}
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-royal-600" />
              Öğrenci Seviye Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {levelDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{item.level}</span>
                  <span className="text-muted-foreground">{item.students} Öğrenci (%{item.pct})</span>
                </div>
                <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-royal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completion & Engagement */}
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Award className="h-4 w-4 text-gold-600" />
              Kurs Bitirme & Sınav Performansı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Ortalama Sınav Puanı</span>
                <span className="font-display font-black text-2xl text-foreground mt-0.5 block">%84.2</span>
              </div>
              <Badge variant="success">Yüksek Başarı</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Düzenlenen Sertifika Sayısı</span>
                <span className="font-display font-black text-2xl text-foreground mt-0.5 block">12</span>
              </div>
              <Badge variant="gold">Doğrulanmış</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Toplam Video İzlenme</span>
                <span className="font-display font-black text-2xl text-foreground mt-0.5 block">142 Saat</span>
              </div>
              <Badge variant="outline">Akademi Toplamı</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
