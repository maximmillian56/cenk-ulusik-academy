export const APP_NAME = 'Cenk Uluşık English Academy'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@cenkulusik.com'
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+905551234567'
export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const DEMO_VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export const BRAND_COLORS = {
  navy: '#0B1530',
  royal: '#2563EB',
  gold: '#E5B45A',
  offWhite: '#F8FAFC',
  slate: '#64748B',
} as const

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

export const ROUTES = {
  home: '/',
  about: '/hakkimda',
  courses: '/kurslar',
  levelTest: '/seviye-testi',
  blog: '/blog',
  reviews: '/yorumlar',
  faq: '/sss',
  contact: '/iletisim',
  login: '/giris',
  register: '/kayit',
  forgotPassword: '/sifremi-unuttum',
  privacy: '/gizlilik',
  kvkk: '/kvkk',
  student: {
    dashboard: '/ogrenci/panel',
    courses: '/ogrenci/kurslarim',
    quizzes: '/ogrenci/testlerim',
    results: '/ogrenci/sonuclarim',
    progress: '/ogrenci/ilerlemem',
    certificates: '/ogrenci/sertifikalarim',
    notifications: '/ogrenci/bildirimler',
    profile: '/ogrenci/profil',
    settings: '/ogrenci/ayarlar',
  },
  admin: {
    dashboard: '/admin/panel',
    students: '/admin/ogrenciler',
    courses: '/admin/kurslar',
    newCourse: '/admin/kurslar/yeni',
    modules: '/admin/moduller',
    lessons: '/admin/dersler',
    quizzes: '/admin/testler',
    newQuiz: '/admin/testler/yeni',
    questions: '/admin/sorular',
    enrollments: '/admin/kayitlar',
    applications: '/admin/basvurular',
    announcements: '/admin/duyurular',
    blog: '/admin/blog',
    reviews: '/admin/yorumlar',
    reports: '/admin/raporlar',
    settings: '/admin/ayarlar',
  },
} as const
