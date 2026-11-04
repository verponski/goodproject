import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { OnboardingForm } from '@/components/onboarding/onboarding-form'
import { ClientSync } from '@/components/client-sync'
import { Button } from '@/components/ui/button'
import { parseDiet } from '@/lib/body'
import { EMPTY_DRAFT, type SurveyDraft } from '@/lib/survey'
import { bodyOf, getToday, requireProfile } from '@/lib/profile'
import { getT } from '@/lib/i18n/server'
import { firstParam } from '@/lib/utils'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.onboarding }
}

export default async function OnboardingPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const profile = await requireProfile()
  const editing = firstParam(searchParams.edit) === '1'
  if (profile.onboarded && !editing) redirect('/')
  const t = getT()

  const body = bodyOf(profile, getToday())
  const initial: SurveyDraft = body
    ? {
        sex: body.sex,
        age: body.age,
        heightCm: body.heightCm,
        weightKg: body.weightKg,
        activity: body.activity,
        goal: body.goal,
        targetWeightKg: body.targetWeightKg ?? body.weightKg,
        paceKg: body.paceKg ?? 0.5,
        diet: parseDiet(profile.diet),
        dietNote: profile.dietNote ?? '',
      }
    : EMPTY_DRAFT

  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_600px_at_100%_-10%,hsl(var(--cream)/0.55),transparent_60%)]">
      <header className="pt-safe mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {editing && profile.onboarded ? (
            <Button asChild variant="ghost" size="icon" aria-label={t.common.close}>
              <Link href="/settings">
                <X />
              </Link>
            </Button>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 sm:pt-8">
        <OnboardingForm initial={initial} editing={editing && profile.onboarded} />
      </main>
      <ClientSync />
    </div>
  )
}
