/**
 * Pure scoring logic. The authoritative quiz scoring runs in Postgres (submit_quiz_attempt);
 * this module mirrors it for the public placement test (server action) and unit tests.
 */
export interface AnswerKeyItem {
  questionId: string
  correctOptionId: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
}

export interface ScoreResult {
  correct: number
  total: number
  percentage: number
  passed: boolean
  perQuestion: Record<string, boolean>
}

export function scoreAnswers(
  key: AnswerKeyItem[],
  answers: Record<string, string | null | undefined>,
  passingPercentage = 70
): ScoreResult {
  const perQuestion: Record<string, boolean> = {}
  let correct = 0
  for (const item of key) {
    const ok = answers[item.questionId] === item.correctOptionId
    perQuestion[item.questionId] = ok
    if (ok) correct++
  }
  const total = key.length
  const percentage = total === 0 ? 0 : Math.round((correct * 10000) / total) / 100
  return { correct, total, percentage, passed: percentage >= passingPercentage, perQuestion }
}

/**
 * Placement estimate: a level is "reached" when the learner answers >= 60% of that level's
 * questions correctly AND all lower levels were reached. Not a validated CEFR certification.
 */
export function estimatePlacementLevel(
  key: AnswerKeyItem[],
  answers: Record<string, string | null | undefined>
): 'A1' | 'A2' | 'B1' | 'B2' {
  const order = ['A1', 'A2', 'B1', 'B2'] as const
  let reached: 'A1' | 'A2' | 'B1' | 'B2' = 'A1'
  for (const level of order) {
    const items = key.filter((k) => k.level === level)
    if (items.length === 0) continue
    const ok = items.filter((k) => answers[k.questionId] === k.correctOptionId).length
    if (ok / items.length >= 0.6) reached = level
    else break
  }
  return reached
}

export function isTimeExpired(startedAt: Date, limitMinutes: number | null, now = new Date()): boolean {
  if (!limitMinutes || limitMinutes <= 0) return false
  return now.getTime() > startedAt.getTime() + limitMinutes * 60_000
}

export function attemptsRemaining(maxAttempts: number | null, used: number): number | null {
  if (!maxAttempts || maxAttempts <= 0) return null
  return Math.max(0, maxAttempts - used)
}
