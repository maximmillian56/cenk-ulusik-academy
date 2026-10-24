import { MetadataRoute } from 'next'
import { DEMO_COURSES, DEMO_BLOG_POSTS } from '@/lib/demo-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cenkulusik.com'

  const staticRoutes = [
    '',
    '/hakkimda',
    '/kurslar',
    '/seviye-testi',
    '/blog',
    '/yorumlar',
    '/sss',
    '/iletisim',
    '/giris',
    '/kayit',
    '/gizlilik',
    '/kvkk',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  const courseRoutes = DEMO_COURSES.map((course) => ({
    url: `${baseUrl}/kurslar/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const blogRoutes = DEMO_BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...courseRoutes, ...blogRoutes]
}
