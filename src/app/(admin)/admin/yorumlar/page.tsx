'use client'

import * as React from 'react'
import { DEMO_TESTIMONIALS } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, CheckCircle2, XCircle, Trash2, ShieldAlert } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminTestimonialsPage() {
  const [reviews, setReviews] = React.useState([
    ...DEMO_TESTIMONIALS.map((t) => ({ ...t, is_approved: true })),
    {
      id: 'rev-pending-1',
      student_name: 'Selin Karaca',
      student_title: 'Üniversite Öğrencisi',
      content: 'A1 kursundaki video anlatımları çok net. Gramer tabloları çok yardımcı oldu.',
      rating: 5,
      course_title: 'A1 Başlangıç İngilizcesi',
      created_at: '2026-03-24',
      is_approved: false,
    },
  ])

  const handleApprove = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, is_approved: true } : r))
    )
    toast({ title: 'Yorum Onaylandı', description: 'Web sitesinde yayına alındı.' })
  }

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id))
    toast({ title: 'Yorum Silindi' })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Öğrenci Yorumları Onay Masası
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Öğrencilerden gelen deneyim ve puanlamaları inceleyin, sadece onayladıklarınızı sitede gösterin.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong>İçerik Dürüstlüğü Kuralı:</strong> Asılsız veya sahte öğrenci yorumu
          üretilmemelidir. Sadece gerçek öğrencilerin geri bildirimleri onaylanmalıdır.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl border border-border/70 bg-card shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-sm text-foreground">
                  {rev.student_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({rev.student_title})
                </span>
                <Badge variant={rev.is_approved ? 'success' : 'gold'} className="text-[10px]">
                  {rev.is_approved ? 'Yayında' : 'Onay Bekliyor'}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold-500" />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
              &ldquo;{rev.content}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
              <span>Kurs: <strong>{rev.course_title}</strong></span>
              <div className="flex items-center gap-2">
                {!rev.is_approved && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(rev.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Onayla ve Yayınla
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(rev.id)}
                  className="text-destructive hover:bg-destructive/10 text-xs rounded-xl"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Sil
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
