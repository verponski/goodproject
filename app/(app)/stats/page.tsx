import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarCheck, Flame, Trophy, TriangleAlert } from 'lucide-react'
import { addDays } from '@/lib/dates'
import { dayState, toDisplayEnergy } from '@/lib/nutrition'
import { computeAverages, computeStreaks, countByState, fillDays } from '@/lib/stats'
import { getDailyTotals, getWeights } from '@/lib/queries'
import { getToday, goalsOf, requireOnboardedProfile, unitsOf } from '@/lib/profile'
import { isGoalType } from '@/lib/body'
import { getI18n, getT } from '@/lib/i18n/server'
import { firstParam } from '@/lib/utils'
import { PageHeader } from '@/components/page-header'
import { RangeTabs } from '@/components/stats/range-tabs'
import { StatCard } from '@/components/stats/stat-card'
import { CaloriesChart, type ChartDatum } from '@/components/stats/calories-chart'
import { WeightSection } from '@/components/weight/weight-section'
import { EmptyState } from '@/components/empty-state'
import { ChartIllustration } from '@/components/illustrations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.stats }
}

type Props = { searchParams: Record<string, string | string[] | undefined> }

export default async function StatsPage({ searchParams }: Props) {
  const profile = await requireOnboardedProfile()
  const units = unitsOf(profile)
  const { t, f } = getI18n(units)
  const range: 7 | 30 = firstParam(searchParams.range) === '30' ? 30 : 7
  const today = getToday()
  const from = addDays(today, -(range - 1))
  const goals = goalsOf(profile)
  const unit = f.energyUnit
  const dw = t.common.days

  const [rows, weights] = await Promise.all([
    getDailyTotals(profile.id, addDays(today, -29), today),
    getWeights(profile.id).catch(() => []),
  ])
  const days = fillDays(rows, from, today)
  const week = fillDays(rows, addDays(today, -6), today)

  const weekAvg = computeAverages(week)
  const periodAvg = computeAverages(days)
  const streaks = computeStreaks(days, goals.calories, today)
  const states = countByState(days, goals.calories)
  const trackedDays = days.length - states.empty

  const data: ChartDatum[] = days.map((d) => ({
    date: d.date,
    label: range === 7 ? f.weekdayShort(d.date) : String(Number(d.date.slice(8))),
    fullLabel: f.dayLong(d.date),
    value: Math.round(toDisplayEnergy(d.calories, units.energy)),
    state: dayState(d.calories, goals.calories),
  }))

  const weekDiff = weekAvg.calories - goals.calories
  const goal = isGoalType(profile.goalType) ? profile.goalType : null

  const weightSection = (
    <WeightSection entries={weights} today={today} target={profile.targetWeightKg} goal={goal} />
  )

  return (
    <div>
      <PageHeader
        title={t.meta.pages.stats}
        description={t.stats.range(f.dayShort(from), f.dayShort(today), trackedDays, dw(trackedDays))}
        action={<RangeTabs value={range} />}
      />

      {trackedDays === 0 ? (
        <div className="space-y-5">
          <EmptyState
            illustration={<ChartIllustration className="animate-float" />}
            title={t.stats.emptyTitle}
            description={t.stats.emptyText}
            action={
              <Button asChild size="lg">
                <Link href="/snap">{t.stats.addFirst}</Link>
              </Button>
            }
          />
          {weightSection}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              index={0}
              icon={Flame}
              label={t.stats.weekAvg}
              value={f.energyValue(weekAvg.calories)}
              unit={unit}
              tone={weekDiff > 0 ? 'coral' : 'default'}
              hint={
                weekAvg.trackedDays === 0
                  ? t.stats.noWeek
                  : weekDiff > 0
                    ? t.stats.aboveGoal(f.energyValue(weekDiff))
                    : t.stats.belowGoal(f.energyValue(-weekDiff))
              }
            />
            <StatCard
              index={1}
              icon={Trophy}
              label={t.stats.bestStreak}
              value={streaks.best.length}
              unit={dw(streaks.best.length)}
              tone="cream"
              hint={
                streaks.best.from && streaks.best.to
                  ? t.stats.bestHint(f.range(streaks.best.from, streaks.best.to))
                  : t.stats.noBest
              }
            />
            <StatCard
              index={2}
              icon={TriangleAlert}
              label={t.stats.worstStreak}
              value={streaks.worst.length}
              unit={dw(streaks.worst.length)}
              tone={streaks.worst.length > 0 ? 'coral' : 'default'}
              hint={
                streaks.worst.from && streaks.worst.to
                  ? t.stats.worstHint(f.range(streaks.worst.from, streaks.worst.to))
                  : t.stats.noWorst
              }
            />
            <StatCard
              index={3}
              icon={CalendarCheck}
              label={t.stats.daysInGoal}
              value={trackedDays - states.over}
              unit={t.stats.of(trackedDays)}
              hint={streaks.current > 0 ? t.stats.currentStreak(streaks.current, dw(streaks.current)) : t.stats.startStreak}
            />
          </div>

          <Card className="animate-fade-up [animation-delay:120ms]">
            <CardHeader>
              <div>
                <CardTitle>{t.stats.caloriesByDay}</CardTitle>
                <CardDescription>
                  {t.stats.avgFor(range, dw(range))}{' '}
                  <span className="tabular font-semibold text-foreground">{f.energy(periodAvg.calories)}</span>
                </CardDescription>
              </div>
              <ul className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex" aria-label={t.stats.legend}>
                <li className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" /> {t.stats.inGoal}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/45" /> {t.stats.under}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-coral" /> {t.stats.over}
                </li>
              </ul>
            </CardHeader>
            <CardContent className="pt-4">
              <CaloriesChart
                data={data}
                goal={Math.round(toDisplayEnergy(goals.calories, units.energy))}
                unit={unit}
                dense={range === 30}
              />
            </CardContent>
          </Card>

          <Card className="animate-fade-up [animation-delay:160ms]">
            <CardHeader>
              <div>
                <CardTitle>{t.stats.macrosAvg}</CardTitle>
                <CardDescription>{t.stats.macrosFor(range, dw(range))}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-3">
              {(
                [
                  { key: 'protein', label: t.macros.protein, goal: goals.protein },
                  { key: 'fat', label: t.macros.fat, goal: goals.fat },
                  { key: 'carbs', label: t.macros.carbs, goal: goals.carbs },
                ] as const
              ).map((m) => {
                const v = periodAvg[m.key]
                const over = v > m.goal
                return (
                  <div key={m.key}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-sm font-semibold">{m.label}</span>
                      <span className="tabular text-sm text-muted-foreground">
                        <span className={over ? 'text-lg font-bold text-coral' : 'text-lg font-bold text-foreground'}>{f.num(v)}</span> /{' '}
                        {f.grams(m.goal)}
                      </span>
                    </div>
                    <Progress
                      value={m.goal > 0 ? v / m.goal : 0}
                      tone={over ? 'coral' : m.key}
                      label={t.stats.macroAvgLabel(m.label, f.num(v), m.goal)}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {weightSection}
        </div>
      )}
    </div>
  )
}
