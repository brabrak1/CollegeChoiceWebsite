'use client'

import { useStore } from '@/lib/store'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { CollegeEntry } from '@/types'

function NumericField({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string
  value?: number
  onChange: (val: number | undefined) => void
  prefix?: string
  suffix?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#4A8FA8] focus-within:border-transparent">
        {prefix && <span className="px-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 h-full flex items-center py-2">{prefix}</span>}
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
          className="flex-1 px-3 py-2 text-sm focus:outline-none bg-white"
          placeholder="—"
        />
        {suffix && <span className="px-2 text-sm text-gray-400 bg-gray-50 border-l border-gray-200 h-full flex items-center py-2">{suffix}</span>}
      </div>
    </div>
  )
}

export function FinancialSection({ college }: { college: CollegeEntry }) {
  const { updateCollege } = useStore()
  const netCost =
    college.tuition != null && college.financialAid != null
      ? college.tuition - college.financialAid
      : undefined

  return (
    <section className="p-5 border-b border-gray-100">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Finances
      </h3>

      <div className="space-y-3">
        <NumericField
          label="Sticker Tuition (annual)"
          value={college.tuition}
          onChange={(val) => updateCollege(college.id, { tuition: val })}
          prefix="$"
        />
        <NumericField
          label="Financial Aid Offered"
          value={college.financialAid}
          onChange={(val) => updateCollege(college.id, { financialAid: val })}
          prefix="$"
        />
      </div>

      {netCost != null && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Net Cost</span>
            <span className={`text-sm font-semibold ${netCost <= 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {netCost <= 0 ? `${formatCurrency(Math.abs(netCost))} refund` : formatCurrency(netCost)}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-xs text-gray-400 block">Avg Tuition (school)</span>
          <span className="text-gray-700">{formatCurrency(college.avgTuition)}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block">Enrollment</span>
          <span className="text-gray-700">{formatNumber(college.enrollmentSize)}</span>
        </div>
        {college.distanceFromHome != null && (
          <div>
            <span className="text-xs text-gray-400 block">Distance from Home</span>
            <span className="text-gray-700">{Math.round(college.distanceFromHome).toLocaleString()} mi</span>
          </div>
        )}
      </div>
    </section>
  )
}
