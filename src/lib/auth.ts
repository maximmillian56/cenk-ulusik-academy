import { cache } from 'react'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { resolveHighestRole, canAccessArea, type AppArea } from '@/lib/authz'
import type { UserRole } from '@/types'

export interface SessionContext {
  user: User
  role: UserRole
  profile: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    preferred_language: string | null
    english_level: string | null
    phone: string | null
    bio: string | null
    created_at: string | null
  }
}

/**
 * Returns the authenticated session or null.
 * The role is ALWAYS read from the `user_roles` table on the server, never from client input or user_metadata.
 * There is no demo bypass: without Supabase there is no session.
 */
export const getSession = cache(async (): Promise<SessionContext | null> => {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id,email,full_name,avatar_url,preferred_language,english_level,phone,bio,created_at,status')
        .eq('id', user.id)
        .maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', user.id),
    ])

    const p = profile as (SessionContext['profile'] & { status?: string }) | null
    if (p?.status === 'suspended') return null

    return {
      user,
      role: resolveHighestRole((roles ?? []).map((r: { role: string }) => r.role)),
      profile: p ?? {
        id: user.id,
        email: user.email ?? '',
        full_name: null,
        avatar_url: null,
        preferred_language: 'tr',
        english_level: null,
        phone: null,
        bio: null,
        created_at: null,
      },
    }
  } catch {
    return null
  }
})

export async function getUser() {
  return (await getSession())?.user ?? null
}

export async function getUserRole(): Promise<UserRole> {
  return (await getSession())?.role ?? 'guest'
}

/** Redirects to login if there is no session. */
export async function requireAuth(next?: string): Promise<SessionContext> {
  const session = await getSession()
  if (!session) redirect(`/giris${next ? `?redirectedFrom=${encodeURIComponent(next)}` : ''}`)
  return session
}

/** Server-side area guard used by layouts and pages. */
export async function requireArea(area: AppArea, next?: string): Promise<SessionContext> {
  const session = await requireAuth(next)
  if (!canAccessArea(session.role, area)) redirect(session.role === 'student' ? '/ogrenci/panel' : '/')
  return session
}

export async function requireAdmin() {
  return requireArea('admin', '/admin/panel')
}

export async function requireStudent() {
  return requireArea('student', '/ogrenci/panel')
}
