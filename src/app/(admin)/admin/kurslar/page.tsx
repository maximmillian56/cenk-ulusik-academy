'use client'

import * as React from 'react'
import Link from 'next/link'
import { DEMO_COURSES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Eye, Trash2, BookOpen, Clock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState(DEMO_COURSES)

  const handleArchive = (id: string) => {
    if (confirm('Bu kursu yayından kaldırmak istediğinize emin misiniz?')) {
      setCourses(courses.filter((c) => c.id !== id))
      toast({ title: 'Kurs Arşivlendi', description: 'Kurs durumu güncellendi.' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Kurs Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Yayındaki ve taslak aşamasındaki tüm eğitim programlarını yönetin.
          </p>
        </div>

        <Link href="/admin/kurslar/yeni">
          <Button className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl gap-2 shadow-md">
            <Plus className="h-4 w-4" /> Yeni Kurs Oluştur
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm divide-y divide-border/50">
        {courses.map((course) => {
          const totalLessons = course.modules.reduce(
            (acc, m) => acc + m.lessons.length,
            0
          )
          return (
            <div
              key={course.id}
              className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-2xl bg-slate-900 overflow-hidden relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.cover_image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="gold" className="text-[10px] font-bold">
                      {course.cefr_level}
                    </Badge>
                    <Badge variant="success" className="text-[10px]">
                      {course.status === 'published' ? 'Yayında' : 'Taslak'}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{course.modules.length} Modül</span>
                    <span>•</span>
                    <span>{totalLessons} Ders</span>
                    <span>•</span>
                    <span>{course.duration_hours} Saat</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Link href={`/kurslar/${course.slug}`} target="_blank">
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
                <Link href={`/admin/kurslar/${course.id}/duzenle`}>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 font-semibold">
                    <Edit className="h-3.5 w-3.5" /> Düzenle
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArchive(course.id)}
                  className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
