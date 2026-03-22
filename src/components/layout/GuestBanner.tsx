'use client'

import { useSession, signIn } from 'next-auth/react'

export function GuestBanner() {
  const { status } = useSession()
  if (status !== 'unauthenticated') return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 text-sm border-t"
      style={{
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
      }}
    >
      <p className="text-amber-800">
        You&apos;re in guest mode — your data will be lost when you close this tab.
      </p>
      <button
        onClick={() => signIn()}
        className="ml-4 font-medium text-amber-900 underline hover:no-underline whitespace-nowrap"
      >
        Save your progress →
      </button>
    </div>
  )
}
