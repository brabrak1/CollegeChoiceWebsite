import type { SearchSuggestion, ScorecardResult } from '@/types'

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools'

// Only name/city/state — fetched on every keystroke, so kept minimal.
const SEARCH_FIELDS = ['id', 'school.name', 'school.city', 'school.state'].join(',')

// Full detail fields — fetched only when the user selects a specific school.
const DETAIL_FIELDS = [
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

function getApiKey(): string | null {
  const key = process.env.COLLEGE_SCORECARD_API_KEY
  if (!key) {
    console.warn('COLLEGE_SCORECARD_API_KEY not set')
    return null
  }
  return key
}

/**
 * Called while the user types — returns lightweight name/city/state suggestions
 * for the autocomplete dropdown. Does NOT fetch coordinates or financial data.
 * Uses `q` for case-insensitive, partial/contains full-text matching on the
 * school name field. No `_sort` param — `q` results are sorted by relevance.
 */
export async function searchColleges(query: string): Promise<SearchSuggestion[]> {
  const apiKey = getApiKey()
  if (!apiKey) return []

  const params = new URLSearchParams({
    'school.name': query,
    fields: SEARCH_FIELDS,
    per_page: '10',
    api_key: apiKey,
  })

  const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } })
  if (!res.ok) {
    console.error('Scorecard API search error', res.status)
    return []
  }

  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results ?? []).map((r: any): SearchSuggestion => ({
    scorecardId: String(r.id),
    name: r['school.name'] ?? '',
    city: r['school.city'] ?? '',
    state: r['school.state'] ?? '',
  })).filter((r: SearchSuggestion) => r.name)
}

/**
 * Called only after the user selects a school from the dropdown.
 * Fetches full detail (coordinates, tuition, enrollment) by the school's
 * numeric Scorecard ID — NOT by the raw search string.
 */
export async function fetchCollegeById(id: string): Promise<ScorecardResult | null> {
  const apiKey = getApiKey()
  if (!apiKey) return null

  const params = new URLSearchParams({
    id,
    fields: DETAIL_FIELDS,
    per_page: '1',
    api_key: apiKey,
  })

  // Cache aggressively — a school's coordinates/tuition rarely change.
  const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 86400 } })
  if (!res.ok) {
    console.error('Scorecard API lookup error', res.status)
    return null
  }

  const data = await res.json()
  const results = data.results ?? []
  if (results.length === 0) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: any = results[0]
  const result: ScorecardResult = {
    scorecardId: String(r.id),
    name: r['school.name'] ?? '',
    city: r['school.city'] ?? '',
    state: r['school.state'] ?? '',
    latitude: r['location.lat'] ?? 0,
    longitude: r['location.lon'] ?? 0,
    websiteUrl: r['school.school_url'] ? `https://${r['school.school_url']}` : undefined,
    avgTuition: r['latest.cost.tuition.in_state'] ?? undefined,
    enrollmentSize: r['latest.student.size'] ?? undefined,
  }

  // A school without coordinates can't be pinned on the map.
  if (!result.latitude || !result.longitude) return null
  return result
}
