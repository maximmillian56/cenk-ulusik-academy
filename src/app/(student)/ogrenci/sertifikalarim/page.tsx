import Link from 'next/link'
import { Award, CheckCircle2, ShieldAlert, ExternalLink, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function StudentCertificatesPage() {
  const certificates = [
    {
      id: 'cert-1',
      courseTitle: 'Sıfırdan Zirveye: A1 Başlangıç İngilizcesi',
      cefrLevel: 'A1',
      issuedAt: '2026-03-20',
      verificationId: 'CU-A1-94821',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
          Sertifikalarım
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Başarıyla tamamladığınız kurslara ait platform bitirme sertifikaları.
        </p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-8 rounded-3xl border-2 border-border/80 bg-card shadow-lg flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="gold" className="text-xs font-bold">
                    {cert.cefrLevel} Tamamlama
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Doğrulama: {cert.verificationId}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-foreground">
                  {cert.courseTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Düzenlenme Tarihi: {cert.issuedAt}
                </p>
              </div>

              {/* Legal Note */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                Bu belge Cenk Uluşık English Academy kurs bitirme belgesidir, resmi CEFR
                yeterlilik diploması yerine geçmez.
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/sertifika/${cert.verificationId}`}
                  target="_blank"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-xl text-xs font-semibold">
                    <ExternalLink className="h-3.5 w-3.5" /> Doğrulama Sayfasını Aç
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl bg-muted/30 border border-border/60 p-8">
          <Award className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-foreground">
            Henüz Sertifikanız Bulunmuyor
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Kayıtlı olduğunuz kursun tüm derslerini ve modül sınavlarını tamamlayarak sertifikanızı alabilirsiniz.
          </p>
        </div>
      )}
    </div>
  )
}
