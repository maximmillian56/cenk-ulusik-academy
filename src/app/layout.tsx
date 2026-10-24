import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cenkulusik.com'),
  title: {
    default: 'Cenk Uluşık English Academy — İngilizceyi Özgüvenle Konuş',
    template: '%s | Cenk Uluşık English Academy',
  },
  description:
    'Cenk Uluşık ile profesyonel İngilizce eğitimi. A1\'den C1\'e kadar kapsamlı kurslar, interaktif video dersler ve kişiselleştirilmiş öğrenme.',
  keywords: [
    'İngilizce kursu',
    'online İngilizce',
    'İngilizce öğren',
    'Cenk Uluşık',
    'English Academy',
    'CEFR',
    'speaking',
    'grammar',
    'İngilizce konuşma',
  ],
  authors: [{ name: 'Cenk Uluşık' }],
  creator: 'Cenk Uluşık',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    url: 'https://cenkulusik.com',
    siteName: 'Cenk Uluşık English Academy',
    title: 'Cenk Uluşık English Academy — İngilizceyi Özgüvenle Konuş',
    description:
      'Cenk Uluşık ile profesyonel İngilizce eğitimi. A1\'den C1\'e kadar kapsamlı kurslar.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cenk Uluşık English Academy',
    description: 'İngilizceyi Sadece Öğrenme, Özgüvenle Konuş!',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1530' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
