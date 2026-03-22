'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useStore } from '@/lib/store'
import type { CollegeEntry } from '@/types'

// Fix Leaflet's broken default icon paths in Webpack/Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

function createPinIcon(status: CollegeEntry['status'], selected: boolean) {
  const colors: Record<CollegeEntry['status'], string> = {
    CONSIDERING: '#4A8FA8',
    FAVORITE: '#F59E0B',
    ELIMINATED: '#9CA3AF',
  }
  const color = colors[status]
  const size = selected ? 36 : 28
  const opacity = status === 'ELIMINATED' ? 0.5 : 1

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:2px solid rgba(255,255,255,0.9);
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        opacity:${opacity};
        ${selected ? 'box-shadow:0 0 0 3px rgba(74,143,168,0.4),0 2px 8px rgba(0,0,0,0.3);' : ''}
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    tooltipAnchor: [size / 2, -size / 2],
  })
}

function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(t)
  }, [map])
  return null
}

function FitBoundsControl({ colleges }: { colleges: CollegeEntry[] }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    if (colleges.length === 0 || fitted.current) return
    const bounds = L.latLngBounds(colleges.map((c) => [c.lat, c.lng]))
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 })
    fitted.current = true
  }, [colleges, map])

  return null
}

function ZoomToFitButton({ colleges }: { colleges: CollegeEntry[] }) {
  const map = useMap()

  function handleFit() {
    if (colleges.length === 0) return
    const bounds = L.latLngBounds(colleges.map((c) => [c.lat, c.lng]))
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 })
  }

  return (
    <div className="leaflet-bottom leaflet-right" style={{ zIndex: 999 }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleFit}
          title="Zoom to fit all schools"
          className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium"
        >
          ⊞
        </button>
      </div>
    </div>
  )
}

export default function MapInner() {
  const { colleges, selectedCollegeId, setSelectedCollege } = useStore()

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      className="z-0"
    >
      <InvalidateSizeOnMount />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {colleges.map((college) => (
        <Marker
          key={college.id}
          position={[college.lat, college.lng]}
          icon={createPinIcon(college.status, selectedCollegeId === college.id)}
          eventHandlers={{
            click: () => setSelectedCollege(college.id),
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
            <div className="text-sm font-medium">{college.name}</div>
            {college.admittedPrograms[0] && (
              <div className="text-xs text-gray-500">{college.admittedPrograms[0]}</div>
            )}
          </Tooltip>
        </Marker>
      ))}

      {colleges.length > 0 && <FitBoundsControl colleges={colleges} />}
      <ZoomToFitButton colleges={colleges} />
    </MapContainer>
  )
}
