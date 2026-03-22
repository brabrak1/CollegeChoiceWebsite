import { MapView } from '@/components/map/MapView'
import { CollegeSearch } from '@/components/map/CollegeSearch'
import { DetailSidebar } from '@/components/sidebar/DetailSidebar'
import { EmptyMapPrompt } from '@/components/map/EmptyMapPrompt'

export default function MapPage() {
  return (
    <div className="relative flex-1 overflow-hidden">
      <MapView />
      <CollegeSearch />
      <DetailSidebar />
      <EmptyMapPrompt />
    </div>
  )
}
