'use client'

import * as React from 'react'
import { Megaphone, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState([
    {
      id: 'ann-1',
      title: 'Yeni Kurs Yayında: B1 Speaking Masterclass!',
      content: 'Konuşma odaklı yeni kursumuz kayıtlarınıza açıldı. Hemen inceleyin!',
      audience: 'all',
      date: '2026-03-24',
    },
    {
      id: 'ann-2',
      title: 'Seviye Tespit Sınavı Güncellendi',
      content: 'A1-C1 arası yeni sorularla seviyenizi daha isabetli ölçebilirsiniz.',
      audience: 'students',
      date: '2026-03-20',
    },
  ])

  const [newTitle, setNewTitle] = React.useState('')
  const [newContent, setNewContent] = React.useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newContent) return

    setAnnouncements([
      {
        id: `ann-${Date.now()}`,
        title: newTitle,
        content: newContent,
        audience: 'all',
        date: 'Bugün',
      },
      ...announcements,
    ])
    setNewTitle('')
    setNewContent('')
    toast({ title: 'Duyuru Yayınlandı', description: 'Tüm öğrencilerin paneline iletildi.' })
  }

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id))
    toast({ title: 'Duyuru Kaldırıldı' })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Duyuru Yönetimi
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Öğrenci panellerinde ve genel bildirim alanlarında gösterilecek duyuruları oluşturun.
        </p>
      </div>

      {/* New Announcement Form */}
      <div className="p-6 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-royal-600" /> Yeni Duyuru Yayınla
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ann-title" className="text-xs">Duyuru Başlığı</Label>
            <Input
              id="ann-title"
              placeholder="Örn: Bu Hafta Sonu Speaking Kulübü Etkinliği"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ann-content" className="text-xs">Duyuru Metni</Label>
            <Textarea
              id="ann-content"
              rows={3}
              placeholder="Öğrencilere iletmek istediğiniz mesaj..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <Button type="submit" size="sm" className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl text-xs">
            Duyuruyu Yayınla
          </Button>
        </form>
      </div>

      {/* Existing Announcements */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-foreground">
          Aktif Duyurular
        </h3>

        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-3xl border border-border/70 bg-card shadow-sm flex items-start justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="gold" className="text-[10px] font-bold">
                  {ann.audience === 'all' ? 'Tüm Ziyaretçiler' : 'Öğrenciler'}
                </Badge>
                <span className="text-xs text-muted-foreground">{ann.date}</span>
              </div>
              <h4 className="font-display font-bold text-sm text-foreground">
                {ann.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {ann.content}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(ann.id)}
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
