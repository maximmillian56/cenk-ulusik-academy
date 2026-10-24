import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/login-form'
import { GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Öğrenci Girişi — Cenk Uluşık English Academy',
  description: 'Öğrenci hesabınıza giriş yapın ve video derslerinize kaldığınız yerden devam edin.',
}

export default function LoginPage() {
  return (
    <div className="py-16 lg:py-24 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-royal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Akademiye Giriş Yap
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Derslerinize, testlerinize ve sertifikalarınıza erişin.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-border/80 bg-card shadow-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
