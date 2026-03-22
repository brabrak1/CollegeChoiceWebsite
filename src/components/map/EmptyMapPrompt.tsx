'use client'

import { useStore } from '@/lib/store'

export function EmptyMapPrompt() {
  const { colleges } = useStore()
  if (colleges.length > 0) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[998]">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-sm mx-4 text-center pointer-events-auto">
        <div className="text-4xl mb-3">🎓</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Where did you get in?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Search for a college above to pin it on the map and start comparing your options.
        </p>
        <p className="text-xs text-gray-400">
          Type a college name in the search box to get started
        </p>
      </div>
    </div>
  )
}
