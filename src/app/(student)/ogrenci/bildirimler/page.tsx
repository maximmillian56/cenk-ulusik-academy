import { Bell, Info, Award, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function StudentNotificationsPage() {
  const notifications = [
    {
      id: 'n-1',
      title: 'A1 Modül 1 Sınav Başarısı',
      message: 'Tebrikler! Modül 1 değerlendirme sınavını %100 başarıyla tamamladınız.',
      type: 'success',
      date: '2 saat önce',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Yeni Konuşma Dersi Eklendi',
      message: 'B1 Speaking Masterclass kursuna yeni pratik videosu yüklendi.',
      type: 'info',
      date: 'Dün',
      read: true,
    },
    {
      id: 'n-3',
      title: 'Haftalık Çalışma Raporunuz Hazır',
      message: 'Bu hafta toplam 4.6 saat video ders tamamlayarak serinizi korudunuz.',
      type: 'info',
      date: '3 gün önce',
      read: true,
    },
  ]

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
            Bildirimler
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kurs güncellemeleri, sınav sonuçları ve duyurular.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm divide-y divide-border/50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 flex items-start gap-4 transition-colors ${
              !n.read ? 'bg-royal-50/40 dark:bg-royal-950/20' : 'hover:bg-muted/30'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                n.type === 'success'
                  ? 'bg-green-100 text-green-600 dark:bg-green-950'
                  : 'bg-royal-100 text-royal-600 dark:bg-royal-950'
              }`}
            >
              {n.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Bell className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-foreground">
                  {n.title}
                </h4>
                <span className="text-xs text-muted-foreground">{n.date}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
