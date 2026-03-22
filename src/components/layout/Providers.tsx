'use client'

import { SessionProvider } from 'next-auth/react'
import { StoreInitializer } from './StoreInitializer'
import { MigrationHandler } from './MigrationHandler'
import type { Session } from 'next-auth'

interface ProvidersProps {
  children: React.ReactNode
  session: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <StoreInitializer />
      <MigrationHandler />
      {children}
    </SessionProvider>
  )
}
