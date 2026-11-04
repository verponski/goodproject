import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { requireOnboardedProfile } from '@/lib/profile'
import { getT } from '@/lib/i18n/server'
import { activeProvider } from '@/lib/recognition/providers'
import type { CoachMessageDTO } from '@/lib/types'
import { PageHeader } from '@/components/page-header'
import { CoachChat } from '@/components/coach/coach-chat'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.coach }
}

export default async function CoachPage() {
  const profile = await requireOnboardedProfile()
  const t = getT()
  const rows = await prisma.coachMessage
    .findMany({ where: { profileId: profile.id }, orderBy: { createdAt: 'desc' }, take: 60 })
    .catch(() => [])
  const messages: CoachMessageDTO[] = rows.reverse().map((m) => ({
    id: m.id,
    role: m.role === 'assistant' ? 'assistant' : 'user',
    text: m.text,
    createdAt: m.createdAt.toISOString(),
  }))

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t.coach.title} description={t.coach.subtitle} />
      <CoachChat initial={messages} demo={!activeProvider()} />
    </div>
  )
}
