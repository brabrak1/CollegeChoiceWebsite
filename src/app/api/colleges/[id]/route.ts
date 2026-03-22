import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  // Remove fields that belong to College table, not UserCollege
  const { name: _n, city: _c, state: _s, lat: _la, lng: _lg, ...userCollegeData } = body

  try {
    const updated = await prisma.userCollege.update({
      where: { id, userId: session.user.id },
      data: userCollegeData,
      include: { college: true },
    })
    return Response.json(updated)
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    await prisma.userCollege.delete({
      where: { id, userId: session.user.id },
    })
    return new Response(null, { status: 204 })
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
}
