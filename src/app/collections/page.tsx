'use client';

import { Suspense, useMemo } from 'react';
import { useUnifiedShop } from '@/hooks/useUnifiedShop';
import { MasterCollectionPage } from '@/components/collections/MasterCollectionPage';
import { UnifiedProduct } from '@/types/unified-shop';

// All categories with updated images and dynamic counts
const allCategories = [
  {
    id: 'suits',
    name: 'Suits',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    count: 0, // Will be updated dynamically
    description: 'Complete suit collections'
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/classic-fit-collection.jpg',
    count: 0,
    description: 'Dress shirts and casual shirts'
  },
  {
    id: 'vest',
    name: 'Vests',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/dusty-sage-vest-tie.png',
    count: 0,
    description: 'Formal and casual vests'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    image: 'https://cdn.kctmenswear.com/blazers/prom/mens-red-floral-pattern-prom-blazer/front.webp',
    count: 0,
    description: 'Blazers and sport coats'
  },
  {
    id: 'pants',
    name: 'Shirt & Tie',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/dd5c1f7d-722d-4e17-00be-60a3fdb33900/public',
    count: 0,
    description: 'Dress pants and trousers'
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    count: 0,
    description: 'Sweaters and knit tops'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    count: 0,
    description: 'Ties, belts, and more'
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    count: 0,
    description: 'Dress shoes and boots'
  }
];

function CollectionsContent() {
  const { products, loading, error } = useUnifiedShop({
    initialFilters: { includeBundles: false },
    autoFetch: true
  });
  


  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    if (!products) return allCategories;
    
    return allCategories.map(category => {
      const count = products.filter(product => {
        const productCategory = product.category?.toLowerCase() || '';
        const categoryId = category.id.toLowerCase();
        
        // Match logic for different categories
        if (categoryId === 'suits') {
          return productCategory.includes('suit') || 
                 productCategory.includes('tuxedo') ||
                 productCategory.includes('blazer');
        }
        if (categoryId === 'shirts') {
          return productCategory.includes('shirt');
        }
        if (categoryId === 'vest') {
          return productCategory.includes('vest');
        }
        if (categoryId === 'jackets') {
          return productCategory.includes('jacket') || 
                 productCategory.includes('blazer') ||
                 productCategory.includes('coat');
        }
        if (categoryId === 'pants') {
          return productCategory.includes('pant') || 
                 productCategory.includes('trouser');
        }
        if (categoryId === 'knitwear') {
          return productCategory.includes('knit') || 
                 productCategory.includes('sweater') ||
                 productCategory.includes('cardigan');
        }
        if (categoryId === 'accessories') {
          return productCategory.includes('tie') || 
                 productCategory.includes('bow') ||
                 productCategory.includes('belt') ||
                 productCategory.includes('suspender') ||
                 productCategory.includes('pocket') ||
                 productCategory.includes('cufflink');
        }
        if (categoryId === 'shoes') {
          return productCategory.includes('shoe') || 
                 productCategory.includes('boot');
        }
        
        return false;
      }).length;
      
      return { ...category, count };
    });
  }, [products]);

  // Transform products for MasterCollectionPage
  const transformedProducts = useMemo(() => {
    if (!products) return [];
    
    return products.map((product: UnifiedProduct) => ({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      originalPrice: product.compare_at_price ? parseFloat(product.compare_at_price) : 
                     (product.price > 100 ? product.price * 1.2 : undefined),
      image: product.images?.[0]?.src || product.featured_image?.src || product.primary_image || product.image || '/placeholder-product.jpg',
      hoverImage: product.images?.[1]?.src || product.additionalImages?.[0],
      category: product.category?.toLowerCase().includes('suit') ? 'suits' :
                product.category?.toLowerCase().includes('shirt') ? 'shirts' :
                product.category?.toLowerCase().includes('vest') ? 'vest' :
                product.category?.toLowerCase().includes('jacket') || product.category?.toLowerCase().includes('blazer') ? 'jackets' :
                product.category?.toLowerCase().includes('pant') ? 'pants' :
                product.category?.toLowerCase().includes('knit') || product.category?.toLowerCase().includes('sweater') ? 'knitwear' :
                product.category?.toLowerCase().includes('tie') || product.category?.toLowerCase().includes('belt') ? 'accessories' :
                product.category?.toLowerCase().includes('shoe') ? 'shoes' : 'other',
      tags: product.tags || [],
      isNew: product.tags?.includes('new-arrival'),
      isSale: product.tags?.includes('sale')
    }));
  }, [products]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MasterCollectionPage
      title="Master Collection"
      subtitle="COMPLETE MENSWEAR"
      description="Precision-tailored pieces in timeless colors enhance every part of a man's wardrobe"
      categories={categoriesWithCounts}
      products={transformedProducts}
      heroImage="https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-3-main.jpg"
    />
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-burgundy mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-burgundy rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Collections</h2>
          <p className="text-gray-600 animate-pulse">Preparing your shopping experience...</p>
        </div>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}