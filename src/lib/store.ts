import { create } from 'zustand'
import type { CollegeEntry, BracketRound } from '@/types'
import { saveGuestData, loadGuestData } from '@/lib/guest-storage'

interface AppStore {
  // Data
  colleges: CollegeEntry[]
  isGuest: boolean
  bracket: BracketRound[] | null
  bracketWinner: string | null

  // UI state
  selectedCollegeId: string | null
  isSidebarOpen: boolean
  compareIds: string[]

  // Actions
  setIsGuest: (guest: boolean) => void
  setColleges: (colleges: CollegeEntry[]) => void

  addCollege: (college: CollegeEntry) => void
  updateCollege: (id: string, updates: Partial<CollegeEntry>) => void
  removeCollege: (id: string) => void

  setSelectedCollege: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void

  toggleCompare: (id: string) => void
  clearCompare: () => void

  setBracket: (rounds: BracketRound[], winner?: string | null) => void
  clearBracket: () => void

  syncToStorage: () => void
  loadFromStorage: () => void
  loadFromServer: () => Promise<void>
}

export const useStore = create<AppStore>((set, get) => ({
  colleges: [],
  isGuest: true,
  bracket: null,
  bracketWinner: null,
  selectedCollegeId: null,
  isSidebarOpen: false,
  compareIds: [],

  setIsGuest: (guest) => set({ isGuest: guest }),
  setColleges: (colleges) => set({ colleges }),

  addCollege: (college) => {
    set((s) => ({ colleges: [...s.colleges, college] }))
    if (get().isGuest) get().syncToStorage()
    else {
      fetch('/api/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(college),
      }).catch(console.error)
    }
  },

  updateCollege: (id, updates) => {
    set((s) => ({
      colleges: s.colleges.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }))
    if (get().isGuest) get().syncToStorage()
    else {
      fetch(`/api/colleges/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(console.error)
    }
  },

  removeCollege: (id) => {
    set((s) => ({
      colleges: s.colleges.filter((c) => c.id !== id),
      selectedCollegeId: s.selectedCollegeId === id ? null : s.selectedCollegeId,
      isSidebarOpen: s.selectedCollegeId === id ? false : s.isSidebarOpen,
      compareIds: s.compareIds.filter((cid) => cid !== id),
    }))
    if (get().isGuest) get().syncToStorage()
    else {
      fetch(`/api/colleges/${id}`, { method: 'DELETE' }).catch(console.error)
    }
  },

  setSelectedCollege: (id) =>
    set({ selectedCollegeId: id, isSidebarOpen: id !== null }),

  setSidebarOpen: (open) =>
    set((s) => ({ isSidebarOpen: open, selectedCollegeId: open ? s.selectedCollegeId : null })),

  toggleCompare: (id) =>
    set((s) => ({
      compareIds: s.compareIds.includes(id)
        ? s.compareIds.filter((c) => c !== id)
        : s.compareIds.length < 4
        ? [...s.compareIds, id]
        : s.compareIds,
    })),

  clearCompare: () => set({ compareIds: [] }),

  setBracket: (rounds, winner = null) =>
    set({ bracket: rounds, bracketWinner: winner ?? null }),

  clearBracket: () => set({ bracket: null, bracketWinner: null }),

  syncToStorage: () => {
    saveGuestData(get().colleges)
  },

  loadFromStorage: () => {
    const colleges = loadGuestData()
    set({ colleges })
  },

  loadFromServer: async () => {
    try {
      const res = await fetch('/api/colleges')
      if (!res.ok) return
      const data = await res.json()
      set({ colleges: data })
    } catch (err) {
      console.error('Failed to load colleges from server', err)
    }
  },
}))
