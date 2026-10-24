'use client'

import * as React from 'react'
import Link from 'next/link'
import { DEMO_QUIZZES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function StudentQuizzesPage() {
  const quiz = DEMO_QUIZZES['q-a1-1']
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const currentQ = quiz.questions[currentIdx]
  const totalQuestions = quiz.questions.length
  const progressPct = Math.round(((currentIdx + 1) / totalQuestions) * 100)

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }))
  }

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      setIsSubmitted(true)
      toast({
        title: 'Sınav Tamamlandı!',
        description: 'Puanınız ve cevap analiziniz hazır.',
      })
    }
  }

  // Calculate score
  let correctCount = 0
  quiz.questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correct_option_id) {
      correctCount += 1
    }
  })

  const scorePct = Math.round((correctCount / totalQuestions) * 100)
  const isPassed = scorePct >= quiz.passing_percentage

  const resetQuiz = () => {
    setCurrentIdx(0)
    setSelectedAnswers({})
    setIsSubmitted(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="text-xs font-bold">
              {quiz.difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Geçme Notu: %{quiz.passing_percentage}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
            {quiz.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {quiz.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted/60 text-muted-foreground">
          <Clock className="h-4 w-4 text-royal-600" />
          <span>Süre: {quiz.time_limit_minutes} Dakika</span>
        </div>
      </div>

      {!isSubmitted ? (
        /* In-Progress Quiz */
        <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400">
              Soru {currentIdx + 1} / {totalQuestions}
            </span>
            <span className="text-xs text-muted-foreground">
              %{progressPct} Tamamlandı
            </span>
          </div>

          <Progress value={progressPct} className="h-2" />

          {/* Question Text */}
          <div className="py-4">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground leading-snug">
              {currentQ.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-royal-600 bg-royal-50/50 dark:bg-royal-950/40 font-semibold shadow-sm'
                      : 'border-border/70 hover:border-royal-600/40 hover:bg-muted/40'
                  }`}
                >
                  <span className="text-sm sm:text-base text-foreground">
                    {opt.option_text}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-royal-600 bg-royal-600 text-white'
                        : 'border-muted-foreground/30'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="pt-6 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Taslak cevabınız anında kaydedilmektedir
            </span>
            <Button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQ.id]}
              className="bg-royal-600 hover:bg-royal-700 text-white rounded-xl font-bold px-6"
            >
              {currentIdx < totalQuestions - 1 ? 'Sonraki Soru' : 'Sınavı Bitir'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Quiz Evaluation & Results */
        <div className="rounded-3xl border border-border/70 bg-card p-8 sm:p-12 shadow-xl space-y-8 text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 ${
              isPassed
                ? 'bg-green-100 text-green-600 border-green-500/40 dark:bg-green-950'
                : 'bg-rose-100 text-rose-600 border-rose-500/40 dark:bg-rose-950'
            }`}
          >
            {isPassed ? <Award className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
          </div>

          <div>
            <Badge
              variant={isPassed ? 'success' : 'destructive'}
              className="font-bold text-xs mb-2 px-3 py-1"
            >
              {isPassed ? 'Başarıyla Geçtiniz' : 'Geçme Notunun Altında Kaldınız'}
            </Badge>

            <h2 className="font-display text-3xl font-black text-foreground">
              Sınav Puanınız: %{scorePct}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Toplam <strong>{totalQuestions}</strong> sorudan <strong>{correctCount}</strong> doğru yaptınız.
              Geçme notu: %{quiz.passing_percentage}
            </p>
          </div>

          {/* Explanations & Review List */}
          <div className="text-left space-y-4 pt-6 border-t border-border/60">
            <h3 className="font-display font-bold text-lg text-foreground">
              Cevap ve Öğrenme Analizi
            </h3>

            <div className="space-y-4">
              {quiz.questions.map((q) => {
                const userAns = selectedAnswers[q.id]
                const isCorrect = userAns === q.correct_option_id
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-muted/30 border border-border/70 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-foreground text-sm">
                        {q.question_text}
                      </span>
                      {isCorrect ? (
                        <Badge variant="success" className="gap-1 shrink-0">
                          <CheckCircle2 className="h-3 w-3" /> Doğru
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1 shrink-0">
                          <XCircle className="h-3 w-3" /> Yanlış
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-1">
                      <strong>Öğretmen Açıklaması:</strong> {q.explanation}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button variant="outline" onClick={resetQuiz} className="gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" />
              Sınavı Tekrar Dene
            </Button>
            <Link href="/ogrenci/kurslarim">
              <Button className="bg-royal-600 hover:bg-royal-700 text-white rounded-xl font-bold">
                Kurslarıma Dön
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
