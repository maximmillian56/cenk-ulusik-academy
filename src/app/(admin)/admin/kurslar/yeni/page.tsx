'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

export default function NewCourseAdminPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState('')
  const [level, setLevel] = React.useState('A1')
  const [category, setCategory] = React.useState('general_english')
  const [shortDesc, setShortDesc] = React.useState('')
  const [desc, setDesc] = React.useState('')
  const [hours, setHours] = React.useState('12')
  const [isFree, setIsFree] = React.useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Kurs Oluşturuldu!',
      description: `"${title || 'Yeni Kurs'}" başarıyla sisteme eklendi.`,
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
          Yeni Kurs Ekle
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Başlık, CEFR seviyesi, süre ve açıklama bilgilerini doldurarak kursu taslak veya yayında olarak kaydedin.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-border/70 bg-card shadow-sm">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Kurs Başlığı *</Label>
            <Input
              id="title"
              placeholder="Örn: Akıcı Konuşma ve Düşünme: B1 Speaking Masterclass"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">CEFR Seviyesi</Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
              >
                <option value="A1">A1 - Başlangıç</option>
                <option value="A2">A2 - Temel</option>
                <option value="B1">B1 - Orta Seviye</option>
                <option value="B2">B2 - Üst Orta</option>
                <option value="C1">C1 - İleri Seviye</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
              >
                <option value="general_english">Genel İngilizce</option>
                <option value="speaking">Konuşma Odaklı</option>
                <option value="grammar">Gramer & Yapı</option>
                <option value="vocabulary">Kelime Dağarcığı</option>
                <option value="exam_preparation">Sınav Hazırlık</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Tahmini Süre (Saat)</Label>
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
            <Label htmlFor="short_desc">Kısa Açıklama (Kart Metni)</Label>
            <Input
              id="short_desc"
              placeholder="1-2 cümlelik dikkat çekici kurs özeti..."
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Detaylı Kurs Açıklaması & Müfredat Özeti</Label>
            <Textarea
              id="desc"
              rows={5}
              placeholder="Kursun hedefleri, kimler için uygun olduğu ve kazanımlar..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
            <input
              type="checkbox"
              id="is_free"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="h-4 w-4 rounded text-royal-600 focus:ring-royal-500"
            />
            <Label htmlFor="is_free" className="text-xs font-semibold cursor-pointer">
              Bu kursu tüm öğrencilere Ücretsiz olarak sun
            </Label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <Button
              type="submit"
              className="bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2 rounded-xl"
            >
              <Save className="h-4 w-4" /> Kursu Kaydet ve Yayınla
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
