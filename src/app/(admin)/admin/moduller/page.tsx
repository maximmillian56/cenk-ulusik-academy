'use client'

import * as React from 'react'
import { DEMO_COURSES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Layers, Plus, Edit, Trash2, Video } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminModulesPage() {
  const [selectedCourse, setSelectedCourse] = React.useState(DEMO_COURSES[0].id)
  const currentCourse = DEMO_COURSES.find((c) => c.id === selectedCourse) || DEMO_COURSES[0]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Modül & Ünite Mimarisi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kurs içerisindeki üniteleri oluşturun, sırasını düzenleyin ve derslerle eşleştirin.
          </p>
        </div>

        <Button
          onClick={() => toast({ title: 'Yeni Modül Eklendi' })}
          className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" /> Yeni Modül Ekle
        </Button>
      </div>

      {/* Select Course */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground">Kurs Seçin:</span>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-card text-xs font-semibold"
        >
          {DEMO_COURSES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.cefr_level})
            </option>
          ))}
        </select>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {currentCourse.modules.map((m, idx) => (
          <div
            key={m.id}
            className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm"
          >
            <div className="p-5 bg-muted/40 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-royal-100 dark:bg-royal-950 text-royal-600 font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {m.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {m.lessons.length} Ders Kayıtlı
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs rounded-xl">
                  <Edit className="h-3.5 w-3.5 mr-1" /> Düzenle
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {m.lessons.map((les) => (
                <div
                  key={les.id}
                  className="p-3 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="h-4 w-4 text-royal-600 shrink-0" />
                    <span className="font-medium text-foreground">{les.title}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {Math.round(les.video_duration_seconds / 60)} dakika
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
