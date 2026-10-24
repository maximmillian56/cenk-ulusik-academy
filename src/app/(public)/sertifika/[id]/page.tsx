import type { Metadata } from 'next'
import Link from 'next/link'
import { Award, CheckCircle2, ShieldAlert, Calendar, User, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { verifyCertificate } from '@/services/catalog'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Sertifika Doğrulama — Cenk Uluşık English Academy',
  description: 'Kurs tamamlama başarı sertifikası doğrulama sistemi.',
}

export default async function CertificateVerifyPage({ params }: PageProps) {
  const { id } = await params
  const cert = await verifyCertificate(id)

  return (
    <div className="py-16 lg:py-24">
      <div className="container-custom max-w-2xl">
        <div className="rounded-3xl border-2 border-border/80 bg-card p-8 sm:p-12 shadow-2xl text-center space-y-6">
          {cert ? (
            <>
              <div className="w-20 h-20 rounded-full bg-gold-100 dark:bg-gold-950/60 border-2 border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-400 mx-auto shadow-md">
                <Award className="h-10 w-10" />
              </div>

              <div>
                <Badge variant="success" className="gap-1 mb-3 px-3 py-1 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Doğrulanmış Sertifika
                </Badge>
                <h1 className="font-display text-3xl font-black text-foreground">
                  Kurs Tamamlama Başarı Sertifikası
                </h1>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  Doğrulama No: {cert.verification_id}
                </p>
              </div>

              {/* Certificate details frame */}
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 text-left space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-royal-600 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Öğrenci Adı:</span>
                    <strong className="text-base text-foreground">{cert.student_name}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-royal-600 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Tamamlanan Kurs:</span>
                    <strong className="text-base text-foreground">{cert.course_title}</strong>
                    {cert.cefr_level && (
                      <Badge variant="outline" className="ml-2 text-[10px]">
                        CEFR: {cert.cefr_level}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-royal-600 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Tamamlama Tarihi:</span>
                    <strong className="text-base text-foreground">
                      {new Date(cert.issued_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Legal disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5 text-left">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <p className="leading-relaxed">
                  <strong>Yasal Beyan:</strong> Bu belge Cenk Uluşık English Academy platformuna
                  ait dijital kurs katılım ve bitirme başarı sertifikasıdır; resmi devlet diploması
                  veya akredite CEFR dil yeterlilik belgesi yerine geçmez.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/">
                  <Button variant="outline">Akademi Ana Sayfasına Dön</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="py-8 space-y-4">
              <h2 className="font-display font-bold text-2xl text-destructive">
                Geçersiz Sertifika Kodu
              </h2>
              <p className="text-sm text-muted-foreground">
                Girdiğiniz doğrulama koduna ait aktif bir sertifika kaydı bulunamadı.
              </p>
              <Link href="/">
                <Button variant="outline">Ana Sayfaya Dön</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
