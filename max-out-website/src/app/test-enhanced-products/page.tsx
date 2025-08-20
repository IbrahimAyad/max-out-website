'use client';

import React, { useEffect, useState } from 'react';
import { EnhancedProduct } from '@/lib/products/enhanced/types';
import { EnhancedProductCard, EnhancedProductGrid } from '@/components/products/enhanced/EnhancedProductCard';
import { Loader2 } from 'lucide-react';

interface DiagnosticInfo {
  environment: any;
  supabase: any;
  errors: any[];
  sampleProducts?: any[];
}

export default function TestEnhancedProductsPage() {
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    // Run diagnostics first
    runDiagnostics();
    // Then fetch products
    fetchEnhancedProducts();
  }, []);

  const runDiagnostics = async () => {
    try {
      const response = await fetch('/api/products/enhanced/debug');
      const data = await response.json();
      setDiagnostics(data);
      
      // If there are critical errors, show diagnostics automatically
      if (data.errors && data.errors.length > 0) {
        setShowDiagnostics(true);
      }
    } catch (err) {
      console.error('Failed to run diagnostics:', err);
    }
  };

  const fetchEnhancedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/enhanced?status=active&limit=10');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching enhanced products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const testHybridSearch = async () => {
    try {
      const response = await fetch('/api/products/search?include_enhanced=true&include_legacy=false');
      const data = await response.json();
    } catch (err) {
      console.error('Error testing hybrid search:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading enhanced products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error Loading Products</p>
          <p>{error}</p>
          <button 
            onClick={fetchEnhancedProducts}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enhanced Products Test Page</h1>
              <p className="mt-2 text-gray-600">Testing the new enhanced product system with CDN images</p>
            </div>
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`${error ? 'text-red-800' : 'text-green-800'} font-medium`}>
                {error ? '❌ Error Loading Products' : '✅ Enhanced Products System is LIVE!'}
              </p>
              <p className={`${error ? 'text-red-600' : 'text-green-600'} text-sm mt-1`}>
                {error ? error : `Found ${products.length} enhanced products in database`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchEnhancedProducts}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Retry Fetch
              </button>
              <button
                onClick={testHybridSearch}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Test Hybrid Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Panel */}
      {showDiagnostics && diagnostics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">System Diagnostics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Environment Info */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Environment</h3>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                  <div>Node Env: <span className="font-mono">{diagnostics.environment?.nodeEnv}</span></div>
                  <div>Vercel: <span className="font-mono">{diagnostics.environment?.vercel}</span></div>
                  <div>Vercel Env: <span className="font-mono">{diagnostics.environment?.vercelEnv}</span></div>
                </div>
              </div>

              {/* Supabase Status */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Supabase Configuration</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${diagnostics.supabase?.urlConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">URL Configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${diagnostics.supabase?.anonKeyConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">Anon Key Configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${diagnostics.supabase?.clientCreated ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">Client Created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${diagnostics.supabase?.connectionTest === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">Connection: {diagnostics.supabase?.connectionTest || 'not tested'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${diagnostics.supabase?.rlsCheck === 'passed' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">RLS Check: {diagnostics.supabase?.rlsCheck || 'not tested'}</span>
                  </div>
                  {diagnostics.supabase?.productCount !== null && (
                    <div className="text-sm mt-2 pt-2 border-t">
                      Total Products in DB: <span className="font-semibold">{diagnostics.supabase.productCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Errors */}
            {diagnostics.errors && diagnostics.errors.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-red-700 mb-2">Errors Detected</h3>
                <div className="bg-red-50 border border-red-200 rounded p-4 space-y-3">
                  {diagnostics.errors.map((err, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-semibold text-red-800">{err.type}</div>
                      <div className="text-red-600">{err.message}</div>
                      {err.solution && (
                        <div className="text-green-700 mt-1">
                          <span className="font-medium">Solution:</span> {err.solution}
                        </div>
                      )}
                      {err.hint && (
                        <div className="text-blue-700 mt-1">
                          <span className="font-medium">Hint:</span> {err.hint}
                        </div>
                      )}
                      {err.missing && (
                        <div className="text-gray-600 mt-1">
                          <span className="font-medium">Missing:</span> {err.missing.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Products from Diagnostics */}
            {diagnostics.sampleProducts && diagnostics.sampleProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Sample Products in Database</h3>
                <div className="bg-gray-50 rounded p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {diagnostics.sampleProducts.map((product: any) => (
                      <div key={product.id} className="bg-white p-3 rounded border text-sm">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-gray-600 text-xs mt-1">ID: {product.id}</div>
                        <div className="text-gray-600">Slug: {product.slug}</div>
                        <div className="text-blue-600 font-semibold">${product.base_price}</div>
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-1 rounded ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <button
                onClick={runDiagnostics}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Re-run Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Summary */}
      {products.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Product Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((product) => {
                const imageCount = product.images?.gallery?.length || 0;
                const hasLifestyle = product.images?.lifestyle?.length || 0;
                const hasDetails = product.images?.detail_shots?.length || 0;
                
                return (
                  <div key={product.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.slug}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Price:</span> ${product.base_price}
                      </p>
                      <p>
                        <span className="font-medium">Images:</span> {imageCount + hasLifestyle + hasDetails + 1} total
                      </p>
                      <p>
                        <span className="font-medium">Gallery:</span> {imageCount} | 
                        <span className="font-medium"> Lifestyle:</span> {hasLifestyle} | 
                        <span className="font-medium"> Details:</span> {hasDetails}
                      </p>
                      <p>
                        <span className="font-medium">Tier:</span> {
                          Array.isArray(product.pricing_tiers) && product.pricing_tiers.length > 0
                            ? product.pricing_tiers.find(t => 
                                product.base_price >= t.price_range.min && 
                                product.base_price <= t.price_range.max
                              )?.tier_name || 'No tier'
                            : 'No tiers'
                        }
                      </p>
                      <p className="text-green-600">
                        <span className="font-medium">CDN:</span> {
                          (product.images?.hero?.url || product.images?.primary?.cdn_url) ? '✓ Using CDN' : '✗ No CDN'
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-semibold mb-6">Enhanced Product Cards</h2>
        
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No enhanced products found in database</p>
            <p className="text-sm text-gray-400 mt-2">
              Add products using the Supabase dashboard or API
            </p>
          </div>
        ) : (
          <EnhancedProductGrid 
            products={products}
            showPricingTier={true}
            showQuickActions={true}
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          />
        )}
      </div>

      {/* Debug Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <details className="bg-gray-800 text-white rounded-lg p-4">
          <summary className="cursor-pointer font-medium">Debug: Raw Product Data</summary>
          <pre className="mt-4 text-xs overflow-x-auto">
            {JSON.stringify(products, null, 2)}
          </pre>
        </details>
      </div>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Next Steps to Test:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Click on product cards to test the product detail pages</li>
            <li>Check if images load from cdn.kctmenswear.com</li>
            <li>Verify the pricing tier badges display correctly</li>
            <li>Test the image gallery with Blue Summer Blazer (5 images)</li>
            <li>Test fallback handling with Black Paisley Velvet (1 image)</li>
            <li>Click "Test Hybrid Search" to verify the API works</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-yellow-800 font-medium">⚠️ Stripe Integration Needed:</p>
            <p className="text-yellow-700 text-sm mt-1">
              These products need Stripe Product IDs to be purchasable. 
              Add stripe_product_id and stripe_price_id to each product in Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}