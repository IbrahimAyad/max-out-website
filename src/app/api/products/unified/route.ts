import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unifiedSearch } from '@/lib/services/unifiedSearchEngine';
import { urlParamsToFilters } from '@/lib/utils/url-filters';
import { getFilterPreset } from '@/lib/config/filter-presets';
import { generateCDNUrls, fixLegacyUrl } from '@/lib/utils/cdn-url-generator';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute cache

/**
 * Unified Products API
 * Fetches and combines products from two sources:
 * 1. Enhanced Products (Supabase products_enhanced table)
 * 2. Core Products (Hardcoded with Stripe IDs)
 * 
 * Bundles are handled by unifiedSearch from the hardcoded bundle list
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Check cache
    const cacheKey = searchParams.toString();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }
    
    // Parse filters from URL
    const filters = urlParamsToFilters(searchParams);
    
    // Get preset information if specified
    const presetId = searchParams.get('preset');
    const presetData = presetId ? getFilterPreset(presetId) : null;
    
    // Disable bundles only on collections page
    const isCollectionsPage = request.nextUrl.pathname.includes('/collections');
    if (isCollectionsPage) {
      filters.includeBundles = false;
    }
    
    // Fetch enhanced products from Supabase
    const enhancedProducts = await fetchEnhancedProducts(filters);
    
    // Pass enhanced products to unified search
    // UnifiedSearch will add Core Products and Bundles as needed
    const results = await unifiedSearch(filters, enhancedProducts);
    
    // Add preset metadata if applicable
    if (presetData) {
      (results as any).presetMetadata = {
        name: presetData.name,
        description: presetData.description,
        icon: presetData.icon,
        seo: presetData.seo
      };
    }
    
    // Cache the results
    cache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });
    
    // Clean old cache entries
    cleanCache();
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Unified products API error:', error);
    
    // Always return 200 with empty results to prevent client crashes
    return NextResponse.json({
      products: [],
      totalCount: 0,
      filteredCount: 0,
      facets: {
        categories: [],
        colors: [],
        occasions: [],
        priceRanges: [],
        bundleTiers: []
      },
      pagination: {
        currentPage: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch products'
    }, { status: 200 });
  }
}

/**
 * Fetch enhanced products from Supabase
 */
async function fetchEnhancedProducts(filters: any): Promise<any[]> {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      console.error('Supabase client not available');
      return [];
    }
    
    // Build query for enhanced products
    let query = supabase
      .from('products_enhanced')
      .select('*')
      .eq('status', 'active');
    
    // Apply category filter
    if (filters.category?.length) {
      const categories = filters.category.map((c: string) => c.toLowerCase());
      // Check for blazers/jackets
      if (categories.some((c: string) => ['blazers', 'jackets', 'blazer'].includes(c))) {
        query = query.eq('category', 'Blazers');
      } else {
        // For other categories, skip enhanced products
        return [];
      }
    }
    
    // Apply price filters
    if (filters.minPrice) {
      query = query.gte('base_price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('base_price', filters.maxPrice);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching enhanced products:', error);
      return [];
    }
    
    if (!data) return [];
    
    // Transform enhanced products to unified format
    return data.map(transformEnhancedProduct);
    
  } catch (error) {
    console.error('Error in fetchEnhancedProducts:', error);
    return [];
  }
}

/**
 * Transform enhanced product to unified format
 */
function transformEnhancedProduct(product: any): any {
  // Get image URL with multiple fallbacks
  let imageUrl = '/placeholder-product.jpg';
  
  // Try different image paths from Supabase
  if (product.images?.hero?.url) {
    imageUrl = product.images.hero.url;
  } else if (product.images?.primary?.url) {
    imageUrl = product.images.primary.url;
  } else if (product.images?.flat?.url) {
    imageUrl = product.images.flat.url;
  } else if (product.images?.gallery?.[0]?.url) {
    imageUrl = product.images.gallery[0].url;
  } else if (product.image_url) {
    imageUrl = product.image_url;
  }
  
  // Fix legacy URLs and ensure CDN domain
  imageUrl = fixLegacyUrl(imageUrl, product.name) || imageUrl;
  
  // If still placeholder, try smart generation
  if (imageUrl === '/placeholder-product.jpg') {
    const generated = generateCDNUrls(product.name);
    if (generated.model !== '/placeholder-product.jpg') {
      imageUrl = generated.model;
    }
  }
  
  // Get additional images
  const additionalImages: string[] = [];
  if (product.images?.gallery) {
    product.images.gallery.forEach((img: any) => {
      if (img.url) {
        const fixedUrl = fixLegacyUrl(img.url, product.name);
        if (fixedUrl) additionalImages.push(fixedUrl);
      }
    });
  }
  
  return {
    id: product.id,
    name: product.name,
    title: product.name,
    description: product.description || '',
    price: product.base_price || 299.99,
    category: 'blazers',
    product_type: 'blazer',
    primary_image: imageUrl,
    image: imageUrl,
    sku: product.sku || '',
    handle: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
    tags: product.tags || [],
    available: product.status === 'active',
    inventory_quantity: product.inventory?.available || 100,
    featured_image: { src: imageUrl },
    images: [{ src: imageUrl }, ...additionalImages.map(url => ({ src: url }))],
    vendor: 'KCT Menswear',
    sizes: product.variants?.map((v: any) => v.size) || ['S', 'M', 'L', 'XL', 'XXL'],
    stripePriceId: product.stripe_price_id || null,
    stripeActive: !!product.stripe_price_id,
    variants: product.variants || [],
    ai_score: 90,
    source: 'enhanced',
    type: 'individual'
  };
}

/**
 * Clean old cache entries
 */
function cleanCache() {
  if (cache.size > 100) {
    const entries = Array.from(cache.entries());
    const cutoff = Date.now() - CACHE_DURATION;
    entries.forEach(([key, value]) => {
      if (value.timestamp < cutoff) {
        cache.delete(key);
      }
    });
  }
}