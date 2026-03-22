import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const bracket = await prisma.bracket.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return Response.json(bracket ?? null)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { rounds, finalWinner } = await req.json()

  const bracket = await prisma.bracket.upsert({
    where: { id: (await prisma.bracket.findFirst({ where: { userId: session.user.id } }))?.id ?? 'new' },
    update: { rounds, finalWinner: finalWinner ?? null },
    create: { userId: session.user.id, rounds, finalWinner: finalWinner ?? null },
  })

  return Response.json(bracket)
}
