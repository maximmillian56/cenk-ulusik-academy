'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { fail, guard, audit, safeDbError, type ActionResult } from '@/lib/server-action'
import {
  courseSchema,
  moduleSchema,
  lessonSchema,
  enrollmentSchema,
  fieldErrors,
  validateImageFile,
  validateResourceFile,
  sniffImage,
} from '@/lib/validation'
import { createAdminClient } from '@/lib/supabase/admin'
import { canAssignRole, isValidRole } from '@/lib/authz'

const uuid = z.string().uuid()

/* --------------------------------- Courses --------------------------------- */

export async function saveCourse(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  const parsed = courseSchema.safeParse(input)
  if (!parsed.success) return fail('Lütfen alanları kontrol edin.', fieldErrors(parsed.error))
  const row = {
    ...parsed.data,
    published_at: parsed.data.status === 'published' ? new Date().toISOString() : null,
  }
  if (id) {
    if (!uuid.safeParse(id).success) return fail('Geçersiz kurs.')
    const { error } = await g.supabase.from('courses').update(row).eq('id', id)
    if (error) return fail(safeDbError(error))
    await audit(g.session.user.id, 'course.updated', 'course', id, { status: row.status })
    revalidatePath('/admin/kurslar')
    revalidatePath('/kurslar')
    return { ok: true, data: { id }, message: 'Kurs kaydedildi.' }
  }
  const { data, error } = await g.supabase
    .from('courses')
    .insert({ ...row, teacher_id: g.session.user.id })
    .select('id')
    .single()
  if (error) return fail(safeDbError(error))
  const newId = (data as { id: string }).id
  await audit(g.session.user.id, 'course.created', 'course', newId)
  revalidatePath('/admin/kurslar')
  return { ok: true, data: { id: newId }, message: 'Kurs oluşturuldu.' }
}

export async function setCourseStatus(id: string, status: 'draft' | 'published' | 'archived'): Promise<ActionResult> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(id).success || !['draft', 'published', 'archived'].includes(status)) return fail('Geçersiz istek.')
  const { error } = await g.supabase
    .from('courses')
    .update({ status, published_at: status === 'published' ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, `course.${status}`, 'course', id)
  revalidatePath('/admin/kurslar')
  revalidatePath('/kurslar')
  return { ok: true, message: 'Kurs durumu güncellendi.' }
}

