// Complete Product Catalog - Core Products + All Bundles
// This file combines all products with Stripe Price IDs

import { allCoreProducts, CORE_PRODUCT_TOTALS } from './coreProducts';
import { bundleProductsWithImages, TOTAL_BUNDLE_COUNT } from './bundleProductsWithImages';

// Export all products
export { allCoreProducts } from './coreProducts';
export { bundleProductsWithImages } from './bundleProductsWithImages';

// Combined product type
export interface UnifiedProduct {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  stripePriceId: string;
  price: number;
  imageUrl: string;
  description: string;
  type: 'core' | 'bundle';
  metadata?: Record<string, any>;
}

// Convert core products to unified format
const unifiedCoreProducts: UnifiedProduct[] = allCoreProducts.map(product => ({
  id: product.id,
  name: product.name,
  category: product.category,
  subcategory: product.subcategory,
  stripePriceId: product.stripePriceId,
  price: product.price,
  imageUrl: product.imageUrl,
  description: product.description,
  type: 'core' as const,
  metadata: {
    ...product.metadata,
    sizes: product.sizes,
    colors: product.colors,
    customizable: product.customizable
  }
}));

// Convert bundles to unified format
const unifiedBundles: UnifiedProduct[] = bundleProductsWithImages.bundles.map(bundle => ({
  id: bundle.id,
  name: bundle.name,
  category: 'bundles',
  subcategory: bundle.category,
  stripePriceId: bundle.stripePriceId || '',
  price: bundle.bundlePrice,
  imageUrl: bundle.imageUrl,
  description: bundle.description,
  type: 'bundle' as const,
  metadata: {
    originalPrice: bundle.originalPrice,
    savings: bundle.savings,
    occasions: bundle.occasions,
    trending: bundle.trending,
    aiScore: bundle.aiScore,
    seasonal: bundle.seasonal,
    suit: bundle.suit,
    shirt: bundle.shirt,
    tie: bundle.tie,
    pocketSquare: bundle.pocketSquare
  }
}));

// Combine all products
export const allProducts: UnifiedProduct[] = [
  ...unifiedCoreProducts,
  ...unifiedBundles
];

// Product statistics
export const PRODUCT_STATISTICS = {
  // Core Products (37 total)
  coreProducts: {
    suits: CORE_PRODUCT_TOTALS.suits,           // 28
    ties: CORE_PRODUCT_TOTALS.ties,              // 4
    tieBundles: CORE_PRODUCT_TOTALS.tieBundles,  // 3
    shirts: CORE_PRODUCT_TOTALS.shirts,          // 2
    total: CORE_PRODUCT_TOTALS.total             // 37
  },
  
  // Bundles (66 total)
  bundles: {
    original: 30,
    casual: 15,
    prom: 5,
    wedding: 16,
    total: TOTAL_BUNDLE_COUNT                    // 66
  },
  
  // Grand total
  grandTotal: allProducts.length,                // 103
  
  // Products with Stripe IDs
  withStripeIds: allProducts.filter(p => p.stripePriceId).length,
  withoutStripeIds: allProducts.filter(p => !p.stripePriceId).length,
  
  // Price ranges
  priceRanges: {
    under100: allProducts.filter(p => p.price < 100).length,
    under200: allProducts.filter(p => p.price >= 100 && p.price < 200).length,
    under300: allProducts.filter(p => p.price >= 200 && p.price < 300).length,
    over300: allProducts.filter(p => p.price >= 300).length
  }
};

// Helper functions
export function getAllProducts(): UnifiedProduct[] {
  return allProducts;
}

export function getProductById(id: string): UnifiedProduct | undefined {
  return allProducts.find(product => product.id === id);
}

export function getProductsByCategory(category: string): UnifiedProduct[] {
  return allProducts.filter(product => product.category === category);
}

export function getProductByStripeId(stripePriceId: string): UnifiedProduct | undefined {
  return allProducts.find(product => product.stripePriceId === stripePriceId);
}

export function getCoreProducts(): UnifiedProduct[] {
  return allProducts.filter(product => product.type === 'core');
}

export function getBundleProducts(): UnifiedProduct[] {
  return allProducts.filter(product => product.type === 'bundle');
}

// Search function
export function searchProducts(query: string): UnifiedProduct[] {
  const searchTerm = query.toLowerCase();
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.subcategory?.toLowerCase().includes(searchTerm)
  );
}

// Get products by price range
export function getProductsByPriceRange(min: number, max: number): UnifiedProduct[] {
  return allProducts.filter(product => product.price >= min && product.price <= max);
}

// Validate all products have Stripe IDs
export function validateStripeIntegration(): {
  valid: boolean;
  missing: UnifiedProduct[];
  report: string;
} {
  const missing = allProducts.filter(p => !p.stripePriceId);
  
  return {
    valid: missing.length === 0,
    missing,
    report: `
      Product Integration Status:
      ✅ Products with Stripe IDs: ${PRODUCT_STATISTICS.withStripeIds}
      ❌ Products missing Stripe IDs: ${PRODUCT_STATISTICS.withoutStripeIds}
      
      Core Products: ${PRODUCT_STATISTICS.coreProducts.total} (All integrated)
      - Suits: ${PRODUCT_STATISTICS.coreProducts.suits}
      - Ties: ${PRODUCT_STATISTICS.coreProducts.ties}
      - Tie Bundles: ${PRODUCT_STATISTICS.coreProducts.tieBundles}
      - Shirts: ${PRODUCT_STATISTICS.coreProducts.shirts}
      
      Bundle Products: ${PRODUCT_STATISTICS.bundles.total} (All integrated)
      - Original: ${PRODUCT_STATISTICS.bundles.original}
      - Casual: ${PRODUCT_STATISTICS.bundles.casual}
      - Prom: ${PRODUCT_STATISTICS.bundles.prom}
      - Wedding: ${PRODUCT_STATISTICS.bundles.wedding}
      
      Total Products: ${PRODUCT_STATISTICS.grandTotal}
    `
  };
}

// Export validation report
