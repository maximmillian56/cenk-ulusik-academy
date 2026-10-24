import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { areaForPath } from '@/lib/authz'
import { isSupabaseConfigured, isDemoContentEnabled } from '@/lib/env'

/**
 * Refreshes the Supabase session cookie and performs a coarse auth gate.
 * Fine-grained role checks happen again on the server in layouts/pages/actions (defense in depth).
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  const area = areaForPath(pathname)

  if (!isSupabaseConfigured()) {
    if (isDemoContentEnabled()) {
      return NextResponse.next({ request })
    }
    if (area !== 'public') {
      const url = request.nextUrl.clone()
      url.pathname = '/kurulum'
      url.search = ''
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  let userId: string | null = null
  try {
    const { data } = await supabase.auth.getUser()
    userId = data.user?.id ?? null
  } catch {
    userId = null
  }

  if (area !== 'public' && !userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/giris'
    url.search = ''
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  if (userId && (pathname === '/giris' || pathname === '/kayit')) {
    const url = request.nextUrl.clone()
    url.pathname = '/ogrenci/panel'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}
