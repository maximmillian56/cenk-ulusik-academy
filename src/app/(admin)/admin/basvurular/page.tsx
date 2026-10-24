'use client'

import * as React from 'react'
import { FileText, CheckCircle2, XCircle, Clock, Mail, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { updateApplicationStatus } from '@/features/public/actions'

export default function AdminApplicationsPage() {
  const [applications, setApplications] = React.useState([
    {
      id: 'app-1',
      full_name: 'Mehmet Kaya',
      email: 'mehmet.k@ornek.com',
      phone: '0555 987 65 43',
      interested_course: 'B1 Speaking Masterclass',
      english_level: 'B1',
      message: 'Teknik mülakatlar için konuşma pratiği yapmak istiyorum.',
      status: 'pending',
      created_at: '2026-03-24 14:30',
    },
    {
      id: 'app-2',
      full_name: 'Zeynep Aydın',
      email: 'zeynep.a@ornek.com',
      phone: '0555 111 22 33',
      interested_course: 'A1 Başlangıç İngilizcesi',
      english_level: 'A1',
      message: 'Sıfırdan temel atmak istiyorum.',
      status: 'pending',
      created_at: '2026-03-23 18:20',
    },
  ])

  const handleStatusChange = async (id: string, newStatus: 'reviewed' | 'accepted' | 'rejected') => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )
    try {
      await updateApplicationStatus(id, newStatus)
    } catch {
      // Graceful fallback in demo mode
    }
    toast({
      title: 'Başvuru Durumu Güncellendi',
      description: `Durum: ${newStatus === 'accepted' ? 'Onaylandı' : 'İncelendi'}`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Kurs Başvuru & Kayıt Talepleri
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Web sitesi iletişim ve kurs formlarından gelen öğrenci adaylarının talepleri.
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  {app.full_name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-royal-600" /> {app.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-gold-600" /> {app.phone}
                  </span>
                  <span>•</span>
                  <span>{app.created_at}</span>
                </div>
              </div>

              <Badge
                variant={
                  app.status === 'accepted'
                    ? 'success'
                    : app.status === 'rejected'
                    ? 'destructive'
                    : 'gold'
                }
                className="self-start sm:self-auto text-xs"
              >
                {app.status === 'accepted'
                  ? 'Onaylandı'
                  : app.status === 'rejected'
                  ? 'Reddedildi'
                  : 'Bekliyor'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-muted/30">
                <span className="text-muted-foreground block mb-0.5 font-medium">İlgilenilen Kurs:</span>
                <strong className="text-foreground text-sm">{app.interested_course}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30">
                <span className="text-muted-foreground block mb-0.5 font-medium">Mevcut Seviye:</span>
                <strong className="text-foreground text-sm">{app.english_level}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 text-xs">
              <span className="font-bold text-foreground block mb-1">Adayın Mesajı:</span>
              <p className="text-muted-foreground leading-relaxed">&ldquo;{app.message}&rdquo;</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange(app.id, 'rejected')}
                className="text-xs text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <XCircle className="h-4 w-4 mr-1" /> Reddet
              </Button>
              <Button
                size="sm"
                onClick={() => handleStatusChange(app.id, 'accepted')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Onayla & Kursa Kaydet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
