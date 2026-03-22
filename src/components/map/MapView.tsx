'use client'

import dynamic from 'next/dynamic'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#4A8FA8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading map…</p>
      </div>
    </div>
  ),
})

export function MapView() {
  return (
    <div className="relative w-full h-full">
      <MapInner />
    </div>
  )
}
