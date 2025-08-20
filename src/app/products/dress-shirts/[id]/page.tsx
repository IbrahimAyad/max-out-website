'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Check } from 'lucide-react';
import { dressShirtProducts, getDressShirtColorById } from '@/lib/products/dressShirtProducts';
import DressShirtFitSelector from '@/components/products/DressShirtFitSelector';
import DressShirtSizeSelector from '@/components/products/DressShirtSizeSelector';
import { useCart } from '@/hooks/useCart';

export default function DressShirtProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Parse id (e.g., "navy-slim" -> color: navy, fit: slim)
  const [colorId, fitId] = id.split('-');
  const colorData = getDressShirtColorById(colorId);
  const fitData = dressShirtProducts.fits[fitId as keyof typeof dressShirtProducts.fits];
  
  const [selectedFit, setSelectedFit] = useState(fitId || 'slim');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addItem } = useCart();

  if (!colorData || !fitData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const currentFitData = dressShirtProducts.fits[selectedFit as keyof typeof dressShirtProducts.fits];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: `dress-shirt-${colorId}-${selectedFit}-${selectedSize}-${Date.now()}`,
      name: `${colorData.name} ${currentFitData.name} Dress Shirt`,
      price: currentFitData.price,
      image: colorData.imageUrl,
      quantity: quantity,
      stripePriceId: currentFitData.priceId,
      stripeProductId: currentFitData.productId,
      selectedColor: colorData.name,
      selectedSize: selectedSize,
      category: 'dress-shirts',
      metadata: {
        color: colorData.name,
        fit: currentFitData.name,
        size: selectedSize
      }
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleFitChange = (newFit: string) => {
    setSelectedFit(newFit);
    // Navigate to the new product URL
    router.push(`/products/dress-shirts/${colorId}-${newFit}`);
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
            <Link href={`/collections/dress-shirts/${colorId}`} className="text-gray-500 hover:text-gray-700">
              {colorData.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{currentFitData.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={colorData.imageUrl}
                alt={`${colorData.name} ${currentFitData.name} Dress Shirt`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {colorData.name} {currentFitData.name} Dress Shirt
              </h1>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                ${currentFitData.price}
              </p>
              <p className="text-gray-600">
                {currentFitData.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Color:</span>
                  <span className="ml-2">{colorData.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Material:</span>
                  <span className="ml-2">100% Cotton</span>
                </div>
              </div>
            </div>

            {/* Fit Selection */}
            <div>
              <p className="font-medium text-gray-900 mb-4">Select Fit:</p>
              <DressShirtFitSelector
                selectedFit={selectedFit}
                onFitChange={handleFitChange}
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

            {/* Quantity */}
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

            {/* Add to Cart */}
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
                `Add to Cart - $${(currentFitData.price * quantity).toFixed(2)}`
              )}
            </button>

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

            {/* Related Colors */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Available in Other Colors</h3>
              <div className="grid grid-cols-8 gap-2">
                {dressShirtProducts.colors.map((color) => (
                  <Link
                    key={color.id}
                    href={`/products/dress-shirts/${color.id}-${selectedFit}`}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      color.id === colorId
                        ? 'border-blue-600 scale-110'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={color.imageUrl}
                      alt={color.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 12.5vw, 6.25vw"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}