import { UnifiedProductFilters, FilterURLParams } from '@/types/unified-shop';
import { getFilterPreset } from '@/lib/config/filter-presets';

/**
 * Convert URL parameters to UnifiedProductFilters
 */
export function urlParamsToFilters(params: URLSearchParams): UnifiedProductFilters {
  const filters: UnifiedProductFilters = {};
  
  // Check for preset first
  const presetId = params.get('preset');
  if (presetId) {
    const preset = getFilterPreset(presetId);
    if (preset) {
      // Start with preset filters as base
      Object.assign(filters, preset.filters);
    }
  }
  
  // Override/add individual filters from URL
  
  // Search
  const search = params.get('search');
  if (search) filters.search = search;
  
  // Product types
  const type = params.get('type');
  if (type) filters.type = type.split(',') as any;
  
  const includeBundles = params.get('includeBundles');
  if (includeBundles) filters.includeBundles = includeBundles === 'true';
  
  const includeIndividual = params.get('includeIndividual');
  if (includeIndividual) filters.includeIndividual = includeIndividual === 'true';
  
  // Categories
  const category = params.get('category');
  if (category) filters.category = category.split(',');
  
  // Colors
  const colors = params.get('colors');
  if (colors) filters.color = colors.split(',');
  
  // Bundle-specific colors
  const suitColor = params.get('suitColor');
  if (suitColor) filters.suitColor = suitColor.split(',');
  
  const shirtColor = params.get('shirtColor');
  if (shirtColor) filters.shirtColor = shirtColor.split(',');
  
  const tieColor = params.get('tieColor');
  if (tieColor) filters.tieColor = tieColor.split(',');
  
  // Bundle tier
  const bundleTier = params.get('bundleTier');
  if (bundleTier) filters.bundleTier = bundleTier.split(',') as any;
  
  // Occasions
  const occasions = params.get('occasions');
  if (occasions) filters.occasions = occasions.split(',');
  
  // Price
  const minPrice = params.get('minPrice');
  if (minPrice) filters.minPrice = parseFloat(minPrice);
  
  const maxPrice = params.get('maxPrice');
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
  
  // Special filters
  const trending = params.get('trending');
  if (trending) filters.trending = trending === 'true';
  
  const onSale = params.get('onSale');
  if (onSale) filters.onSale = onSale === 'true';
  
  const newArrivals = params.get('newArrivals');
  if (newArrivals) filters.newArrivals = newArrivals === 'true';
  
  // Sorting
  const sort = params.get('sort');
  if (sort) filters.sortBy = sort as any;
  
  // Pagination
  const page = params.get('page');
  if (page) filters.page = parseInt(page);
  
  const limit = params.get('limit');
  if (limit) filters.limit = parseInt(limit);
  
  // Material
  const material = params.get('material');
  if (material) filters.material = material.split(',');
  
  // Fit
  const fit = params.get('fit');
  if (fit) filters.fit = fit.split(',');
  
  // Seasonal
  const seasonal = params.get('seasonal');
  if (seasonal) filters.seasonal = seasonal.split(',');
  
  return filters;
}

/**
 * Convert UnifiedProductFilters to URL parameters
 */
