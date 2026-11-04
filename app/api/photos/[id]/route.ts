import { prisma } from '@/lib/db'
import { getProfileIdFromCookie } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const profileId = getProfileIdFromCookie()
  if (!profileId) return new Response('Unauthorized', { status: 401 })
  if (!/^[a-z0-9_-]{1,64}$/i.test(params.id)) return new Response('Not found', { status: 404 })

  const photo = await prisma.photo.findFirst({
    where: { id: params.id, profileId },
    select: { data: true, mimeType: true },
  })
  if (!photo) return new Response('Not found', { status: 404 })

  return new Response(new Uint8Array(photo.data), {
    headers: {
      'Content-Type': photo.mimeType,
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  })
}
