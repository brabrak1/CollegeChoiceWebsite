'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/map', label: 'Map' },
  { href: '/compare', label: 'Compare' },
  { href: '/bracket', label: 'Bracket' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  return (
    <nav
      className="h-16 flex items-center justify-between px-6 z-50 relative"
      style={{ backgroundColor: 'var(--color-nav)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          CC
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">CollegeChoice</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3">
        {status === 'loading' ? (
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
        ) : session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  {(session.user.name ?? session.user.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm hidden md:block">{session.user.name ?? session.user.email}</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-md text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
