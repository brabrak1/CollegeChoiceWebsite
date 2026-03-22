'use client'

import { useStore } from '@/lib/store'
import { CompareTable } from '@/components/compare/CompareTable'
import { CollegeLogo } from '@/components/ui/CollegeLogo'
import Link from 'next/link'

export default function ComparePage() {
  const { colleges, compareIds, toggleCompare, clearCompare } = useStore()
  const selected = colleges.filter((c) => compareIds.includes(c.id))
  const unselected = colleges.filter((c) => !compareIds.includes(c.id))

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compare Schools</h1>
            <p className="text-sm text-gray-500 mt-1">Select 2–4 schools to compare side by side</p>
          </div>
          <div className="flex gap-2">
            {compareIds.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
            )}
            <Link
              href="/map"
              className="text-sm text-[#4A8FA8] hover:text-[#3A7A91] transition-colors"
            >
              ← Back to map
            </Link>
          </div>
        </div>

        {colleges.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 mb-4">No schools added yet.</p>
            <Link href="/map" className="text-[#4A8FA8] hover:underline text-sm">
              Go to map to add schools →
            </Link>
          </div>
        ) : (
          <>
            {/* School selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Select schools to compare ({selected.length}/4)
              </p>
              <div className="flex flex-wrap gap-2">
                {colleges.map((c) => {
                  const isSelected = compareIds.includes(c.id)
                  const isDisabled = !isSelected && compareIds.length >= 4
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCompare(c.id)}
                      disabled={isDisabled}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                        isSelected
                          ? 'border-[#4A8FA8] bg-[#4A8FA8]/10 text-[#4A8FA8]'
                          : isDisabled
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <CollegeLogo name={c.name} logoUrl={c.logoUrl} size={20} />
                      <span className="font-medium">{c.name}</span>
                      {isSelected && <span className="text-xs">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Comparison table */}
            {selected.length >= 2 ? (
              <CompareTable colleges={selected} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-400 text-sm">
                  Select at least 2 schools above to start comparing
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
