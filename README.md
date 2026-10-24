# Cenk Uluşık English Academy 🎓

> **"İngilizceyi Sadece Öğrenme, Özgüvenle Konuş!"**  
> *Learn English. Unlock Your Future.*

Üst düzey, üretime hazır (production-ready), tam teşekküllü (full-stack) online İngilizce öğrenme yönetim platformu (Learning Management Platform).

---

## 🌟 Proje Genel Bakışı

Cenk Uluşık English Academy; basit bir pazarlama sayfası değil, gerçek bir eğitim platformudur:
- **Ziyaretçiler için:** Animasyonlu açılış sayfası, eğitmen tanıtımı, CEFR uyumlu kurs kataloğu, 4 adımlı öğrenme yolculuğu, interaktif kelime kartları demosu, 12-20 soruluk online seviye tespit sınavı (Placement Test), blog ve onaylı öğrenci yorumları.
- **Öğrenciler için (`/ogrenci`):** Kişiselleştirilmiş karşılama, kayıtlı kurslar, ders tamamlama ilerlemesi, büyük video oynatıcı (Mux/Cloudflare/Demo soyutlama katmanı, oynatma listesi, ders notları, indirilebilir kaynaklar), interaktif sınav motoru (Quiz Engine), sınav sonuç analizleri, haftalık çalışma grafikleri, dijital doğrulama kodlu başarı sertifikaları ve bildirim merkezi.
- **Eğitmen & Yönetici için (`/admin`):** Gerçek veritabanı istatistikleri, kurs oluşturma/düzenleme/arşivleme, modül ve video ders yönetimi, soru havuzu ve test yapılandırması, öğrenci kayıt tanımlama, kurs başvuru inceleme masası (onayla/reddet), duyuru yayını, blog yönetimi, öğrenci yorumu onaylama ve platform ayarları.

---

## 🎨 Marka & Tasarım Kimliği

Platform, özel tasarım sistemiyle inşa edilmiştir:
- **Navy (Lacivert):** `#0B1530` — Derin kurumsal ciddiyet ve güven
- **Royal Blue (Kraliyet Mavisi):** `#2563EB` — Dinamik eğitim ve interaktivite
- **Gold (Altın Sarısı):** `#E5B45A` — Başarı, ödül ve sertifikasyon
- **Off-white (Kırık Beyaz):** `#F8FAFC` — Ferah ve modern arka plan
- **Slate (Arduvaz):** `#64748B` — Tipografik denge ve okunabilirlik
- **Karanlık / Aydınlık Mod:** `next-themes` ile tam uyumlu tema değiştirici
- **Erişilebilirlik:** WCAG 2.2 AA kontrast ve klavye gezinimi uyumu

---

## 🛡️ Güvenlik & Yetkilendirme Mimarisi

1. **Supabase Auth & Session:** E-posta/şifre doğrulaması, şifre sıfırlama akışı, güvenli HTTP-only çerez oturum yönetimi (`@supabase/ssr`).
2. **Rol Tabanlı Erişim Denetimi (RBAC):**
   - `Guest`: Herkese açık sayfalar, seviye testi ve kurs kataloğu.
   - `Student`: Öğrenci paneli, kayıtlı kurs videoları, quizler, sertifikalar.
   - `Teacher` & `Admin`: Kurs müfredatı, sınav hazırlama, öğrenci kayıt ve başvuru yönetimi.
3. **İstemci Verisine Asla Güvenmeme:** Roller `auth.jwt()` veya `user_roles` PostgreSQL tablosundan sunucu tarafında doğrulanır. İstemciden gönderilen rol parametreleri kabul edilmez.
4. **Sınav Güvenliği:** Doğru cevap anahtarları öğrencinin çözdüğü esnada tarayıcıya iletilmez; değerlendirme sunucu tarafında yapılarak hile engellenir.
5. **Video Koruması:** YouTube gibi herkese açık gömülü linkler yerine, yetkilendirilmiş imzalı URL (signed playback) destekleyen soyutlama katmanı mevcuttur.
6. **Row Level Security (RLS):** Supabase üzerindeki 22 tablonun tamamında katı RLS politikaları devrededir.

