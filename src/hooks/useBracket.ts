import { useStore } from '@/lib/store'
import { nextPowerOfTwo } from '@/lib/utils'
import type { BracketRound, BracketMatchup, CollegeEntry } from '@/types'
import { nanoid } from 'nanoid'

function buildBracketRounds(colleges: CollegeEntry[]): BracketRound[] {
  const size = nextPowerOfTwo(colleges.length)
  // Seed: sort by bracketSeed, then fill with byes
  const seeded = [...colleges].sort((a, b) => (a.bracketSeed ?? 999) - (b.bracketSeed ?? 999))
  const slots: (string | null)[] = [
    ...seeded.map((c) => c.id),
    ...Array(size - seeded.length).fill(null),
  ]

  // Build first round matchups
  const firstRoundMatchups: BracketMatchup[] = []
  for (let i = 0; i < size; i += 2) {
    firstRoundMatchups.push({
      id: nanoid(),
      collegeA: slots[i],
      collegeB: slots[i + 1],
      winner: null,
      nextMatchupId: null,
    })
  }

  const rounds: BracketRound[] = []
  let currentMatchups = firstRoundMatchups
  let roundNumber = 1

  while (currentMatchups.length >= 1) {
    rounds.push({ roundNumber, matchups: currentMatchups })
    if (currentMatchups.length === 1) break

    const nextMatchups: BracketMatchup[] = []
    for (let i = 0; i < currentMatchups.length; i += 2) {
      const nextMatchup: BracketMatchup = {
        id: nanoid(),
        collegeA: null,
        collegeB: null,
        winner: null,
        nextMatchupId: null,
      }
      nextMatchups.push(nextMatchup)
      // Link current matchups to next
      currentMatchups[i].nextMatchupId = nextMatchup.id
      if (currentMatchups[i + 1]) currentMatchups[i + 1].nextMatchupId = nextMatchup.id
    }

    currentMatchups = nextMatchups
    roundNumber++
  }

  // Auto-advance byes (where one side is null)
  for (const round of rounds) {
    for (const matchup of round.matchups) {
      if (matchup.collegeA !== null && matchup.collegeB === null) {
        matchup.winner = matchup.collegeA
      } else if (matchup.collegeB !== null && matchup.collegeA === null) {
        matchup.winner = matchup.collegeB
      }
    }
  }

  return rounds
}

export function useBracket() {
  const { colleges, bracket, setBracket, updateCollege } = useStore()

  function initBracket() {
    const active = colleges.filter((c) => c.status !== 'ELIMINATED')
    if (active.length < 2) return
    const rounds = buildBracketRounds(active)
    setBracket(rounds, null)
  }

  function advanceWinner(matchupId: string, winnerId: string) {
    if (!bracket) return

    const allMatchups = bracket.flatMap((r) => r.matchups)
    const matchup = allMatchups.find((m) => m.id === matchupId)
    if (!matchup || matchup.winner) return

    // Find loser
    const loserId = matchup.collegeA === winnerId ? matchup.collegeB : matchup.collegeA

    // Mark loser as eliminated
    if (loserId) {
      updateCollege(loserId, { status: 'ELIMINATED' })
    }

    // Update matchup winner
    const updatedRounds = bracket.map((round) => ({
      ...round,
      matchups: round.matchups.map((m) => {
        if (m.id !== matchupId) return m
        return { ...m, winner: winnerId }
      }),
    }))

    // Advance winner to next matchup
    if (matchup.nextMatchupId) {
      for (const round of updatedRounds) {
        for (const m of round.matchups) {
          if (m.id === matchup.nextMatchupId) {
            if (m.collegeA === null) {
              m.collegeA = winnerId
            } else {
              m.collegeB = winnerId
            }
          }
        }
      }
    }

    // Check if this is the final matchup
    const isFinal = !matchup.nextMatchupId
    setBracket(updatedRounds, isFinal ? winnerId : null)
  }

  function resetBracket() {
    // Un-eliminate all colleges first
    colleges.filter((c) => c.status === 'ELIMINATED').forEach((c) => {
      updateCollege(c.id, { status: 'CONSIDERING' })
    })
    setBracket([], null)
  }

  return { initBracket, advanceWinner, resetBracket }
}
