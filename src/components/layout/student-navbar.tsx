'use client'

import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Bell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface StudentNavbarProps {
  userId?: string
}

export function StudentNavbar({ userId }: StudentNavbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    toast({ title: 'Oturum kapatıldı' })
    router.push('/')
  }

  return (
    <header className="h-16 border-b border-border/70 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="font-display font-bold text-base sm:text-lg text-foreground">
          Öğrenci Portalı
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notifications Shortcut */}
        <Link href="/ogrenci/bildirimler">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold-500" />
          </Button>
        </Link>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-royal-600 text-white font-bold text-xs">
                  ÖĞ
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-foreground block leading-tight">
                  Öğrenci Hesabı
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Cenk Uluşık Academy
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Hesap Yönetimi
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/ogrenci/profil" className="cursor-pointer text-xs">
                <User className="h-4 w-4 mr-2" />
                Profilim
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/ogrenci/ayarlar" className="cursor-pointer text-xs">
                Ayarlar
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
