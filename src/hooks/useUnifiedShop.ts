import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UnifiedProduct, UnifiedProductFilters, UnifiedSearchResult } from '@/types/unified-shop';
import { urlParamsToFilters, filtersToUrlParams, updateUrlWithFilters } from '@/lib/utils/url-filters';
import { getFilterPreset } from '@/lib/config/filter-presets';
import { useDebounce } from '@/hooks/useDebounce';

interface UseUnifiedShopOptions {
  initialFilters?: Partial<UnifiedProductFilters>;
  autoFetch?: boolean;
  debounceDelay?: number;
}

interface UseUnifiedShopReturn {
  // Data
  products: UnifiedProduct[];
  loading: boolean;
  error: string | null;
  
  // Metadata
  totalCount: number;
  filteredCount: number;
  facets: UnifiedSearchResult['facets'];
  suggestions: UnifiedSearchResult['suggestions'];
  pagination: UnifiedSearchResult['pagination'];
  presetMetadata: any;
  
  // Filters
  filters: UnifiedProductFilters;
  activePreset: string | null;
  
  // Actions
  updateFilters: (newFilters: Partial<UnifiedProductFilters>) => void;
  resetFilters: () => void;
  applyPreset: (presetId: string) => void;
  clearPreset: () => void;
  toggleFilter: (key: keyof UnifiedProductFilters, value: any) => void;
  search: (query: string) => void;
  setPage: (page: number) => void;
  setSortBy: (sort: UnifiedProductFilters['sortBy']) => void;
  
  // Utilities
  isFilterActive: (key: keyof UnifiedProductFilters, value: any) => boolean;
  getShareableLink: () => string;
  refreshProducts: () => Promise<void>;
}

export function useUnifiedShop(options: UseUnifiedShopOptions = {}): UseUnifiedShopReturn {
  const {
    initialFilters = {},
    autoFetch = true,
    debounceDelay = 300
  } = options;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [facets, setFacets] = useState<UnifiedSearchResult['facets']>({
    categories: [],
    colors: [],
    occasions: [],
    priceRanges: [],
    bundleTiers: []
  });
  const [suggestions, setSuggestions] = useState<UnifiedSearchResult['suggestions']>();
  const [pagination, setPagination] = useState<UnifiedSearchResult['pagination']>({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [presetMetadata, setPresetMetadata] = useState<any>(null);
  
  // Parse filters from URL on mount and when URL changes
  const [filters, setFilters] = useState<UnifiedProductFilters>(() => {
    const urlFilters = urlParamsToFilters(searchParams);
    return { ...initialFilters, ...urlFilters };
  });
  
  // Debounced search term
  const debouncedSearch = useDebounce(filters.search || '', debounceDelay);
  
  // Determine active preset
  const activePreset = useMemo(() => {
    const presetId = searchParams.get('preset');
    return presetId || null;
  }, [searchParams]);
  
  // Fetch products
  const fetchProducts = useCallback(async (currentFilters: UnifiedProductFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = filtersToUrlParams(currentFilters);
      if (activePreset) {
        params.set('preset', activePreset);
      }
      
      // Use main unified endpoint that fetches both bundles and Supabase products
      const response = await fetch(`/api/products/unified?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: UnifiedSearchResult & { presetMetadata?: any } = await response.json();
      
      setProducts(data.products);
      setTotalCount(data.totalCount);
      setFilteredCount(data.filteredCount);
      setFacets(data.facets);
      setSuggestions(data.suggestions);
      setPagination(data.pagination);
      setPresetMetadata(data.presetMetadata || null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activePreset]);
  
  // Auto-fetch when filters change (with debouncing for search)
  useEffect(() => {
    if (!autoFetch) return;
    
    const filtersToUse = {
      ...filters,
      search: debouncedSearch
    };
    
    fetchProducts(filtersToUse);
  }, [debouncedSearch, filters, fetchProducts, autoFetch]);
  
  // Update URL when filters change
  useEffect(() => {
    updateUrlWithFilters(filters, activePreset || undefined);
  }, [filters, activePreset]);
  
  // Action: Update filters
  const updateFilters = useCallback((newFilters: Partial<UnifiedProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset page when filters change
    }));
  }, []);
  
  // Action: Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    router.push('/products');
  }, [initialFilters, router]);
  
  // Action: Apply preset
  const applyPreset = useCallback((presetId: string) => {
    const preset = getFilterPreset(presetId);
    if (preset) {
      setFilters(preset.filters);
      router.push(`/products?preset=${presetId}`);
    }
  }, [router]);
  
  // Action: Clear preset
  const clearPreset = useCallback(() => {
    router.push('/products');
  }, [router]);
  
  // Action: Toggle filter value
  const toggleFilter = useCallback((key: keyof UnifiedProductFilters, value: any) => {
    setFilters(prev => {
      const currentValue = prev[key];
      
      // Handle array values
      if (Array.isArray(currentValue)) {
        const newArray = currentValue.includes(value)
          ? currentValue.filter(v => v !== value)
          : [...currentValue, value];
        
        return {
          ...prev,
          [key]: newArray.length > 0 ? newArray : undefined,
          page: 1
        };
      }
      
      // Handle boolean values
      if (typeof currentValue === 'boolean') {
        return {
          ...prev,
          [key]: !currentValue,
          page: 1
        };
      }
      
      // Handle other values
      return {
        ...prev,
        [key]: currentValue === value ? undefined : value,
        page: 1
      };
    });
  }, []);
  
  // Action: Search
  const search = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      search: query,
      page: 1
    }));
  }, []);
  
  // Action: Set page
  const setPage = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  }, []);
  
  // Action: Set sort
  const setSortBy = useCallback((sort: UnifiedProductFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sort,
      page: 1
    }));
  }, []);
  
  // Utility: Check if filter is active
  const isFilterActive = useCallback((key: keyof UnifiedProductFilters, value: any): boolean => {
    const currentValue = filters[key];
    
    if (Array.isArray(currentValue)) {
      return currentValue.includes(value);
    }
    
    return currentValue === value;
  }, [filters]);
  
  // Utility: Get shareable link
  const getShareableLink = useCallback((): string => {
    const params = filtersToUrlParams(filters);
    if (activePreset) {
      params.set('preset', activePreset);
    }
    return `${window.location.origin}/products?${params.toString()}`;
  }, [filters, activePreset]);
  
  // Utility: Refresh products
  const refreshProducts = useCallback(async () => {
    await fetchProducts(filters);
  }, [filters, fetchProducts]);
  
  return {
    // Data
    products,
    loading,
    error,
    
    // Metadata
    totalCount,
    filteredCount,
    facets,
    suggestions,
    pagination,
    presetMetadata,
    
    // Filters
    filters,
    activePreset,
    
    // Actions
    updateFilters,
    resetFilters,
    applyPreset,
    clearPreset,
    toggleFilter,
    search,
    setPage,
    setSortBy,
    
    // Utilities
    isFilterActive,
    getShareableLink,
    refreshProducts
  };
}