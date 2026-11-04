import { getT } from '@/lib/i18n/server'
import { Skeleton } from '@/components/ui/skeleton'

export default function HistoryLoading() {
  return (
    <div aria-busy="true" aria-label={getT().common.loading}>
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <Skeleton className="mt-6 h-14 w-full rounded-[18px]" />
      <div className="mt-6 space-y-5">
        {[0, 1, 2].map((g) => (
          <div key={g}>
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-2 rounded-[20px] border border-border/70 bg-card p-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3 w-2/5" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
