'use client'

import { useStore } from '@/lib/store'
import { CollegeHeader } from './CollegeHeader'
import { AdmissionSection } from './AdmissionSection'
import { FinancialSection } from './FinancialSection'
import { ProsConsSection } from './ProsConsSection'
import { NotesSection } from './NotesSection'
import { TagsSection } from './TagsSection'
import { PhotosSection } from './PhotosSection'
import { ClimateSection } from './ClimateSection'

export function DetailSidebar() {
  const { isSidebarOpen, selectedCollegeId, colleges } = useStore()
  const college = colleges.find((c) => c.id === selectedCollegeId)

  return (
    <aside
      className={`absolute top-0 right-0 h-full bg-white shadow-2xl overflow-y-auto z-[1000] transform transition-transform duration-300 ease-in-out`}
      style={{
        width: 'var(--sidebar-width)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      {college ? (
        <div key={college.id}>
          <CollegeHeader college={college} />
          <AdmissionSection college={college} />
          <FinancialSection college={college} />
          <ProsConsSection college={college} />
          <ClimateSection college={college} />
          <TagsSection college={college} />
          <PhotosSection college={college} />
          <NotesSection college={college} />
          <div className="h-24" /> {/* bottom padding for guest banner */}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-400">Select a school on the map</p>
        </div>
      )}
    </aside>
  )
}
