'use client'

import { CollegeLogo } from '@/components/ui/CollegeLogo'
import type { CollegeEntry } from '@/types'

interface BracketSlotProps {
  college: CollegeEntry | undefined
  isWinner: boolean
  isEliminated: boolean
  onPick: () => void
  canPick: boolean
}

export function BracketSlot({ college, isWinner, isEliminated, onPick, canPick }: BracketSlotProps) {
  if (!college) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 min-h-[48px]">
        <div className="w-6 h-6 rounded bg-gray-100 flex-shrink-0" />
        <span className="text-xs text-gray-300 italic">Bye</span>
      </div>
    )
  }

  return (
    <button
      onClick={onPick}
      disabled={!canPick || !!isWinner}
      className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all min-h-[48px] ${
        isWinner
          ? 'bg-[#4A8FA8]/10'
          : isEliminated
          ? 'opacity-40'
          : canPick
          ? 'hover:bg-gray-50 cursor-pointer'
          : 'cursor-default'
      }`}
    >
      <CollegeLogo name={college.name} logoUrl={college.logoUrl} size={24} />
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium truncate ${isWinner ? 'text-[#4A8FA8]' : 'text-gray-800'}`}>
          {college.name}
        </div>
      </div>
      {isWinner && (
        <span className="text-[#4A8FA8] text-xs flex-shrink-0">✓</span>
      )}
    </button>
  )
}
