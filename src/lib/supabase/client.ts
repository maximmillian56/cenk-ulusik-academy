import { createBrowserClient } from '@supabase/ssr'

/** Browser client (anon key, RLS enforced). Used only for auth flows. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://not-configured.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'not-configured'
  )
}