export function filtersToUrlParams(filters: UnifiedProductFilters): URLSearchParams {
  const params = new URLSearchParams();
  
  // Don't include preset in URL if filters have been modified
  // This prevents confusion when filters diverge from preset
  
  if (filters.search) params.set('search', filters.search);
  
  if (filters.type?.length) params.set('type', filters.type.join(','));
  if (filters.includeBundles !== undefined) params.set('includeBundles', filters.includeBundles.toString());
  if (filters.includeIndividual !== undefined) params.set('includeIndividual', filters.includeIndividual.toString());
  
  if (filters.category?.length) params.set('category', filters.category.join(','));
  
  if (filters.color?.length) params.set('colors', filters.color.join(','));
  if (filters.suitColor?.length) params.set('suitColor', filters.suitColor.join(','));
  if (filters.shirtColor?.length) params.set('shirtColor', filters.shirtColor.join(','));
  if (filters.tieColor?.length) params.set('tieColor', filters.tieColor.join(','));
  
  if (filters.bundleTier?.length) params.set('bundleTier', filters.bundleTier.join(','));
  
  if (filters.occasions?.length) params.set('occasions', filters.occasions.join(','));
  
  if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
  
  if (filters.trending !== undefined) params.set('trending', filters.trending.toString());
  if (filters.onSale !== undefined) params.set('onSale', filters.onSale.toString());
  if (filters.newArrivals !== undefined) params.set('newArrivals', filters.newArrivals.toString());
  
  if (filters.material?.length) params.set('material', filters.material.join(','));
  if (filters.fit?.length) params.set('fit', filters.fit.join(','));
  if (filters.seasonal?.length) params.set('seasonal', filters.seasonal.join(','));
  
  if (filters.sortBy) params.set('sort', filters.sortBy);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  
  return params;
}

/**
 * Update browser URL without page reload
 */
export function updateUrlWithFilters(filters: UnifiedProductFilters, preset?: string) {
  const params = filtersToUrlParams(filters);
  
  // Add preset if specified
  if (preset) {
    params.set('preset', preset);
  }
  
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.pushState({}, '', newUrl);
}

/**
 * Generate shareable link for current filters
 */
export function generateShareableLink(filters: UnifiedProductFilters, preset?: string): string {
  const params = filtersToUrlParams(filters);
  
  if (preset) {
    params.set('preset', preset);
  }
  
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/products`
    : 'https://kct-menswear.com/products';
    
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Check if current filters match a preset
 */
export function matchesPreset(currentFilters: UnifiedProductFilters, presetId: string): boolean {
  const preset = getFilterPreset(presetId);
  if (!preset) return false;
  
  // Check if all preset filters are present in current filters
  for (const [key, value] of Object.entries(preset.filters)) {
    const currentValue = currentFilters[key as keyof UnifiedProductFilters];
    
    if (Array.isArray(value)) {
      if (!Array.isArray(currentValue)) return false;
      if (value.length !== currentValue.length) return false;
      if (!value.every(v => currentValue.includes(v))) return false;
    } else {
      if (currentValue !== value) return false;
    }
  }
  
  return true;
}

/**
 * Get active preset if filters match
 */
export function getActivePreset(filters: UnifiedProductFilters): string | null {
  const presetIds = ['black-tie', 'wedding-guest', 'business-professional', 'prom-special', 
                     'all-black', 'navy-collection', 'complete-looks-199', 'premium-bundles'];
  
  for (const presetId of presetIds) {
    if (matchesPreset(filters, presetId)) {
      return presetId;
    }
  }
  
  return null;
}

/**
 * Parse and validate bundle tier from string
 */
export function parseBundleTier(tier: string): 'starter' | 'professional' | 'executive' | 'premium' | null {
  const validTiers = ['starter', 'professional', 'executive', 'premium'];
  return validTiers.includes(tier) ? tier as any : null;
}

/**
 * Format filter display names
 */
export function formatFilterDisplay(key: string, value: any): string {
  const formatters: Record<string, (v: any) => string> = {
    bundleTier: (v) => {
      const tierNames = {
        starter: 'Starter ($199)',
        professional: 'Professional ($229)',
        executive: 'Executive ($249)',
        premium: 'Premium ($299)'
      };
      return tierNames[v] || v;
    },
    suitColor: (v) => `Suit: ${v}`,
    shirtColor: (v) => `Shirt: ${v}`,
    tieColor: (v) => `Tie: ${v}`,
    minPrice: (v) => `From $${v}`,
    maxPrice: (v) => `Up to $${v}`,
    occasions: (v) => v,
    category: (v) => v.charAt(0).toUpperCase() + v.slice(1),
    color: (v) => v.charAt(0).toUpperCase() + v.slice(1)
  };
  
  const formatter = formatters[key];
  return formatter ? formatter(value) : value.toString();
}