'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { TagBadge } from '@/components/ui/Badge'
import type { CollegeEntry } from '@/types'

const PRESETS = ['Dream school', 'Safety', 'Target', 'Best aid', 'Best location', 'Top ranked']

export function TagsSection({ college }: { college: CollegeEntry }) {
  const { updateCollege } = useStore()
  const [input, setInput] = useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (!trimmed || college.tags.includes(trimmed)) return
    updateCollege(college.id, { tags: [...college.tags, trimmed] })
    setInput('')
  }

  function removeTag(tag: string) {
    updateCollege(college.id, { tags: college.tags.filter((t) => t !== tag) })
  }

  return (
    <section className="p-5 border-b border-gray-100">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Tags
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {college.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
        ))}
        {college.tags.length === 0 && (
          <span className="text-xs text-gray-400 italic">No tags yet</span>
        )}
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag(input)}
          placeholder="Add a tag…"
          className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A8FA8]"
        />
        <button
          onClick={() => addTag(input)}
          className="text-xs px-3 py-1.5 bg-[#4A8FA8] text-white rounded-lg hover:bg-[#3A7A91] transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {PRESETS.filter((p) => !college.tags.includes(p)).map((preset) => (
          <button
            key={preset}
            onClick={() => addTag(preset)}
            className="text-xs px-2 py-1 rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            + {preset}
          </button>
        ))}
      </div>
    </section>
  )
}
