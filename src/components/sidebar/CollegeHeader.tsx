'use client'

import { useStore } from '@/lib/store'
import { CollegeLogo } from '@/components/ui/CollegeLogo'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { CollegeEntry, CollegeStatus } from '@/types'

const STATUS_OPTIONS: { value: CollegeStatus; label: string }[] = [
  { value: 'CONSIDERING', label: 'Considering' },
  { value: 'FAVORITE', label: 'Favorite' },
  { value: 'ELIMINATED', label: 'Eliminated' },
]

export function CollegeHeader({ college }: { college: CollegeEntry }) {
  const { updateCollege, removeCollege, setSidebarOpen, toggleCompare, compareIds } = useStore()
  const isInCompare = compareIds.includes(college.id)

  return (
    <div className="p-5 border-b border-gray-100">
      <div className="flex items-start gap-4">
        <CollegeLogo name={college.name} logoUrl={college.logoUrl} size={56} />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">{college.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {college.city}, {college.state}
          </p>
          <div className="mt-2">
            <StatusBadge status={college.status} />
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Status selector */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateCollege(college.id, { status: opt.value })}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              college.status === opt.value
                ? 'border-[#4A8FA8] bg-[#4A8FA8]/10 text-[#4A8FA8] font-medium'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toggleCompare(college.id)}
          className={isInCompare ? 'border-[#4A8FA8] text-[#4A8FA8]' : ''}
        >
          {isInCompare ? '✓ Comparing' : '+ Compare'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            removeCollege(college.id)
            setSidebarOpen(false)
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
