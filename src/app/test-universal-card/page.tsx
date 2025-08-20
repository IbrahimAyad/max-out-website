'use client';

import { useState, useEffect } from 'react';
import { UniversalProductCard, UniversalProductGrid } from '@/components/products/UniversalProductCard';
import { Loader2 } from 'lucide-react';

export default function TestUniversalCardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch enhanced products with proper image structure
      const response = await fetch('/api/products/enhanced?status=active&limit=12');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // If no products, use demo data
      if (!data.products || data.products.length === 0) {
        setProducts(getDemoProducts());
      } else {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // Use demo data as fallback
      setProducts(getDemoProducts());
      setError('Using demo products');
    } finally {
      setLoading(false);
    }
  };

  // Demo products with proper enhanced structure
  const getDemoProducts = () => [
    {
      id: '1',
      name: 'Navy Premium Suit',
      slug: 'navy-premium-suit',
      base_price: 299.99,
      compare_at_price: 399.99,
      images: {
        hero: {
          url: 'https://cdn.kctmenswear.com/double_breasted/mens_double_breasted_suit_model_2024_0.webp',
          alt: 'Navy Premium Suit - Front View'
        },
        gallery: [
          {
            cdn_url: 'https://cdn.kctmenswear.com/double_breasted/mens_double_breasted_suit_model_2024_1.webp',
            alt_text: 'Navy Premium Suit - Side View'
          },
          {
            cdn_url: 'https://cdn.kctmenswear.com/double_breasted/mens_double_breasted_suit_model_2024_2.webp',
            alt_text: 'Navy Premium Suit - Back View'
          }
        ]
      },
      colors: ['#1e3a5f', '#000000', '#8b4513']
    },
    {
      id: '2',
      name: 'Black Tuxedo Classic',
      slug: 'black-tuxedo-classic',
      base_price: 349.99,
      images: {
        primary: {
          cdn_url: 'https://cdn.kctmenswear.com/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png',
          alt_text: 'Black Tuxedo Classic'
        },
        gallery: [
          {
            cdn_url: 'https://cdn.kctmenswear.com/tuxedo/black_tuxedo_detail.webp',
            alt_text: 'Black Tuxedo Detail'
          }
        ]
      }
    },
    {
      id: '3',
      name: 'Burgundy Velvet Blazer',
      slug: 'burgundy-velvet-blazer',
      base_price: 229.99,
      compare_at_price: 299.99,
      images: {
        hero: {
          url: 'https://cdn.kctmenswear.com/prom_blazer/mens_burgundy_velvet_prom_blazer_model_1015.webp',
          alt: 'Burgundy Velvet Blazer'
        },
        gallery: [
          {
            cdn_url: 'https://cdn.kctmenswear.com/prom_blazer/burgundy_velvet_detail.webp',
            alt_text: 'Burgundy Velvet Detail'
          },
          {
            cdn_url: 'https://cdn.kctmenswear.com/prom_blazer/burgundy_velvet_back.webp',
            alt_text: 'Burgundy Velvet Back'
          }
        ]
      },
      colors: ['#800020', '#000000']
    },
    {
      id: '4',
      name: 'Light Grey Summer Suit',
      slug: 'light-grey-summer-suit',
      base_price: 279.99,
      images: {
        hero: {
          url: 'https://cdn.kctmenswear.com/kct-prodcuts/Summer%20Wedding%20Bundles/sand-suit-white-shirt-sage-green-tie.png',
          alt: 'Light Grey Summer Suit'
        }
      }
    },
    {
      id: '5',
      name: 'Royal Blue Slim Fit',
      slug: 'royal-blue-slim-fit',
      base_price: 319.99,
      images: {
        primary: {
          cdn_url: 'https://cdn.kctmenswear.com/suits/royal_blue/main.webp',
          alt_text: 'Royal Blue Slim Fit'
        },
        gallery: [
          {
            cdn_url: 'https://cdn.kctmenswear.com/suits/royal_blue/side.webp',
            alt_text: 'Royal Blue Side'
          },
          {
            cdn_url: 'https://cdn.kctmenswear.com/suits/royal_blue/back.webp',
            alt_text: 'Royal Blue Back'
          },
          {
            cdn_url: 'https://cdn.kctmenswear.com/suits/royal_blue/detail.webp',
            alt_text: 'Royal Blue Detail'
          }
        ]
      },
      colors: ['#002fa7', '#1e3a5f', '#000000']
    },
    {
      id: '6',
      name: 'Charcoal Business Essential',
      slug: 'charcoal-business-essential',
      base_price: 269.99,
      compare_at_price: 349.99,
      images: {
        hero: {
          url: 'https://cdn.kctmenswear.com/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-brown-tie.png',
          alt: 'Charcoal Business Essential'
        },
        gallery: [
          {
            cdn_url: 'https://cdn.kctmenswear.com/suits/charcoal/detail.webp',
            alt_text: 'Charcoal Detail'
          }
        ]
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-light text-gray-900">
            Universal Product Card Test
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Minimal design inspired by major fashion brands • Hover to see next image • Mobile optimized
          </p>
        </div>
      </div>

      {/* Features Info */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Key Features:</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🖼️ Smart Image System</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Extracts images from enhanced products JSONB</li>
                <li>• Falls back through hero → primary → gallery</li>
                <li>• Automatic placeholder if no images</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✨ Hover Effects</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Auto-cycles through images on hover</li>
                <li>• Shows dot indicators for multiple images</li>
                <li>• Touch to cycle on mobile</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📱 Mobile First</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Large images (3:4 aspect ratio)</li>
                <li>• 2 columns on mobile, scales up</li>
                <li>• Touch-friendly interactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-light text-gray-900">
            {products.length} Products
          </h2>
          {error && (
            <span className="text-sm text-amber-600">
              {error}
            </span>
          )}
        </div>

        <UniversalProductGrid products={products} />
      </div>

      {/* Debug Info */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <details className="bg-gray-100 rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Debug: View Product Data Structure
          </summary>
          <pre className="mt-4 text-xs overflow-x-auto bg-white p-4 rounded">
            {JSON.stringify(products[0], null, 2)}
          </pre>
        </details>
      </div>

      {/* Instructions */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Implementation Guide:</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>1. Import the component:</strong>
              <pre className="mt-1 bg-white p-2 rounded text-xs">
{`import { UniversalProductCard, UniversalProductGrid } from '@/components/products/UniversalProductCard';`}
              </pre>
            </div>
            <div>
              <strong>2. Use with enhanced products:</strong>
              <pre className="mt-1 bg-white p-2 rounded text-xs">
{`<UniversalProductGrid products={enhancedProducts} />`}
              </pre>
            </div>
            <div>
              <strong>3. Single card usage:</strong>
              <pre className="mt-1 bg-white p-2 rounded text-xs">
{`<UniversalProductCard product={product} priority={true} />`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}