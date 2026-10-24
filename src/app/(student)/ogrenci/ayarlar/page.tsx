'use client'

import * as React from 'react'
import { Lock, Bell, Globe, Shield, Trash2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

export default function StudentSettingsPage() {
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [courseReminders, setCourseReminders] = React.useState(true)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Şifreniz Değiştirildi',
      description: 'Yeni şifreniz başarıyla kaydedildi.',
    })
  }

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
          Hesap Ayarları
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Güvenlik, bildirim ve gizlilik tercihlerinizi yönetin.
        </p>
      </div>

      {/* Password Change */}
      <div className="p-8 rounded-3xl border border-border/70 bg-card shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <KeyRound className="h-5 w-5 text-royal-600" />
          <h2 className="font-display font-bold text-lg text-foreground">
            Şifre Değiştir
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pw">Mevcut Şifre</Label>
            <Input id="current-pw" type="password" placeholder="••••••••" className="rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-pw">Yeni Şifre</Label>
            <Input id="new-pw" type="password" placeholder="En az 8 karakter" className="rounded-xl" />
          </div>

          <Button type="submit" size="sm" className="bg-royal-600 hover:bg-royal-700 text-white font-semibold rounded-xl">
            Şifreyi Güncelle
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="p-8 rounded-3xl border border-border/70 bg-card shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <Bell className="h-5 w-5 text-gold-600" />
          <h2 className="font-display font-bold text-lg text-foreground">
            Bildirim Tercihleri
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm text-foreground block">
                E-posta Bildirimleri
              </span>
              <span className="text-xs text-muted-foreground">
                Yeni ders yayınlandığında veya quiz sonuçlandığında e-posta al.
              </span>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div>
              <span className="font-semibold text-sm text-foreground block">
                Haftalık Hatırlatıcılar
              </span>
              <span className="text-xs text-muted-foreground">
                Düzenli çalışma rutininizi korumanız için haftalık motivasyon mesajı.
              </span>
            </div>
            <Switch
              checked={courseReminders}
              onCheckedChange={setCourseReminders}
            />
          </div>
        </div>
      </div>

      {/* Data Privacy & Deletion */}
      <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
          <Trash2 className="h-4 w-4" />
          <span>Hesabımı ve Verilerimi Sil</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          KVKK ve gizlilik haklarınız kapsamında tüm hesap verilerinizin, quiz geçmişinizin ve
          ilerleme kayıtlarınızın kalıcı olarak silinmesini talep edebilirsiniz.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm('Hesabınızı ve tüm verilerinizi kalıcı olarak silmek istediğinize emin misiniz?')) {
              toast({ title: 'Talep Alındı', description: 'Hesap silme talebiniz iletildi.' })
            }
          }}
          className="text-xs border-rose-300 text-rose-600 hover:bg-rose-100 rounded-xl"
        >
          Hesap Silme Talebi İlet
        </Button>
      </div>
    </div>
  )
}
