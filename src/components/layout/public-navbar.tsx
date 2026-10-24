'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, GraduationCap, BookOpen, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/kurslar', label: 'Kurslar' },
  { href: '/hakkimda', label: 'Hakkımda' },
  { href: '/seviye-testi', label: 'Seviye Testi' },
  { href: '/blog', label: 'Blog' },
  { href: '/yorumlar', label: 'Yorumlar' },
  { href: '/sss', label: 'SSS' },
  { href: '/iletisim', label: 'İletişim' },
]

export function PublicNavbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border/60'
          : 'bg-background/70 backdrop-blur-sm border-b border-border/30'
      )}
    >
      <nav className="container-custom">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-royal-600 text-white shadow-md group-hover:bg-royal-700 transition-colors">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-foreground leading-tight block">
                Cenk Uluşık
              </span>
              <span className="text-xs font-medium text-gold-600 dark:text-gold-400 tracking-wider uppercase block">
                English Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-royal-600 bg-royal-50 font-semibold dark:bg-royal-950/60 dark:text-royal-400'
                    : 'text-foreground/75 hover:text-foreground hover:bg-muted/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link href="/seviye-testi" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="border-royal-600/30 text-royal-600 dark:text-royal-400">
                Seviye Testi
              </Button>
            </Link>
            <Link href="/giris">
              <Button size="sm" className="bg-royal-600 hover:bg-royal-700 text-white gap-1.5 shadow-sm">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Giriş Yap</span>
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Menüyü aç/kapat"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-md pb-4 pt-2"
            >
              <div className="space-y-1 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center px-4 py-3 text-base font-medium rounded-xl transition-colors',
                      pathname === link.href
                        ? 'text-royal-600 bg-royal-50 dark:bg-royal-950 font-semibold'
                        : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
                  <Link href="/kayit">
                    <Button variant="gold" className="w-full">
                      Ücretsiz Kayıt Ol
                    </Button>
                  </Link>
                  <Link href="/ogrenci/panel">
                    <Button variant="outline" className="w-full">
                      Öğrenci Portalı
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
