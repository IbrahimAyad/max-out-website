import { NextRequest, NextResponse } from 'next/server';
import { smartFilterEngine, SmartFilterConfig } from '@/lib/ai/smart-filter-engine';
import { createClient } from '@/lib/supabase/server';
import { unifiedSearch } from '@/lib/services/unifiedSearchEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filterConfig: SmartFilterConfig = body;
    
    // console.log('Smart filter request:', filterConfig);
    
    // Step 1: Fetch all available products
    const supabase = await createClient();
    let individualProducts = [];
    
    // Fetch from Supabase if not disabled
    if (filterConfig.categories || !body.skipDatabase) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            primary_image,
            product_images (
              image_url,
              alt_text,
              position,
              image_type
            ),
            product_variants (
              id,
              title,
              price,
              inventory_quantity,
              available
            )
          `)
          .eq('visibility', true)
          .eq('status', 'active')
          .limit(1000);
        
        const { data, error } = await query;
        
        // console.log('Supabase query result:', { 
        //   dataCount: data?.length, 
        //   error: error?.message,
        //   hasData: !!data 
        // });
        
        if (!error && data) {
          // Map to unified format
          individualProducts = data.map((product: any) => {
            // CRITICAL: Primary image is in products.primary_image field!
            const primaryImageUrl = product.primary_image || null;
            
            // Get gallery images from product_images table
            const galleryImages = product.product_images?.map((img: any) => ({ 
              src: img.image_url 
            })) || [];
            
            // Combine primary image with gallery images
            const allImages = primaryImageUrl 
              ? [{ src: primaryImageUrl }, ...galleryImages]
              : galleryImages;
            
            const firstVariant = product.product_variants?.[0];
            const totalInventory = product.product_variants?.reduce(
              (sum: number, v: any) => sum + (v.inventory_quantity || 0), 0
            ) || product.total_inventory || 0;
            
            const variantPrice = firstVariant?.price || product.base_price || 0;
            const displayPrice = variantPrice > 1000 
              ? (variantPrice / 100).toString() 
              : variantPrice.toString();
            
            return {
              id: product.id,
              title: product.name,  // Use 'title' for compatibility with supabaseProductToUnified
              name: product.name,
              description: product.description,
              price: displayPrice,  // Keep as string for supabaseProductToUnified
              category: product.product_type || product.category || 'uncategorized',
              product_type: product.product_type,
              primary_image: primaryImageUrl,  // Pass primary_image directly
              sku: product.sku,
              handle: product.handle,
              tags: product.tags || [],
              available: totalInventory > 0,
              inventory_quantity: totalInventory,
              images: allImages,  // Use combined images array
              featured_image: primaryImageUrl ? { src: primaryImageUrl } : null,
              vendor: product.vendor,
              sizes: product.additional_info?.sizes_available?.split(', ') || [],
              material: product.additional_info?.material,
              fit: product.additional_info?.fit_type
            };
          });
          
          // console.log('Mapped individual products:', individualProducts.length);
        }
      } catch (error) {
        console.error('Error fetching products from Supabase:', error);
      }
    }
    
    // Step 2: Get unified products (including bundles and core products)
    // console.log('Before unifiedSearch - individual products:', individualProducts.length);
    // Pass a high limit to get all products, not just the first page
    const unifiedResults = await unifiedSearch({ limit: 1000 }, individualProducts);
    const allProducts = unifiedResults.products;
    
    // console.log(`After unifiedSearch - total products: ${allProducts.length} (${individualProducts.length} individual + bundles)`);
    
    // Step 3: Apply smart filtering
    const filterResults = await smartFilterEngine.applySmartFilters(
      allProducts,
      filterConfig
    );
    
    // console.log(`Smart filter returned ${filterResults.products.length} products`);
    
    // Step 4: Enhance response with additional data
    const response = {
      success: true,
      ...filterResults,
      // Add search analytics
      analytics: {
        searchId: generateSearchId(),
        timestamp: new Date().toISOString(),
        filtersApplied: Object.keys(filterConfig).filter(k => filterConfig[k as keyof SmartFilterConfig]),
        resultCount: filterResults.products.length,
        hasAlternatives: filterResults.alternativeFilters.length > 0,
        hasSuggestions: filterResults.suggestions.length > 0
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Smart filter API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to apply smart filters',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters into filter config
  const filterConfig: SmartFilterConfig = {
    searchQuery: searchParams.get('q') || undefined,
    categories: searchParams.get('categories')?.split(','),
    colors: searchParams.get('colors')?.split(','),
    sizes: searchParams.get('sizes')?.split(','),
    occasions: searchParams.get('occasions')?.split(','),
    priceRange: searchParams.get('minPrice') && searchParams.get('maxPrice') ? {
      min: Number(searchParams.get('minPrice')),
      max: Number(searchParams.get('maxPrice'))
    } : undefined,
    trendingOnly: searchParams.get('trending') === 'true',
    seasonalRelevance: searchParams.get('seasonal') === 'true',
    includeOutfitSuggestions: searchParams.get('outfits') === 'true',
    maxResults: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined
  };
  
  // Use POST logic
  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify(filterConfig)
  });
  
  return POST(mockRequest as NextRequest);
}

function generateSearchId(): string {
  return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}