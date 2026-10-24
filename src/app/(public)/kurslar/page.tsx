'use client'

import * as React from 'react'
import { CourseCard } from '@/components/course/course-card'
import { DEMO_COURSES } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'

const levels = ['Tümü', 'A1', 'A2', 'B1', 'B2', 'C1']

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = React.useState('Tümü')
  const [search, setSearch] = React.useState('')

  const filteredCourses = DEMO_COURSES.filter((course) => {
    const matchesLevel =
      selectedLevel === 'Tümü' || course.cefr_level === selectedLevel
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.short_description.toLowerCase().includes(search.toLowerCase())
    return matchesLevel && matchesSearch
  })

  return (
    <div className="py-12 lg:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <Badge variant="outline" className="text-royal-600 border-royal-600/30 mb-2 px-3 py-1">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Kurs Kataloğu
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Tüm İngilizce Kurslarımız
          </h1>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Sıfırdan başlayanlardan ileri seviyede akıcı konuşmak isteyenlere kadar
            özel olarak tasarlanmış müfredatımız.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/60">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {levels.map((lvl) => (
              <Button
                key={lvl}
                size="sm"
                variant={selectedLevel === lvl ? 'default' : 'outline'}
                onClick={() => setSelectedLevel(lvl)}
                className={`rounded-xl font-semibold text-xs shrink-0 ${
                  selectedLevel === lvl
                    ? 'bg-royal-600 text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {lvl}
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Kurs ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-muted/30 border border-border/60 p-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-foreground">
              Aramanızla Eşleşen Kurs Bulunamadı
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Farklı bir arama terimi veya seviye filtresi deneyebilirsiniz.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSelectedLevel('Tümü')
                setSearch('')
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
