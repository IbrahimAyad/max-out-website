import { NextRequest, NextResponse } from 'next/server';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import { BUNDLE_TIERS } from '@/types/unified-shop';

// Simplified unified endpoint that just returns bundles for testing
export async function GET(request: NextRequest) {
  try {
    // Convert bundles to simplified format
    const products = bundleProductsWithImages.bundles.map(bundle => {
      // Determine bundle tier based on price
      let bundleTier: 'starter' | 'professional' | 'executive' | 'premium' = 'professional';
      
      if (bundle.bundlePrice <= 199) bundleTier = 'starter';
      else if (bundle.bundlePrice <= 229) bundleTier = 'professional';
      else if (bundle.bundlePrice <= 249) bundleTier = 'executive';
      else bundleTier = 'premium';
      
      return {
        id: bundle.id,
        sku: bundle.id,
        type: 'bundle',
        name: bundle.name,
        description: bundle.description,
        imageUrl: bundle.imageUrl,
        price: bundle.bundlePrice,
        originalPrice: bundle.originalPrice,
        bundlePrice: bundle.bundlePrice,
        savings: bundle.savings,
        isBundle: true,
        bundleTier,
        bundleComponents: {
          suit: {
            name: `${bundle.suit.color} ${bundle.suit.type} Suit`,
            color: bundle.suit.color.toLowerCase(),
            type: bundle.suit.type,
            image: bundle.suit.image
          },
          shirt: {
            name: `${bundle.shirt.color} ${bundle.shirt.fit} Shirt`,
            color: bundle.shirt.color.toLowerCase(),
            fit: bundle.shirt.fit,
            image: bundle.shirt.image
          },
          tie: bundle.tie ? {
            name: `${bundle.tie.color} ${bundle.tie.style} Tie`,
            color: bundle.tie.color.toLowerCase(),
            style: bundle.tie.style,
            image: bundle.tie.image
          } : undefined,
          pocketSquare: bundle.pocketSquare ? {
            name: `${bundle.pocketSquare.color} ${bundle.pocketSquare.pattern} Pocket Square`,
            color: bundle.pocketSquare.color.toLowerCase(),
            pattern: bundle.pocketSquare.pattern
          } : undefined
        },
        occasions: bundle.occasions,
        tags: [bundle.category],
        trending: bundle.trending,
        inStock: true,
        category: bundle.category
      };
    });
    
    // Return simple response
    return NextResponse.json({
      products: products.slice(0, 24), // Return first 24 bundles
      totalCount: products.length,
      filteredCount: products.length,
      facets: {
        categories: [
          { name: 'Business', count: 12 },
          { name: 'Wedding', count: 8 },
          { name: 'Formal', count: 6 }
        ],
        colors: [
          { name: 'black', count: 15 },
          { name: 'navy', count: 18 },
          { name: 'grey', count: 12 }
        ],
        occasions: [
          { name: 'Wedding', count: 20 },
          { name: 'Business', count: 15 },
          { name: 'Formal', count: 10 }
        ],
        priceRanges: [
          { label: 'Under $200', min: 0, max: 200, count: 10 },
          { label: '$200-$300', min: 200, max: 300, count: 25 }
        ],
        bundleTiers: [
          { tier: 'starter', count: 10, price: 199 },
          { tier: 'professional', count: 8, price: 229 },
          { tier: 'executive', count: 6, price: 249 },
          { tier: 'premium', count: 4, price: 299 }
        ]
      },
      appliedFilters: {},
      pagination: {
        currentPage: 1,
        totalPages: Math.ceil(products.length / 24),
        hasNext: products.length > 24,
        hasPrev: false
      }
    });
    
  } catch (error) {
    console.error('Unified products API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}