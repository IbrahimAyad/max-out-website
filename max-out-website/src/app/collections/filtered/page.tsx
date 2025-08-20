'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DynamicMasterCollection } from '@/components/collections/DynamicMasterCollection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function FilteredCollectionContent() {
  const searchParams = useSearchParams();
  
  // Parse filters from URL
  const category = searchParams.get('category');
  const tags = searchParams.get('tags')?.split(',');
  const occasions = searchParams.get('occasions')?.split(',');
  
  // Build initial filters
  const initialFilters = {
    ...(category && { categories: [category] }),
    ...(tags && { tags }),
    ...(occasions && { occasions })
  };

  // Determine collection name for display
  const getCollectionName = () => {
    if (category) return category.charAt(0).toUpperCase() + category.slice(1);
    if (tags?.[0]) return tags[0].split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    if (occasions?.[0]) return occasions[0].charAt(0).toUpperCase() + occasions[0].slice(1);
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href="/collections/overview" 
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Collections
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{getCollectionName()}</span>
          </nav>
        </div>
      </div>

      {/* Collection Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getCollectionName()} Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {category === 'suits' && 'Discover our premium collection of men\'s suits for every occasion'}
            {category === 'shirts' && 'Elegant dress shirts crafted from the finest materials'}
            {category === 'accessories' && 'Complete your look with our curated accessories'}
            {tags?.includes('velvet') && 'Luxurious velvet blazers for special occasions'}
            {occasions?.includes('wedding') && 'Perfect attire for wedding celebrations'}
            {occasions?.includes('prom') && 'Stand out at prom with our exclusive 2025 collection'}
            {occasions?.includes('business') && 'Professional attire for the modern businessman'}
            {!category && !tags?.length && !occasions?.length && 'Browse our complete collection of premium menswear'}
          </p>
        </div>
      </div>

      {/* Dynamic Collection Component with Filters */}
      <DynamicMasterCollection initialFilters={initialFilters} />
    </div>
  );
}

export default function FilteredCollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    }>
      <FilteredCollectionContent />
    </Suspense>
  );
}