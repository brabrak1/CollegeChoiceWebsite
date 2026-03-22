import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import type { CollegeEntry } from '@/types'

function mapToCollegeEntry(uc: {
  id: string
  collegeId: string
  admittedPrograms: string[]
  status: string
  tuition: number | null
  financialAid: number | null
  distanceFromHome: number | null
  climate: string | null
  notes: string | null
  tags: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pros: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cons: any[]
  photos: string[]
  bracketSeed: number | null
  college: {
    id: string
    scorecardId: string
    name: string
    city: string
    state: string
    latitude: number
    longitude: number
    logoUrl: string | null
    websiteUrl: string | null
    avgTuition: number | null
    enrollmentSize: number | null
  }
}): CollegeEntry {
  return {
    id: uc.id,
    collegeId: uc.collegeId,
    scorecardId: uc.college.scorecardId,
    name: uc.college.name,
    city: uc.college.city,
    state: uc.college.state,
    lat: uc.college.latitude,
    lng: uc.college.longitude,
    logoUrl: uc.college.logoUrl ?? undefined,
    websiteUrl: uc.college.websiteUrl ?? undefined,
    avgTuition: uc.college.avgTuition ?? undefined,
    enrollmentSize: uc.college.enrollmentSize ?? undefined,
    admittedPrograms: uc.admittedPrograms,
    status: uc.status as CollegeEntry['status'],
    tuition: uc.tuition ?? undefined,
    financialAid: uc.financialAid ?? undefined,
    distanceFromHome: uc.distanceFromHome ?? undefined,
    climate: uc.climate ?? undefined,
    notes: uc.notes ?? undefined,
    tags: uc.tags,
    pros: uc.pros,
    cons: uc.cons,
    photos: uc.photos,
    bracketSeed: uc.bracketSeed ?? undefined,
  }
}

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const userColleges = await prisma.userCollege.findMany({
    where: { userId: session.user.id },
    include: { college: true },
    orderBy: { createdAt: 'asc' },
  })

  return Response.json(userColleges.map(mapToCollegeEntry))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const college = await prisma.college.upsert({
    where: { scorecardId: body.scorecardId },
    update: {
      logoUrl: body.logoUrl ?? undefined,
      websiteUrl: body.websiteUrl ?? undefined,
    },
    create: {
      scorecardId: body.scorecardId,
      name: body.name,
      city: body.city,
      state: body.state,
      latitude: body.latitude ?? body.lat,
      longitude: body.longitude ?? body.lng,
      logoUrl: body.logoUrl ?? null,
      websiteUrl: body.websiteUrl ?? null,
      avgTuition: body.avgTuition ?? null,
      enrollmentSize: body.enrollmentSize ?? null,
    },
  })

  // Check if already exists
  const existing = await prisma.userCollege.findUnique({
    where: { userId_collegeId: { userId: session.user.id, collegeId: college.id } },
    include: { college: true },
  })
  if (existing) return Response.json(mapToCollegeEntry(existing), { status: 200 })

  const userCollege = await prisma.userCollege.create({
    data: {
      userId: session.user.id,
      collegeId: college.id,
      admittedPrograms: body.admittedPrograms ?? [],
      status: body.status ?? 'CONSIDERING',
      tuition: body.tuition ?? null,
      financialAid: body.financialAid ?? null,
      climate: body.climate ?? null,
      notes: body.notes ?? null,
      tags: body.tags ?? [],
      pros: body.pros ?? [],
      cons: body.cons ?? [],
      photos: body.photos ?? [],
      bracketSeed: body.bracketSeed ?? null,
    },
    include: { college: true },
  })

  return Response.json(mapToCollegeEntry(userCollege), { status: 201 })
}
