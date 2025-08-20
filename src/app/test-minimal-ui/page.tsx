'use client';

import { useState, useEffect } from 'react';
import UltraMinimalProductCard from '@/components/products/UltraMinimalProductCard';
import ProductQuickView from '@/components/products/ProductQuickView';
import { createClient } from '@/lib/supabase/client';

export default function TestMinimalUIPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (
              id,
              option1,
              price,
              inventory_quantity,
              stripe_price_id
            )
          `)
          .eq('status', 'active')
          .eq('visibility', true)
          .limit(12);

        if (error) throw error;

        // Transform to match our component expectations
        const transformedProducts = data?.map(product => ({
          ...product,
          price: product.base_price ? product.base_price / 100 : 179,
          variants: product.product_variants,
          sizes: product.product_variants
            ?.filter((v: any) => v.option1 && v.option1 !== 'Default Size')
            .map((v: any) => v.option1)
        })) || [];

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use demo data as fallback
        setProducts(getDemoProducts());
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Demo products fallback
  const getDemoProducts = () => [
    {
      id: '1',
      name: 'Navy Classic',
      price: 179,
      primary_image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp',
      category: 'Suits',
      available: true,
      sizes: ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R']
    },
    {
      id: '2',
      name: 'Black Classic',
      price: 179,
      primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png',
      category: 'Suits',
      available: true,
      sizes: ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R']
    },
    {
      id: '3',
      name: 'Charcoal Classic',
      price: 179,
      primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-brown-tie.png',
      category: 'Suits',
      available: true,
      sizes: ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R']
    },
    {
      id: '4',
      name: 'Grey Classic',
      price: 179,
      primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/casual-bundles/navy-white-shirt-white-pocket-sqaure.png',
      category: 'Suits',
      available: true,
      sizes: ['36R', '38R', '40R', '42R', '44R', '46R', '48R']
    },
    {
      id: '5',
      name: 'Brown Classic',
      price: 179,
      primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/indigo-2p-white-dusty-pink.png',
      category: 'Suits',
      available: false,
      sizes: []
    },
    {
      id: '6',
      name: 'Olive Classic',
      price: 179,
      primary_image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/sparkle-blazer/mens_burgundy_glitter_finish_sparkle_model_1046.webp',
      category: 'Suits',
      available: true,
      sizes: ['40R', '42R', '44R', '46R']
    }
  ];

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const currentIndex = products.findIndex(p => p.id === selectedProduct?.id);
    let newIndex = currentIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : products.length - 1;
    } else {
      newIndex = currentIndex < products.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedProduct(products[newIndex]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Minimal UI Test</h1>
              <p className="text-sm text-gray-600 mt-1">
                Tap/Click products to open quick view • {isMobile ? 'Mobile' : 'Desktop'} Mode
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {products.length} Products
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {products.map(product => (
              <UltraMinimalProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onNavigate={handleNavigate}
        isMobile={isMobile}
      />
    </div>
  );
}