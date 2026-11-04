import type { Metadata } from 'next'
import { Database, Globe, Palette, Ruler, ShieldCheck, Sparkles, Target, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { computePlan, parseDiet } from '@/lib/body'
import { countEntries } from '@/lib/queries'
import { bodyOf, getToday, goalsOf, requireOnboardedProfile, unitsOf } from '@/lib/profile'
import { activeProvider, sampleCount } from '@/lib/recognition'
import { getI18n, getT } from '@/lib/i18n/server'
import { getPalette } from '@/lib/palette-server'
import { PageHeader } from '@/components/page-header'
import { GoalsForm } from '@/components/settings/goals-form'
import { UnitsForm } from '@/components/settings/units-form'
import { ThemePicker } from '@/components/settings/theme-picker'
import { ExportButton } from '@/components/settings/export-button'
import { LanguagePicker } from '@/components/settings/language-picker'
import { PalettePicker } from '@/components/settings/palette-picker'
import { ProfileSummary } from '@/components/settings/profile-summary'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.settings }
}

function Section({
  icon: Icon,
  title,
  description,
  children,
  index,
}: {
  icon: typeof Target
  title: string
  description: string
  children: ReactNode
  index: number
}) {
  return (
    <Card className="animate-fade-up p-5 sm:p-6" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  )
}

export default async function SettingsPage() {
  const profile = await requireOnboardedProfile()
  const units = unitsOf(profile)
  const { t, f } = getI18n(units)
  const stats = await countEntries(profile.id)
  const provider = activeProvider()
  const samples = sampleCount()
  const today = getToday()
  const body = bodyOf(profile, today)
  const plan = body ? computePlan(body, today) : null

  return (
    <div>
      <PageHeader title={t.meta.pages.settings} description={t.settings.description} />
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <Section index={0} icon={UserRound} title={t.settings.profileTitle} description={t.settings.profileText}>
            <ProfileSummary body={body} plan={plan} diet={parseDiet(profile.diet)} dietNote={profile.dietNote} t={t} f={f} />
          </Section>
          <Section index={1} icon={Target} title={t.settings.goalTitle} description={t.settings.goalText}>
            <GoalsForm key={`${profile.calorieGoal}-${profile.proteinGoal}-${profile.fatGoal}-${profile.carbsGoal}`} initial={goalsOf(profile)} />
          </Section>
        </div>
        <div className="space-y-4">
          <Section index={2} icon={Globe} title={t.settings.languageTitle} description={t.settings.languageText}>
            <LanguagePicker />
          </Section>
          <Section index={3} icon={Palette} title={t.settings.appearanceTitle} description={t.settings.appearanceText}>
            <p className="mb-2 text-[13px] font-medium text-muted-foreground">{t.settings.palette}</p>
            <PalettePicker initial={getPalette()} />
            <p className="mb-2 mt-5 text-[13px] font-medium text-muted-foreground">{t.settings.theme}</p>
            <ThemePicker />
          </Section>
          <Section index={4} icon={Ruler} title={t.settings.unitsTitle} description={t.settings.unitsText}>
            <UnitsForm weight={units.weight} energy={units.energy} />
          </Section>
          <Section index={5} icon={Database} title={t.settings.dataTitle} description={t.settings.dataText}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="tabular text-sm text-muted-foreground">{t.settings.dataStats(stats.entries, stats.days)}</p>
              <ExportButton disabled={stats.entries === 0} />
            </div>
          </Section>
          <Section index={6} icon={Sparkles} title={t.settings.aiTitle} description={t.settings.aiText}>
            <div className="flex flex-wrap items-center gap-2">
              {provider ? (
                <Badge>
                  <ShieldCheck /> {t.settings.connected(provider.label)}
                </Badge>
              ) : (
                <Badge variant="cream">
                  <Sparkles /> {t.snap.demo}
                </Badge>
              )}
              <p className="text-sm text-muted-foreground">{provider ? t.settings.aiOn(samples) : t.settings.aiOff}</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
