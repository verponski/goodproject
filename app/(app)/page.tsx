import Link from 'next/link'
import { Camera, PencilLine } from 'lucide-react'
import { MEAL_TYPES } from '@/lib/constants'
import { isIsoDate } from '@/lib/dates'
import { sumTotals } from '@/lib/nutrition'
import { getDayEntries } from '@/lib/queries'
import { getCurrentHour, getToday, goalsOf, requireOnboardedProfile, unitsOf } from '@/lib/profile'
import { getI18n } from '@/lib/i18n/server'
import { getCachedInsight } from '@/lib/coach/insight-store'
import { entriesHash } from '@/lib/coach/insight'
import { firstParam } from '@/lib/utils'
import { DateSwitcher } from '@/components/diary/date-switcher'
import { DaySummary } from '@/components/diary/day-summary'
import { MealSection } from '@/components/diary/meal-section'
import { DayInsightCard } from '@/components/coach/day-insight-card'
import { EmptyState } from '@/components/empty-state'
import { PlateIllustration } from '@/components/illustrations'
import { Button } from '@/components/ui/button'

type Props = { searchParams: Record<string, string | string[] | undefined> }

export default async function DiaryPage({ searchParams }: Props) {
  const profile = await requireOnboardedProfile()
  const { t, locale } = getI18n()
  const today = getToday()
  const param = firstParam(searchParams.date)
  const date = isIsoDate(param) && param <= today ? param : today
  const entries = await getDayEntries(profile.id, date)
  const totals = sumTotals(entries)
  const units = unitsOf(profile)
  const hash = entriesHash(entries, locale)
  const insight = entries.length > 0 ? await getCachedInsight(profile.id, date) : null
  const snapHref = date === today ? '/snap' : `/snap?date=${date}`

  return (
    <div className="space-y-6">
      <DateSwitcher date={date} today={today} />

      <div className="grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <div className="space-y-4 lg:sticky lg:top-24">
          <DaySummary totals={totals} goals={goalsOf(profile)} units={units} />
          {entries.length > 0 ? (
            <DayInsightCard
              key={`${date}-${hash}`}
              date={date}
              hash={hash}
              initial={insight ? { text: insight.text, hash: insight.hash } : null}
              auto={date === today && getCurrentHour() >= 18}
            />
          ) : null}
          <Button asChild size="lg" className="hidden w-full lg:inline-flex">
            <Link href={snapHref}>
              <Camera /> {t.diary.snapFood}
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <EmptyState
              illustration={<PlateIllustration className="animate-float" />}
              title={date === today ? t.diary.emptyToday : t.diary.emptyDay}
              description={t.diary.emptyDescription}
              action={
                <>
                  <Button asChild size="lg">
                    <Link href={snapHref}>
                      <Camera /> {t.diary.snapFood}
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={`/snap?mode=manual&date=${date}`}>
                      <PencilLine /> {t.diary.manual}
                    </Link>
                  </Button>
                </>
              }
            />
          ) : (
            MEAL_TYPES.map((meal, i) => (
              <MealSection
                key={meal}
                meal={meal}
                index={i}
                date={date}
                units={units}
                entries={entries.filter((e) => e.mealType === meal)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
