'use client'

import { CollegeLogo } from '@/components/ui/CollegeLogo'
import { StatusBadge, TagBadge } from '@/components/ui/Badge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { getNumericHighlight, HighlightCell } from './DiffHighlight'
import type { CollegeEntry } from '@/types'

interface CompareTableProps {
  colleges: CollegeEntry[]
}

function RowLabel({ label }: { label: string }) {
  return (
    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4 bg-gray-50 border-r border-gray-100">
      {label}
    </div>
  )
}

export function CompareTable({ colleges }: CompareTableProps) {
  const tuitions = colleges.map((c) => c.tuition)
  const aids = colleges.map((c) => c.financialAid)
  const nets = colleges.map((c) =>
    c.tuition != null && c.financialAid != null ? c.tuition - c.financialAid : undefined
  )
  const distances = colleges.map((c) => c.distanceFromHome)
  const enrollments = colleges.map((c) => c.enrollmentSize)

  const cols = `grid-cols-[160px_repeat(${colleges.length},1fr)]`

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header row */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <div className="bg-gray-50 border-r border-gray-100" />
        {colleges.map((c) => (
          <div key={c.id} className="p-4 text-center border-r border-gray-100 last:border-0">
            <div className="flex flex-col items-center gap-2">
              <CollegeLogo name={c.name} logoUrl={c.logoUrl} size={48} />
              <div>
                <div className="font-semibold text-sm text-gray-900 leading-tight">{c.name}</div>
                <div className="text-xs text-gray-400">{c.city}, {c.state}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Admitted Programs */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Programs" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 border-r border-gray-100 last:border-0">
            {c.admittedPrograms.length > 0 ? (
              <ul className="space-y-1">
                {c.admittedPrograms.map((p, i) => (
                  <li key={i} className="text-xs text-gray-700">{p}</li>
                ))}
              </ul>
            ) : (
              <span className="text-xs text-gray-400 italic">—</span>
            )}
          </div>
        ))}
      </div>

      {/* Tuition */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Tuition" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 text-sm text-center border-r border-gray-100 last:border-0">
            <HighlightCell highlight={getNumericHighlight(tuitions, c.tuition)}>
              {formatCurrency(c.tuition)}
            </HighlightCell>
          </div>
        ))}
      </div>

      {/* Financial Aid */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Aid Offered" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 text-sm text-center border-r border-gray-100 last:border-0">
            <HighlightCell highlight={getNumericHighlight(aids, c.financialAid, false)}>
              {formatCurrency(c.financialAid)}
            </HighlightCell>
          </div>
        ))}
      </div>

      {/* Net Cost */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Net Cost" />
        {colleges.map((c) => {
          const net = c.tuition != null && c.financialAid != null ? c.tuition - c.financialAid : undefined
          return (
            <div key={c.id} className="p-3 text-sm text-center border-r border-gray-100 last:border-0">
              <HighlightCell highlight={getNumericHighlight(nets, net)}>
                {formatCurrency(net)}
              </HighlightCell>
            </div>
          )
        })}
      </div>

      {/* Distance */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Distance" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 text-sm text-center border-r border-gray-100 last:border-0">
            {c.distanceFromHome != null ? `${Math.round(c.distanceFromHome).toLocaleString()} mi` : '—'}
          </div>
        ))}
      </div>

      {/* Enrollment */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Enrollment" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 text-sm text-center border-r border-gray-100 last:border-0">
            <HighlightCell highlight={getNumericHighlight(enrollments, c.enrollmentSize, false)}>
              {formatNumber(c.enrollmentSize)}
            </HighlightCell>
          </div>
        ))}
      </div>

      {/* Climate */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Climate" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 text-xs text-gray-600 text-center border-r border-gray-100 last:border-0">
            {c.climate ?? <span className="text-gray-400 italic">—</span>}
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Tags" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 border-r border-gray-100 last:border-0">
            <div className="flex flex-wrap gap-1 justify-center">
              {c.tags.map((t) => <TagBadge key={t} tag={t} />)}
              {c.tags.length === 0 && <span className="text-xs text-gray-400 italic">—</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Pros */}
      <div className={`grid ${cols} border-b border-gray-100`}>
        <RowLabel label="Pros" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 border-r border-gray-100 last:border-0">
            {c.pros.length > 0 ? (
              <ul className="space-y-1">
                {c.pros.map((p) => (
                  <li key={p.id} className="text-xs text-green-700 flex items-start gap-1">
                    <span className="text-green-400 mt-0.5">+</span> {p.text}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-xs text-gray-400 italic">—</span>
            )}
          </div>
        ))}
      </div>

      {/* Cons */}
      <div className={`grid ${cols}`}>
        <RowLabel label="Cons" />
        {colleges.map((c) => (
          <div key={c.id} className="p-3 border-r border-gray-100 last:border-0">
            {c.cons.length > 0 ? (
              <ul className="space-y-1">
                {c.cons.map((con) => (
                  <li key={con.id} className="text-xs text-red-600 flex items-start gap-1">
                    <span className="text-red-400 mt-0.5">−</span> {con.text}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-xs text-gray-400 italic">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
