import type { Metadata } from 'next'
import { ShieldCheck, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni — Cenk Uluşık English Academy',
  description:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca aydınlatma metni.',
}

export default function KVKKPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="container-custom max-w-4xl">
        <Badge variant="outline" className="text-royal-600 border-royal-600/30 mb-2 px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          6698 Sayılı Kanun
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          KVKK Aydınlatma Metni
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme
        </p>

        {/* Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3 mb-10">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Yasal Uyarı:</strong> İşbu metin örnek ve düzenlenebilir bir KVKK metni
            taslağıdır. Resmi hukuki bağlayıcılık kazanması için yasal danışmanınız
            tarafından teyit edilmesi önerilir.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/90 text-sm sm:text-base leading-relaxed">
          <h2 className="font-display text-xl font-bold text-foreground">
            1. Veri Sorumlusunun Kimliği
          </h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca,
            Cenk Uluşık English Academy veri sorumlusu sıfatıyla hareket etmektedir.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground">
            2. İşlenen Kişisel Veriler ve Hukuki Sebebi
          </h2>
          <p>
            Kişisel verileriniz, Kanun&apos;un 5. maddesinde belirtilen &ldquo;bir sözleşmenin
            kurulması veya ifasıyla doğrudan doğruya ilgili olması&rdquo; ve &ldquo;ilgili kişinin
            açık rızası&rdquo; hukuki sebeplerine dayalı olarak dijital kanallardan toplanmaktadır.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground">
            3. Kişisel Verilerin Aktarımı
          </h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar ve platform altyapı hizmeti sağlayan
            sunucu sağlayıcıları haricinde hiçbir üçüncü taraf şirkete ticari veya reklam amaçlı
            aktarılmaz ya da satılmaz.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground">
            4. İlgili Kişinin Kanun&apos;un 11. Maddesindeki Hakları
          </h2>
          <p>
            KVKK&apos;nın 11. maddesi uyarınca veri sahipleri şu haklara sahiptir:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>Kanun&apos;un 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-foreground">
            5. Başvuru Usulü
          </h2>
          <p>
            Haklarınıza ilişkin taleplerinizi yazılı olarak veya kayıtlı e-posta adresinizden
            <strong> info@cenkulusik.com</strong> adresine iletebilirsiniz. Başvurularınız en geç
            30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
          </p>
        </div>
      </div>
    </div>
  )
}
