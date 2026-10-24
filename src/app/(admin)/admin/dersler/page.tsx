'use client'

import * as React from 'react'
import { DEMO_COURSES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Plus, Edit, Trash2, PlayCircle, Eye } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function AdminLessonsPage() {
  const allLessons = DEMO_COURSES.flatMap((c) =>
    c.modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, courseTitle: c.title, moduleTitle: m.title }))
    )
  )

  const [lessons, setLessons] = React.useState(allLessons)

  const handleDelete = (id: string) => {
    if (confirm('Bu video dersi silmek istediğinize emin misiniz?')) {
      setLessons(lessons.filter((l) => l.id !== id))
      toast({ title: 'Ders Silindi', description: 'Video kaydı listeden kaldırıldı.' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Video Ders Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Ders videolarını yükleyin, video sağlayıcısını (Mux/Cloudflare/Demo) belirleyin ve ders notlarını güncelleyin.
          </p>
        </div>

        <Button
          onClick={() => toast({ title: 'Ders Yükleme Ekranı', description: 'Yeni ders formu açıldı.' })}
          className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" /> Yeni Ders Ekle
        </Button>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm divide-y divide-border/50">
        {lessons.map((les) => (
          <div
            key={les.id}
            className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-royal-100 dark:bg-royal-950 flex items-center justify-center text-royal-600 shrink-0">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-foreground">
                  {les.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="font-medium text-royal-600 dark:text-royal-400">
                    {les.courseTitle}
                  </span>
                  <span>•</span>
                  <span>{les.moduleTitle}</span>
                  <span>•</span>
                  <span>{Math.round(les.video_duration_seconds / 60)} dk</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Link href={`/ogrenci/ders/${les.id}`} target="_blank">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: 'Düzenleme', description: `${les.title} düzenleme modu.` })}
                className="text-xs rounded-xl gap-1"
              >
                <Edit className="h-3 w-3" /> Düzenle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(les.id)}
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
