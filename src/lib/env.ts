/**
 * Central environment helpers.
 * The app NEVER pretends a backend operation succeeded when Supabase is not configured.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

export function isSupabaseConfigured(): boolean {
  return (
    url.startsWith('https://') &&
    !url.includes('your_supabase') &&
    anon.length > 20 &&
    !anon.includes('your_supabase')
  )
}

/** Public demo content (catalog/blog previews) is shown only when explicitly enabled. */
export function isDemoContentEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export const siteConfig = {
  name: 'Cenk Uluşık English Academy',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  paymentsEnabled: false, // No payment provider is configured. Enrollment is application/admin based.
}

export const NOT_CONFIGURED_MESSAGE =
  'Veritabanı bağlantısı yapılandırılmamış. Lütfen README dosyasındaki Supabase kurulum adımlarını tamamlayın.'
