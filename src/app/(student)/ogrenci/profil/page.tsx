'use client'

import * as React from 'react'
import { User, Mail, Phone, Calendar, BookOpen, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export default function StudentProfilePage() {
  const [fullName, setFullName] = React.useState('Ahmet Yılmaz')
  const [phone, setPhone] = React.useState('0555 123 45 67')
  const [bio, setBio] = React.useState('Yazılım mühendisiyim, teknik mülakatlar için İngilizce konuşma akıcılığımı geliştirmeyi hedefliyorum.')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Profil Güncellendi!',
      description: 'Değişiklikler başarıyla kaydedildi.',
    })
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
          Öğrenci Profilim
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kişisel bilgilerinizi ve öğrenme hedeflerinizi düzenleyin.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-border/70 bg-card shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border/60">
            <div className="w-16 h-16 rounded-full bg-royal-600 text-white font-black text-xl flex items-center justify-center">
              AY
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">{fullName}</h3>
              <p className="text-xs text-muted-foreground">Öğrenci • Kayıt Tarihi: Mart 2026</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Adınız Soyadınız</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta Adresi</Label>
            <Input
              id="email"
              type="email"
              disabled
              value="ahmet.yilmaz@ornek.com"
              className="rounded-xl bg-muted/50 cursor-not-allowed"
            />
            <span className="text-[11px] text-muted-foreground">
              E-posta adresiniz hesap güvenliği nedeniyle kilitlidir.
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Öğrenme Hedefi & Biyografi</Label>
            <Textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <Button type="submit" className="bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2 rounded-xl">
            <Save className="h-4 w-4" /> Değişiklikleri Kaydet
          </Button>
        </form>
      </div>
    </div>
  )
}
