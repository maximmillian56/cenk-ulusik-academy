const hits = new Map<string, { count: number; resetAt: number }>()

/** In-memory fixed-window limiter (single instance fallback). */
export function checkRateLimitMemory(key: string, limit: number, windowSeconds: number, now = Date.now()): boolean {
  const entry = hits.get(key)
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return true
  }
  if (entry.count >= limit) return false
  entry.count += 1
  return true
}

export function _resetRateLimitMemory() {
  hits.clear()
}
