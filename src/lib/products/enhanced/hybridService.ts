// Hybrid Product Service - Queries both legacy and enhanced products
// Provides unified interface for product search across both systems

import { supabase } from '@/lib/supabase/client';
import { 
  EnhancedProduct, 
  EnhancedProductQuery, 
  HybridProductResult, 
  HybridProductQuery,
  UnifiedProductSource 
} from './types';
import { 
  UnifiedProduct, 
  getAllProducts, 
  searchProducts, 
  getProductsByCategory,
  getProductsByPriceRange 
} from '../allProducts';

export class HybridProductService {
  
  /**
   * Search products across both legacy and enhanced systems
   */
  static async searchProducts(query: HybridProductQuery): Promise<{
    results: HybridProductResult[];
    total_count: number;
    legacy_count: number;
    enhanced_count: number;
  }> {
    const results: HybridProductResult[] = [];
    let legacyCount = 0;
    let enhancedCount = 0;

    // Search legacy products (if enabled)
    if (query.include_legacy !== false) {
      const legacyResults = await this.searchLegacyProducts(query);
      legacyCount = legacyResults.length;
      
      results.push(...legacyResults.map(product => ({
        source: 'legacy' as UnifiedProductSource,
        legacy_product: product,
        enhanced_product: undefined
      })));
    }

    // Search enhanced products (if enabled)
    if (query.include_enhanced !== false) {
      const enhancedResults = await this.searchEnhancedProducts(query);
      enhancedCount = enhancedResults.length;
      
      results.push(...enhancedResults.map(product => ({
        source: 'enhanced' as UnifiedProductSource,
        legacy_product: undefined,
        enhanced_product: product
      })));
    }

    // Sort combined results
    const sortedResults = this.sortHybridResults(results, query.sort_by || 'relevance');

    // Apply pagination
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    const paginatedResults = sortedResults.slice(offset, offset + limit);

    return {
      results: paginatedResults,
      total_count: results.length,
      legacy_count: legacyCount,
      enhanced_count: enhancedCount
    };
  }

  /**
   * Get a single product by ID from either system
   */
  static async getProductById(id: string, preferredSource?: UnifiedProductSource): Promise<HybridProductResult | null> {
    // Try enhanced products first (if preferred or no preference)
    if (preferredSource !== 'legacy') {
      try {
        const { data: enhancedProduct } = await supabase
          .from('products_enhanced')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (enhancedProduct) {
          return {
            source: 'enhanced',
            legacy_product: undefined,
            enhanced_product: enhancedProduct as EnhancedProduct
          };
        }
      } catch (error) {
        console.error('Error fetching enhanced product:', error);
      }
    }

    // Try legacy products if enhanced failed or not preferred
    try {
      const legacyProduct = await this.getLegacyProductById(id);
      if (legacyProduct) {
        return {
          source: 'legacy',
          legacy_product: legacyProduct,
          enhanced_product: undefined
        };
      }
    } catch (error) {
      console.error('Error fetching legacy product:', error);
    }

    return null;
  }

  /**
   * Get product by slug (enhanced products only, legacy uses IDs)
   */
  static async getProductBySlug(slug: string): Promise<HybridProductResult | null> {
    try {
      const { data: enhancedProduct } = await supabase
        .from('products_enhanced')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (enhancedProduct) {
        return {
          source: 'enhanced',
          legacy_product: undefined,
          enhanced_product: enhancedProduct as EnhancedProduct
        };
      }
    } catch (error) {
      console.error('Error fetching product by slug:', error);
    }

    return null;
  }

  /**
   * Search legacy products using local data
   */
  private static async searchLegacyProducts(query: HybridProductQuery): Promise<UnifiedProduct[]> {
    let products = getAllProducts();

    // Apply filters
    if (query.category) {
      products = products.filter(p => 
        p.category.toLowerCase() === query.category!.toLowerCase() ||
        p.subcategory?.toLowerCase() === query.category!.toLowerCase()
      );
    }

    if (query.search_term) {
      products = searchProducts(query.search_term);
    }

    if (query.min_price || query.max_price) {
      const min = query.min_price || 0;
      const max = query.max_price || Number.MAX_SAFE_INTEGER;
      products = products.filter(p => p.price >= min && p.price <= max);
    }

    if (query.in_stock_only) {
      // Legacy products don't have real inventory, assume all in stock
      // Could enhance this later by checking Stripe inventory
    }

    return products;
  }

  /**
   * Search enhanced products using Supabase
   */
  private static async searchEnhancedProducts(query: HybridProductQuery): Promise<EnhancedProduct[]> {
    let supabaseQuery = supabase
      .from('products_enhanced')
      .select('*')
      .eq('status', 'active');

    // Apply filters
    if (query.category) {
      supabaseQuery = supabaseQuery.or(`category.ilike.%${query.category}%,subcategory.ilike.%${query.category}%`);
    }

    if (query.min_price) {
      supabaseQuery = supabaseQuery.gte('base_price', query.min_price);
    }

    if (query.max_price) {
      supabaseQuery = supabaseQuery.lte('base_price', query.max_price);
    }

    if (query.search_term) {
      supabaseQuery = supabaseQuery.textSearch('name,description', query.search_term);
    }

    if (query.in_stock_only) {
      // Check inventory JSONB for available stock > 0
      supabaseQuery = supabaseQuery.gt('inventory->available_stock', 0);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching enhanced products:', error);
      return [];
    }

    return data as EnhancedProduct[];
  }

