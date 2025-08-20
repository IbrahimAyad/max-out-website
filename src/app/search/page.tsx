import { Suspense } from 'react'
import SearchPageContent from './SearchPageContent'

// Loading component for search page
function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse text-center space-y-4">
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-96 mx-auto"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  )
}
