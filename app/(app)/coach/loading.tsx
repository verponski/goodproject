import { getT } from '@/lib/i18n/server'
import { Skeleton } from '@/components/ui/skeleton'

export default function CoachLoading() {
  return (
    <div className="mx-auto max-w-2xl" aria-busy="true" aria-label={getT().common.loading}>
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-20 w-4/5 rounded-[22px]" />
        <Skeleton className="ml-auto h-12 w-1/2 rounded-[22px]" />
        <Skeleton className="h-28 w-4/5 rounded-[22px]" />
      </div>
    </div>
  )
}
