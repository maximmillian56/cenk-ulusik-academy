import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client. Bypasses RLS.
 * ONLY for trusted server code (server actions after authorization, scripts).
 * The key has no NEXT_PUBLIC_ prefix, so Next.js never bundles it for the browser.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient must never run in the browser')
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey || serviceKey.includes('your_supabase')) {
    return null
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
