import type { UserRole } from '@/types'

/** Pure authorization helpers (unit tested, no I/O). */
export type AppArea = 'public' | 'student' | 'admin'
export type Permission =
  | 'course:manage'
  | 'quiz:manage'
  | 'student:manage'
  | 'enrollment:manage'
  | 'application:review'
  | 'announcement:publish'
  | 'blog:manage'
  | 'testimonial:moderate'
  | 'settings:manage'
  | 'role:assign'
  | 'report:view'

const ROLE_RANK: Record<UserRole, number> = { guest: 0, student: 1, teacher: 2, admin: 3 }

const TEACHER_PERMISSIONS: Permission[] = [
  'course:manage',
  'quiz:manage',
  'student:manage',
  'enrollment:manage',
  'application:review',
  'announcement:publish',
  'blog:manage',
  'testimonial:moderate',
  'report:view',
]

const PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [],
  student: [],
  teacher: TEACHER_PERMISSIONS,
  admin: [...TEACHER_PERMISSIONS, 'settings:manage', 'role:assign'],
}

export function isValidRole(value: unknown): value is UserRole {
  return value === 'student' || value === 'teacher' || value === 'admin' || value === 'guest'
}

/** Picks the highest privileged role among DB rows; ignores unknown values. */
export function resolveHighestRole(roles: unknown[]): UserRole {
  let best: UserRole = roles.length ? 'student' : 'student'
  for (const r of roles) {
    if (isValidRole(r) && ROLE_RANK[r] > ROLE_RANK[best]) best = r
  }
  return best
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return PERMISSIONS[role].includes(permission)
}

export function canAccessArea(role: UserRole, area: AppArea): boolean {
  if (area === 'public') return true
  if (area === 'student') return ROLE_RANK[role] >= ROLE_RANK.student
  return role === 'admin' || role === 'teacher'
}

export function areaForPath(pathname: string): AppArea {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return 'admin'
  if (pathname === '/ogrenci' || pathname.startsWith('/ogrenci/')) return 'student'
  return 'public'
}

/** Only admins may assign roles, and nobody may change their own role. */
export function canAssignRole(actorRole: UserRole, actorId: string, targetId: string, newRole: UserRole): boolean {
  if (!hasPermission(actorRole, 'role:assign')) return false
  if (actorId === targetId) return false
  return newRole !== 'guest'
}

/** Lesson access: staff, preview lessons, or an active/completed enrollment. */
export function canViewLesson(opts: {
  role: UserRole
  isPreview: boolean
  isPublished: boolean
  enrollmentStatus: 'active' | 'completed' | 'suspended' | null
}): boolean {
  if (opts.role === 'admin' || opts.role === 'teacher') return true
  if (!opts.isPublished) return false
  if (opts.isPreview) return true
  return opts.enrollmentStatus === 'active' || opts.enrollmentStatus === 'completed'
}

/** Safe redirect target: only same-origin relative paths. */
export function safeRedirectPath(value: string | null | undefined, fallback = '/ogrenci/panel'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback
  return value
}
