-- ==============================================================================
-- CENK ULUŞIK ENGLISH ACADEMY - SEED DATA
-- ==============================================================================

-- Site settings
INSERT INTO public.site_settings (key, value)
VALUES 
  ('contact', '{"email": "info@cenkulusik.com", "phone": "+905551234567", "whatsapp": "+905551234567"}'::jsonb),
  ('features', '{"certificates_enabled": true, "placement_test_enabled": true, "registrations_open": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed courses
INSERT INTO public.courses (
  id, title, slug, short_description, description, cover_image_url, cefr_level, category, duration_hours, status, is_featured, is_free, prerequisites
) VALUES 
(
  'c1111111-1111-1111-1111-111111111111',
  'Sıfırdan Zirveye: A1 Başlangıç İngilizcesi',
  'sifirdan-zirveye-a1-baslangic-ingilizcesi',
  'İngilizceye sıfırdan başlayanlar için temel gramer, günlük konuşma kalıpları ve telaffuz rehberi.',
  'Bu kurs ile İngilizceye sağlam bir temel atacaksınız. Günlük hayatta kendinizi tanıtma, sipariş verme, yol tarifi isteme gibi temel iletişim becerilerini kazanacaksınız.',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
  'A1',
  'beginner',
  12.0,
  'published',
  TRUE,
  TRUE,
  ARRAY['Temel okuma yazma']
),
(
  'c2222222-2222-2222-2222-222222222222',
  'Akıcı Konuşma ve Düşünme: B1 Speaking Masterclass',
  'akici-konusma-ve-dusunme-b1-speaking-masterclass',
  'Kelimeleri kafanızda Türkçeden çevirmeden doğrudan İngilizce konuşma ve düşünme teknikleri.',
  'Bildiğinizi hissediyor ama konuşurken tıkanıyor musunuz? Bu masterclass, beyninizin İngilizce konuşma reflekslerini harekete geçirmek için özel teknikler sunar.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'B1',
  'speaking',
  18.0,
  'published',
  TRUE,
  FALSE,
  ARRAY['A2 seviyesi gramer ve kelime']
),
(
  'c3333333-3333-3333-3333-333333333333',
  'İleri Seviye Gramer ve Kusursuz Cümle Yapıları (B2-C1)',
  'ileri-seviye-gramer-ve-kusursuz-cumle-yapilari',
  'Inversion, Conditionals, Cleft Sentences ve akademik İngilizce cümle mimarisi.',
  'IELTS, TOEFL veya profesyonel iş hayatı için gerekli sofistike İngilizce dil yapıları.',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
  'B2',
  'grammar',
  24.0,
  'published',
  TRUE,
  FALSE,
  ARRAY['B1 seviye yeterliliği']
)
ON CONFLICT (id) DO NOTHING;

-- Seed modules for Course 1
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Modül 1: Tanışma ve Temel İletişim', 1),
  ('22222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Modül 2: Günlük Rutinler ve Simple Present', 2)
ON CONFLICT (id) DO NOTHING;

-- Seed lessons
INSERT INTO public.lessons (
  id, module_id, course_id, title, description, lesson_type, video_url, video_provider, video_duration_seconds, content, order_index, is_preview
) VALUES 
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'c1111111-1111-1111-1111-111111111111',
  '1. Tanışma ve Selamlaşma İfadeleri',
  'Hello, Hi, Good morning ve kendinizi tanıtmanın en doğal yolları.',
  'video',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'demo',
  480,
  '### Tanışma ve Selamlaşma\nİngilizcede selamlaşma durumun resmiyetine göre değişiklik gösterir.',
  1,
  TRUE
),
(
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'c1111111-1111-1111-1111-111111111111',
  '2. To Be Fiili (Am / Is / Are) Mantığı',
  'İngilizcenin omurgası olan to be fiilinin gerçek hayatta kullanımı.',
  'video',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'demo',
  620,
  '### To Be Fiili\nI am, You are, He/She/It is mantığı ve pratik alıştırmalar.',
  2,
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Seed announcements
INSERT INTO public.announcements (title, content, target_audience, is_published)
VALUES 
  ('Yeni Kurs Yayında: B1 Speaking Masterclass!', 'Konuşma odaklı yeni kursumuz kayıtlarınıza açıldı. Hemen inceleyin!', 'all', TRUE),
  ('Seviye Tespit Sınavı Güncellendi', 'A1-C1 arası yeni sorularla seviyenizi daha isabetli ölçebilirsiniz.', 'all', TRUE)
ON CONFLICT DO NOTHING;