  /**
   * Get legacy product by ID
   */
  private static async getLegacyProductById(id: string): Promise<UnifiedProduct | null> {
    const products = getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  /**
   * Sort hybrid results based on sort criteria
   */
  private static sortHybridResults(
    results: HybridProductResult[], 
    sortBy: 'relevance' | 'price' | 'name' | 'date_added'
  ): HybridProductResult[] {
    return results.sort((a, b) => {
      const productA = a.legacy_product || a.enhanced_product!;
      const productB = b.legacy_product || b.enhanced_product!;

      switch (sortBy) {
        case 'price':
          const priceA = a.legacy_product?.price || a.enhanced_product?.base_price || 0;
          const priceB = b.legacy_product?.price || b.enhanced_product?.base_price || 0;
          return priceA - priceB;

        case 'name':
          return productA.name.localeCompare(productB.name);

        case 'date_added':
          // Enhanced products have created_at, legacy don't - put enhanced first
          if (a.enhanced_product && !b.enhanced_product) return -1;
          if (!a.enhanced_product && b.enhanced_product) return 1;
          if (a.enhanced_product && b.enhanced_product) {
            return new Date(b.enhanced_product.created_at).getTime() - 
                   new Date(a.enhanced_product.created_at).getTime();
          }
          return 0;

        case 'relevance':
        default:
          // Enhanced products get slight preference for relevance
          if (a.enhanced_product && !b.enhanced_product) return -1;
          if (!a.enhanced_product && b.enhanced_product) return 1;
          return 0;
      }
    });
  }

  /**
   * Get product price (handles both systems)
   */
  static getProductPrice(result: HybridProductResult): number {
    return result.legacy_product?.price || result.enhanced_product?.base_price || 0;
  }

  /**
   * Get product name (handles both systems)
   */
  static getProductName(result: HybridProductResult): string {
    return result.legacy_product?.name || result.enhanced_product?.name || 'Unknown Product';
  }

  /**
   * Get product image URL (handles both systems with fallback)
   */
  static getProductImageUrl(result: HybridProductResult): string {
    if (result.legacy_product) {
      return result.legacy_product.imageUrl;
    }
    
    if (result.enhanced_product) {
      // Try new CDN first, fallback to legacy
      const images = result.enhanced_product.images;
      if (typeof images === 'object' && images.primary) {
        return images.primary.cdn_url || images.primary.url;
      }
    }
    
    return '/placeholder-product.jpg';
  }

  /**
   * Get product URL/slug (handles both systems)
   */
  static getProductUrl(result: HybridProductResult): string {
    if (result.enhanced_product) {
      return `/products/${result.enhanced_product.slug}`;
    }
    
    if (result.legacy_product) {
      // Legacy products use category-based URLs
      const category = result.legacy_product.type === 'bundle' ? 'bundles' : 'products';
      return `/${category}/${result.legacy_product.id}`;
    }
    
    return '#';
  }

  /**
   * Check if product is in stock (handles both systems)
   */
  static isInStock(result: HybridProductResult): boolean {
    if (result.legacy_product) {
      // Legacy products don't have inventory tracking, assume in stock
      return true;
    }
    
    if (result.enhanced_product) {
      const inventory = result.enhanced_product.inventory;
      if (typeof inventory === 'object' && 'available_stock' in inventory) {
        return (inventory.available_stock as number) > 0;
      }
    }
    
    return true; // Default to in stock
  }

  /**
   * Get product categories from both systems
   */
  static async getAllCategories(): Promise<string[]> {
    const categories = new Set<string>();

    // Get legacy categories
    const legacyProducts = getAllProducts();
    legacyProducts.forEach(product => {
      categories.add(product.category);
      if (product.subcategory) {
        categories.add(product.subcategory);
      }
    });

    // Get enhanced categories
    try {
      const { data: enhancedProducts } = await supabase
        .from('products_enhanced')
        .select('category, subcategory')
        .eq('status', 'active');

      enhancedProducts?.forEach(product => {
        categories.add(product.category);
        if (product.subcategory) {
          categories.add(product.subcategory);
        }
      });
    } catch (error) {
      console.error('Error fetching enhanced categories:', error);
    }

    return Array.from(categories).sort();
  }

  /**
   * Get price range across both systems
   */
  static async getPriceRange(): Promise<{ min: number; max: number }> {
    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;

    // Check legacy products
    const legacyProducts = getAllProducts();
    legacyProducts.forEach(product => {
      min = Math.min(min, product.price);
      max = Math.max(max, product.price);
    });

    // Check enhanced products
    try {
      const { data: priceData } = await supabase
        .from('products_enhanced')
        .select('base_price')
        .eq('status', 'active');

      priceData?.forEach(product => {
        min = Math.min(min, product.base_price);
        max = Math.max(max, product.base_price);
      });
    } catch (error) {
      console.error('Error fetching enhanced price range:', error);
    }

    return { 
      min: min === Number.MAX_SAFE_INTEGER ? 0 : min, 
      max 
    };
  }
}

// Export convenience functions
export const {
  searchProducts: searchHybridProducts,
  getProductById: getHybridProductById,
  getProductBySlug: getHybridProductBySlug,
  getProductsByCategory: getHybridProductsByCategory,
  getProductPrice,
  getProductName,
  getProductImageUrl,
  getProductUrl,
  isInStock,
  getAllCategories: getHybridCategories,
  getPriceRange: getHybridPriceRange
} = HybridProductService;