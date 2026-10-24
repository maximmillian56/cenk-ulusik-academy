import { PLACEMENT_QUESTIONS } from '@/lib/demo-data'

/** CEFR band of each original placement question (A1–B2). */
export const PLACEMENT_LEVELS: Record<string, 'A1' | 'A2' | 'B1' | 'B2'> = {
  'pq-1': 'A1',
  'pq-2': 'A1',
  'pq-3': 'A1',
  'pq-4': 'A2',
  'pq-5': 'A2',
  'pq-6': 'A2',
  'pq-7': 'B1',
  'pq-8': 'B1',
  'pq-9': 'B1',
  'pq-10': 'B2',
  'pq-11': 'B2',
  'pq-12': 'B2',
}

/** Questions without the answer key or explanations — safe to send to the browser. */
export function getPublicPlacementQuestions() {
  return PLACEMENT_QUESTIONS.map((q) => ({ id: q.id, question_text: q.question_text, options: q.options }))
}

export const LEVEL_TO_CATEGORY: Record<string, string> = {
  A1: 'beginner',
  A2: 'elementary',
  B1: 'intermediate',
  B2: 'upper_intermediate',
}
