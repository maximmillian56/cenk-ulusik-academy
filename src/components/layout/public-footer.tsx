import Link from 'next/link'
import { GraduationCap, Mail, Phone, Heart, ShieldCheck, Award } from 'lucide-react'

const quickLinks = [
  { href: '/kurslar', label: 'Tüm Kurslar' },
  { href: '/hakkimda', label: 'Cenk Uluşık Hakkında' },
  { href: '/seviye-testi', label: 'Online Seviye Testi' },
  { href: '/blog', label: 'İngilizce Rehber Blog' },
  { href: '/yorumlar', label: 'Öğrenci Yorumları' },
  { href: '/sss', label: 'Sıkça Sorulan Sorular' },
]

const legalLinks = [
  { href: '/gizlilik', label: 'Gizlilik ve Çerez Politikası' },
  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
  { href: '/iletisim', label: 'İletişim & Başvuru' },
]

const courseCategories = [
  { href: '/kurslar?seviye=A1', label: 'A1 Başlangıç Seviyesi' },
  { href: '/kurslar?seviye=A2', label: 'A2 Temel İngilizce' },
  { href: '/kurslar?seviye=B1', label: 'B1 Orta Seviye Konuşma' },
  { href: '/kurslar?seviye=B2', label: 'B2 Üst Orta Gramer & Akıcılık' },
  { href: '/kurslar?seviye=C1', label: 'C1 İleri Seviye İngilizce' },
]

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0B1530] text-slate-200 border-t border-slate-800">
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-royal-600 text-white shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white block">
                  Cenk Uluşık
                </span>
                <span className="text-xs font-semibold text-gold-400 tracking-wider uppercase block">
                  English Academy
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              İngilizceyi Sadece Öğrenme, Özgüvenle Konuş! Cenk Uluşık rehberliğinde
              A1&apos;den C1&apos;e yapılandırılmış müfredatla geleceğinizin kapısını açın.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@cenkulusik.com"
                className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-gold-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-gold-400" />
                info@cenkulusik.com
              </a>
              <a
                href="tel:+905551234567"
                className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-gold-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-gold-400" />
                +90 555 123 45 67
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-base mb-4 tracking-wide">
              Hızlı Erişim
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-semibold text-white text-base mb-4 tracking-wide">
              Kurs Seviyeleri
            </h3>
            <ul className="space-y-2.5">
              {courseCategories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and Portal */}
          <div>
            <h3 className="font-semibold text-white text-base mb-4 tracking-wide">
              Yasal & Güvenlik
            </h3>
            <ul className="space-y-2.5 mb-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-2">
                Erişim Portalları
              </span>
              <div className="flex flex-col gap-2">
                <Link
                  href="/giris"
                  className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                >
                  → Öğrenci Girişi
                </Link>
                <Link
                  href="/admin/panel"
                  className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                >
                  → Öğretmen / Admin Paneli
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p>
            <strong>Önemli Yasal Bilgilendirme:</strong> Bu platform tarafından verilen
            sertifikalar, kurs katılım ve bitirme başarı belgesi niteliğinde olup resmi CEFR veya
            devlet onaylı diploma yerine geçmez. Platformda yer alan biyografik ve mesleki
            bilgiler yetkili yönetici tarafından düzenlenebilir.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} Cenk Uluşık English Academy. Tüm hakları saklıdır.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            Türkiye&apos;de özenle geliştirildi
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
