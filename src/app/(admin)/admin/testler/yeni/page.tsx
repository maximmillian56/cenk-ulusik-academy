'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DEMO_COURSES } from '@/lib/demo-data'
import { toast } from '@/hooks/use-toast'

export default function NewQuizAdminPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState('')
  const [level, setLevel] = React.useState('A1')
  const [timeLimit, setTimeLimit] = React.useState('15')
  const [passingScore, setPassingScore] = React.useState('70')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Test Oluşturuldu',
      description: 'Yeni test kaydı sisteme eklendi. Şimdi soruları ekleyebilirsiniz.',
    })
    router.push('/admin/sorular')
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/testler">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="h-4 w-4" /> Testlere Dön
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
          Yeni Test / Sınav Oluştur
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Sınav kurallarını, başarı barajını ve zaman sınırını belirleyin.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-border/70 bg-card shadow-sm">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Test Başlığı *</Label>
            <Input
              id="quiz-title"
              placeholder="Örn: B1 Modül 2 Değerlendirme Sınavı"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Seviye</Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Süre (Dakika)</Label>
              <Input
                id="time"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing">Geçme Barajı (%)</Label>
              <Input
                id="passing"
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold gap-2 rounded-xl"
          >
            <Save className="h-4 w-4" /> Testi Kaydet & Soru Eklemeye Geç
          </Button>
        </form>
      </div>
    </div>
  )
}
