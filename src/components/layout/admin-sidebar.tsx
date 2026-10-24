'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  Video,
  ClipboardList,
  FileQuestion,
  UserCheck,
  FileText,
  Megaphone,
  BookMarked,
  Star,
  BarChart3,
  Settings,
  GraduationCap,
  Home,
  LogOut,
  X,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

const adminNavItems = [
  { href: '/admin/panel', label: 'Genel Panel', icon: LayoutDashboard },
  { href: '/admin/ogrenciler', label: 'Öğrenci Yönetimi', icon: Users },
  { href: '/admin/kurslar', label: 'Kurs Yönetimi', icon: BookOpen },
  { href: '/admin/moduller', label: 'Modül Yapısı', icon: Layers },
  { href: '/admin/dersler', label: 'Video Dersler', icon: Video },
  { href: '/admin/testler', label: 'Testler & Sınavlar', icon: ClipboardList },
  { href: '/admin/sorular', label: 'Soru Havuzu', icon: FileQuestion },
  { href: '/admin/kayitlar', label: 'Kurs Kayıtları', icon: UserCheck },
  { href: '/admin/basvurular', label: 'Gelen Başvurular', icon: FileText },
  { href: '/admin/duyurular', label: 'Duyuru Yayınla', icon: Megaphone },
  { href: '/admin/blog', label: 'Blog & İçerik', icon: BookMarked },
  { href: '/admin/yorumlar', label: 'Yorum Onaylama', icon: Star },
  { href: '/admin/raporlar', label: 'İstatistik & Rapor', icon: BarChart3 },
  { href: '/admin/ayarlar', label: 'Akademi Ayarları', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    toast({ title: 'Çıkış yapıldı' })
    router.push('/')
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full bg-gold-500 text-navy-900 shadow-2xl flex items-center justify-center font-bold"
        aria-label="Yönetici Menüsünü Aç"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#070D1E] text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gold-500 text-navy-900 flex items-center justify-center shadow-md font-bold">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white block">
              Cenk Uluşık
            </span>
            <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block">
              Yönetici Paneli
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-royal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            href="/ogrenci/panel"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Öğrenci Görünümüne Geç
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Home className="h-4 w-4" /> Ana Sayfa
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
          >
            <LogOut className="h-4 w-4" /> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  )
}
