import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession, type SessionContext } from '@/lib/auth'
import { hasPermission, type Permission } from '@/lib/authz'
import { isSupabaseConfigured, NOT_CONFIGURED_MESSAGE } from '@/lib/env'
import { checkRateLimitMemory } from '@/lib/rate-limit'

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export function fail(error: string, fieldErrors?: Record<string, string[]>): ActionResult<never> {
  return { ok: false, error, fieldErrors }
}

export async function clientIp(): Promise<string> {
  const h = await headers()
  return (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown').trim()
}

/**
 * Rate limiter: uses the DB table (service role) when available so limits hold across
 * serverless instances; otherwise falls back to in-memory limiting.
 */
export async function rateLimit(bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  const key = `${bucket}:${await clientIp()}`
  const admin = createAdminClient()
  if (!admin) return checkRateLimitMemory(key, limit, windowSeconds)
  const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000).toISOString()
  const { data } = await admin.from('rate_limits').select('count').eq('key', key).eq('window_start', windowStart).maybeSingle()
  const count = (data?.count as number | undefined) ?? 0
  if (count >= limit) return false
  await admin.from('rate_limits').upsert({ key, window_start: windowStart, count: count + 1 })
  return true
}

export async function audit(
  userId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = await createClient()
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      metadata: metadata ?? null,
      ip_address: await clientIp(),
    })
  } catch {
    // Audit failure must never break the user flow; it is logged server-side.
    console.error('[audit] failed to write', action)
  }
}

type Guarded =
  | { ok: true; session: SessionContext; supabase: Awaited<ReturnType<typeof createClient>> }
  | { ok: false; result: ActionResult<never> }

/** Every privileged server action starts here. Role comes from the DB, never the request. */
export async function guard(permission?: Permission): Promise<Guarded> {
  if (!isSupabaseConfigured()) return { ok: false, result: fail(NOT_CONFIGURED_MESSAGE) }
  const session = await getSession()
  if (!session) return { ok: false, result: fail('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.') }
  if (permission && !hasPermission(session.role, permission)) {
    await audit(session.user.id, 'authz.denied', 'permission', permission)
    return { ok: false, result: fail('Bu işlem için yetkiniz yok.') }
  }
  return { ok: true, session, supabase: await createClient() }
}

/** Maps DB errors to safe user-facing messages without leaking internals. */
export function safeDbError(error: { message?: string; code?: string } | null): string {
  if (!error) return 'Beklenmeyen bir hata oluştu.'
  console.error('[db]', error.code, error.message)
  if (error.code === '23505') return 'Bu kayıt zaten mevcut (benzersizlik ihlali).'
  if (error.code === '42501') return 'Bu işlem için yetkiniz yok.'
  const known: Record<string, string> = {
    NOT_ENROLLED: 'Bu içeriğe erişmek için kursa kayıtlı olmalısınız.',
    ATTEMPTS_EXHAUSTED: 'Bu test için deneme hakkınız doldu.',
    QUIZ_EMPTY: 'Bu testte henüz soru yok.',
    QUIZ_NOT_FOUND: 'Test bulunamadı.',
    ATTEMPT_EXPIRED: 'Test süresi doldu.',
    ATTEMPT_CLOSED: 'Bu deneme zaten gönderildi.',
    COURSE_NOT_COMPLETED: 'Sertifika için kursun tüm derslerini tamamlamalısınız.',
    CERTIFICATE_DISABLED: 'Bu kurs için sertifika özelliği kapalı.',
  }
  for (const k of Object.keys(known)) if (error.message?.includes(k)) return known[k]
  return 'İşlem tamamlanamadı. Lütfen tekrar deneyin.'
}
