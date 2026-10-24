'use client'

import * as React from 'react'
import { DEMO_QUIZZES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, HelpCircle, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = React.useState(DEMO_QUIZZES['q-a1-1'].questions)

  const handleDelete = (id: string) => {
    if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      setQuestions(questions.filter((q) => q.id !== id))
      toast({ title: 'Soru Silindi' })
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Soru Havuzu Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Testlere ait çoktan seçmeli soruları, 4 şıkkı, doğru cevabı ve eğitmen açıklamasını düzenleyin.
          </p>
        </div>

        <Button
          onClick={() => toast({ title: 'Yeni Soru Modalı', description: 'Yeni soru formu açıldı.' })}
          className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" /> Yeni Soru Ekle
        </Button>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-6 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-royal-100 dark:bg-royal-950 text-royal-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-display font-bold text-base text-foreground">
                  {q.question_text}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast({ title: 'Soru Düzenleme Modu' })}
                  className="h-8 w-8 p-0 rounded-xl"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(q.id)}
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Options display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {q.options.map((opt) => {
                const isCorrect = opt.id === q.correct_option_id
                return (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-between ${
                      isCorrect
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-bold'
                        : 'border-border/60 bg-muted/20 text-foreground'
                    }`}
                  >
                    <span>{opt.option_text}</span>
                    {isCorrect && (
                      <Badge variant="success" className="text-[9px] gap-1 px-1.5 py-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Doğru Cevap
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Explanation */}
            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-xs text-muted-foreground">
              <strong className="text-foreground">Öğretmen Açıklaması:</strong>{' '}
              {q.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
