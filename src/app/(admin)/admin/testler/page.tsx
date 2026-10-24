'use client'

import * as React from 'react'
import Link from 'next/link'
import { DEMO_QUIZZES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, ClipboardList, HelpCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = React.useState(Object.values(DEMO_QUIZZES))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Test & Sınav Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kurs modül sonu testlerini, süre sınırlarını ve geçme puanlarını yapılandırın.
          </p>
        </div>

        <Link href="/admin/testler/yeni">
          <Button className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl gap-2 shadow-md">
            <Plus className="h-4 w-4" /> Yeni Test Oluştur
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm divide-y divide-border/50">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 flex items-center justify-center shrink-0">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="gold" className="text-[10px] font-bold">
                    {q.difficulty}
                  </Badge>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Geçme Puanı: %{q.passing_percentage}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-foreground">
                  {q.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {q.questions.length} Çoktan Seçmeli Soru • Süre: {q.time_limit_minutes} dk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Link href="/admin/sorular">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1 font-semibold">
                  <HelpCircle className="h-3.5 w-3.5" /> Soruları Yönet
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast({ title: 'Test Düzenleme', description: `${q.title} açıldı.` })}
                className="text-xs rounded-xl"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
