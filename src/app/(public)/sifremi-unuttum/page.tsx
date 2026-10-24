import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/features/auth/forgot-password-form'
import { KeyRound } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Şifremi Unuttum — Cenk Uluşık English Academy',
  description: 'Şifrenizi sıfırlamak için e-posta adresinize kurtarma bağlantısı gönderin.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="py-16 lg:py-24 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-royal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Şifrenizi mi Unuttunuz?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kayıtlı e-posta adresinizi girin, sıfırlama bağlantısını iletelim.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-border/80 bg-card shadow-xl">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
