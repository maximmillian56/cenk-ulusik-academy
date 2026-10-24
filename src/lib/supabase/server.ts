import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Request-scoped Supabase client acting as the signed-in user (RLS enforced).
 * Callers should check isSupabaseConfigured() first; services do this for you.
 */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://not-configured.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'not-configured',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component; middleware refreshes the session.
          }
        },
      },
    }
  )
}