export async function uploadCourseCover(courseId: string, formData: FormData): Promise<ActionResult<{ url: string }>> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(courseId).success) return fail('Geçersiz kurs.')
  const file = formData.get('file') as File | null
  const err = validateImageFile(file)
  if (err) return fail(err)
  if (!(await sniffImage(file!))) return fail('Dosya içeriği geçerli bir görsel değil.')
  const ext = file!.type === 'image/png' ? 'png' : file!.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${courseId}/${Date.now()}.${ext}`
  const { error } = await g.supabase.storage.from('course-covers').upload(path, file!, { contentType: file!.type, upsert: false })
  if (error) return fail('Görsel yüklenemedi. Storage bucket kurulumunu kontrol edin.')
  const { data } = g.supabase.storage.from('course-covers').getPublicUrl(path)
  await g.supabase.from('courses').update({ cover_image_url: data.publicUrl }).eq('id', courseId)
  await audit(g.session.user.id, 'course.cover_uploaded', 'course', courseId)
  revalidatePath(`/admin/kurslar/${courseId}/duzenle`)
  return { ok: true, data: { url: data.publicUrl }, message: 'Kapak görseli yüklendi.' }
}

/* --------------------------------- Modules --------------------------------- */

export async function createModule(input: unknown): Promise<ActionResult> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  const parsed = moduleSchema.safeParse(input)
  if (!parsed.success) return fail('Modül bilgilerini kontrol edin.', fieldErrors(parsed.error))
  const { count } = await g.supabase.from('course_modules').select('*', { count: 'exact', head: true }).eq('course_id', parsed.data.course_id)
  const { error } = await g.supabase.from('course_modules').insert({ ...parsed.data, order_index: (count ?? 0) + 1 })
  if (error) return fail(safeDbError(error))
  revalidatePath(`/admin/kurslar/${parsed.data.course_id}/duzenle`)
  revalidatePath('/admin/moduller')
  return { ok: true, message: 'Modül eklendi.' }
}

export async function updateModule(id: string, title: string, description: string | null): Promise<ActionResult> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  const t = title.trim()
  if (!uuid.safeParse(id).success || t.length < 2 || t.length > 160) return fail('Geçersiz modül bilgisi.')
  const { error } = await g.supabase.from('course_modules').update({ title: t, description: description?.slice(0, 1000) ?? null }).eq('id', id)
  if (error) return fail(safeDbError(error))
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Modül güncellendi.' }
}

export async function deleteModule(id: string): Promise<ActionResult> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(id).success) return fail('Geçersiz modül.')
  const { error } = await g.supabase.from('course_modules').delete().eq('id', id)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, 'module.deleted', 'course_module', id)
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Modül ve içindeki dersler silindi.' }
}

/** Reorder by swapping order_index with neighbour. */
async function move(table: 'course_modules' | 'lessons', id: string, direction: 'up' | 'down', scopeCol: 'course_id' | 'module_id') {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(id).success) return fail('Geçersiz kayıt.')
  const { data: item } = await g.supabase.from(table).select(`id,order_index,${scopeCol}`).eq('id', id).maybeSingle()
  if (!item) return fail('Kayıt bulunamadı.')
  const it = item as unknown as Record<string, string | number>
  const { data: siblings } = await g.supabase.from(table).select('id,order_index').eq(scopeCol, it[scopeCol]).order('order_index')
  const list = (siblings ?? []) as { id: string; order_index: number }[]
  const idx = list.findIndex((s) => s.id === id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return { ok: true } as ActionResult
  // normalize then swap
  const reordered = [...list]
  ;[reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]]
  for (let i = 0; i < reordered.length; i++) {
    await g.supabase.from(table).update({ order_index: i + 1 }).eq('id', reordered[i].id)
  }
  revalidatePath('/admin', 'layout')
  return { ok: true } as ActionResult
}

export async function moveModule(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  return move('course_modules', id, direction, 'course_id')
}
export async function moveLesson(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  return move('lessons', id, direction, 'module_id')
}

/* --------------------------------- Lessons --------------------------------- */

export async function saveLesson(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  const parsed = lessonSchema.safeParse(input)
  if (!parsed.success) return fail('Ders bilgilerini kontrol edin.', fieldErrors(parsed.error))
  const v = parsed.data
  if (v.video_url && v.video_provider === 'demo' && !/^https:\/\/|^\//.test(v.video_url)) return fail('Demo video adresi https:// ile başlamalı.')
  if (v.video_url && /youtube\.com|youtu\.be/i.test(v.video_url)) {
    return fail('Herkese açık YouTube bağlantıları ücretli içerik için güvenli değildir. Mux, Cloudflare Stream veya özel depolama kullanın.')
  }
  // Ensure module belongs to course
  const { data: mod } = await g.supabase.from('course_modules').select('course_id').eq('id', v.module_id).maybeSingle()
  if (!mod || (mod as { course_id: string }).course_id !== v.course_id) return fail('Modül bu kursa ait değil.')

  if (id) {
    if (!uuid.safeParse(id).success) return fail('Geçersiz ders.')
    const { error } = await g.supabase.from('lessons').update(v).eq('id', id)
    if (error) return fail(safeDbError(error))
    await audit(g.session.user.id, 'lesson.updated', 'lesson', id)
    revalidatePath('/admin', 'layout')
    return { ok: true, data: { id }, message: 'Ders kaydedildi.' }
  }
  const { count } = await g.supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('module_id', v.module_id)
  const { data, error } = await g.supabase.from('lessons').insert({ ...v, order_index: (count ?? 0) + 1 }).select('id').single()
  if (error) return fail(safeDbError(error))
  const newId = (data as { id: string }).id
  await audit(g.session.user.id, 'lesson.created', 'lesson', newId)
  revalidatePath('/admin', 'layout')
  return { ok: true, data: { id: newId }, message: 'Ders oluşturuldu.' }
}

export async function deleteLesson(id: string): Promise<ActionResult> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(id).success) return fail('Geçersiz ders.')
  const { error } = await g.supabase.from('lessons').delete().eq('id', id)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, 'lesson.deleted', 'lesson', id)
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Ders silindi.' }
}

export async function uploadLessonResource(lessonId: string, formData: FormData): Promise<ActionResult> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(lessonId).success) return fail('Geçersiz ders.')
  const file = formData.get('file') as File | null
  const title = String(formData.get('title') ?? '').trim().slice(0, 160)
  const err = validateResourceFile(file)
  if (err) return fail(err)
  if (!title) return fail('Kaynak başlığı gerekli.')
  const safeName = file!.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80)
  const path = `${lessonId}/${Date.now()}-${safeName}`
  const { error } = await g.supabase.storage.from('lesson-resources').upload(path, file!, { contentType: file!.type })
  if (error) return fail('Dosya yüklenemedi. Storage bucket kurulumunu kontrol edin.')
  const size = file!.size > 1048576 ? `${(file!.size / 1048576).toFixed(1)} MB` : `${Math.ceil(file!.size / 1024)} KB`
  const { error: e2 } = await g.supabase.from('lesson_resources').insert({ lesson_id: lessonId, title, file_url: '', storage_path: path, file_size: size })
  if (e2) return fail(safeDbError(e2))
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Kaynak eklendi.' }
}

export async function deleteLessonResource(id: string): Promise<ActionResult> {
  const g = await guard('course:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(id).success) return fail('Geçersiz kaynak.')
  const { data } = await g.supabase.from('lesson_resources').select('storage_path').eq('id', id).maybeSingle()
  const path = (data as { storage_path: string | null } | null)?.storage_path
  if (path) await g.supabase.storage.from('lesson-resources').remove([path])
  const { error } = await g.supabase.from('lesson_resources').delete().eq('id', id)
  if (error) return fail(safeDbError(error))
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Kaynak silindi.' }
}

/* ------------------------------- Enrollments ------------------------------- */

export async function enrollStudent(input: unknown): Promise<ActionResult> {
  const g = await guard('enrollment:manage')
  if (!g.ok) return g.result
  const parsed = enrollmentSchema.safeParse(input)
  if (!parsed.success) return fail('Öğrenci ve kurs seçin.')
  const { error } = await g.supabase.from('enrollments').upsert(
    { ...parsed.data, status: 'active', assigned_by: g.session.user.id },
    { onConflict: 'student_id,course_id' }
  )
  if (error) return fail(safeDbError(error))
  const { data: course } = await g.supabase.from('courses').select('title').eq('id', parsed.data.course_id).maybeSingle()
  await g.supabase.from('notifications').insert({
    user_id: parsed.data.student_id,
    title: 'Yeni kursa kaydedildiniz',
    message: `"${(course as { title: string } | null)?.title ?? 'Kurs'}" kursuna erişiminiz açıldı.`,
    type: 'success',
    link: '/ogrenci/kurslarim',
  })
  await audit(g.session.user.id, 'enrollment.created', 'enrollment', `${parsed.data.student_id}:${parsed.data.course_id}`)
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Öğrenci kursa kaydedildi.' }
}

export async function setEnrollmentStatus(enrollmentId: string, status: 'active' | 'suspended' | 'completed'): Promise<ActionResult> {
  const g = await guard('enrollment:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(enrollmentId).success || !['active', 'suspended', 'completed'].includes(status)) return fail('Geçersiz istek.')
  const { error } = await g.supabase.from('enrollments').update({ status }).eq('id', enrollmentId)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, `enrollment.${status}`, 'enrollment', enrollmentId)
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Kayıt durumu güncellendi.' }
}

export async function removeEnrollment(enrollmentId: string): Promise<ActionResult> {
  const g = await guard('enrollment:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(enrollmentId).success) return fail('Geçersiz kayıt.')
  const { error } = await g.supabase.from('enrollments').delete().eq('id', enrollmentId)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, 'enrollment.removed', 'enrollment', enrollmentId)
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Öğrenci kurstan çıkarıldı.' }
}

/* ----------------------------- Student access ------------------------------ */

export async function setStudentStatus(studentId: string, status: 'active' | 'suspended'): Promise<ActionResult> {
  const g = await guard('student:manage')
  if (!g.ok) return g.result
  if (!uuid.safeParse(studentId).success || !['active', 'suspended'].includes(status)) return fail('Geçersiz istek.')
  if (studentId === g.session.user.id) return fail('Kendi hesabınızı askıya alamazsınız.')
  const { error } = await g.supabase.from('profiles').update({ status }).eq('id', studentId)
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, `student.${status}`, 'profile', studentId)
  revalidatePath(`/admin/ogrenciler/${studentId}`)
  return { ok: true, message: status === 'suspended' ? 'Hesap askıya alındı.' : 'Hesap yeniden etkinleştirildi.' }
}

/** Admin-only. Self-assignment is blocked in code and RLS only allows admins to write user_roles. */
export async function assignRole(targetId: string, role: string): Promise<ActionResult> {
  const g = await guard('role:assign')
  if (!g.ok) return g.result
  if (!uuid.safeParse(targetId).success || !isValidRole(role)) return fail('Geçersiz istek.')
  if (!canAssignRole(g.session.role, g.session.user.id, targetId, role)) return fail('Bu rol ataması yapılamaz.')
  const { error: delErr } = await g.supabase.from('user_roles').delete().eq('user_id', targetId).neq('role', role)
  if (delErr) return fail(safeDbError(delErr))
  const { error } = await g.supabase.from('user_roles').upsert({ user_id: targetId, role, assigned_by: g.session.user.id }, { onConflict: 'user_id,role' })
  if (error) return fail(safeDbError(error))
  await audit(g.session.user.id, 'role.assigned', 'profile', targetId, { role })
  revalidatePath(`/admin/ogrenciler/${targetId}`)
  return { ok: true, message: 'Rol güncellendi.' }
}

/** KVKK deletion: removes the auth user (cascades to profile and personal data). Admin only. */
export async function deleteUserAccount(targetId: string): Promise<ActionResult> {
  const g = await guard('role:assign')
  if (!g.ok) return g.result
  if (!uuid.safeParse(targetId).success || targetId === g.session.user.id) return fail('Geçersiz istek.')
  const admin = createAdminClient()
  if (!admin) return fail('SUPABASE_SERVICE_ROLE_KEY yapılandırılmamış.')
  await audit(g.session.user.id, 'account.deleted', 'profile', targetId)
  const { error } = await admin.auth.admin.deleteUser(targetId)
  if (error) return fail('Hesap silinemedi.')
  revalidatePath('/admin/ogrenciler')
  return { ok: true, message: 'Hesap ve ilişkili kişisel veriler silindi.' }
}
