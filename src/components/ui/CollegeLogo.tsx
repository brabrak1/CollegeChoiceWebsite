'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CollegeLogoProps {
  name: string
  logoUrl?: string
  size?: number
  className?: string
}

export function CollegeLogo({ name, logoUrl, size = 40, className }: CollegeLogoProps) {
  const [error, setError] = useState(false)
  const initials = name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  if (!logoUrl || error) {
    return (
      <div
        className={cn(
          'rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0',
          className
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: 'var(--color-accent)',
          fontSize: size * 0.3,
        }}
      >
        {initials || name[0]?.toUpperCase()}
      </div>
    )
  }

  return (
    <div
      className={cn('rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="object-contain w-full h-full p-1"
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  )
}
