import type { ScorecardResult } from '@/types'

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools'

const FIELDS = [
  'id',
  'school.name',
  'school.city',
  'school.state',
  'location.lat',
  'location.lon',
  'school.school_url',
  'latest.cost.tuition.in_state',
  'latest.student.size',
].join(',')

export async function searchColleges(query: string): Promise<ScorecardResult[]> {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY
  if (!apiKey) {
    console.warn('COLLEGE_SCORECARD_API_KEY not set — returning empty results')
    return []
  }

  const params = new URLSearchParams({
    'school.name': query,
    fields: FIELDS,
    per_page: '10',
    api_key: apiKey,
  })

  const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } })
  if (!res.ok) {
    console.error('Scorecard API error', res.status)
    return []
  }

  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results ?? []).map((r: any): ScorecardResult => ({
    scorecardId: String(r.id),
    name: r['school.name'] ?? '',
    city: r['school.city'] ?? '',
    state: r['school.state'] ?? '',
    latitude: r['location.lat'] ?? 0,
    longitude: r['location.lon'] ?? 0,
    websiteUrl: r['school.school_url'] ? `https://${r['school.school_url']}` : undefined,
    avgTuition: r['latest.cost.tuition.in_state'] ?? undefined,
    enrollmentSize: r['latest.student.size'] ?? undefined,
  })).filter((r: ScorecardResult) => r.latitude && r.longitude)
}
