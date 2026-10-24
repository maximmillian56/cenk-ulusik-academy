import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/register-form'
import { GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kayıt Ol — Cenk Uluşık English Academy',
  description: 'Ücretsiz öğrenci hesabı oluşturun ve hemen İngilizce öğrenmeye başlayın.',
}

export default function RegisterPage() {
  return (
    <div className="py-16 lg:py-24 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-royal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Ücretsiz Hesap Oluşturun
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Akademimize katılın ve konuşma odaklı İngilizce serüvenine başlayın.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-border/80 bg-card shadow-xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
