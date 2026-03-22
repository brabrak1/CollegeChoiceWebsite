import { searchColleges } from '@/lib/scorecard-api'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return Response.json([])
  const results = await searchColleges(q)
  return Response.json(results)
}
