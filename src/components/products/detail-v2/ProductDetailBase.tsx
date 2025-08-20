'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { UnifiedProduct } from '@/types/unified-shop';
import { classifyProduct } from './utils/productClassifier';
import { resolveTemplate } from './utils/templateResolver';
import { EnhancedProduct } from './types';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface ProductDetailBaseProps {
  product: UnifiedProduct;
  relatedProducts?: UnifiedProduct[];
  className?: string;
}

const ProductDetailBase: React.FC<ProductDetailBaseProps> = ({
  product,
  relatedProducts = [],
  className = ''
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Classify the product to determine template
  const complexity = classifyProduct(product);
  
  // Enhance product with template data
  const enhancedProduct: EnhancedProduct = {
    ...product,
    templateType: complexity,
    sizingConfig: getSizingConfig(product, complexity),
    bundleConfig: getBundleConfig(product, complexity)
  };

  // Get the appropriate template component
  const TemplateComponent = resolveTemplate(complexity);
  
  // Prepare images array
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products' },
    { name: product.category || 'Category', href: `/collections/${product.category}` },
    { name: product.name, href: '#', current: true }
  ];

  return (
    <div className={`bg-white ${className}`}>
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.name}>
              <div className="flex items-center">
                {index === 0 && breadcrumb.icon && (
                  <breadcrumb.icon className="h-5 w-5 text-gray-400 mr-2" />
                )}
                {breadcrumb.current ? (
                  <span className="text-sm font-medium text-gray-500 truncate">
                    {breadcrumb.name}
                  </span>
                ) : (
                  <a
                    href={breadcrumb.href}
                    className="text-sm font-medium text-gray-500 hover:text-burgundy-600 truncate"
                  >
                    {breadcrumb.name}
                  </a>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-2" />
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-[4/5] w-full bg-gray-100 rounded-lg overflow-hidden"
            >
              <OptimizedImage
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 aspect-square w-16 h-16 bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-burgundy-500' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Rendered by Template */}
          <div className="space-y-6">
            <TemplateComponent product={enhancedProduct} />
          </div>
        </div>

        {/* Trust Signals Section */}
        <TrustSignalsSection complexity={complexity} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProductsSection products={relatedProducts} />
        )}
      </div>
    </div>
  );
};

// Trust Signals Component
const TrustSignalsSection: React.FC<{ complexity: string }> = ({ complexity }) => {
  const isPremium = complexity === 'premium';
  
  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Free Shipping
          </h3>
          <p className="text-sm text-gray-600">
            On orders over ${isPremium ? '200' : '75'}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Easy Returns
          </h3>
          <p className="text-sm text-gray-600">
            {isPremium ? '60' : '30'} day return policy
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Quality Guarantee
          </h3>
          <p className="text-sm text-gray-600">
            {isPremium ? 'Lifetime' : '1 year'} quality promise
          </p>
        </div>
      </div>
    </div>
  );
};

// Related Products Component
const RelatedProductsSection: React.FC<{ products: UnifiedProduct[] }> = ({ products }) => (
  <div className="mt-16 border-t border-gray-200 pt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.slice(0, 4).map((product) => (
        <div key={product.id} className="group cursor-pointer">
          <div className="aspect-[4/5] w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
            <OptimizedImage
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-burgundy-600 font-semibold">
            ${product.price.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// Helper functions
function getSizingConfig(product: UnifiedProduct, complexity: string) {
  // Return appropriate sizing configuration based on product type
  return {
    type: complexity === 'premium' ? 'grid' : 'buttons',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], // Default sizes
  };
}

function getBundleConfig(product: UnifiedProduct, complexity: string) {
  // Return bundle configuration
  return {
    enabled: complexity === 'accessory',
    tiers: complexity === 'accessory' ? [
      { name: 'Buy 4 Get 1 Free', description: '5 items total', price: 99.97, originalPrice: 124.96, savings: 24.99 },
      { name: 'Buy 6 Get 2 Free', description: '8 items total', price: 149.96, originalPrice: 199.94, savings: 49.98 },
      { name: 'Buy 8 Get 3 Free', description: '11 items total', price: 199.95, originalPrice: 274.93, savings: 74.98 },
    ] : undefined,
  };
}

export default ProductDetailBase;