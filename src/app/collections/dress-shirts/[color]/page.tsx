'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Check, Ruler } from 'lucide-react';
import { dressShirtProducts, getDressShirtColorById } from '@/lib/products/dressShirtProducts';
import DressShirtFitSelector from '@/components/products/DressShirtFitSelector';
import DressShirtSizeSelector from '@/components/products/DressShirtSizeSelector';
import SizeGuideModal from '@/components/products/SizeGuideModal';
import { useCart } from '@/hooks/useCart';

interface ColorParams {
  color: string;
}

export default function DressShirtColorPage() {
  const params = useParams() as unknown as ColorParams;
  const colorData = getDressShirtColorById(params.color);
  
  const [selectedFit, setSelectedFit] = useState<string>('slim');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addItem } = useCart();

  if (!colorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Color not found</p>
      </div>
    );
  }

  const selectedFitData = dressShirtProducts.fits[selectedFit as keyof typeof dressShirtProducts.fits];
  const pageTitle = `${colorData.name} Dress Shirt`;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: `dress-shirt-${colorData.id}-${selectedFit}-${Date.now()}`,
      name: `${colorData.name} ${selectedFitData.name} Dress Shirt`,
      price: selectedFitData.price,
      image: colorData.imageUrl,
      quantity: quantity,
      stripePriceId: selectedFitData.priceId,
      stripeProductId: selectedFitData.productId,
      selectedColor: colorData.name,
      selectedSize: selectedSize,
      category: 'dress-shirts',
      metadata: {
        color: colorData.name,
        fit: selectedFitData.name,
        size: selectedSize
      }
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pageTitle,
        text: `Check out this ${colorData.name} dress shirt in ${selectedFitData.name}`,
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
            <Link href="/collections/dress-shirts" className="text-gray-500 hover:text-gray-700">
              Dress Shirts
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{colorData.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={colorData.imageUrl}
                alt={`${colorData.name} Dress Shirt`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Color swatches */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">More Colors:</span>
              <div className="flex space-x-2">
                {dressShirtProducts.colors.slice(0, 8).map((color) => (
                  <Link
                    key={color.id}
                    href={`/collections/dress-shirts/${color.id}`}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color.id === colorData.id 
                        ? 'border-blue-600 scale-110' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
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
                  <span className="ml-2 text-sm text-gray-600">4.8 (47 reviews)</span>
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
                ${selectedFitData.price}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600">
                Crafted from premium cotton with a smooth finish, this {colorData.name.toLowerCase()} dress shirt 
                is perfect for both professional and formal occasions. Features include a spread collar, 
                button cuffs, and a tailored silhouette.
              </p>
            </div>

            {/* Fit Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-gray-900">Select Fit:</p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                >
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>
              <DressShirtFitSelector
                selectedFit={selectedFit}
                onFitChange={setSelectedFit}
                fits={dressShirtProducts.fits}
              />
            </div>

            {/* Size Selection */}
            <div>
              <DressShirtSizeSelector
                selectedFit={selectedFit}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                fits={dressShirtProducts.fits}
              />
            </div>

            {/* Quantity Selection */}
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

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                !selectedSize
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : addedToCart
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
                `Add to Cart - $${(selectedFitData.price * quantity).toFixed(2)}`
              )}
            </button>

            {/* Product Features */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="font-medium text-gray-900 mb-4">Product Features</h3>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Premium 100% cotton fabric</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Wrinkle-resistant finish</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Machine washable</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Free shipping on orders over $75</span>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-3">Care Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Machine wash cold with like colors</li>
                <li>• Tumble dry low or hang to dry</li>
                <li>• Warm iron if needed</li>
                <li>• Do not bleach or dry clean</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          productType="shirt"
        />
      )}
    </div>
  );
}