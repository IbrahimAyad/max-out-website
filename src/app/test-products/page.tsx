'use client';

import { useState, useEffect } from 'react';
import { fetchProductsWithImages, getProductImageUrl, formatPrice, testSupabaseConnection } from '@/lib/shared/supabase-products';
import type { Product } from '@/lib/shared/supabase-products';

export default function TestProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    async function loadProducts() {
      try {
        // console.log('Starting to load products...');
        
        // First test connection
        // console.log('Testing Supabase connection...');
        const connectionTest = await testSupabaseConnection();
        // console.log('Connection test result:', connectionTest);
        
        setConnectionStatus(connectionTest.success ? '✅ Connected to Supabase' : `❌ ${connectionTest.error}`);

        if (!connectionTest.success) {
          setError(`Cannot connect to Supabase: ${connectionTest.error}`);
          setLoading(false);
          return;
        }

        // Then fetch products
        // console.log('Fetching products...');
        const result = await fetchProductsWithImages({ limit: 10 });
        // console.log('Fetch result:', result);
        
        if (result.success) {
          // console.log(`Successfully fetched ${result.data.length} products`);
          setProducts(result.data);
          setError(null);
        } else {
          console.error('Error fetching products:', result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Products Test</h1>
        
        {/* Connection Status */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <p className="font-semibold">Connection Status:</p>
          <p className={connectionStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
            {connectionStatus}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div>
            <p className="mb-4 text-gray-600">Found {products.length} products</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={getProductImageUrl(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // console.error(`Image failed to load for ${product.name}:`, e);
                        e.currentTarget.src = '/placeholder-product.svg';
                      }}
                    />
                    {product.images && product.images.length > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {product.images.length} image{product.images.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <p className="text-amber-600 font-bold">{formatPrice(product.base_price)}</p>
                    
                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                      </p>
                    )}

                    {/* Debug Info */}
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
                      <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
{JSON.stringify({
  id: product.id,
  sku: product.sku,
  images: product.images?.length || 0,
  variants: product.variants?.length || 0
}, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No products found in Supabase</p>
          </div>
        )}
      </div>
    </div>
  );
}