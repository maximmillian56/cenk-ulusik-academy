'use client'

import * as React from 'react'
import { Settings, Save, ShieldAlert, Video, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

export default function AdminSettingsPage() {
  const [teacherBio, setTeacherBio] = React.useState('İletişim odaklı İngilizce öğretimi ve CEFR müfredat uzmanı.')
  const [contactEmail, setContactEmail] = React.useState('info@cenkulusik.com')
  const [whatsapp, setWhatsapp] = React.useState('+90 555 123 45 67')
  const [certificatesEnabled, setCertificatesEnabled] = React.useState(true)
  const [videoProvider, setVideoProvider] = React.useState('demo')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Ayarlar Kaydedildi',
      description: 'Platform parametreleri başarıyla güncellendi.',
    })
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Akademi & Sistem Ayarları
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Eğitmen biyografisi, video sağlayıcı konfigürasyonu ve iletişim kanalları.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Teacher Bio Edit */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4">
          <h2 className="font-display font-bold text-base text-foreground">
            Eğitmen Cenk Uluşık Profili
          </h2>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-xs">Web Sitesi Biyografi Metni</Label>
            <Textarea
              id="bio"
              rows={4}
              value={teacherBio}
              onChange={(e) => setTeacherBio(e.target.value)}
              className="rounded-xl text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Bu alan ana sayfadaki &ldquo;Öğretmeninizle Tanışın&rdquo; bölümünde dinamik olarak görüntülenir.
            </p>
          </div>
        </div>

        {/* Video Provider Abstraction Config */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-royal-600" />
            <h2 className="font-display font-bold text-base text-foreground">
              Video Akış Sağlayıcısı (Video Streaming)
            </h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="video-prov" className="text-xs">Aktif Video Servisi</Label>
              <select
                id="video-prov"
                value={videoProvider}
                onChange={(e) => setVideoProvider(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold"
              >
                <option value="demo">Demo Modu (Yerel / Açık Örnek Medya)</option>
                <option value="mux">Mux Video (Güvenli İmzalı Token)</option>
                <option value="cloudflare">Cloudflare Stream (Özel İmzalı URL)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground leading-relaxed">
              <strong>Güvenlik Notu:</strong> YouTube herkese açık video yerleştirmeleri ücretli içerik koruması sağlamaz. Canlı prodüksiyonda Mux veya Cloudflare Stream API kimlik bilgileri <code>.env.local</code> içerisine girilerek DRM/İmzalı token ile teslim edilir.
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4">
          <h2 className="font-display font-bold text-base text-foreground">
            İletişim & WhatsApp Entegrasyonu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Resmi E-posta</Label>
              <Input
                id="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="text-xs">WhatsApp Destek Hattı</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Features switch */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/70 bg-card shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-foreground">
              Bitirme Sertifikası Üretimi
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kursu bitiren öğrencilere otomatik dijital doğrulama kodlu başarı belgesi verilsin.
            </p>
          </div>
          <Switch
            checked={certificatesEnabled}
            onCheckedChange={setCertificatesEnabled}
          />
        </div>

        <Button
          type="submit"
          className="bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2 rounded-xl shadow-md"
        >
          <Save className="h-4 w-4" /> Tüm Ayarları Kaydet
        </Button>
      </form>
    </div>
  )
}
