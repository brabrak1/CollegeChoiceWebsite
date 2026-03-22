import { fetchCollegeById } from '@/lib/scorecard-api'
import { NextRequest } from 'next/server'

/**
 * GET /api/colleges/lookup?id=<scorecardId>
 *
 * Fetches full college detail from the Scorecard API by numeric school ID.
 * Only called after the user selects a school from the search dropdown —
 * never called while the user is still typing.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id') ?? ''
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 })

  const college = await fetchCollegeById(id)
  if (!college) return Response.json({ error: 'College not found' }, { status: 404 })

  return Response.json(college)
}