---

## 📁 Proje Dizin Yapısı

```
cenk-ulusik-english-academy/
├── __tests__/                  # Unit ve entegrasyon testleri
├── supabase/
│   ├── migrations/             # 22 tabloluk tam PostgreSQL şeması ve RLS politikaları
│   └── seed.sql                # Güvenli başlangıç tohum verileri
├── src/
│   ├── app/
│   │   ├── (public)/           # Ziyaretçi rotaları (/, /kurslar, /hakkimda, /seviye-testi, vb.)
│   │   ├── (student)/ogrenci/  # Öğrenci portalı (/panel, /ders/[id], /testlerim, vb.)
│   │   ├── (admin)/admin/      # Yönetici konsolu (/panel, /kurslar, /ogrenciler, vb.)
│   │   ├── globals.css         # Tailwind token'ları ve temalar
│   │   ├── layout.tsx          # Kök HTML & Tema Sağlayıcı
│   │   ├── sitemap.ts          # Dinamik arama motoru haritası
│   │   └── robots.ts           # Arama motoru erişim kuralları
│   ├── components/
│   │   ├── ui/                 # shadcn/ui tabanlı atomik bileşenler
│   │   ├── layout/             # Navbar, Footer ve Sidebar bileşenleri
│   │   ├── sections/           # Ana sayfa modüler bölümleri
│   │   └── course/             # Kurs kartları ve iskelet yükleme ekranları
│   ├── features/               # Auth formları, öğrenci ve yönetici bileşenleri
│   ├── lib/
│   │   ├── auth.ts             # Sunucu taraflı oturum & rol kontrolleri
│   │   ├── constants.ts        # Uygulama sabitleri & rota haritası
│   │   ├── demo-data.ts        # Çevrimdışı zengin demo/mock katmanı
│   │   ├── utils.ts            # Metin işleme, puanlama ve süre yardımcıları
│   │   └── supabase/           # Client, Server, Admin ve Middleware istemcileri
│   └── types/                  # TypeScript arayüzleri ve Supabase veri tipleri
└── package.json
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
- Node.js 18.17+ veya Node.js 22 LTS
- npm veya pnpm / yarn

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Tanımlayın
`.env.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.example .env.local
```

`.env.local` içeriği:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Cenk Uluşık English Academy"
NEXT_PUBLIC_CONTACT_EMAIL=info@cenkulusik.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+905551234567

# Canlı Supabase olmadan çevrimdışı tam interaktif demo çalıştırmak için:
NEXT_PUBLIC_DEMO_MODE=true
```

### 4. Supabase Veritabanı Kurulumu
1. [supabase.com](https://supabase.com) üzerinden yeni bir proje açın.
2. **SQL Editor** sekmesine gidin.
3. `supabase/migrations/20260101_init.sql` dosyasındaki SQL kodlarını yapıştırıp çalıştırın (Run).
4. Ardından `supabase/seed.sql` dosyasını çalıştırarak örnek kursları ve ayarları yükleyin.

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### 6. Testleri Çalıştırma
```bash
npm test
```

---

## 🔑 Demo Giriş Bilgileri (Hızlı İnceleme)

Demo modunda (`NEXT_PUBLIC_DEMO_MODE=true`):
- **Öğrenci Portalı:** Doğrudan `/ogrenci/panel` sayfasına gidebilir ya da `/giris` sayfasındaki *"Test Giriş Bilgilerini Doldur"* butonuna basabilirsiniz.
- **Yönetici Paneli:** Doğrudan `/admin/panel` adresinden tüm yönetim araçlarını test edebilirsiniz.

---

## 📄 Yasal Bilgilendirme ve KVKK

Bu platform Türkiye Cumhuriyeti 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ilkelerine uygun veri minimizasyonu ile geliştirilmiştir. Platform tarafından üretilen sertifikalar kurs katılım ve bitirme başarı belgesi olup devlet onaylı resmi üniversite diploması veya akredite CEFR sertifikası yerine geçmez.
