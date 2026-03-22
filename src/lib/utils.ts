import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClearbitLogoUrl(websiteUrl?: string): string | undefined {
  if (!websiteUrl) return undefined
  try {
    const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`)
    const domain = url.hostname.replace(/^www\./, '')
    return `https://logo.clearbit.com/${domain}`
  } catch {
    return undefined
  }
}

export function formatCurrency(amount?: number): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export function formatNumber(n?: number): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatDistance(miles?: number): string {
  if (miles == null) return '—'
  return `${Math.round(miles).toLocaleString()} mi`
}

export function calcDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function nextPowerOfTwo(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}
