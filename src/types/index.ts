export type CollegeStatus = 'CONSIDERING' | 'FAVORITE' | 'ELIMINATED'

export interface ProsCons {
  id: string
  text: string
  weight?: number
}

export interface CollegeEntry {
  id: string              // UserCollege.id
  collegeId: string       // College.id
  scorecardId: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
  logoUrl?: string
  websiteUrl?: string
  avgTuition?: number
  enrollmentSize?: number
  // user-specific fields
  admittedPrograms: string[]
  status: CollegeStatus
  tuition?: number
  financialAid?: number
  distanceFromHome?: number
  climate?: string
  notes?: string
  tags: string[]
  pros: ProsCons[]
  cons: ProsCons[]
  photos: string[]
  bracketSeed?: number
}

// Minimal shape returned by /api/search — used only to populate the dropdown
// while the user types. Does NOT include coordinates or financial data.
export interface SearchSuggestion {
  scorecardId: string
  name: string
  city: string
  state: string
}

// Full shape returned by /api/colleges/lookup — fetched only after the user
// selects a specific school. Includes coordinates, tuition, enrollment.
export interface ScorecardResult {
  scorecardId: string
  name: string
  city: string
  state: string
  latitude: number
  longitude: number
  websiteUrl?: string
  avgTuition?: number
  enrollmentSize?: number
}

export interface BracketMatchup {
  id: string
  collegeA: string | null
  collegeB: string | null
  winner: string | null
  nextMatchupId: string | null
}

export interface BracketRound {
  roundNumber: number
  matchups: BracketMatchup[]
}
