'use client'

import { useStore } from '@/lib/store'
import { useBracket } from '@/hooks/useBracket'
import { BracketView } from '@/components/bracket/BracketView'
import { CollegeLogo } from '@/components/ui/CollegeLogo'
import Link from 'next/link'

export default function BracketPage() {
  const { colleges, bracket, bracketWinner } = useStore()
  const { initBracket, resetBracket } = useBracket()

  const active = colleges.filter((c) => c.status !== 'ELIMINATED')
  const winner = colleges.find((c) => c.id === bracketWinner)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Elimination Bracket</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {colleges.length} school{colleges.length !== 1 ? 's' : ''} · {active.length} active
            </p>
          </div>
          <div className="flex gap-3">
            {bracket && bracket.length > 0 && (
              <button
                onClick={resetBracket}
                className="text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            )}
            {active.length >= 2 && (
              <button
                onClick={initBracket}
                className="text-sm px-4 py-2 bg-[#4A8FA8] text-white rounded-lg hover:bg-[#3A7A91] transition-colors font-medium"
              >
                {bracket && bracket.length > 0 ? 'Re-seed Bracket' : 'Start Bracket'}
              </button>
            )}
            <Link
              href="/map"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              ← Map
            </Link>
          </div>
        </div>
      </div>

      {/* Winner banner */}
      {winner && (
        <div className="bg-gradient-to-r from-[#4A8FA8]/10 to-[#4A8FA8]/5 border-b border-[#4A8FA8]/20 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <span className="text-2xl">🏆</span>
            <div className="flex items-center gap-3">
              <CollegeLogo name={winner.name} logoUrl={winner.logoUrl} size={48} />
              <div>
                <p className="text-xs font-semibold text-[#4A8FA8] uppercase tracking-wider">Your Choice</p>
                <p className="text-xl font-bold text-gray-900">{winner.name}</p>
                {winner.admittedPrograms[0] && (
                  <p className="text-sm text-gray-500">{winner.admittedPrograms[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {colleges.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <p className="text-gray-500 mb-4">No schools added yet.</p>
            <Link href="/map" className="text-[#4A8FA8] hover:underline text-sm">
              Go to map to add schools →
            </Link>
          </div>
        ) : active.length < 2 ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <p className="text-gray-500">Add at least 2 active schools to run a bracket.</p>
          </div>
        ) : !bracket || bracket.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <p className="text-gray-500 mb-4">
              Ready to run a tournament with {active.length} schools?
            </p>
            <button
              onClick={initBracket}
              className="text-sm px-6 py-3 bg-[#4A8FA8] text-white rounded-xl hover:bg-[#3A7A91] transition-colors font-medium"
            >
              Start Bracket
            </button>
          </div>
        ) : (
          <BracketView rounds={bracket} />
        )}
      </div>
    </div>
  )
}
