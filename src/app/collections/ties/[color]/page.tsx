'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Check } from 'lucide-react';
import { tieProducts, getTieColorById } from '@/lib/products/tieProducts';
import TieStyleSelector from '@/components/products/TieStyleSelector';
import TieBundleCalculator from '@/components/products/TieBundleCalculator';
import SizeGuideModal from '@/components/products/SizeGuideModal';
import { useCart } from '@/hooks/useCart';

interface ColorParams {
  color: string;
}

export default function TieColorCollectionPage() {
  const pathname = usePathname();
  const color = pathname.split('/').pop() as string;
  const colorId = color.replace('-collection', '');
  const colorData = getTieColorById(colorId);
  const { addItem } = useCart();
  
  const [selectedStyle, setSelectedStyle] = useState<string>('bowtie');
  const [purchaseMode, setPurchaseMode] = useState<'single' | 'bundle'>('single');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<'five' | 'eight' | 'eleven'>('five');
  const [addedToCart, setAddedToCart] = useState(false);

  if (!colorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Color not found</p>
      </div>
    );
  }

  const selectedStyleData = tieProducts.styles[selectedStyle as keyof typeof tieProducts.styles];
  const pageTitle = `${colorData.name} Ties & Bowties Collection`;

  const handleAddToCart = () => {
    if (purchaseMode === 'single') {
      // Add single tie
      addItem({
        id: `tie-${colorData.id}-${selectedStyle}`,
        name: `${colorData.name} ${selectedStyleData.name}`,
        price: selectedStyleData.price,
        image: colorData.imageUrl,
        quantity: quantity,
        stripePriceId: selectedStyleData.priceId,
        stripeProductId: selectedStyleData.productId,
        selectedColor: colorData.name,
        selectedSize: selectedStyleData.width,
        category: 'ties',
        metadata: {
          color: colorData.name,
          style: selectedStyleData.name,
          width: selectedStyleData.width
        }
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } else {
      // Navigate to bundle builder
      window.location.href = `/products/ties/${colorData.id}-${selectedStyle}`;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pageTitle,
        text: `Check out this ${colorData.name} ${selectedStyleData.name}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/collections/ties" className="text-gray-500 hover:text-gray-700">
              Ties
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{colorData.name} Collection</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={colorData.imageUrl}
                alt={`${colorData.name} ${selectedStyleData.name}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Thumbnail previews */}
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(tieProducts.styles).map(([styleKey, style]) => (
                <button
                  key={styleKey}
                  onClick={() => setSelectedStyle(styleKey)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedStyle === styleKey
                      ? 'border-blue-600 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={colorData.imageUrl}
                    alt={style.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-1 left-1 right-1 text-white text-xs font-medium">
                    {style.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {pageTitle}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.8 (3 reviews)</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${selectedStyleData.price}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600">
                Elevate your style with our premium {colorData.name.toLowerCase()} tie 
                collection. Each tie is meticulously crafted from high-quality silk 
                with a subtle texture that adds sophistication to any outfit.
              </p>
            </div>

            {/* Color Display */}
            <div>
              <p className="font-medium text-gray-900 mb-2">
                Color: {colorData.name}
              </p>
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: colorData.hex }}
                />
                <div className="flex space-x-2">
                  {/* Show other popular colors */}
                  {tieProducts.colors.slice(0, 4).map((color) => (
                    <Link
                      key={color.id}
                      href={`/collections/ties/${color.id}-collection`}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Style Selector */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-gray-900">Select Style:</p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Size Guide
                </button>
              </div>
              <TieStyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                styles={tieProducts.styles}
              />
            </div>

            {/* Purchase Options */}
            <div>
              <p className="font-medium text-gray-900 mb-4">Purchase Options:</p>
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setPurchaseMode('single')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    purchaseMode === 'single'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Single Item
                </button>
                <button
                  onClick={() => setPurchaseMode('bundle')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    purchaseMode === 'bundle'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Bundle & Save
                </button>
              </div>

              {purchaseMode === 'single' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center border border-gray-300 rounded-lg py-2"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5 inline-block mr-2" />
                        Added to Cart
                      </>
                    ) : (
                      `Add to Cart - $${(selectedStyleData.price * quantity).toFixed(2)}`
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <TieBundleCalculator
                    selectedBundle={selectedBundle}
                    onBundleChange={setSelectedBundle}
                    bundles={tieProducts.bundles}
                    basePrice={selectedStyleData.price}
                  />
                  
                  <Link
                    href={`/products/ties/${colorId}-${selectedStyle}`}
                    className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Customize Bundle
                  </Link>
                </div>
              )}
            </div>

            {/* Product Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">30-day easy returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Quality guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          productType="ties"
        />
      )}
    </div>
  );
}