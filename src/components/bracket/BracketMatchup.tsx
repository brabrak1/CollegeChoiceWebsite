'use client'

import { useStore } from '@/lib/store'
import { BracketSlot } from './BracketSlot'
import { useBracket } from '@/hooks/useBracket'
import type { BracketMatchup as BracketMatchupType } from '@/types'

interface Props {
  matchup: BracketMatchupType
}

export function BracketMatchupCard({ matchup }: Props) {
  const { colleges } = useStore()
  const { advanceWinner } = useBracket()

  const collegeA = colleges.find((c) => c.id === matchup.collegeA)
  const collegeB = colleges.find((c) => c.id === matchup.collegeB)

  const bothFilled = matchup.collegeA !== null && matchup.collegeB !== null
  const canPick = bothFilled && !matchup.winner

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden shadow-sm w-48 flex-shrink-0 ${
        matchup.winner ? 'border-[#4A8FA8]/30' : 'border-gray-200'
      }`}
    >
      <BracketSlot
        college={collegeA}
        isWinner={matchup.winner === matchup.collegeA}
        isEliminated={matchup.winner !== null && matchup.winner !== matchup.collegeA}
        onPick={() => matchup.collegeA && advanceWinner(matchup.id, matchup.collegeA)}
        canPick={canPick}
      />
      <div className="h-px bg-gray-100" />
      <BracketSlot
        college={collegeB}
        isWinner={matchup.winner === matchup.collegeB}
        isEliminated={matchup.winner !== null && matchup.winner !== matchup.collegeB}
        onPick={() => matchup.collegeB && advanceWinner(matchup.id, matchup.collegeB)}
        canPick={canPick}
      />
      {canPick && (
        <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">Pick a winner</p>
        </div>
      )}
    </div>
  )
}
