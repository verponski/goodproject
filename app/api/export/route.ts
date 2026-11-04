import { prisma } from '@/lib/db'
import { isMealType } from '@/lib/constants'
import { toCsv } from '@/lib/csv'
import { getProfileIdFromCookie, getToday } from '@/lib/profile'
import { getT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const profileId = getProfileIdFromCookie()
  if (!profileId) return new Response('Unauthorized', { status: 401 })

  const entries = await prisma.entry.findMany({
    where: { profileId, deletedAt: null },
    include: { items: { orderBy: { position: 'asc' } } },
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
  })

  const t = getT()
  const rows = entries.map((e) => [
    e.date,
    isMealType(e.mealType) ? t.meals[e.mealType] : e.mealType,
    e.title,
    e.items.map((i) => t.csv.item(i.name, Math.round(i.weightG), Math.round(i.calories))).join('; '),
    Math.round(e.weightG),
    Math.round(e.calories),
    Math.round(e.protein * 10) / 10,
    Math.round(e.fat * 10) / 10,
    Math.round(e.carbs * 10) / 10,
    e.source === 'photo' ? t.csv.source.photo : e.source === 'seed' ? t.csv.source.seed : t.csv.source.manual,
    e.note ?? '',
    e.createdAt.toISOString(),
  ])

  // BOM — чтобы Excel корректно открыл кириллицу
  const body = '\uFEFF' + toCsv(t.csv.headers, rows)
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="caloriesnap-diary-${getToday()}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
