import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { dayState } from '@/lib/nutrition'
import { getHistory } from '@/lib/queries'
import { getToday, requireOnboardedProfile, unitsOf } from '@/lib/profile'
import { getI18n, getT } from '@/lib/i18n/server'
import type { EntryDTO } from '@/lib/types'
import { firstParam, cn } from '@/lib/utils'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/history/search-input'
import { EntryRow } from '@/components/diary/entry-row'
import { EmptyState } from '@/components/empty-state'
import { PlateIllustration, SearchIllustration } from '@/components/illustrations'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.history }
}

type Props = { searchParams: Record<string, string | string[] | undefined> }

const STATE_DOT = {
  over: 'bg-coral',
  on: 'bg-primary',
  under: 'bg-muted-foreground/50',
  empty: 'bg-muted',
} as const

export default async function HistoryPage({ searchParams }: Props) {
  const profile = await requireOnboardedProfile()
  const units = unitsOf(profile)
  const { t, f } = getI18n(units)
  const q = (firstParam(searchParams.q) ?? '').trim().slice(0, 60)
  const [entries, today] = [await getHistory(profile.id, q), getToday()]

  const groups = new Map<string, EntryDTO[]>()
  for (const e of entries) groups.set(e.date, [...(groups.get(e.date) ?? []), e])

  return (
    <div>
      <PageHeader title={t.meta.pages.history} description={q ? t.history.found(entries.length) : t.history.description} />
      <div className="sticky top-[calc(64px+env(safe-area-inset-top))] z-20 -mx-4 mb-6 bg-background/85 px-4 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <SearchInput initial={q} />
      </div>

      {entries.length === 0 ? (
        q ? (
          <EmptyState
            illustration={<SearchIllustration className="animate-float" />}
            title={t.history.nothingFound(q)}
            description={t.history.nothingFoundText}
            action={
              <Button asChild variant="outline">
                <Link href="/history">{t.history.reset}</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            illustration={<PlateIllustration className="animate-float" />}
            title={t.history.emptyTitle}
            description={t.history.emptyText}
            action={
              <Button asChild size="lg">
                <Link href="/snap">
                  <Camera /> {t.history.firstPhoto}
                </Link>
              </Button>
            }
          />
        )
      ) : (
        <div className="space-y-5">
          {Array.from(groups.entries()).map(([date, list], gi) => {
            const total = list.reduce((s, e) => s + e.calories, 0)
            const state = dayState(total, profile.calorieGoal)
            return (
              <section
                key={date}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(gi, 8) * 45}ms` }}
                aria-labelledby={`day-${date}`}
              >
                <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
                  <h2 id={`day-${date}`} className="text-[15px] font-bold tracking-tight">
                    {f.relativeDay(date, today)}
                  </h2>
                  {!q ? (
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={cn('h-2 w-2 rounded-full', STATE_DOT[state])} aria-hidden />
                      {state !== 'empty' ? <span className="sr-only">{t.history.state[state]}</span> : null}
                      <span className={cn('tabular font-semibold text-foreground', state === 'over' && 'text-coral')}>
                        {f.energyValue(total)}
                      </span>
                      {f.energyUnit}
                    </span>
                  ) : null}
                </div>
                <Card className="p-2">
                  <ul className="divide-y divide-border/60">
                    {list.map((e) => (
                      <li key={e.id} className="py-0.5">
                        <EntryRow entry={e} units={units} meta={t.meals[e.mealType]} />
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
