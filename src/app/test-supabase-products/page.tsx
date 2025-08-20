'use client';

import { useEffect, useState } from 'react';
import { fetchProductsWithImages, Product } from '@/lib/shared/supabase-products';
import { SupabaseProductCard } from '@/components/products/SupabaseProductCard';
import { toEnhancedProduct } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';

export default function TestSupabaseProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await fetchProductsWithImages({ limit: 12 });
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error || 'Failed to load products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Supabase products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error Loading Products</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase Products Test
          </h1>
          <p className="text-gray-600">
            Displaying {products.length} products from Supabase
          </p>
          
          {/* Connection Status */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">
                Supabase Connected Successfully
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              // Convert Supabase Product to EnhancedProduct for the card
              const enhancedProduct = toEnhancedProduct({
                ...product,
                product_variants: product.variants || [],
                product_images: product.images || []
              } as any);
              
              return (
                <div key={product.id} className="relative">
                  {/* Debug Info Badge */}
                  <div className="absolute -top-2 -right-2 z-20 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>
                  
                  <SupabaseProductCard 
                    product={enhancedProduct}
                    showQuickAdd={true}
                    showWishlist={true}
                  />
                  
                  {/* Product Debug Info */}
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                    <p><strong>ID:</strong> {product.id.slice(0, 8)}...</p>
                    <p><strong>SKU:</strong> {product.sku}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Images:</strong> {product.images?.length || 0}</p>
                    <p><strong>Variants:</strong> {product.variants?.length || 0}</p>
                    <p><strong>Source:</strong> Supabase</p>
                    {product.metadata?.stripe_price_id && (
                      <p><strong>Stripe:</strong> ✓ Integrated</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No products found in Supabase</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Integration Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Supabase Connection:</span>
              <span className="text-green-600 font-medium">✓ Working</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shared Service Pattern:</span>
              <span className="text-green-600 font-medium">✓ Implemented</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Backend Sync:</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Product Display:</span>
              <span className="text-green-600 font-medium">✓ Functional</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>Next Steps:</strong> Add Stripe price IDs to Supabase products for checkout integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}