'use client'

import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Bell, Shield, LogOut, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export function AdminNavbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    toast({ title: 'Yönetici oturumu kapatıldı' })
    router.push('/')
  }

  return (
    <header className="h-16 border-b border-border/70 bg-card/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Badge variant="gold" className="text-xs font-bold gap-1 text-navy-900">
          <Shield className="h-3 w-3" /> Yönetici Modu
        </Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Cenk Uluşık English Academy Yönetim Konsolu
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gold-500 text-navy-900 font-bold text-xs">
                  CU
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-foreground block leading-tight">
                  Cenk Uluşık
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Süper Yönetici
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Yönetici İşlemleri
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin/ayarlar" className="cursor-pointer text-xs">
                Platform Ayarları
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/ogrenci/panel" className="cursor-pointer text-xs">
                Öğrenci Portalı
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer text-xs">
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
