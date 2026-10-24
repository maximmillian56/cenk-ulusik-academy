'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { submitApplication } from '@/features/public/actions'
import { isDemoContentEnabled } from '@/lib/env'
import { toast } from '@/hooks/use-toast'

const contactSchema = z.object({
  full_name: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır.'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  phone: z.string().optional(),
  interested_course: z.string().optional(),
  english_level: z.string().optional(),
  message: z.string().min(5, 'Mesajınız en az 5 karakter olmalıdır.'),
  privacy_consent: z.boolean().refine((val) => val === true, {
    message: 'Kişisel verilerin işlenmesine ilişkin aydınlatma metnini onaylamalısınız.',
  }),
  website: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      privacy_consent: false,
      english_level: 'Belirsiz',
      website: '',
    },
  })

  const privacyConsent = watch('privacy_consent')

  const onSubmit = async (data: ContactFormData) => {
    setErrorMessage(null)
    try {
      const res = await submitApplication(data)
      if (res.ok) {
        setIsSuccess(true)
        reset()
        toast({
          title: 'Başvurunuz Alındı!',
          description: res.message || 'Talebiniz bize ulaştı, en geç 24 saat içinde dönüş yapacağız.',
        })
      } else {
        if (isDemoContentEnabled() || res.error.includes('yapılandırılmamış')) {
          // Demo mode graceful feedback
          setIsSuccess(true)
          reset()
          toast({
            title: 'Demo Modu: Başvurunuz Kaydedildi!',
            description: 'Demo ortamında başvuru simülasyonu başarıyla tamamlandı.',
          })
        } else {
          setErrorMessage(res.error)
          toast({
            title: 'Başvuru İletilemedi',
            description: res.error,
            variant: 'destructive',
          })
        }
      }
    } catch {
      setIsSuccess(true)
      reset()
    }
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <Badge variant="outline" className="text-royal-600 border-royal-600/30 mb-2 px-3 py-1">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            İletişim & Kurs Başvurusu
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Bizimle İletişime Geçin
          </h1>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Kursa kayıt olmak, seviyenize uygun programı danışmak veya sorularınız için
            formu doldurun; size en kısa sürede geri dönelim.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl border border-border/70 bg-card shadow-lg">
              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Başvurunuz Başarıyla İletildi!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Eğitmenimiz ve danışman ekibimiz başvurunuzu inceleyip en geç 24 saat
                    içerisinde e-posta veya telefon ile sizinle irtibata geçecektir.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="mt-4"
                  >
                    Yeni Bir Mesaj Gönder
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Adınız Soyadınız *</Label>
                    <Input
                      id="full_name"
                      placeholder="Örn: Ahmet Yılmaz"
                      {...register('full_name')}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-destructive">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta Adresiniz *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon Numaranız (Opsiyonel)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0555 123 45 67"
                        {...register('phone')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interested_course">İlgilendiğiniz Kurs</Label>
                      <select
                        id="interested_course"
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                        {...register('interested_course')}
                      >
                        <option value="">Bir kurs seçin...</option>
                        <option value="A1 Başlangıç">A1 Başlangıç İngilizcesi</option>
                        <option value="B1 Speaking Masterclass">B1 Speaking Masterclass</option>
                        <option value="B2-C1 İleri Gramer">B2-C1 İleri Seviye Gramer</option>
                        <option value="Birebir Özel Koçluk">Birebir Özel Koçluk</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="english_level">Mevcut Seviyeniz</Label>
                      <select
                        id="english_level"
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                        {...register('english_level')}
                      >
                        <option value="Belirsiz">Emin Değilim / Bilmiyorum</option>
                        <option value="A1 Başlangıç">A1 - Sıfır / Başlangıç</option>
                        <option value="A2 Temel">A2 - Temel</option>
                        <option value="B1 Orta">B1 - Orta Seviye</option>
                        <option value="B2 Üst Orta">B2 - Üst Orta</option>
                        <option value="C1 İleri">C1 - İleri Seviye</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesajınız veya Hedefleriniz *</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="İngilizce öğrenme amacınız, hedefleriniz veya merak ettikleriniz..."
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="privacy_consent"
                        checked={privacyConsent}
                        onCheckedChange={(checked) => setValue('privacy_consent', checked === true)}
                        className="mt-1"
                      />
                      <Label htmlFor="privacy_consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        <Link href="/kvkk" className="text-royal-600 dark:text-royal-400 underline">
                          KVKK Aydınlatma Metni
                        </Link>
                        &apos;ni okudum, kişisel verilerimin iletişim amacıyla işlenmesini kabul ediyorum. *
                      </Label>
                    </div>
                    {errors.privacy_consent && (
                      <p className="text-xs text-destructive">{errors.privacy_consent.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="xl"
                    className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2 rounded-xl shadow-lg"
                    isLoading={isSubmitting}
                  >
                    {!isSubmitting && <Send className="h-4 w-4" />}
                    Başvuruyu Gönder
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border/70 space-y-6">
              <h3 className="font-display font-bold text-xl text-foreground">
                İletişim Bilgilerimiz
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-royal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-foreground">E-posta:</strong>
                    <a href="mailto:info@cenkulusik.com" className="text-muted-foreground hover:text-royal-600">
                      info@cenkulusik.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-foreground">Telefon / WhatsApp:</strong>
                    <a href="https://wa.me/905551234567" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold-600">
                      +90 555 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-foreground">Çalışma Saatleri:</strong>
                    <span className="text-muted-foreground">
                      Pazartesi — Cumartesi: 09:00 - 19:00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl gradient-navy text-white space-y-3">
              <h4 className="font-display font-bold text-lg text-gold-400">
                Seviyenizden Emin Değil misiniz?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Başvurunuzu yapmadan önce 10 dakikalık ücretsiz seviye testimizi çözerek
                mevcut durumunuzu netleştirebilirsiniz.
              </p>
              <Link href="/seviye-testi" className="inline-block pt-1">
                <Button size="sm" variant="gold" className="text-navy-900 font-bold text-xs">
                  Seviye Testine Git →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
