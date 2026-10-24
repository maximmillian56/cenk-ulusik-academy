export interface DemoCourse {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  cover_image_url: string
  cefr_level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  category: string
  duration_hours: number
  is_free: boolean
  is_featured: boolean
  status: 'published'
  prerequisites: string[]
  teacher_name: string
  modules: DemoModule[]
}

export interface DemoModule {
  id: string
  title: string
  order_index: number
  lessons: DemoLesson[]
}

export interface DemoLesson {
  id: string
  module_id: string
  course_id: string
  title: string
  description: string
  lesson_type: 'video' | 'text' | 'quiz'
  video_url: string
  video_provider: 'demo' | 'mux' | 'cloudflare'
  video_duration_seconds: number
  content: string
  order_index: number
  is_preview: boolean
  resources?: { title: string; url: string; size: string }[]
  quiz_id?: string
}

export interface DemoQuiz {
  id: string
  title: string
  description: string
  difficulty: string
  time_limit_minutes: number
  passing_percentage: number
  course_id?: string
  lesson_id?: string
  questions: DemoQuestion[]
}

export interface DemoQuestion {
  id: string
  question_text: string
  options: { id: string; option_text: string }[]
  correct_option_id: string
  explanation: string
}

export interface DemoBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  category: string
  tags: string[]
  published_at: string
  author: string
}

export interface DemoTestimonial {
  id: string
  student_name: string
  student_title: string
  content: string
  rating: number
  course_title: string
  created_at: string
}

