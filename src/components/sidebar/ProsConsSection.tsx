'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import type { CollegeEntry, ProsCons } from '@/types'
import { nanoid } from 'nanoid'

function ProsConsList({
  items,
  type,
  collegeId,
  onAdd,
  onRemove,
}: {
  items: ProsCons[]
  type: 'pros' | 'cons'
  collegeId: string
  onAdd: (text: string) => void
  onRemove: (id: string) => void
}) {
  const [text, setText] = useState('')
  const isPros = type === 'pros'

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold ${isPros ? 'bg-green-500' : 'bg-red-400'}`}>
          {isPros ? '+' : '−'}
        </span>
        <h4 className={`text-xs font-semibold uppercase tracking-wide ${isPros ? 'text-green-700' : 'text-red-600'}`}>
          {isPros ? 'Pros' : 'Cons'}
        </h4>
      </div>

      <ul className="space-y-1 mb-2 min-h-[2rem]">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2 group">
            <span className="text-sm text-gray-700 flex-1 leading-snug">{item.text}</span>
            <button
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs flex-shrink-0 mt-0.5"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-1.5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              onAdd(text.trim())
              setText('')
            }
          }}
          placeholder={`Add a ${type === 'pros' ? 'pro' : 'con'}…`}
          className="flex-1 text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A8FA8]"
        />
        <button
          onClick={() => {
            if (text.trim()) {
              onAdd(text.trim())
              setText('')
            }
          }}
          className={`text-xs px-2 py-1 rounded-lg text-white transition-colors ${isPros ? 'bg-green-500 hover:bg-green-600' : 'bg-red-400 hover:bg-red-500'}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function ProsConsSection({ college }: { college: CollegeEntry }) {
  const { updateCollege } = useStore()

  function addItem(type: 'pros' | 'cons', text: string) {
    const newItem: ProsCons = { id: nanoid(), text }
    updateCollege(college.id, { [type]: [...college[type], newItem] })
  }

  function removeItem(type: 'pros' | 'cons', id: string) {
    updateCollege(college.id, { [type]: college[type].filter((i) => i.id !== id) })
  }

  return (
    <section className="p-5 border-b border-gray-100">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Pros &amp; Cons
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <ProsConsList
          items={college.pros}
          type="pros"
          collegeId={college.id}
          onAdd={(t) => addItem('pros', t)}
          onRemove={(id) => removeItem('pros', id)}
        />
        <ProsConsList
          items={college.cons}
          type="cons"
          collegeId={college.id}
          onAdd={(t) => addItem('cons', t)}
          onRemove={(id) => removeItem('cons', id)}
        />
      </div>
    </section>
  )
}
