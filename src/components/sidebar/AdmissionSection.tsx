'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import type { CollegeEntry } from '@/types'

export function AdmissionSection({ college }: { college: CollegeEntry }) {
  const { updateCollege } = useStore()
  const [newProgram, setNewProgram] = useState('')

  function addProgram() {
    const trimmed = newProgram.trim()
    if (!trimmed) return
    updateCollege(college.id, { admittedPrograms: [...college.admittedPrograms, trimmed] })
    setNewProgram('')
  }

  function removeProgram(idx: number) {
    const updated = college.admittedPrograms.filter((_, i) => i !== idx)
    updateCollege(college.id, { admittedPrograms: updated })
  }

  return (
    <section className="p-5 border-b border-gray-100">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Admitted Programs
      </h3>

      {college.admittedPrograms.length > 0 ? (
        <ul className="space-y-1.5 mb-3">
          {college.admittedPrograms.map((prog, idx) => (
            <li key={idx} className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-800">{prog}</span>
              <button
                onClick={() => removeProgram(idx)}
                className="text-gray-300 hover:text-red-400 transition-colors text-xs flex-shrink-0"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 italic mb-3">No programs added yet</p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newProgram}
          onChange={(e) => setNewProgram(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addProgram()}
          placeholder="e.g. College of Engineering — CS"
          className="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8FA8] focus:border-transparent"
        />
        <button
          onClick={addProgram}
          className="text-sm px-3 py-1.5 bg-[#4A8FA8] text-white rounded-lg hover:bg-[#3A7A91] transition-colors"
        >
          Add
        </button>
      </div>
    </section>
  )
}
