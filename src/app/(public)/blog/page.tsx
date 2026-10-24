import Link from 'next/link'
import type { Metadata } from 'next'
import { DEMO_BLOG_POSTS } from '@/lib/demo-data'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'İngilizce Rehberi Blog — Cenk Uluşık English Academy',
  description:
    'İngilizce öğrenme teknikleri, konuşma ipuçları, gramer rehberleri ve kelime ezberleme metotları.',
}

export default function BlogListPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <Badge variant="outline" className="text-royal-600 border-royal-600/30 mb-2 px-3 py-1">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Eğitim & Rehberlik
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            İngilizce Öğrenme Rehberi
          </h1>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Akıcı konuşma, kelime dağarcığını kalıcı kılma ve sınav hazırlık stratejileri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEMO_BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group rounded-3xl overflow-hidden border border-border/70 bg-card hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3.5 left-3.5">
                  <Badge variant="gold" className="font-bold text-xs shadow-md">
                    {post.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.published_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {post.author}
                  </span>
                </div>

                <h2 className="font-display font-bold text-xl text-foreground mb-3 group-hover:text-royal-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-slate-500 bg-muted/60 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-royal-600 dark:text-royal-400 font-semibold text-xs flex items-center gap-1 group-hover:underline"
                  >
                    Devamını Oku <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
