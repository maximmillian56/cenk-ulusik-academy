import { Skeleton } from '@/components/ui/skeleton'

export function CourseCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border/60 bg-card overflow-hidden flex flex-col">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-4 border-t border-border/50 flex justify-between items-center mt-auto">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
