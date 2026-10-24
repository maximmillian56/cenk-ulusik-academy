'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Award,
  Bell,
  User,
  Settings,
  GraduationCap,
  BarChart2,
  X,
  Menu,
  LogOut,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

const navItems = [
  { href: '/ogrenci/panel', label: 'Öğrenci Paneli', icon: LayoutDashboard },
  { href: '/ogrenci/kurslarim', label: 'Kurslarım', icon: BookOpen },
  { href: '/ogrenci/testlerim', label: 'Testlerim & Sınavlar', icon: ClipboardList },
  { href: '/ogrenci/sonuclarim', label: 'Test Sonuçlarım', icon: BarChart2 },
  { href: '/ogrenci/ilerlemem', label: 'İlerleme Grafiği', icon: TrendingUp },
  { href: '/ogrenci/sertifikalarim', label: 'Sertifikalarım', icon: Award },
  { href: '/ogrenci/bildirimler', label: 'Bildirimler', icon: Bell },
  { href: '/ogrenci/profil', label: 'Profilim', icon: User },
  { href: '/ogrenci/ayarlar', label: 'Hesap Ayarları', icon: Settings },
]

interface StudentSidebarProps {
  userId?: string
}

export function StudentSidebar({ userId }: StudentSidebarProps) {
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full bg-royal-600 text-white shadow-2xl flex items-center justify-center focus:outline-none"
        aria-label="Menüyü Aç"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#0B1530] text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="h-10 w-10 rounded-2xl bg-royal-600 text-white flex items-center justify-center shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white block">
              Cenk Uluşık
            </span>
            <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider block">
              Öğrenci Portalı
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
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

        {/* Footer shortcuts */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Home className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
          >
            <LogOut className="h-4 w-4" />
            Güvenli Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  )
}
