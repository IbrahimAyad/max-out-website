'use client';

import React from 'react';
import { HybridProductResult } from '@/lib/products/enhanced/types';
import { HybridProductService } from '@/lib/products/enhanced/hybridService';

// Enhanced product components
import { EnhancedImageGallery } from '../enhanced/EnhancedImageGallery';
import { PricingTierDisplay, TierProgression } from '../enhanced/PricingTierDisplay';

// Legacy product components (assuming they exist)
import { ProductImageAnalysis } from '../ProductImageAnalysis';

interface HybridProductPageProps {
  productResult: HybridProductResult;
  className?: string;
}

export function HybridProductPage({ productResult, className = '' }: HybridProductPageProps) {
  
  const isEnhanced = productResult.source === 'enhanced';
  const product = productResult.enhanced_product || productResult.legacy_product;

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const productPrice = HybridProductService.getProductPrice(productResult);
  const productName = HybridProductService.getProductName(productResult);
  const isInStock = HybridProductService.isInStock(productResult);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - Images */}
        <div className="space-y-6">
          {isEnhanced && productResult.enhanced_product ? (
            // Enhanced product image gallery
            <EnhancedImageGallery
              images={productResult.enhanced_product.images}
              productName={productName}
              enableZoom={true}
              enableFullscreen={true}
            />
          ) : (
            // Legacy product image display
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={HybridProductService.getProductImageUrl(productResult)}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Legacy product image analysis if available */}
              {productResult.legacy_product && (
                <ProductImageAnalysis imageUrl={productResult.legacy_product.imageUrl} />
              )}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          
          {/* Product Header */}
          <div className="space-y-4">
            {/* System Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                isEnhanced 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isEnhanced ? 'Enhanced Product' : 'Classic Product'}
              </span>
              
              {isEnhanced && productResult.enhanced_product?.featured && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
              
              {isEnhanced && productResult.enhanced_product?.trending && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                  Trending
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{productName}</h1>

            {/* Category and Brand */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="capitalize">
                {isEnhanced ? productResult.enhanced_product?.category : productResult.legacy_product?.category}
              </span>
              {isEnhanced && productResult.enhanced_product?.brand && (
                <>
                  <span>•</span>
                  <span>{productResult.enhanced_product.brand}</span>
                </>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${productPrice.toFixed(2)}
                </span>
                
                {/* Stock Status */}
                <span className={`px-3 py-1 text-sm font-medium rounded ${
                  isInStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Enhanced Pricing Tiers */}
              {isEnhanced && productResult.enhanced_product?.pricing_tiers && (
                <div className="space-y-4">
                  <PricingTierDisplay
                    pricingTiers={productResult.enhanced_product.pricing_tiers}
                    currentPrice={productResult.enhanced_product.base_price}
                    displayMode="detailed"
                  />
                  
                  <TierProgression
                    pricingTiers={productResult.enhanced_product.pricing_tiers}
                    currentPrice={productResult.enhanced_product.base_price}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            
            {isEnhanced && productResult.enhanced_product ? (
              <div className="space-y-3">
                {productResult.enhanced_product.short_description && (
                  <p className="text-lg text-gray-700">
                    {productResult.enhanced_product.short_description}
                  </p>
                )}
                <p className="text-gray-600">
                  {productResult.enhanced_product.description}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                {productResult.legacy_product?.description}
              </p>
            )}
          </div>

          {/* Enhanced Features */}
          {isEnhanced && productResult.enhanced_product?.features && Array.isArray(productResult.enhanced_product.features) && productResult.enhanced_product.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {productResult.enhanced_product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {isEnhanced && productResult.enhanced_product?.specifications && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <SpecificationDisplay specifications={productResult.enhanced_product.specifications} />
              </div>
            </div>
          )}

          {/* Legacy Product Metadata */}
          {!isEnhanced && productResult.legacy_product?.metadata && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <LegacyMetadataDisplay metadata={productResult.legacy_product.metadata} />
              </div>
            </div>
          )}

          {/* Care Instructions */}
          {isEnhanced && productResult.enhanced_product?.care_instructions && Array.isArray(productResult.enhanced_product.care_instructions) && productResult.enhanced_product.care_instructions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Care Instructions</h2>
              <ul className="space-y-1 text-gray-600">
                {productResult.enhanced_product.care_instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 pt-6 border-t">
            <button
              className={`w-full py-3 px-6 rounded-md text-lg font-medium transition-colors ${
                isInStock
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isInStock}
            >
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button className="w-full py-3 px-6 border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying enhanced product specifications
function SpecificationDisplay({ specifications }: { specifications: any }) {
  const specs = specifications as any;
  
  return (
    <div className="space-y-3">
      {specs.material && (
        <div className="flex justify-between">
          <span className="font-medium">Material:</span>
          <span className="text-gray-600">{specs.material}</span>
        </div>
      )}
      
      {specs.fit_type && (
        <div className="flex justify-between">
          <span className="font-medium">Fit:</span>
          <span className="text-gray-600 capitalize">{specs.fit_type}</span>
        </div>
      )}
      
      {specs.country_of_origin && (
        <div className="flex justify-between">
          <span className="font-medium">Made in:</span>
          <span className="text-gray-600">{specs.country_of_origin}</span>
        </div>
      )}
      
      {specs.customizable && (
        <div className="flex justify-between">
          <span className="font-medium">Customizable:</span>
          <span className="text-green-600">Yes</span>
        </div>
      )}
    </div>
  );
}

// Helper component for displaying legacy product metadata
function LegacyMetadataDisplay({ metadata }: { metadata: any }) {
  return (
    <div className="space-y-3">
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
          <span className="text-gray-600">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}