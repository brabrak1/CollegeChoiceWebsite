'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { loadGuestData, clearGuestData, migrateGuestToAccount } from '@/lib/guest-storage'
import { useStore } from '@/lib/store'

export function MigrationHandler() {
  const { status } = useSession()
  const { loadFromServer } = useStore()
  const migrated = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated' || migrated.current) return

    const guestData = loadGuestData()
    if (guestData.length === 0) return

    migrated.current = true
    migrateGuestToAccount(guestData)
      .then(() => {
        clearGuestData()
        return loadFromServer()
      })
      .catch(console.error)
  }, [status, loadFromServer])

  return null
}
