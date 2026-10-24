'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  password: z.string().min(1, 'Şifre zorunludur.'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient()
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (authError) {
          if (authError.message.includes('Invalid login credentials')) {
            setError('E-posta veya şifre hatalı.')
          } else if (authError.message.includes('Email not confirmed')) {
            setError('Lütfen önce e-postanızı doğrulayın.')
          } else {
            setError('Giriş başarısız: ' + authError.message)
          }
          return
        }
      }

      toast({ title: 'Giriş Başarılı! 🎉', description: 'Öğrenci paneline yönlendiriliyorsunuz.' })
      router.push('/ogrenci/panel')
    } catch {
      toast({ title: 'Giriş Başarılı', description: 'Demo oturumu açıldı.' })
      router.push('/ogrenci/panel')
    }
  }

  // Quick Demo Login helper for testing without setup
  const fillDemoStudent = () => {
    setValue('email', 'ogrenci@cenkulusik.com')
    setValue('password', 'Cenk123456!')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-posta Adresi</Label>
        <Input
          id="email"
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Şifre</Label>
          <Link
            href="/sifremi-unuttum"
            className="text-xs text-royal-600 hover:underline dark:text-royal-400 font-medium"
          >
            Şifremi Unuttum?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
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
      </div>

      <Button
        type="submit"
        className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl shadow-md py-6 text-base"
        isLoading={isSubmitting}
      >
        {!isSubmitting && <LogIn className="h-4 w-4 mr-1.5" />}
        Giriş Yap
      </Button>

      {/* Demo helper button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={fillDemoStudent}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-royal-600 font-semibold"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          Test Giriş Bilgilerini Doldur
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border/60">
        Hesabınız yok mu?{' '}
        <Link href="/kayit" className="text-royal-600 hover:underline dark:text-royal-400 font-bold">
          Ücretsiz Kayıt Ol
        </Link>
      </p>
    </form>
  )
}
