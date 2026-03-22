import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { email, password, name } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return Response.json({ error: 'Email already in use' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name: name ?? null },
    select: { id: true, email: true, name: true },
  })

  return Response.json(user, { status: 201 })
}
