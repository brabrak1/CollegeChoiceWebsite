'use client'

import { useStore } from '@/lib/store'
import type { CollegeEntry } from '@/types'
import { useCallback, useState } from 'react'

export function ClimateSection({ college }: { college: CollegeEntry }) {
  const { updateCollege } = useStore()
  const [value, setValue] = useState(college.climate ?? '')

  const handleBlur = useCallback(() => {
    updateCollege(college.id, { climate: value || undefined })
  }, [college.id, value, updateCollege])

  return (
    <section className="p-5 border-b border-gray-100">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Weather &amp; Climate
      </h3>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="e.g. Cold winters, humid summers…"
        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8FA8] focus:border-transparent"
      />
    </section>
  )
}
