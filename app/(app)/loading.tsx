import { getT } from '@/lib/i18n/server'
import { Skeleton } from '@/components/ui/skeleton'

export default function DiaryLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label={getT().common.loading}>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-11 w-11" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-11 w-11" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-6">
        <div className="rounded-[20px] border border-border/70 bg-card p-6">
          <Skeleton className="mx-auto h-[228px] w-[228px] rounded-full" />
          <Skeleton className="mt-6 h-16 w-full" />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[20px] border border-border/70 bg-card p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              {i < 2 ? <Skeleton className="mt-4 h-14 w-full" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
