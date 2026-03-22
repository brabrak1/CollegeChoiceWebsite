'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useStore } from '@/lib/store'
import { getClearbitLogoUrl } from '@/lib/utils'
import { CollegeLogo } from '@/components/ui/CollegeLogo'
import type { SearchSuggestion, ScorecardResult } from '@/types'
import { nanoid } from 'nanoid'

export function CollegeSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  // ID of the suggestion currently being resolved (fetch full data by ID)
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addCollege, removeCollege, colleges, setSelectedCollege } = useStore()

  // ── Autocomplete search ─────────────────────────────────────────────────────
  // Fires 300 ms after the user stops typing.
  // Calls /api/search which returns only name/city/state — no coordinates or
  // financial data. The Scorecard API is queried with the `q` (full-text /
  // contains) parameter on these minimal fields.
  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data: SearchSuggestion[] = await res.json()
      setResults(data)
      setOpen(true)
    } catch {
      setResults([])
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  // ── Selection handler ───────────────────────────────────────────────────────
  // Triggered only when the user clicks a result.
  // Calls /api/colleges/lookup?id=<scorecardId> — the Scorecard API is hit here
  // (and only here) with the school's numeric ID, returning coordinates, tuition,
  // and enrollment. The raw search query string is never passed to that endpoint.
  async function handleSelect(suggestion: SearchSuggestion) {
    setQuery(suggestion.name)
    setOpen(false)
    setResults([])

    // If already on the map, just navigate to it.
    const existing = colleges.find((c) => c.scorecardId === suggestion.scorecardId)
    if (existing) {
      setSelectedCollege(existing.id)
      return
    }

    setSelectingId(suggestion.scorecardId)
    try {
      const res = await fetch(`/api/colleges/lookup?id=${suggestion.scorecardId}`)
      if (!res.ok) throw new Error(`Lookup failed: ${res.status}`)
      const detail: ScorecardResult = await res.json()

      addCollege({
        id: nanoid(),
        collegeId: nanoid(),
        scorecardId: detail.scorecardId,
        name: detail.name,
        city: detail.city,
        state: detail.state,
        lat: detail.latitude,
        lng: detail.longitude,
        logoUrl: getClearbitLogoUrl(detail.websiteUrl),
        websiteUrl: detail.websiteUrl,
        avgTuition: detail.avgTuition,
        enrollmentSize: detail.enrollmentSize,
        admittedPrograms: [],
        status: 'CONSIDERING',
        tags: [],
        pros: [],
        cons: [],
        photos: [],
      })
    } catch (err) {
      console.error('Failed to add college', err)
      setQuery('')
    } finally {
      setSelectingId(null)
    }
  }

  function clearSearch() {
    setQuery('')
    setResults([])
    setOpen(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const addedIds = new Set(colleges.map((c) => c.scorecardId))
  const isBusy = loading || selectingId !== null

  return (
    <div ref={containerRef} className="absolute top-4 left-4 z-[999] w-80">
      {/* ── Search input ── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => {
            if (query.length >= 2 && results.length > 0) setOpen(true)
          }}
          placeholder="Search colleges…"
          className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8FA8] focus:border-transparent"
        />
        {isBusy && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="w-4 h-4 border-2 border-[#4A8FA8] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isBusy && query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Dropdown: empty state ── */}
      {open && results.length === 0 && (
        <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-sm text-gray-400">
          No colleges found for &ldquo;{query}&rdquo;
        </div>
      )}

      {/* ── Dropdown: results ── */}
      {open && results.length > 0 && (
        <ul className="mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {results.map((r) => {
            const added = addedIds.has(r.scorecardId)
            const isSelecting = selectingId === r.scorecardId
            return (
              <li key={r.scorecardId}>
                <button
                  onClick={() => handleSelect(r)}
                  disabled={isSelecting}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 disabled:opacity-70"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.city}, {r.state}</div>
                    </div>
                    {isSelecting && (
                      <div className="w-3.5 h-3.5 border-2 border-[#4A8FA8] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                    {!isSelecting && added && (
                      <span className="text-xs text-[#4A8FA8] font-medium flex-shrink-0">Added ✓</span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* ── My Schools list ── */}
      {colleges.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              My Schools ({colleges.length})
            </span>
          </div>
          <ul className="max-h-52 overflow-y-auto divide-y divide-gray-50">
            {colleges.map((c) => (
              <li key={c.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors group">
                <CollegeLogo name={c.name} logoUrl={c.logoUrl} size={22} />
                <button
                  onClick={() => setSelectedCollege(c.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="text-xs font-medium text-gray-800 truncate leading-tight">{c.name}</div>
                  <div className="text-xs text-gray-400 leading-tight">{c.city}, {c.state}</div>
                </button>
                <button
                  onClick={() => removeCollege(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0 text-base leading-none"
                  aria-label={`Remove ${c.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
