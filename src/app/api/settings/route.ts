import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { homeAddress, homeLat, homeLng } = await req.json()

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      homeAddress: homeAddress ?? null,
      homeLat: homeLat ?? null,
      homeLng: homeLng ?? null,
    },
  })

  return Response.json({ ok: true })
}
