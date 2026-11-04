import { getT } from '@/lib/i18n/server'
import { Skeleton } from '@/components/ui/skeleton'

export default function SnapLoading() {
  return (
    <div aria-busy="true" aria-label={getT().common.loading}>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-2 h-4 w-60" />
      <Skeleton className="mt-6 h-[360px] w-full rounded-[28px]" />
      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  )
}
