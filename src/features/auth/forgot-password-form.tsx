'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

const forgotSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export function ForgotPasswordForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormData) => {
    setError(null)
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient()
        await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/ogrenci/ayarlar`,
        })
      }
      setSuccess(true)
      toast({
        title: 'Sıfırlama E-postası Gönderildi',
        description: 'Lütfen gelen kutunuzu kontrol edin.',
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
          E-posta Gönderildi!
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Şifre sıfırlama bağlantısını e-posta adresinize ilettik. Lütfen spam kutusunu da
          kontrol ediniz.
        </p>
        <div className="pt-2">
          <Link href="/giris">
            <Button size="sm" variant="outline" className="rounded-xl">
              Giriş Sayfasına Dön
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
        <Label htmlFor="forgot-email">Kayıtlı E-posta Adresiniz</Label>
        <Input
          id="forgot-email"
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

      <Button
        type="submit"
        className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl shadow-md py-6 text-base"
        isLoading={isSubmitting}
      >
        {!isSubmitting && <Mail className="h-4 w-4 mr-1.5" />}
        Sıfırlama Bağlantısı Gönder
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border/60">
        Şifrenizi hatırladınız mı?{' '}
        <Link href="/giris" className="text-royal-600 hover:underline dark:text-royal-400 font-bold">
          Giriş Yap
        </Link>
      </p>
    </form>
  )
}
