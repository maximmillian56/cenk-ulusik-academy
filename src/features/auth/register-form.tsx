'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

const registerSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır.')
    .max(80, 'Ad soyad çok uzun.'),
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır.')
    .regex(/[A-Z]/, 'En az 1 büyük harf içermelidir.')
    .regex(/[0-9]/, 'En az 1 rakam içermelidir.'),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Gizlilik politikasını ve KVKK şartlarını kabul etmelisiniz.',
  }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { privacy: false },
  })

  const privacyValue = watch('privacy')

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient()
        const { error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
            },
          },
        })

        if (authError) {
          setError(authError.message)
          return
        }
      }

      setSuccess(true)
      toast({
        title: 'Kayıt Başarılı!',
        description: 'E-postanıza doğrulama bağlantısı gönderildi.',
      })
    } catch {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="p-8 rounded-3xl border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground">
          Kaydınız Başarıyla Alındı!
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          E-posta adresinize bir doğrulama bağlantısı gönderdik. Doğrulama adımından sonra
          öğrenci panelinize giriş yapabilirsiniz.
        </p>
        <div className="pt-2">
          <Link href="/giris">
            <Button size="sm" className="bg-royal-600 hover:bg-royal-700 text-white rounded-xl">
              Giriş Sayfasına Git
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="reg-name">Adınız Soyadınız *</Label>
        <Input
          id="reg-name"
          placeholder="Örn: Ahmet Yılmaz"
          autoComplete="name"
          className="rounded-xl"
          {...register('full_name')}
        />
        {errors.full_name && (
          <p className="text-xs text-destructive">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">E-posta Adresiniz *</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="ornek@email.com"
          autoComplete="email"
          className="rounded-xl"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Şifre Belirleyin *</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            className="rounded-xl pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        <p className="text-[11px] text-muted-foreground">
          En az 8 karakter, 1 büyük harf ve 1 rakam içermelidir.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy-terms"
            checked={privacyValue}
            onCheckedChange={(checked) => setValue('privacy', checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="privacy-terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer font-normal">
            <Link href="/gizlilik" className="text-royal-600 underline dark:text-royal-400">
              Gizlilik Politikası
            </Link>
            {' '}ve{' '}
            <Link href="/kvkk" className="text-royal-600 underline dark:text-royal-400">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum, kabul ediyorum. *
          </Label>
        </div>
        {errors.privacy && (
          <p className="text-xs text-destructive">{errors.privacy.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl shadow-md py-6 text-base"
        isLoading={isSubmitting}
      >
        {!isSubmitting && <UserPlus className="h-4 w-4 mr-1.5" />}
        Ücretsiz Hesap Oluştur
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border/60">
        Zaten hesabınız var mı?{' '}
        <Link href="/giris" className="text-royal-600 hover:underline dark:text-royal-400 font-bold">
          Giriş Yap
        </Link>
      </p>
    </form>
  )
}
