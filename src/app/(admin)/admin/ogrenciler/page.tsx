'use client'

import * as React from 'react'
import Link from 'next/link'
import { Users, Search, UserCheck, Shield, BookOpen, MoreVertical, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

const mockStudents = [
  {
    id: 'std-1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@ornek.com',
    role: 'student',
    enrolledCoursesCount: 1,
    joinedDate: '2026-03-01',
    status: 'active',
  },
  {
    id: 'std-2',
    name: 'Elif Demir',
    email: 'elif.demir@ornek.com',
    role: 'student',
    enrolledCoursesCount: 2,
    joinedDate: '2026-02-15',
    status: 'active',
  },
  {
    id: 'std-3',
    name: 'Cenk Uluşık',
    email: 'info@cenkulusik.com',
    role: 'admin',
    enrolledCoursesCount: 3,
    joinedDate: '2026-01-01',
    status: 'active',
  },
]

export default function AdminStudentsPage() {
  const [search, setSearch] = React.useState('')
  const [students, setStudents] = React.useState(mockStudents)

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Öğrenci Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Platforma kayıtlı öğrencilerin listesi, profil detayları ve yetki durumları.
          </p>
        </div>

        <Button
          onClick={() => toast({ title: 'Manuel Öğrenci Kaydı', description: 'Öğrenci ekleme modalı.' })}
          className="bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl shadow-md text-xs"
        >
          Manuel Öğrenci Ekle
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="İsim veya e-posta ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl text-xs"
        />
      </div>

      {/* Students Table */}
      <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Öğrenci Adı</th>
                <th className="p-4">E-posta</th>
                <th className="p-4">Yetki / Rol</th>
                <th className="p-4">Kayıtlı Kurs</th>
                <th className="p-4">Kayıt Tarihi</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-foreground">{s.name}</td>
                  <td className="p-4 text-muted-foreground">{s.email}</td>
                  <td className="p-4">
                    <Badge
                      variant={s.role === 'admin' ? 'gold' : 'secondary'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {s.role}
                    </Badge>
                  </td>
                  <td className="p-4 font-semibold text-foreground">
                    {s.enrolledCoursesCount} Kurs
                  </td>
                  <td className="p-4 text-muted-foreground">{s.joinedDate}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/ogrenciler/${s.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-[11px] gap-1">
                        <Eye className="h-3 w-3" /> İncele
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
