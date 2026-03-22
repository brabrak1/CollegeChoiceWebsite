import type { CollegeEntry } from '@/types'

const STORAGE_KEY = 'cc_guest_data'

export function saveGuestData(colleges: CollegeEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ colleges, version: 1 }))
  } catch {
    // sessionStorage may be unavailable (private browsing quota)
  }
}

export function loadGuestData(): CollegeEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw).colleges ?? []
  } catch {
    return []
  }
}

export function clearGuestData(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}

export async function migrateGuestToAccount(colleges: CollegeEntry[]): Promise<void> {
  for (const college of colleges) {
    try {
      // First ensure base College record exists
      await fetch('/api/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scorecardId: college.scorecardId,
          name: college.name,
          city: college.city,
          state: college.state,
          latitude: college.lat,
          longitude: college.lng,
          logoUrl: college.logoUrl,
          websiteUrl: college.websiteUrl,
          avgTuition: college.avgTuition,
          enrollmentSize: college.enrollmentSize,
          // user-specific data to migrate
          admittedPrograms: college.admittedPrograms,
          status: college.status,
          tuition: college.tuition,
          financialAid: college.financialAid,
          climate: college.climate,
          notes: college.notes,
          tags: college.tags,
          pros: college.pros,
          cons: college.cons,
          photos: college.photos,
          bracketSeed: college.bracketSeed,
        }),
      })
    } catch (err) {
      console.error('Failed to migrate college', college.name, err)
    }
  }
}
