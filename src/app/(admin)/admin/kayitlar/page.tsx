'use client'

import * as React from 'react'
import { DEMO_COURSES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserCheck, Search, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = React.useState([
    {
      id: 'enr-1',
      studentName: 'Ahmet Yılmaz',
      studentEmail: 'ahmet.yilmaz@ornek.com',
      courseTitle: DEMO_COURSES[0].title,
      enrolledAt: '2026-03-01',
      status: 'active',
      progress: '%40',
    },
    {
      id: 'enr-2',
      studentName: 'Elif Demir',
      studentEmail: 'elif.demir@ornek.com',
      courseTitle: DEMO_COURSES[1].title,
      enrolledAt: '2026-02-15',
      status: 'completed',
      progress: '%100',
    },
  ])

  const handleRevoke = (id: string) => {
    if (confirm('Öğrencinin bu kursa erişimini kaldırmak istiyor musunuz?')) {
      setEnrollments(enrollments.filter((e) => e.id !== id))
      toast({ title: 'Kayıt İptal Edildi' })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Kurs Kayıtları (Enrollments)
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Öğrencilerin kurs erişim yetkileri, aktiflik durumları ve tamamlama oranları.
        </p>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Öğrenci</th>
                <th className="p-4">Kurs</th>
                <th className="p-4">Kayıt Tarihi</th>
                <th className="p-4">İlerleme</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-foreground block">{enr.studentName}</span>
                    <span className="text-muted-foreground text-[11px]">{enr.studentEmail}</span>
                  </td>
                  <td className="p-4 font-medium text-foreground">{enr.courseTitle}</td>
                  <td className="p-4 text-muted-foreground">{enr.enrolledAt}</td>
                  <td className="p-4 font-bold text-royal-600 dark:text-royal-400">
                    {enr.progress}
                  </td>
                  <td className="p-4">
                    <Badge variant={enr.status === 'completed' ? 'success' : 'gold'} className="text-[10px]">
                      {enr.status === 'completed' ? 'Tamamlandı' : 'Aktif'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevoke(enr.id)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
