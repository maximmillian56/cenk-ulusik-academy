import type { Metadata } from 'next'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası — Cenk Uluşık English Academy',
  description: 'Gizlilik politikası, çerez politikası ve kullanıcı verilerinin korunması.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="container-custom max-w-4xl">
        <Badge variant="outline" className="text-royal-600 border-royal-600/30 mb-2 px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          Yasal Bilgilendirme
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          Gizlilik ve Çerez Politikası
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Son güncelleme: 24 Ekim 2026
        </p>

        {/* Disclaimer warning */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3 mb-10">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Yasal Uyarı:</strong> İşbu metin örnek ve düzenlenebilir bir gizlilik
            politikası taslağıdır. Resmi hukuki danışmanlık yerine geçmez. Kurumunuza özel yasal
            düzenlemeler için hukuk danışmanınızla görüşünüz.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/90 text-sm sm:text-base leading-relaxed">
          <h2 className="font-display text-xl font-bold text-foreground">
            1. Veri Sorumlusu
          </h2>
          <p>
            Cenk Uluşık English Academy (&ldquo;Akademi&rdquo;) olarak kişisel verilerinizin
            güvenliğine azami özen göstermekteyiz. İşbu Gizlilik Politikası, platformumuz
            üzerinden toplanan bilgilerin hangi amaçlarla işlendiğini açıklar.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground">
            2. Toplanan Kişisel Veriler
          </h2>
          <p>
            Platformumuza kaydolurken veya kurs başvurusunda bulunurken aşağıdaki veriler
            toplanabilir:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Kimlik Bilgileri: Ad, soyad.</li>
            <li>İletişim Bilgileri: E-posta adresi, telefon numarası.</li>
            <li>Eğitim & İlerleme Verileri: Kayıtlı olunan kurslar, izlenen video süreleri, quiz cevapları ve puanlar.</li>
            <li>Teknik Veriler: IP adresi, tarayıcı türü ve oturum çerezleri.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-foreground">
            3. Verilerin İşlenme Amaçları
          </h2>
          <p>
            Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Kullanıcı hesabı oluşturulması ve güvenli oturum yönetimi,</li>
            <li>Online kurslara erişim sağlanması ve öğrenci ilerleme takibi,</li>
            <li>Sınav sonuçlarının değerlendirilmesi ve sertifika oluşturulması,</li>
            <li>Öğrenci talep ve başvurularının yanıtlanması,</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-foreground">
            4. Çerezler (Cookies)
          </h2>
          <p>
            Sitemizde yalnızca temel oturum yönetimi, tema tercihi ve güvenlik doğrulaması
            amaçlı zorunlu teknik çerezler kullanılmaktadır. Üçüncü taraf reklam takip
            çerezleri barındırılmamaktadır.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground">
            5. Veri Güvenliği ve Silme Hakkı
          </h2>
          <p>
            Verileriniz şifreli veritabanlarında saklanır ve yetkisiz erişimlere karşı
            korunur. Hesabınızı ve verilerinizi tamamen silmek istediğinizde
            <strong> info@cenkulusik.com</strong> adresine talepte bulunabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
