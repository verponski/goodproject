import { getT } from '@/lib/i18n/server'
import { Skeleton } from '@/components/ui/skeleton'

export default function StatsLoading() {
  return (
    <div aria-busy="true" aria-label={getT().common.loading}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Skeleton className="h-9 w-36" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-[52px] w-[200px]" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[20px] border border-border/70 bg-card p-5">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="mt-4 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-full" />
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-[20px] border border-border/70 bg-card p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-6 h-[260px] w-full" />
      </div>
    </div>
  )
}
