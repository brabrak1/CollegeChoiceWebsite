'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useStore } from '@/lib/store'

export function StoreInitializer() {
  const { status } = useSession()
  const { setIsGuest, loadFromStorage, loadFromServer } = useStore()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated') {
      setIsGuest(false)
      loadFromServer()
    } else {
      setIsGuest(true)
      loadFromStorage()
    }
  }, [status, setIsGuest, loadFromStorage, loadFromServer])

  return null
}
