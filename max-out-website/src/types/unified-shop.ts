// Unified Shop Types for KCT Menswear
// Handles both individual products and bundles in a single interface

export type ProductType = 'individual' | 'bundle' | 'accessory';
export type BundleTier = 'starter' | 'professional' | 'executive' | 'premium';

// Unified product interface that works for both individual items and bundles
export interface UnifiedProduct {
  // Core identifiers
  id: string;
  sku: string;
  type: ProductType;
  
  // Display information
  name: string;
  description: string;
  imageUrl: string;
  images?: string[];
  
  // Pricing
  price: number;
  originalPrice?: number;
  bundlePrice?: number;
  savings?: number;
  stripePriceId?: string;
  
  // Bundle specific fields
  isBundle?: boolean;
  bundleTier?: BundleTier;
  bundleComponents?: {
    suit?: {
      id?: string;
      name: string;
      color: string;
      type: '2-piece' | '3-piece';
      image?: string;
    };
    shirt?: {
      id?: string;
      name: string;
      color: string;
      fit: 'Classic' | 'Slim' | 'Modern';
      image?: string;
    };
    tie?: {
      id?: string;
      name: string;
      color: string;
      style: 'Classic' | 'Skinny' | 'Slim' | 'Bowtie';
      image?: string;
    };
  };
  
  // Individual product fields
  category?: string;
  color?: string;
  size?: string[];
  material?: string;
  fit?: string;
  
  // Metadata
  occasions: string[];
  tags: string[];
  trending?: boolean;
  seasonal?: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
  aiScore?: number;
  
  // Inventory
  inStock?: boolean;
  stockLevel?: number;
  
  // SEO
  slug?: string;
  metaDescription?: string;
}

// Comprehensive filter interface
export interface UnifiedProductFilters {
  // Search
  search?: string;
  
  // Product type filters
  type?: ProductType[];
  includeIndividual?: boolean;
  includeBundles?: boolean;
  includeAccessories?: boolean;
  
  // Category filters
  category?: string[];
  
  // Bundle-specific filters
  bundleTier?: BundleTier[];
  suitColor?: string[];
  shirtColor?: string[];
  tieColor?: string[];
  suitType?: ('2-piece' | '3-piece')[];
  
  // Individual product filters
  color?: string[];
  size?: string[];
  material?: string[];
  fit?: string[];
  
  // Price filters
  minPrice?: number;
  maxPrice?: number;
  priceRanges?: Array<{ min: number; max: number }>;
  
  // Occasion filters
  occasions?: string[];
  
  // Style filters
  style?: string[];
  trending?: boolean;
  seasonal?: string[];
  
  // Sorting
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'trending' | 'newest' | 'ai-score';
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Special filters
  onSale?: boolean;
  newArrivals?: boolean;
  bestSellers?: boolean;
  
  // AI filters
  aiRecommended?: boolean;
  minAiScore?: number;
}

// Filter preset for predefined collections
export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  filters: Partial<UnifiedProductFilters>;
  displayOptions?: {
    showBundlesFirst?: boolean;
    emphasizeSavings?: boolean;
    gridLayout?: 'standard' | 'large' | 'compact';
  };
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// URL Parameter types for filter persistence
export interface FilterURLParams {
  preset?: string;
  search?: string;
  type?: string;
  category?: string;
  colors?: string;
  occasions?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  // Bundle specific
  suitColor?: string;
  shirtColor?: string;
  tieColor?: string;
  bundleTier?: string;
}

// Search result with metadata
export interface UnifiedSearchResult {
  products: UnifiedProduct[];
  totalCount: number;
  filteredCount: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    colors: Array<{ name: string; count: number; hex?: string }>;
    occasions: Array<{ name: string; count: number }>;
    sizes: Array<{ size: string; count: number }>;
    materials: Array<{ name: string; count: number }>;
    priceRanges: Array<{ label: string; min: number; max: number; count: number }>;
    bundleTiers: Array<{ tier: BundleTier; count: number; price: number }>;
  };
  appliedFilters: UnifiedProductFilters;
  suggestions?: {
    didYouMean?: string;
    relatedSearches?: string[];
    recommendedFilters?: Partial<UnifiedProductFilters>;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Bundle tier configuration
export const BUNDLE_TIERS: Record<BundleTier, { 
  price: number; 
  stripePriceId: string; 
  label: string;
  color: string;
}> = {
  starter: {
    price: 199,
    stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5',
    label: 'Starter Bundle',
    color: 'bg-slate-600'
  },
  professional: {
    price: 229,
    stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
    label: 'Professional Bundle',
    color: 'bg-rose-600'
  },
  executive: {
    price: 249,
    stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
    label: 'Executive Bundle',
    color: 'bg-burgundy-600'
  },
  premium: {
    price: 299,
    stripePriceId: 'price_1RpvfvCHc12x7sCzq1jYfG9o',
    label: 'Premium Bundle',
    color: 'bg-gold-600'
  }
};