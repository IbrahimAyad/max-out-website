// Hybrid Product Search API - Searches both legacy and enhanced products
import { NextRequest, NextResponse } from 'next/server';
import { HybridProductService } from '@/lib/products/enhanced/hybridService';
import { HybridProductQuery } from '@/lib/products/enhanced/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query: HybridProductQuery = {
      category: searchParams.get('category') || undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      search_term: searchParams.get('q') || searchParams.get('search') || undefined,
      in_stock_only: searchParams.get('in_stock_only') === 'true',
      prefer_source: searchParams.get('prefer_source') as 'legacy' | 'enhanced' | undefined,
      include_legacy: searchParams.get('include_legacy') !== 'false', // Default true
      include_enhanced: searchParams.get('include_enhanced') !== 'false', // Default true
      sort_by: (searchParams.get('sort_by') as 'relevance' | 'price' | 'name' | 'date_added') || 'relevance',
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100), // Max 100 results
      offset: Math.max(parseInt(searchParams.get('offset') || '0'), 0)
    };

    // Execute hybrid search
    const searchResults = await HybridProductService.searchProducts(query);

    // Transform results for API response
    const products = searchResults.results.map(result => {
      const product = result.legacy_product || result.enhanced_product!;
      
      return {
        id: product.id,
        name: HybridProductService.getProductName(result),
        price: HybridProductService.getProductPrice(result),
        image_url: HybridProductService.getProductImageUrl(result),
        product_url: HybridProductService.getProductUrl(result),
        source: result.source,
        category: result.legacy_product?.category || result.enhanced_product?.category,
        subcategory: result.legacy_product?.subcategory || result.enhanced_product?.subcategory,
        in_stock: HybridProductService.isInStock(result),
        description: result.legacy_product?.description || result.enhanced_product?.short_description || result.enhanced_product?.description,
        
        // Enhanced product specific fields
        ...(result.enhanced_product && {
          slug: result.enhanced_product.slug,
          brand: result.enhanced_product.brand,
          featured: result.enhanced_product.featured,
          trending: result.enhanced_product.trending,
          pricing_tier: result.enhanced_product.pricing_tiers ? 
            result.enhanced_product.pricing_tiers.find(tier => 
              result.enhanced_product!.base_price >= tier.price_range.min && 
              result.enhanced_product!.base_price <= tier.price_range.max
            ) : null
        }),
        
        // Legacy product specific fields  
        ...(result.legacy_product && {
          type: result.legacy_product.type,
          metadata: result.legacy_product.metadata
        })
      };
    });

    // Calculate price range for faceted search
    const priceRange = await HybridProductService.getPriceRange();
    
    // Get categories for faceted search
    const categories = await HybridProductService.getAllCategories();

    return NextResponse.json({
      products,
      results_info: {
        total_count: searchResults.total_count,
        legacy_count: searchResults.legacy_count,
        enhanced_count: searchResults.enhanced_count,
        shown_count: products.length,
        has_more: searchResults.total_count > (query.offset || 0) + products.length
      },
      facets: {
        price_range: priceRange,
        categories: categories.slice(0, 20), // Limit to 20 categories for performance
        sources: [
          { source: 'legacy', count: searchResults.legacy_count, label: 'Classic Products' },
          { source: 'enhanced', count: searchResults.enhanced_count, label: 'Enhanced Products' }
        ]
      },
      query_info: {
        search_term: query.search_term,
        category: query.category,
        price_filter: {
          min: query.min_price,
          max: query.max_price
        },
        sort_by: query.sort_by,
        filters_applied: Object.keys(query).filter(key => 
          query[key as keyof HybridProductQuery] !== undefined && 
          query[key as keyof HybridProductQuery] !== false
        ).length
      }
    });

  } catch (error) {
    console.error('Error in hybrid product search:', error);
    return NextResponse.json(
      { 
        error: 'Search failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Advanced search with complex filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const query: HybridProductQuery = {
      category: body.category,
      min_price: body.min_price,
      max_price: body.max_price,
      search_term: body.search_term || body.q,
      in_stock_only: body.in_stock_only || false,
      prefer_source: body.prefer_source,
      include_legacy: body.include_legacy !== false,
      include_enhanced: body.include_enhanced !== false,
      sort_by: body.sort_by || 'relevance',
      limit: Math.min(body.limit || 20, 100),
      offset: Math.max(body.offset || 0, 0)
    };

    // Support for multiple categories
    if (body.categories && Array.isArray(body.categories)) {
      // For multiple categories, we'll need to modify the search logic
      // For now, just use the first category
      query.category = body.categories[0];
    }

    // Support for feature flags (enhanced products only)
    if (body.featured !== undefined) {
      // This would require modifying the hybrid service to support feature filters
      // For now, we'll filter results post-search
    }

    const searchResults = await HybridProductService.searchProducts(query);

    // Apply post-search filters for enhanced product features
    let filteredResults = searchResults.results;

    if (body.featured !== undefined) {
      filteredResults = filteredResults.filter(result => 
        result.enhanced_product ? result.enhanced_product.featured === body.featured : true
      );
    }

    if (body.trending !== undefined) {
      filteredResults = filteredResults.filter(result => 
        result.enhanced_product ? result.enhanced_product.trending === body.trending : true
      );
    }

    if (body.customizable !== undefined) {
      filteredResults = filteredResults.filter(result => {
        if (result.enhanced_product) {
          return result.enhanced_product.specifications?.customizable === body.customizable;
        }
        if (result.legacy_product) {
          return result.legacy_product.metadata?.customizable === body.customizable;
        }
        return true;
      });
    }

    // Transform results
    const products = filteredResults.map(result => {
      const product = result.legacy_product || result.enhanced_product!;
      
      return {
        id: product.id,
        name: HybridProductService.getProductName(result),
        price: HybridProductService.getProductPrice(result),
        image_url: HybridProductService.getProductImageUrl(result),
        product_url: HybridProductService.getProductUrl(result),
        source: result.source,
        category: result.legacy_product?.category || result.enhanced_product?.category,
        in_stock: HybridProductService.isInStock(result),
        
        // Include full product data for advanced search
        product_data: result.legacy_product || result.enhanced_product
      };
    });

    return NextResponse.json({
      products,
      results_info: {
        total_found: searchResults.total_count,
        after_filters: filteredResults.length,
        legacy_count: searchResults.legacy_count,
        enhanced_count: searchResults.enhanced_count
      },
      search_metadata: {
        query: body,
        execution_time: Date.now(), // Could track actual execution time
        filters_applied: Object.keys(body).length
      }
    });

  } catch (error) {
    console.error('Error in advanced hybrid search:', error);
    return NextResponse.json(
      { 
        error: 'Advanced search failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}