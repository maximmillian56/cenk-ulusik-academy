'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Calendar, BookOpen, Award, Shield, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DEMO_COURSES } from '@/lib/demo-data'
import { toast } from '@/hooks/use-toast'

export default function AdminStudentDetailPage() {
  const params = useParams()
  const studentId = params?.id as string

  const [enrolledCourse, setEnrolledCourse] = React.useState(DEMO_COURSES[0].id)

  const handleEnroll = () => {
    toast({
      title: 'Kursa Kaydedildi',
      description: 'Öğrenciye seçilen kurs başarıyla tanımlandı.',
    })
  }

  return (
    <div className="max-w-3xl space-y-8">
      <Link href="/admin/ogrenciler">
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <ArrowLeft className="h-4 w-4" /> Öğrenci Listesine Dön
        </Button>
      </Link>

      {/* Student Profile Card */}
      <div className="p-8 rounded-3xl border border-border/70 bg-card shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border/60">
          <div className="w-16 h-16 rounded-2xl bg-royal-600 text-white font-black text-xl flex items-center justify-center">
            AY
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-foreground">Ahmet Yılmaz</h2>
              <Badge variant="secondary" className="text-xs">Öğrenci</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">ahmet.yilmaz@ornek.com</p>
          </div>
        </div>

        {/* Course Assignment */}
        <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
          <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-royal-600" />
            Yeni Kurs Tanımla
          </h3>
          <div className="flex items-center gap-3">
            <select
              value={enrolledCourse}
              onChange={(e) => setEnrolledCourse(e.target.value)}
              className="flex-1 h-10 px-3 rounded-xl border border-input bg-card text-xs font-semibold"
            >
              {DEMO_COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.cefr_level})
                </option>
              ))}
            </select>
            <Button onClick={handleEnroll} size="sm" className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl text-xs">
              Kursa Ata
            </Button>
          </div>
        </div>

        {/* Current Enrolled Courses */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-foreground">
            Kayıtlı Bulunduğu Kurslar
          </h3>
          <div className="p-4 rounded-2xl border border-border/60 bg-card flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-foreground">{DEMO_COURSES[0].title}</p>
              <p className="text-muted-foreground mt-0.5">Kayıt Tarihi: 2026-03-01 • İlerleme: %40</p>
            </div>
            <Badge variant="success">Aktif</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
