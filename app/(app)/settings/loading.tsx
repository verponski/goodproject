import { getT } from '@/lib/i18n/server'
import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div aria-busy="true" aria-label={getT().common.loading}>
      <Skeleton className="h-9 w-44" />
      <Skeleton className="mt-2 h-4 w-56" />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {[0, 1].map((c) => (
          <div key={c} className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-[20px] border border-border/70 bg-card p-6">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="mt-5 h-12 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
