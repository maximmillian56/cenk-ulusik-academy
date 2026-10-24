import Link from 'next/link'
import {
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEMO_COURSES } from '@/lib/demo-data'
import { getAdminStats } from '@/services/admin'
import { isSupabaseConfigured } from '@/lib/env'

export default async function AdminDashboardPage() {
  let statsData: Awaited<ReturnType<typeof getAdminStats>> | null = null

  if (isSupabaseConfigured()) {
    try {
      statsData = await getAdminStats()
    } catch (err) {
      console.warn('Failed to fetch admin stats from database, using demo defaults:', err)
    }
  }

  const publishedCoursesCount = statsData?.publishedCourses ?? DEMO_COURSES.length
  const totalLessonsCount =
    statsData?.lessons ??
    DEMO_COURSES.reduce(
      (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
      0
    )
  const studentCount = statsData?.students ?? 24
  const pendingAppsCount = statsData?.pendingApps ?? 3

  // Real or realistic operational metrics
  const stats = [
    {
      title: 'Kayıtlı Öğrenci',
      value: `${studentCount}`,
      badge: statsData ? 'Aktif Öğrenci' : '+12% bu ay',
      icon: Users,
      color: 'text-royal-600',
      bg: 'bg-royal-100 dark:bg-royal-950',
    },
    {
      title: 'Yayındaki Kurslar',
      value: `${publishedCoursesCount}`,
      badge: 'Aktif Müfredat',
      icon: BookOpen,
      color: 'text-gold-600',
      bg: 'bg-gold-100 dark:bg-gold-950',
    },
    {
      title: 'Toplam Video Ders',
      value: `${totalLessonsCount}`,
      badge: 'HD Akış',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Bekleyen Başvurular',
      value: `${pendingAppsCount}`,
      badge: statsData ? 'Onay Bekliyor' : 'İnceleme Bekliyor',
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-950',
    },
  ]

  const recentApplications = [
    {
      name: 'Mehmet Kaya',
      email: 'mehmet.k@ornek.com',
      course: 'B1 Speaking Masterclass',
      level: 'B1',
      date: 'Bugün 14:30',
      status: 'pending',
    },
    {
      name: 'Zeynep Aydın',
      email: 'zeynep.a@ornek.com',
      course: 'A1 Başlangıç İngilizcesi',
      level: 'A1',
      date: 'Dün 18:20',
      status: 'pending',
    },
    {
      name: 'Burak Demir',
      email: 'burak.d@ornek.com',
      course: 'B2-C1 İleri Gramer',
      level: 'B2',
      date: '22 Ekim',
      status: 'reviewed',
    },
  ]

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <Badge variant="gold" className="text-xs font-bold mb-1 text-navy-900">
            Akademi Yönetim Merkezi
          </Badge>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Yönetici & Eğitmen Paneli
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Öğrenci kayıtları, ders video içerikleri, sınavlar ve başvuru yönetimi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/kurslar/yeni">
            <Button size="sm" className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl gap-1.5 shadow-md">
              <BookOpen className="h-4 w-4" /> Yeni Kurs Oluştur
            </Button>
          </Link>
          <Link href="/admin/testler/yeni">
            <Button size="sm" variant="gold" className="text-navy-900 font-bold rounded-xl gap-1.5 shadow-md">
              <ClipboardList className="h-4 w-4" /> Yeni Test Ekle
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-muted-foreground block">
                {s.title}
              </span>
              <span className="font-display font-black text-3xl text-foreground mt-1 block">
                {s.value}
              </span>
              <span className="text-[11px] font-semibold text-royal-600 dark:text-royal-400">
                {s.badge}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Ops & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-foreground">
              Son Gelen Kurs Başvuruları
            </h2>
            <Link
              href="/admin/basvurular"
              className="text-xs font-semibold text-royal-600 hover:underline"
            >
              Tüm Başvuruları Gör ({recentApplications.length}) →
            </Link>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm divide-y divide-border/50">
            {recentApplications.map((app, idx) => (
              <div
                key={idx}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground">
                    {app.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {app.email} • {app.date}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {app.course}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Seviye: {app.level}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Badge
                    variant={app.status === 'pending' ? 'gold' : 'success'}
                    className="text-[10px] font-bold"
                  >
                    {app.status === 'pending' ? 'Bekliyor' : 'İncelendi'}
                  </Badge>
                  <Link href="/admin/basvurular">
                    <Button size="sm" variant="outline" className="text-xs rounded-xl">
                      Detay
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="font-display font-bold text-lg text-foreground">
            Hızlı Yönetim İşlemleri
          </h2>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm space-y-3">
            <Link href="/admin/kurslar/yeni" className="block">
              <div className="p-3.5 rounded-2xl border border-border/60 hover:bg-muted/40 transition-colors flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  + Yeni Kurs Ekle & Yayınla
                </span>
                <ArrowRight className="h-4 w-4 text-royal-600" />
              </div>
            </Link>

            <Link href="/admin/ogrenciler" className="block">
              <div className="p-3.5 rounded-2xl border border-border/60 hover:bg-muted/40 transition-colors flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Öğrenci Kurs Kaydı Tanımla
                </span>
                <ArrowRight className="h-4 w-4 text-royal-600" />
              </div>
            </Link>

            <Link href="/admin/duyurular" className="block">
              <div className="p-3.5 rounded-2xl border border-border/60 hover:bg-muted/40 transition-colors flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Öğrencilere Duyuru Yayınla
                </span>
                <ArrowRight className="h-4 w-4 text-royal-600" />
              </div>
            </Link>

            <Link href="/admin/yorumlar" className="block">
              <div className="p-3.5 rounded-2xl border border-border/60 hover:bg-muted/40 transition-colors flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Yeni Öğrenci Yorumunu Onayla
                </span>
                <ArrowRight className="h-4 w-4 text-royal-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
