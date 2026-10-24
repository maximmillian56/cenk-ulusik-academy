'use client'

import * as React from 'react'
import Link from 'next/link'
import { PLACEMENT_QUESTIONS } from '@/lib/demo-data'
import { submitPlacement, type PlacementResult } from '@/features/public/actions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  ShieldAlert,
  Sparkles,
  Loader2,
} from 'lucide-react'

export default function PlacementTestPage() {
  const [started, setStarted] = React.useState(false)
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [isFinished, setIsFinished] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [serverResult, setServerResult] = React.useState<PlacementResult | null>(null)

  const currentQ = PLACEMENT_QUESTIONS[currentIdx]
  const totalQ = PLACEMENT_QUESTIONS.length
  const progressPct = Math.round(((currentIdx + 1) / totalQ) * 100)

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }))
  }

  const handleNext = async () => {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      setIsSubmitting(true)
      try {
        const res = await submitPlacement(answers)
        if (res.ok && res.data) {
          setServerResult(res.data)
        }
      } catch (err) {
        console.error('Test submit error:', err)
      } finally {
        setIsSubmitting(false)
        setIsFinished(true)
      }
    }
  }

  // Calculate local fallback results if offline
  let localCorrect = 0
  PLACEMENT_QUESTIONS.forEach((q) => {
    if (answers[q.id] === q.correct_option_id) {
      localCorrect += 1
    }
  })
  const localPct = Math.round((localCorrect / totalQ) * 100)

  const scorePct = serverResult?.percentage ?? localPct
  const correctCount = serverResult?.correct ?? localCorrect
  let estimatedLevel = serverResult?.level ?? 'A1'

  let recommendedCourse = 'Sıfırdan Zirveye: A1 Başlangıç İngilizcesi'
  let recommendedSlug = 'sifirdan-zirveye-a1-baslangic-ingilizcesi'

  if (estimatedLevel === 'B2' || (!serverResult && scorePct >= 85)) {
    estimatedLevel = 'B2'
    recommendedCourse = 'İleri Seviye Gramer ve Kusursuz Cümle Yapıları (B2-C1)'
    recommendedSlug = 'ileri-seviye-gramer-ve-kusursuz-cumle-yapilari'
  } else if (estimatedLevel === 'B1' || (!serverResult && scorePct >= 65)) {
    estimatedLevel = 'B1'
    recommendedCourse = 'Akıcı Konuşma ve Düşünme: B1 Speaking Masterclass'
    recommendedSlug = 'akici-konusma-ve-dusunme-b1-speaking-masterclass'
  } else if (estimatedLevel === 'A2' || (!serverResult && scorePct >= 40)) {
    estimatedLevel = 'A2'
    recommendedCourse = 'Akıcı Konuşma ve Düşünme: B1 Speaking Masterclass'
    recommendedSlug = 'akici-konusma-ve-dusunme-b1-speaking-masterclass'
  }

  const restartTest = () => {
    setStarted(false)
    setCurrentIdx(0)
    setAnswers({})
    setServerResult(null)
    setIsSubmitting(false)
    setIsFinished(false)
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="container-custom max-w-3xl">
        {!started ? (
          /* Introduction Screen */
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-xl space-y-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600 dark:text-royal-400 mx-auto">
              <Sparkles className="h-8 w-8" />
            </div>

            <div>
              <Badge variant="gold" className="font-bold text-xs mb-3 px-3 py-1">
                Ücretsiz İngilizce Seviye Belirleme
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                İngilizce Seviyenizi Keşfedin
              </h1>
              <p className="text-muted-foreground mt-3 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                20 soruluk pratik testimizle gramer, kelime ve cümle kurma becerinizi
                ölçün; size en uygun kursu hemen bulun.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left p-6 rounded-2xl bg-muted/40 border border-border/60">
              <div>
                <span className="font-bold text-sm block text-foreground">Soru Sayısı:</span>
                <span className="text-xs text-muted-foreground">12 Seviyelendirilmiş Soru</span>
              </div>
              <div>
                <span className="font-bold text-sm block text-foreground">Süre:</span>
                <span className="text-xs text-muted-foreground">Yaklaşık 10-15 Dakika</span>
              </div>
              <div>
                <span className="font-bold text-sm block text-foreground">Sonuç:</span>
                <span className="text-xs text-muted-foreground">Anında Seviye & Kurs Önerisi</span>
              </div>
            </div>

            {/* Crucial legal requirement warning */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3 text-left">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Önemli Not:</strong> Bu testin sonucu yaklaşık bir İngilizce seviyesi
                tahmini sunmakta olup resmi olarak onaylanmış bir CEFR sertifikası veya resmi sınav
                belgesi yerine geçmez.
              </p>
            </div>

            <Button
              size="xl"
              onClick={() => setStarted(true)}
              className="bg-royal-600 hover:bg-royal-700 text-white font-bold px-10 rounded-2xl shadow-lg"
            >
              Testi Başlat <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : !isFinished ? (
          /* Active Quiz Screen */
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xl space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400">
                Soru {currentIdx + 1} / {totalQ}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {progressPct}% Tamamlandı
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
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id] === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-royal-600 bg-royal-50/50 dark:bg-royal-950/40 font-semibold shadow-sm'
                        : 'border-border/70 hover:border-royal-600/40 hover:bg-muted/40'
                    }`}
                  >
                    <span className="text-sm sm:text-base text-foreground">
                      {option.option_text}
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

            {/* Navigation button */}
            <div className="pt-6 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Cevabınızı seçtikten sonra ilerleyin
              </span>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id] || isSubmitting}
                className="bg-royal-600 hover:bg-royal-700 text-white rounded-xl font-bold px-6 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Değerlendiriliyor...
                  </>
                ) : currentIdx < totalQ - 1 ? (
                  <>
                    Sonraki Soru <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Testi Tamamla <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-2xl space-y-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gold-100 dark:bg-gold-950/60 flex items-center justify-center text-gold-600 dark:text-gold-400 mx-auto border-2 border-gold-400/40">
              <Trophy className="h-10 w-10" />
            </div>

            <div>
              <Badge variant="gold" className="font-bold text-xs mb-2">
                Test Tamamlandı!
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                Tahmini Seviyeniz: <span className="text-royal-600 dark:text-royal-400">{estimatedLevel}</span>
              </h2>
              <p className="text-muted-foreground mt-2 text-base">
                Toplam <strong>{totalQ}</strong> sorudan <strong>{correctCount}</strong> doğru yaptınız. Başarı oranınız: <strong>%{scorePct}</strong>
              </p>
            </div>

            {/* Recommendation Box */}
            <div className="p-6 rounded-3xl bg-royal-50 dark:bg-royal-950/50 border border-royal-200 dark:border-royal-800 text-left space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400 block">
                Size Özel Kurs Tavsiyesi
              </span>
              <h3 className="font-display font-bold text-xl text-foreground">
                {recommendedCourse}
              </h3>
              <p className="text-sm text-muted-foreground">
                Seviye testinizdeki doğru ve yanlışlarınıza göre bu kurs dil becerilerinizi
                hızlıca bir üst aşamaya taşıyacaktır.
              </p>
              <div className="pt-2">
                <Link href={`/kurslar/${recommendedSlug}`}>
                  <Button className="bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2">
                    Tavsiye Edilen Kursu İncele <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Answer Explanations Review */}
            <div className="text-left space-y-4 pt-6 border-t border-border/60">
              <h3 className="font-display font-bold text-lg text-foreground">
                Soru ve Cevap Analizi
              </h3>
              <div className="space-y-3">
                {PLACEMENT_QUESTIONS.map((q, idx) => {
                  const userAns = answers[q.id]
                  const isCorrect = userAns === q.correct_option_id
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {q.question_text}
                        </span>
                        {isCorrect ? (
                          <Badge variant="success" className="shrink-0 gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Doğru
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="shrink-0 gap-1">
                            <XCircle className="h-3 w-3" /> Yanlış
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        <strong>Açıklama:</strong> {q.explanation}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={restartTest} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Testi Tekrar Çöz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
