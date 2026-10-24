import type { Metadata } from 'next'
import { FAQSection } from '@/components/sections/faq-section'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular (SSS) — Cenk Uluşık English Academy',
  description:
    'Eğitimler, kayıt süreçleri, sertifikasyon ve ödeme koşulları hakkında merak edilen tüm soruların yanıtları.',
}

export default function FAQPage() {
  return (
    <div className="py-8">
      <FAQSection />
    </div>
  )
}
