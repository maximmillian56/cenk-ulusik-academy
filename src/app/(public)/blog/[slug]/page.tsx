import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { DEMO_BLOG_POSTS } from '@/lib/demo-data'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = DEMO_BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Yazı Bulunamadı' }
  }

  return {
    title: `${post.title} — Cenk Uluşık English Academy Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = DEMO_BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="py-12 lg:py-20">
      <div className="container-custom max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-600 dark:text-royal-400 hover:underline mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Tüm Yazılara Dön
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4 mb-8">
          <Badge variant="gold" className="font-bold">
            {post.category}
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-royal-600" />
              Yazar: <strong className="text-foreground">{post.author}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-royal-600" />
              Yayın Tarihi: {formatDate(post.published_at)}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-xl border border-border/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body Content */}
        <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none leading-relaxed">
          <p className="lead text-lg text-muted-foreground font-medium mb-6">
            {post.excerpt}
          </p>
          <div className="whitespace-pre-line text-foreground/90">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-border/60 flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">Etiketler:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-royal-600 dark:text-royal-400 bg-royal-50 dark:bg-royal-950 px-2.5 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
