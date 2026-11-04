import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { StartFlow } from '@/components/start/start-flow'
import { hasAccess } from '@/lib/access'
import { getT, hasLocaleCookie } from '@/lib/i18n/server'
import { getPalette } from '@/lib/palette-server'
import { firstParam, safeNextPath } from '@/lib/utils'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.start }
}

export default function StartPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const next = safeNextPath(firstParam(searchParams.next))
  if (!hasAccess()) redirect(next === '/' ? '/unlock' : `/unlock?next=${encodeURIComponent(next)}`)
  return (
    <main className="pt-safe flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <StartFlow next={next} showWelcome={!hasLocaleCookie()} palette={getPalette()} />
    </main>
  )
}
