'use client'

import { useSession } from 'next-auth/react'
import { useStore } from '@/lib/store'
import { useState } from 'react'
import { calcDistanceMiles } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const { colleges, updateCollege } = useStore()

  const [homeAddress, setHomeAddress] = useState('')
  const [homeLat, setHomeLat] = useState('')
  const [homeLng, setHomeLng] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (status === 'unauthenticated') {
    redirect('/login')
  }

  if (status === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4A8FA8] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  async function saveSettings() {
    const lat = parseFloat(homeLat)
    const lng = parseFloat(homeLng)
    if (!homeAddress || isNaN(lat) || isNaN(lng)) return

    setSaving(true)

    // Update distance for all colleges
    colleges.forEach((c) => {
      const dist = calcDistanceMiles(lat, lng, c.lat, c.lng)
      updateCollege(c.id, { distanceFromHome: Math.round(dist) })
    })

    // Save to server
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeAddress, homeLat: lat, homeLng: lng }),
      })
    } catch {
      // Non-critical
    }

    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Account info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 block mb-1">Name</span>
              <span className="text-sm text-gray-900">{session?.user.name ?? '—'}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">Email</span>
              <span className="text-sm text-gray-900">{session?.user.email}</span>
            </div>
          </div>
        </div>

        {/* Home address */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Home Location</h2>
          <p className="text-xs text-gray-400 mb-4">
            Used to calculate distance to each school. Enter your home city or zip code coordinates.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Home city / address</label>
              <input
                type="text"
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                placeholder="e.g. Chicago, IL"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8FA8]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                <input
                  type="number"
                  value={homeLat}
                  onChange={(e) => setHomeLat(e.target.value)}
                  placeholder="41.8781"
                  step="any"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8FA8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                <input
                  type="number"
                  value={homeLng}
                  onChange={(e) => setHomeLng(e.target.value)}
                  placeholder="-87.6298"
                  step="any"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8FA8]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Tip: Find your coordinates at{' '}
              <a
                href="https://www.latlong.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A8FA8] hover:underline"
              >
                latlong.net
              </a>
            </p>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving || !homeAddress || !homeLat || !homeLng}
            className="mt-4 px-5 py-2.5 bg-[#4A8FA8] text-white text-sm font-medium rounded-xl hover:bg-[#3A7A91] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save & Update Distances'}
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Schools</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{colleges.length}</div>
              <div className="text-xs text-gray-400 mt-1">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F59E0B]">
                {colleges.filter((c) => c.status === 'FAVORITE').length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Favorites</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {colleges.filter((c) => c.status === 'ELIMINATED').length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Eliminated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
