'use client'

import { BracketMatchupCard } from './BracketMatchup'
import type { BracketMatchup as BracketMatchupType, BracketRound } from '@/types'

const GAP_BASE = 16 // px — gap between matchup cards within a pair (round 1)

function getRoundName(roundNumber: number, totalRounds: number): string {
  const fromEnd = totalRounds - roundNumber
  if (fromEnd === 0) return 'Final'
  if (fromEnd === 1) return 'Semifinals'
  if (fromEnd === 2) return 'Quarterfinals'
  return `Round ${roundNumber}`
}

// Draws the classic bracket "arm" ─┐ / └─ between a pair of matchups
function PairConnector() {
  return (
    <div className="flex flex-col self-stretch w-5 flex-shrink-0">
      <div className="flex-1 border-t-2 border-r-2 border-gray-200 rounded-tr" />
      <div className="flex-1 border-b-2 border-r-2 border-gray-200 rounded-br" />
    </div>
  )
}

export function BracketView({ rounds }: { rounds: BracketRound[] }) {
  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex items-start min-w-max px-4">
        {rounds.map((round, roundIdx) => {
          const isLastRound = roundIdx === rounds.length - 1
          // Gap between cards within a pair — doubles each round
          const intraGap = GAP_BASE * Math.pow(2, roundIdx)
          // Gap between pairs — twice the intra gap
          const interGap = intraGap * 2
          // Push each round down by half an intra-gap so it centers on paired matchups
          const topPad = roundIdx > 0 ? intraGap / 2 : 0

          // Group matchups into pairs: [0,1], [2,3], …
          const pairs: [BracketMatchupType, BracketMatchupType | null][] = []
          for (let i = 0; i < round.matchups.length; i += 2) {
            pairs.push([round.matchups[i], round.matchups[i + 1] ?? null])
          }

          return (
            <div key={round.roundNumber} className="flex flex-col">
              {/* Round label */}
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4 w-52">
                {getRoundName(round.roundNumber, rounds.length)}
              </div>

              {/* Pairs column */}
              <div
                className="flex flex-col"
                style={{ gap: `${interGap}px`, paddingTop: `${topPad}px` }}
              >
                {pairs.map(([m1, m2]) => (
                  <div key={m1.id} className="flex items-stretch">
                    {/* Left stack: one or two matchup cards */}
                    <div className="flex flex-col" style={{ gap: `${intraGap}px` }}>
                      <BracketMatchupCard matchup={m1} />
                      {m2 && <BracketMatchupCard matchup={m2} />}
                    </div>

                    {/* Outgoing bracket arm (not on last round) */}
                    {!isLastRound && m2 && <PairConnector />}

                    {/* Single bye — just a horizontal stub */}
                    {!isLastRound && !m2 && (
                      <div className="w-5 flex-shrink-0 self-center border-t-2 border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
