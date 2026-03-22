'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useStore } from '@/lib/store'
import { getClearbitLogoUrl } from '@/lib/utils'
import type { ScorecardResult } from '@/types'
import { nanoid } from 'nanoid'

export function CollegeSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ScorecardResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { addCollege, colleges } = useStore()

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data: ScorecardResult[] = await res.json()
      setResults(data)
      setOpen(true)
    } catch {
      setResults([])
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

  function handleSelect(result: ScorecardResult) {
    const alreadyAdded = colleges.some((c) => c.scorecardId === result.scorecardId)
    if (alreadyAdded) {
      setOpen(false)
      setQuery('')
      return
    }

    const logoUrl = getClearbitLogoUrl(result.websiteUrl)
    addCollege({
      id: nanoid(),
      collegeId: nanoid(),
      scorecardId: result.scorecardId,
      name: result.name,
      city: result.city,
      state: result.state,
      lat: result.latitude,
      lng: result.longitude,
      logoUrl,
      websiteUrl: result.websiteUrl,
      avgTuition: result.avgTuition,
      enrollmentSize: result.enrollmentSize,
      admittedPrograms: [],
      status: 'CONSIDERING',
      tags: [],
      pros: [],
      cons: [],
      photos: [],
    })
    setQuery('')
    setOpen(false)
    setResults([])
  }

  // Close dropdown on outside click
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

  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-4 z-[999] w-80"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="Search colleges…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8FA8] focus:border-transparent"
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="w-4 h-4 border-2 border-[#4A8FA8] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length === 0 && (
        <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-sm text-gray-400">
          No colleges found for &ldquo;{query}&rdquo;
        </div>
      )}

      {open && results.length > 0 && (
        <ul className="mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {results.map((r) => {
            const added = addedIds.has(r.scorecardId)
            return (
              <li key={r.scorecardId}>
                <button
                  onClick={() => handleSelect(r)}
                  disabled={added}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 disabled:opacity-50 disabled:cursor-default"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.city}, {r.state}</div>
                    </div>
                    {added && (
                      <span className="text-xs text-[#4A8FA8] font-medium">Added</span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
