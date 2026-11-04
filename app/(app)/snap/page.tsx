import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { SnapFlow } from '@/components/snap/snap-flow'
import { isMealType, suggestMealType } from '@/lib/constants'
import { isIsoDate } from '@/lib/dates'
import { getCurrentHour, getToday, requireOnboardedProfile, unitsOf } from '@/lib/profile'
import { getI18n, getT } from '@/lib/i18n/server'
import { activeProvider } from '@/lib/recognition'
import { firstParam } from '@/lib/utils'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.snap }
}

// Распознавание (несколько оценок ИИ параллельно) может занять до ~30 с — даём запас на Vercel.
export const maxDuration = 60

type Props = { searchParams: Record<string, string | string[] | undefined> }

export default async function SnapPage({ searchParams }: Props) {
  const profile = await requireOnboardedProfile()
  const { t, f, locale } = getI18n()
  const today = getToday()
  const dateParam = firstParam(searchParams.date)
  const date = isIsoDate(dateParam) && dateParam <= today ? dateParam : today
  const mealParam = firstParam(searchParams.meal)
  const meal = isMealType(mealParam) ? mealParam : suggestMealType(getCurrentHour())
  const mode = firstParam(searchParams.mode) === 'manual' ? 'manual' : 'photo'
  const dateLabel = f.relativeDay(date, today)

  return (
    <>
      <PageHeader title={t.meta.pages.snap} description={t.snap.pageDescription(locale === 'en' ? dateLabel : dateLabel.toLocaleLowerCase('uk-UA'))} />
      <SnapFlow
        key={`${date}-${meal}-${mode}`}
        date={date}
        today={today}
        dateLabel={dateLabel}
        initialMeal={meal}
        initialMode={mode}
        units={unitsOf(profile)}
        demoMode={activeProvider() === null}
      />
    </>
  )
}
