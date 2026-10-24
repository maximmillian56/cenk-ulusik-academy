'use client'

import * as React from 'react'
import Link from 'next/link'
import { DEMO_BLOG_POSTS } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, BookMarked, Eye } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminBlogManagementPage() {
  const [posts, setPosts] = React.useState(DEMO_BLOG_POSTS)

  const handleDelete = (id: string) => {
    if (confirm('Bu blog yazısını kaldırmak istiyor musunuz?')) {
      setPosts(posts.filter((p) => p.id !== id))
      toast({ title: 'Yazı Silindi' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Blog & İçerik Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            İngilizce öğrenme ipuçları, rehber makaleler ve SEO içeriklerini yönetin.
          </p>
        </div>

        <Button
          onClick={() => toast({ title: 'Yeni Yazı Editörü', description: 'Yazı editörü açıldı.' })}
          className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl gap-2 shadow-md text-xs"
        >
          <Plus className="h-4 w-4" /> Yeni Blog Yazısı Yaz
        </Button>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm divide-y divide-border/50">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-12 rounded-xl bg-slate-900 overflow-hidden relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="gold" className="text-[10px] font-bold">
                    {post.category}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {post.published_at}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-foreground">
                  {post.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Link href={`/blog/${post.slug}`} target="_blank">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: 'Düzenle', description: post.title })}
                className="text-xs rounded-xl"
              >
                <Edit className="h-3 w-3 mr-1" /> Düzenle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post.id)}
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
