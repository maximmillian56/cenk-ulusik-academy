import { HeroSection } from '@/components/sections/hero-section'
import { TeacherSection } from '@/components/sections/teacher-section'
import { CoursesPreviewSection } from '@/components/sections/courses-preview-section'
import { LearningJourneySection } from '@/components/sections/learning-journey-section'
import { BenefitsSection } from '@/components/sections/benefits-section'
import { VocabDemoSection } from '@/components/sections/vocab-demo-section'
import { PlacementTestCTASection } from '@/components/sections/placement-test-cta-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FAQSection } from '@/components/sections/faq-section'
import { ContactCTASection } from '@/components/sections/contact-cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TeacherSection />
      <CoursesPreviewSection />
      <LearningJourneySection />
      <BenefitsSection />
      <VocabDemoSection />
      <PlacementTestCTASection />
      <TestimonialsSection />
      <FAQSection />
      <ContactCTASection />
    </>
  )
}
