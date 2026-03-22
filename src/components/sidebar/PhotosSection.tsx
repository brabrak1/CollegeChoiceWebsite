'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import Image from 'next/image'
import type { CollegeEntry } from '@/types'

export function PhotosSection({ college }: { college: CollegeEntry }) {
  const { updateCollege } = useStore()
  const [urlInput, setUrlInput] = useState('')

  function addPhoto() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    updateCollege(college.id, { photos: [...college.photos, trimmed] })
    setUrlInput('')
  }

  function removePhoto(url: string) {
    updateCollege(college.id, { photos: college.photos.filter((p) => p !== url) })
  }

  return (
    <section className="p-5 border-b border-gray-100">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Photos
      </h3>

      {college.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {college.photos.map((url) => (
            <div key={url} className="relative group rounded-lg overflow-hidden aspect-video bg-gray-100">
              <Image
                src={url}
                alt="Campus photo"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={() => removePhoto(url)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPhoto()}
          placeholder="Paste photo URL…"
          className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A8FA8]"
        />
        <button
          onClick={addPhoto}
          className="text-xs px-3 py-1.5 bg-[#4A8FA8] text-white rounded-lg hover:bg-[#3A7A91] transition-colors"
        >
          Add
        </button>
      </div>
    </section>
  )
}
