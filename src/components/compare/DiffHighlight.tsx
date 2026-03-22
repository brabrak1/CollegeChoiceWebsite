export function getNumericHighlight(
  allValues: (number | undefined)[],
  current: number | undefined,
  lowerIsBetter = true
): 'best' | 'worst' | 'neutral' {
  const defined = allValues.filter((v): v is number => v != null)
  if (current == null || defined.length < 2) return 'neutral'

  const best = lowerIsBetter ? Math.min(...defined) : Math.max(...defined)
  const worst = lowerIsBetter ? Math.max(...defined) : Math.min(...defined)

  if (current === best) return 'best'
  if (current === worst) return 'worst'
  return 'neutral'
}

export function HighlightCell({
  highlight,
  children,
}: {
  highlight: 'best' | 'worst' | 'neutral'
  children: React.ReactNode
}) {
  const cls =
    highlight === 'best'
      ? 'bg-green-50 text-green-800'
      : highlight === 'worst'
      ? 'bg-red-50 text-red-700'
      : ''

  return <span className={`inline-block px-1 rounded ${cls}`}>{children}</span>
}