export const DEMO_COURSES: DemoCourse[] = [
  {
    id: 'c1-beginner-a1',
    title: 'Sıfırdan Zirveye: A1 Başlangıç İngilizcesi',
    slug: 'sifirdan-zirveye-a1-baslangic-ingilizcesi',
    short_description:
      'İngilizceye sıfırdan başlayanlar için temel gramer, günlük konuşma kalıpları ve telaffuz rehberi.',
    description:
      'Bu kurs ile İngilizceye sağlam bir temel atacaksınız. Günlük hayatta kendinizi tanıtma, sipariş verme, yol tarifi isteme gibi temel iletişim becerilerini kazanacaksınız. İnteraktif video dersler ve pratik alıştırmalarla İngilizce artık gözünüzde büyümesin!',
    cover_image_url:
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
    cefr_level: 'A1',
    category: 'beginner',
    duration_hours: 12,
    is_free: true,
    is_featured: true,
    status: 'published',
    prerequisites: ['Temel okuma yazma becerisi'],
    teacher_name: 'Cenk Uluşık',
    modules: [
      {
        id: 'mod-1',
        title: 'Modül 1: Tanışma ve Temel İletişim',
        order_index: 1,
        lessons: [
          {
            id: 'les-1',
            module_id: 'mod-1',
            course_id: 'c1-beginner-a1',
            title: '1. Tanışma ve Selamlaşma İfadeleri',
            description:
              'Hello, Hi, Good morning ve kendinizi tanıtmanın en doğal yolları.',
            lesson_type: 'video',
            video_url:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            video_provider: 'demo',
            video_duration_seconds: 480,
            content: `### Tanışma ve Selamlaşma
İngilizcede selamlaşma durumun resmiyetine göre değişiklik gösterir.
- **Resmi:** Good morning, Good afternoon, Good evening, How do you do?
- **Samimi:** Hi, Hello, Hey, What's up?

#### Kendini Tanıtma Kalıpları:
- My name is... (Benim adım...)
- I am from Turkey. (Türkiye'den geliyorum.)
- Nice to meet you. (Tanıştığıma memnun oldum.)`,
            order_index: 1,
            is_preview: true,
            resources: [
              { title: 'Ders Özeti (PDF)', url: '#', size: '1.2 MB' },
              { title: 'Kelime Listesi (A1)', url: '#', size: '450 KB' },
            ],
            quiz_id: 'q-a1-1',
          },
          {
            id: 'les-2',
            module_id: 'mod-1',
            course_id: 'c1-beginner-a1',
            title: '2. To Be Fiili (Am / Is / Are) Mantığı',
            description: 'İngilizcenin omurgası olan to be fiilinin gerçek hayatta kullanımı.',
            lesson_type: 'video',
            video_url:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            video_provider: 'demo',
            video_duration_seconds: 620,
            content: `### To Be Fiili (Am / Is / Are)
İngilizcede durum bildiren cümlelerin temeli 'to be' fiilidir.

- I **am** a student.
- He / She / It **is** ready.
- You / We / They **are** learning English.

Olumsuz formda \`not\` eklenir: *I am not tired.*
Soru formunda fiil başa gelir: *Are you ready?*`,
            order_index: 2,
            is_preview: true,
            resources: [
              { title: 'To Be Çalışma Kağıdı', url: '#', size: '890 KB' },
            ],
            quiz_id: 'q-a1-1',
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Modül 2: Günlük Rutinler ve Simple Present',
        order_index: 2,
        lessons: [
          {
            id: 'les-3',
            module_id: 'mod-2',
            course_id: 'c1-beginner-a1',
            title: '3. Günlük Rutinleri Anlatma',
            description: 'Sabah uyanmaktan akşam uyumaya kadar bir günü İngilizce ifade etme.',
            lesson_type: 'video',
            video_url:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            video_provider: 'demo',
            video_duration_seconds: 540,
            content: `### Günlük Rutinler
- I wake up at 7 AM.
- I have breakfast with my family.
- I go to work / school.
- I study English in the evening.`,
            order_index: 3,
            is_preview: false,
            quiz_id: 'q-a1-1',
          },
        ],
      },
    ],
  },
  {
    id: 'c2-speaking-b1',
    title: 'Akıcı Konuşma ve Düşünme: B1 Speaking Masterclass',
    slug: 'akici-konusma-ve-dusunme-b1-speaking-masterclass',
    short_description:
      'Kelimeleri kafanızda Türkçeden çevirmeden doğrudan İngilizce konuşma ve düşünme teknikleri.',
    description:
      'Bildiğinizi hissediyor ama konuşurken tıkanıyor musunuz? Bu masterclass, beyninizin İngilizce konuşma reflekslerini harekete geçirmek için özel nöro-dilbilimsel teknikler ve gerçek diyalog simülasyonları sunar.',
    cover_image_url:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    cefr_level: 'B1',
    category: 'speaking',
    duration_hours: 18,
    is_free: false,
    is_featured: true,
    status: 'published',
    prerequisites: ['A2 seviyesi gramer ve kelime bilgisi'],
    teacher_name: 'Cenk Uluşık',
    modules: [
      {
        id: 'mod-spk-1',
        title: 'Modül 1: Zihinsel Engelleri Aşmak',
        order_index: 1,
        lessons: [
          {
            id: 'les-spk-1',
            module_id: 'mod-spk-1',
            course_id: 'c2-speaking-b1',
            title: '1. Çeviri Tuzağından Kurtulmak: Chunking Metodu',
            description: 'Kelimeleri tek tek değil, kalıp bloklar (chunks) halinde öğrenin.',
            lesson_type: 'video',
            video_url:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            video_provider: 'demo',
            video_duration_seconds: 720,
            content: `### Chunking Metodu Nedir?
Beynimiz dili tek tek kelimeler halinde değil, 2-4 kelimelik anlam blokları (chunks) olarak işler.
Örnek:
- "As a matter of fact"
- "At the end of the day"
- "To be honest with you"

Bu kalıpları refleks haline getirdiğinizde konuşma akıcılığınız iki katına çıkar.`,
            order_index: 1,
            is_preview: true,
          },
        ],
      },
    ],
  },
  {
    id: 'c3-grammar-b2',
    title: 'İleri Seviye Gramer ve Kusursuz Cümle Yapıları (B2-C1)',
    slug: 'ileri-seviye-gramer-ve-kusursuz-cumle-yapilari',
    short_description:
      'Inversion, Conditionals, Cleft Sentences ve akademik İngilizce cümle mimarisi.',
    description:
      'IELTS, TOEFL veya profesyonel iş hayatı için gerekli sofistike İngilizce dil yapıları. Karmaşık düşünceleri net, zarif ve etkileyici cümlelerle ifade etme sanatı.',
    cover_image_url:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    cefr_level: 'B2',
    category: 'grammar',
    duration_hours: 24,
    is_free: false,
    is_featured: true,
    status: 'published',
    prerequisites: ['B1 seviye yeterliliği'],
    teacher_name: 'Cenk Uluşık',
    modules: [
      {
        id: 'mod-grm-1',
        title: 'Modül 1: Vurgulu Cümleler (Inversion & Cleft)',
        order_index: 1,
        lessons: [
          {
            id: 'les-grm-1',
            module_id: 'mod-grm-1',
            course_id: 'c3-grammar-b2',
            title: '1. Negative Inversion ile Güçlü Vurgu',
            description: 'Rarely, Seldom, Not only... but also ile devrik cümle yapımı.',
            lesson_type: 'video',
            video_url:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            video_provider: 'demo',
            video_duration_seconds: 840,
            content: `### Negative Inversion
Cümleye negatif ya da kısıtlayıcı bir zarf ile başladığımızda soru sırası uygularız:
- Normal: *I have rarely seen such dedication.*
- Inverted: *Rarely **have I seen** such dedication.*

Bu yapı yazılı ve sözlü İngilizcede büyük bir prestij ve etki sağlar.`,
            order_index: 1,
            is_preview: true,
          },
        ],
      },
    ],
  },
]

export const DEMO_QUIZZES: Record<string, DemoQuiz> = {
  'q-a1-1': {
    id: 'q-a1-1',
    title: 'A1 Modül 1 Değerlendirme Testi',
    description: 'Tanışma kalıpları ve to be fiili bilginizi test edin.',
    difficulty: 'A1',
    time_limit_minutes: 10,
    passing_percentage: 70,
    questions: [
      {
        id: 'q1',
        question_text: "Which sentence is grammatically correct?",
        options: [
          { id: 'opt1', option_text: 'She are my teacher.' },
          { id: 'opt2', option_text: 'She is my teacher.' },
          { id: 'opt3', option_text: 'She am my teacher.' },
          { id: 'opt4', option_text: 'She be my teacher.' },
        ],
        correct_option_id: 'opt2',
        explanation: "'She' öznesi tekil 3. şahıs olduğu için 'is' yardımcı fiilini alır.",
      },
      {
        id: 'q2',
        question_text: "How do you respond politely to 'Nice to meet you'?",
        options: [
          { id: 'opt1', option_text: 'Nice to meet you too.' },
          { id: 'opt2', option_text: 'Yes, I am.' },
          { id: 'opt3', option_text: 'Good bye.' },
          { id: 'opt4', option_text: 'I have 25 years old.' },
        ],
        correct_option_id: 'opt1',
        explanation: "'Nice to meet you' ifadesine en doğal karşılık 'Nice to meet you too'dur.",
      },
      {
        id: 'q3',
        question_text: "Complete: 'Where _____ you from?'",
        options: [
          { id: 'opt1', option_text: 'is' },
          { id: 'opt2', option_text: 'am' },
          { id: 'opt3', option_text: 'are' },
          { id: 'opt4', option_text: 'be' },
        ],
        correct_option_id: 'opt3',
        explanation: "'You' zamiri ile soru sorarken 'are' kullanılır: 'Where are you from?'",
      },
    ],
  },
}

export const PLACEMENT_QUESTIONS: DemoQuestion[] = [
  {
    id: 'pq-1',
    question_text: "1. Hello! My name _____ Sarah. What is your name?",
    options: [
      { id: 'a', option_text: 'am' },
      { id: 'b', option_text: 'is' },
      { id: 'c', option_text: 'are' },
      { id: 'd', option_text: 'be' },
    ],
    correct_option_id: 'b',
    explanation: "'My name' tekil bir özne olduğu için 'is' kullanılır (A1).",
  },
  {
    id: 'pq-2',
    question_text: "2. I usually _____ coffee in the morning, but today I am drinking tea.",
    options: [
      { id: 'a', option_text: 'drink' },
      { id: 'b', option_text: 'drinks' },
      { id: 'c', option_text: 'drinking' },
      { id: 'd', option_text: 'drank' },
    ],
    correct_option_id: 'a',
    explanation: "Genel alışkanlıklar 'Simple Present' ve 'I' öznesi için yalın fiil ile ifade edilir (A1).",
  },
  {
    id: 'pq-3',
    question_text: "3. Excuse me, _____ a pharmacy near here?",
    options: [
      { id: 'a', option_text: 'there is' },
      { id: 'b', option_text: 'is there' },
      { id: 'c', option_text: 'are there' },
      { id: 'd', option_text: 'there are' },
    ],
    correct_option_id: 'b',
    explanation: "Tekil bir nesnenin varlığını sorarken 'Is there...?' yapısı kullanılır (A1).",
  },
  {
    id: 'pq-4',
    question_text: "4. Where _____ you go on holiday last summer?",
    options: [
      { id: 'a', option_text: 'do' },
      { id: 'b', option_text: 'have' },
      { id: 'c', option_text: 'did' },
      { id: 'd', option_text: 'were' },
    ],
    correct_option_id: 'c',
    explanation: "'Last summer' geçmiş zaman zarfıdır; geçmiş zaman soru cümlesinde 'did' yardımcı fiili kullanılır (A2).",
  },
  {
    id: 'pq-5',
    question_text: "5. Istanbul is _____ than Ankara in terms of population.",
    options: [
      { id: 'a', option_text: 'more crowded' },
      { id: 'b', option_text: 'crowded' },
      { id: 'c', option_text: 'most crowded' },
      { id: 'd', option_text: 'crowdeder' },
    ],
    correct_option_id: 'a',
    explanation: "Çok heceli sıfatların karşılaştırmasında (comparative) 'more' kullanılır (A2).",
  },
  {
    id: 'pq-6',
    question_text: "6. I _____ never visited Japan, but I would love to go there one day.",
    options: [
      { id: 'a', option_text: 'am' },
      { id: 'b', option_text: 'have' },
      { id: 'c', option_text: 'had' },
      { id: 'd', option_text: 'did' },
    ],
    correct_option_id: 'b',
    explanation: "Hayat tecrübelerinden bahsederken Present Perfect Tense ('have + V3') kullanılır (A2).",
  },
  {
    id: 'pq-7',
    question_text: "7. If it _____ tomorrow, we will cancel the picnic.",
    options: [
      { id: 'a', option_text: 'rains' },
      { id: 'b', option_text: 'will rain' },
      { id: 'c', option_text: 'rained' },
      { id: 'd', option_text: 'is raining' },
    ],
    correct_option_id: 'a',
    explanation: "First Conditional cümlelerinde if cümleciği Simple Present alır (B1).",
  },
  {
    id: 'pq-8',
    question_text: "8. She asked me how long I _____ for the company.",
    options: [
      { id: 'a', option_text: 'am working' },
      { id: 'b', option_text: 'had been working' },
      { id: 'c', option_text: 'have worked' },
      { id: 'd', option_text: 'work' },
    ],
    correct_option_id: 'b',
    explanation: "Dolaylı anlatımda (Reported Speech) geçmişteki bir süreci Past Perfect Continuous aktarır (B1).",
  },
  {
    id: 'pq-9',
    question_text: "9. The meeting had to be _____ because the manager fell ill.",
    options: [
      { id: 'a', option_text: 'called off' },
      { id: 'b', option_text: 'put down' },
      { id: 'c', option_text: 'taken over' },
      { id: 'd', option_text: 'turned in' },
    ],
    correct_option_id: 'a',
    explanation: "'Call off' ertelemek/iptal etmek anlamına gelen bir phrasal verb'dür (B1).",
  },
  {
    id: 'pq-10',
    question_text: "10. Despite _____ exhausted after the flight, he attended the evening gala.",
    options: [
      { id: 'a', option_text: 'he was' },
      { id: 'b', option_text: 'being' },
      { id: 'c', option_text: 'to be' },
      { id: 'd', option_text: 'of being' },
    ],
    correct_option_id: 'b',
    explanation: "'Despite' bir edattır ve kendisinden sonra gerund (-ing) veya isim alır (B2).",
  },
  {
    id: 'pq-11',
    question_text: "11. Seldom _____ such an inspiring lecture on language acquisition.",
    options: [
      { id: 'a', option_text: 'I have heard' },
      { id: 'b', option_text: 'have I heard' },
      { id: 'c', option_text: 'I had heard' },
      { id: 'd', option_text: 'did I heard' },
    ],
    correct_option_id: 'b',
    explanation: "'Seldom' ile başlayan devrik (inversion) yapılarda soru sırası gelir: 'have I heard' (B2).",
  },
  {
    id: 'pq-12',
    question_text: "12. Had she known about the schedule change, she _____ earlier.",
    options: [
      { id: 'a', option_text: 'would arrive' },
      { id: 'b', option_text: 'would have arrived' },
      { id: 'c', option_text: 'will have arrived' },
      { id: 'd', option_text: 'had arrived' },
    ],
    correct_option_id: 'b',
    explanation: "Third Conditional inversion yapısında ana cümlede 'would have + V3' gelir (B2/C1).",
  },
]

export const DEMO_BLOG_POSTS: DemoBlogPost[] = [
  {
    id: 'blog-1',
    title: 'İngilizce Konuşurken Neden Tıkanıyoruz? İşte Çözümü',
    slug: 'ingilizce-konusurken-neden-tikaniriz-cozumu',
    excerpt:
      'Gramer biliyor ama konuşurken duraksıyor musunuz? Türkçeden çeviri yapma alışkanlığını kırmak için kanıtlanmış 4 egzersiz.',
    content: `
### İngilizce Konuşma Korkusunu Yenmek

Birçok İngilizce öğrencisinin ortak sorunu şudur: *"Anlıyorum ama konuşamıyorum."*

Peki bunun bilimsel sebebi nedir? Beynimiz yabancı bir dilde iletişim kurarken iki farklı hafıza türünü kullanır:
1. **Bildirimsel Hafıza (Declarative Memory):** Gramer kuralları, kelime listeleri.
2. **İşlemsel Hafıza (Procedural Memory):** Bisiklete binmek gibi otomatik refleksler.

Geleneksel eğitim sistemi sadece bildirimsel hafızayı besler. Ancak akıcı konuşabilmek için bilgiyi işlemsel hafızaya aktarmanız gerekir.

#### Ne Yapmalısınız?
- **Gölgeleme (Shadowing):** Anadili İngilizce olan bir konuşmacıyı dinlerken aynı anda onunla birlikte konuşun.
- **Kalıplarla Öğrenme:** Kelimeleri tekil değil, bağlam içinde cümle blokları olarak ezberleyin.
- **Kendi Kendine Konuşma:** Günlük düşüncelerinizi sesli olarak basit İngilizce cümlelerle dile getirin.
    `,
    cover_image_url:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    category: 'Konuşma Teknikleri',
    tags: ['speaking', 'akıcılık', 'öğrenme metodu'],
    published_at: '2026-03-15',
    author: 'Cenk Uluşık',
  },
  {
    id: 'blog-2',
    title: 'Günde 15 Dakika ile 1000 Yeni Kelime Nasıl Öğrenilir?',
    slug: 'gunde-15-dakika-ile-1000-yeni-kelime',
    excerpt:
      'Aralıklı Tekrar (Spaced Repetition) sistemiyle unutma eğrisini alt edin ve kelimeleri kalıcı hafızanıza kazıyın.',
    content: `
### Kelimeleri Unutmamak İçin Bilimsel Yöntem

Hermann Ebbinghaus'un Unutma Eğrisi'ne göre, yeni öğrendiğimiz bir bilginin %70'ini 24 saat içinde unuturuz.

Bu döngüyü kırmanın yolu **Aralıklı Tekrar (Spaced Repetition)** yöntemidir.
Kelimeleri 1. gün, 3. gün, 7. gün ve 30. gün aralıklarla tekrar gözden geçirdiğinizde bilgi uzun vadeli hafızaya yerleşir.
    `,
    cover_image_url:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    category: 'Kelime Bilgisi',
    tags: ['vocabulary', 'spaced-repetition', 'hafıza'],
    published_at: '2026-03-22',
    author: 'Cenk Uluşık',
  },
]

export const DEMO_TESTIMONIALS: DemoTestimonial[] = [
  {
    id: 't-1',
    student_name: 'Ahmet Yılmaz',
    student_title: 'Yazılım Mühendisi',
    content:
      'Cenk Hoca ile çalışmaya başlamadan önce teknik mülakatlarda çok çekiniyordum. B1 Speaking Masterclass sayesinde yurt dışındaki şirketlerle rahatça İngilizce mülakat yapabildim.',
    rating: 5,
    course_title: 'B1 Speaking Masterclass',
    created_at: '2026-02-10',
  },
  {
    id: 't-2',
    student_name: 'Elif Demir',
    student_title: 'Mimarlık Öğrencisi',
    content:
      'Ders anlatımı son derece akıcı ve mantığa oturtarak öğretiyor. Ezbere dayalı değil, dili hissederek öğreniyorsunuz. Herkese tavsiye ederim!',
    rating: 5,
    course_title: 'A1 Başlangıç İngilizcesi',
    created_at: '2026-02-28',
  },
]
