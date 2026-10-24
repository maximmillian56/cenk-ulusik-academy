import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Eğitimler canlı mı yoksa kayıtlı video ders mi?',
    a: 'Platformumuzda yüksek kaliteli, modüler video dersler yer alır. İstediğiniz gün ve saatte kendi hızınızda takip edebilir, takıldığınız yerleri tekrar izleyebilirsiniz. Ayrıca eğitmen soru-cevap ve özel destek imkanları sunulmaktadır.',
  },
  {
    q: 'Hangi seviyeden başlamalıyım?',
    a: 'Platformumuzdaki 20 soruluk ücretsiz "Online Seviye Testi"ni çözerek A1, A2, B1, B2 veya C1 seviyenizi tespit edebilir ve size önerilen başlangıç kursuna katılabilirsiniz.',
  },
  {
    q: 'Dersleri tamamlayınca sertifika alabiliyor muyum?',
    a: 'Evet. Kursunuzdaki tüm video dersleri ve modül sonu testlerini %70 ve üzeri başarıyla tamamladığınızda adınıza özel benzersiz doğrulama kodlu "Kurs Bitirme Başarı Sertifikası" üretilir.',
  },
  {
    q: 'Kurs ücretli mi, nasıl kayıt olabilirim?',
    a: 'A1 Başlangıç kursumuz ve seviye testimiz ücretsizdir. İleri seviye masterclass kursları için kurs sayfasından başvuru formunu doldurarak veya doğrudan kayıt oluşturarak erişim sağlayabilirsiniz.',
  },
  {
    q: 'İngilizce konuşma korkumu nasıl yenebilirim?',
    a: 'Platformun temel odağı ezber yerine "aktif konuşma" ve "çevirisiz düşünme" refleksidir. Derslerde sunulan chunking (kalıp bloklar) ve shadowing metotlarıyla kısa sürede duraksamadan konuşmaya başlarsınız.',
  },
]

export function FAQSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400 block mb-2">
            Aklınıza Takılanlar
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Cenk Uluşık English Academy sistemi ve ders işleyişi hakkında merak edilenler.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border border-border/70 bg-card px-6 py-2 shadow-sm"
              >
                <AccordionTrigger className="font-display font-semibold text-base sm:text-lg text-foreground hover:no-underline text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pt-2 pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
