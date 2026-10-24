'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DEMO_COURSES } from '@/lib/demo-data'
import { toast } from '@/hooks/use-toast'

export default function EditCourseAdminPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.id as string

  const course = DEMO_COURSES.find((c) => c.id === courseId) || DEMO_COURSES[0]

  const [title, setTitle] = React.useState(course.title)
  const [level, setLevel] = React.useState(course.cefr_level)
  const [shortDesc, setShortDesc] = React.useState(course.short_description)
  const [desc, setDesc] = React.useState(course.description)
  const [hours, setHours] = React.useState(String(course.duration_hours))

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Kurs Güncellendi!',
      description: 'Yapılan değişiklikler kaydedildi.',
    })
    router.push('/admin/kurslar')
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/kurslar">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="h-4 w-4" /> Kurslara Dön
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Kursu Düzenle
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {course.title}
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-border/70 bg-card shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Kurs Başlığı</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">CEFR Seviyesi</Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Süre (Saat)</Label>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_desc">Kısa Açıklama</Label>
            <Input
              id="short_desc"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Detaylı Açıklama</Label>
            <Textarea
              id="desc"
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <Button
              type="submit"
              className="bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2 rounded-xl"
            >
              <Save className="h-4 w-4" /> Değişiklikleri Kaydet
            </Button>
            <Link href="/admin/kurslar">
              <Button type="button" variant="outline" className="rounded-xl">
                İptal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
