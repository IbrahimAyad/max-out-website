// Smart Collection Routing: Enhanced filtering and URL management
// This handles smart routing for collection pages with category filters

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getMasterCollection, getSubCollectionFilters } from '@/lib/config/master-collections';

export interface SmartRouteParams {
  filter?: string;
  sort?: string;
  view?: string;
}

// Hook for managing smart collection routing
export function useSmartCollectionRouting(collectionId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current filter from URL
  const currentFilter = searchParams.get('filter') || `all-${collectionId}`;
  const currentSort = searchParams.get('sort') || 'featured';
  const currentView = searchParams.get('view') || 'grid';
  
  // Update URL with new filter
  const updateFilter = (filterId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (filterId === `all-${collectionId}`) {
      params.delete('filter');
    } else {
      params.set('filter', filterId);
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };
  
  // Update URL with new sort
  const updateSort = (sortBy: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (sortBy === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', sortBy);
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };
  
  // Get shareable URL for current view
  const getShareableUrl = () => {
    return `${window.location.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  };
  
  // Get filters for current subcollection
  const getCurrentFilters = () => {
    return getSubCollectionFilters(collectionId, currentFilter);
  };
  
  return {
    currentFilter,
    currentSort,
    currentView,
    updateFilter,
    updateSort,
    getShareableUrl,
    getCurrentFilters
  };
}

// Enhanced product filtering with multiple criteria
export function smartFilterProducts<T extends { 
  category?: string;
  subcategory?: string; 
  description?: string;
  tags?: string[];
  price: number;
}>(
  products: T[], 
  collectionId: string, 
  selectedCategory: string
): T[] {
  if (selectedCategory === `all-${collectionId}`) {
    return products;
  }
  
  const masterCollection = getMasterCollection(collectionId);
  if (!masterCollection) return products;
  
  const subCollection = masterCollection.subCollections.find(sub => sub.id === selectedCategory);
  if (!subCollection) return products;
  
  return products.filter(product => {
    let matches = false;
    
    // Tag-based filtering
    if (subCollection.filterParams.tags) {
      const tagMatch = subCollection.filterParams.tags.some(tag => 
        product.subcategory === tag || 
        product.description?.toLowerCase().includes(tag.toLowerCase()) ||
        product.category?.toLowerCase().includes(tag.toLowerCase()) ||
        product.tags?.some(productTag => productTag.toLowerCase() === tag.toLowerCase())
      );
      matches = matches || tagMatch;
    }
    
    // Category-based filtering
    if (subCollection.filterParams.categories) {
      const categoryMatch = subCollection.filterParams.categories.some(category => 
        product.category === category
      );
      matches = matches || categoryMatch;
    }
    
    // Price range filtering (for bundles/complete looks)
    if (subCollection.filterParams.priceRange) {
      const { min, max } = subCollection.filterParams.priceRange;
      const priceMatch = product.price >= min && product.price <= max;
      matches = matches && priceMatch; // AND condition for price
    }
    
    return matches;
  });
}

// Generate collection breadcrumbs for navigation
export function generateCollectionBreadcrumbs(collectionId: string, selectedCategory?: string) {
  const masterCollection = getMasterCollection(collectionId);
  if (!masterCollection) return [];
  
  const breadcrumbs = [
    { name: 'Collections', href: '/collections' },
    { name: masterCollection.name, href: masterCollection.route }
  ];
  
  if (selectedCategory && selectedCategory !== `all-${collectionId}`) {
    const subCollection = masterCollection.subCollections.find(sub => sub.id === selectedCategory);
    if (subCollection) {
      breadcrumbs.push({
        name: subCollection.name,
        href: `${masterCollection.route}?filter=${selectedCategory}`
      });
    }
  }
  
  return breadcrumbs;
}

// Get SEO-friendly meta data for filtered views
export function getCollectionSEOMeta(collectionId: string, selectedCategory?: string) {
  const masterCollection = getMasterCollection(collectionId);
  if (!masterCollection) return null;
  
  if (!selectedCategory || selectedCategory === `all-${collectionId}`) {
    return {
      title: `${masterCollection.name} | KCT Menswear`,
      description: masterCollection.description,
      canonical: masterCollection.route
    };
  }
  
  const subCollection = masterCollection.subCollections.find(sub => sub.id === selectedCategory);
  if (!subCollection) return null;
  
  return {
    title: `${subCollection.name} - ${masterCollection.name} | KCT Menswear`,
    description: `Shop ${subCollection.name.toLowerCase()} from our ${masterCollection.name.toLowerCase()}. ${masterCollection.description}`,
    canonical: `${masterCollection.route}?filter=${selectedCategory}`
  };
}

// Analytics tracking for smart filtering
export function trackSmartFilter(collectionId: string, filterId: string, productCount: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'collection_filter', {
      collection_id: collectionId,
      filter_id: filterId,
      product_count: productCount
    });
  }
}