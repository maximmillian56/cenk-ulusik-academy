import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, CheckCircle2, Clock, RotateCcw } from 'lucide-react'

export default function StudentResultsPage() {
  const attempts = [
    {
      id: 'att-1',
      quizTitle: 'A1 Modül 1 Değerlendirme Testi',
      score: 100,
      passed: true,
      date: '2026-03-22',
      duration: '4 dk 30 sn',
    },
    {
      id: 'att-2',
      quizTitle: 'İngilizce Seviye Belirleme Sınavı',
      score: 85,
      passed: true,
      date: '2026-03-15',
      duration: '8 dk 12 sn',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
          Sınav ve Test Sonuçlarım
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daha önce tamamladığınız quizlerin geçmiş kayıtları ve puan analiziniz.
        </p>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm">
        <div className="divide-y divide-border/60">
          {attempts.map((att) => (
            <div
              key={att.id}
              className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950/60 text-green-600 flex items-center justify-center shrink-0">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {att.quizTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>Tarih: {att.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {att.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <span className="font-display font-black text-2xl text-foreground block">
                    %{att.score}
                  </span>
                  <Badge variant="success" className="text-[10px] font-bold">
                    Başarılı
                  </Badge>
                </div>
                <Link href="/ogrenci/testlerim">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1">
                    <RotateCcw className="h-3.5 w-3.5" /> Tekrar Çöz
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
