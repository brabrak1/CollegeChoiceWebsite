import { cn } from '@/lib/utils'
import type { CollegeStatus } from '@/types'

const statusConfig: Record<CollegeStatus, { label: string; className: string }> = {
  CONSIDERING: {
    label: 'Considering',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  FAVORITE: {
    label: 'Favorite',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  ELIMINATED: {
    label: 'Eliminated',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  },
}

export function StatusBadge({ status }: { status: CollegeStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}

export function TagBadge({
  tag,
  onRemove,
  color,
}: {
  tag: string
  onRemove?: () => void
  color?: string
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
      style={
        color
          ? { backgroundColor: `${color}20`, color, borderColor: `${color}40` }
          : { backgroundColor: '#E5E7EB', color: '#374151', borderColor: '#D1D5DB' }
      }
    >
      {tag}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 ml-0.5 leading-none">
          ×
        </button>
      )}
    </span>
  )
}
