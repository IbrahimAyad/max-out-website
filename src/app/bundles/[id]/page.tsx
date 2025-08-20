'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Check, 
  Tag, 
  Clock, 
  Truck,
  Shield,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import { weddingBundles } from '@/lib/products/weddingBundles';
import { promBundles } from '@/lib/products/promBundles';
import { casualBundles } from '@/lib/products/casualBundles';
import { getSuitImage, getShirtImage, getTieImage } from '@/lib/products/bundleImageMapping';
import { useCart } from '@/hooks/useCart';

export default function BundleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  // Check regular bundles, wedding bundles, prom bundles, and casual bundles
  let bundle = bundleProductsWithImages.bundles.find(b => b.id === params.id);
  let isWeddingBundle = false;
  let isPromBundle = false;
  let isCasualBundle = false;
  
  if (!bundle) {
    // Check wedding bundles
    const weddingBundle = weddingBundles.bundles.find(b => b.id === params.id);
    if (weddingBundle) {
      bundle = {
        ...weddingBundle,
        suit: { ...weddingBundle.suit, image: getSuitImage(weddingBundle.suit.color) || '' },
        shirt: { ...weddingBundle.shirt, image: getShirtImage(weddingBundle.shirt.color) || '' },
        tie: { ...weddingBundle.tie, image: getTieImage(weddingBundle.tie.color) || '' }
      };
      isWeddingBundle = true;
    }
  }
  
  if (!bundle) {
    // Check prom bundles
    const promBundle = promBundles.bundles.find(b => b.id === params.id);
    if (promBundle) {
      bundle = {
        ...promBundle,
        suit: { ...promBundle.suit, image: getSuitImage(promBundle.suit.color) || '' },
        shirt: { ...promBundle.shirt, image: getShirtImage(promBundle.shirt.color) || '' },
        tie: { ...promBundle.tie, image: getTieImage(promBundle.tie.color) || '' }
      };
      isPromBundle = true;
    }
  }
  
  if (!bundle) {
    // Check casual bundles
    const casualBundle = casualBundles.bundles.find(b => b.id === params.id);
    if (casualBundle) {
      bundle = {
        ...casualBundle,
        suit: { ...casualBundle.suit, image: getSuitImage(casualBundle.suit.color) || '' },
        shirt: { ...casualBundle.shirt, image: getShirtImage(casualBundle.shirt.color) || '' },
        tie: casualBundle.pocketSquare ? { ...casualBundle.pocketSquare, image: '' } : { color: '', style: '', image: '' }
      };
      isCasualBundle = true;
    }
  }
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bundle not found</h1>
          <Link 
            href="/bundles"
            className="text-blue-600 hover:underline"
          >
            Return to bundles
          </Link>
        </div>
      </div>
    );
  }

  const sizes = ['36S', '38S', '40R', '42R', '44R', '46L', '48L'];
  
  // Create array of preview images
  const images = [
    bundle.imageUrl,
    bundle.imageUrl, // Placeholder - would be different angles
    bundle.imageUrl  // Placeholder - would be detail shots
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.bundlePrice,
      image: bundle.imageUrl,
      quantity: 1,
      category: isCasualBundle ? 'casual-bundle' : isPromBundle ? 'prom-bundle' : isWeddingBundle ? 'wedding-bundle' : 'bundle',
      size: selectedSize,
      metadata: {
        suit: bundle.suit,
        shirt: bundle.shirt,
        tie: bundle.tie,
        originalPrice: bundle.originalPrice,
        savings: bundle.savings,
        ...(isWeddingBundle && { season: bundle.season }),
        ...(isCasualBundle && { pocketSquare: bundle.pocketSquare })
      }
    });
  };

  // Related bundles
  let relatedBundles = [];
  if (isWeddingBundle) {
    // For wedding bundles, show other wedding bundles from the same season
    relatedBundles = weddingBundles.bundles
      .filter(b => b.season === bundle.season && b.id !== bundle.id)
      .slice(0, 4);
  } else if (isPromBundle) {
    // For prom bundles, show other prom bundles from the same category
    relatedBundles = promBundles.bundles
      .filter(b => b.category === bundle.category && b.id !== bundle.id)
      .slice(0, 4);
  } else {
    // For regular bundles, show bundles from the same category
    relatedBundles = bundleProductsWithImages.bundles
      .filter(b => b.category === bundle.category && b.id !== bundle.id)
      .slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isWeddingBundle ? (
              <>
                <Link href="/occasions" className="text-gray-500 hover:text-gray-700">
                  Occasions
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link href="/occasions/wedding-party" className="text-gray-500 hover:text-gray-700">
                  Wedding Party
                </Link>
              </>
            ) : isPromBundle ? (
              <>
                <Link href="/occasions" className="text-gray-500 hover:text-gray-700">
                  Occasions
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link href="/occasions/prom" className="text-gray-500 hover:text-gray-700">
                  Prom
                </Link>
              </>
            ) : isCasualBundle ? (
              <>
                <Link href="/occasions" className="text-gray-500 hover:text-gray-700">
                  Occasions
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link href="/occasions/cocktail" className="text-gray-500 hover:text-gray-700">
                  Cocktail
                </Link>
              </>
            ) : (
              <Link href="/bundles" className="text-gray-500 hover:text-gray-700">
                Bundles
              </Link>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{bundle.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div>
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={images[activeImageIndex]}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                  priority
                />
                {bundle.trending && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Trending
                  </span>
                )}
                {bundle.aiScore && bundle.aiScore >= 95 && (
                  <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Score: {bundle.aiScore}
                  </span>
                )}
              </div>

              {/* Thumbnail Navigation - Individual Products */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Included Items:</p>
                <div className="grid grid-cols-3 gap-2">
                  {/* Suit Thumbnail */}
                  {bundle.suit.image && (
                    <div className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border hover:border-gray-400 transition-colors">
                        <Image
                          src={bundle.suit.image}
                          alt={`${bundle.suit.color} Suit`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">{bundle.suit.color} Suit</p>
                    </div>
                  )}
                  
                  {/* Shirt Thumbnail */}
                  {bundle.shirt.image && (
                    <div className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border hover:border-gray-400 transition-colors">
                        <Image
                          src={bundle.shirt.image}
                          alt={`${bundle.shirt.color} Shirt`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">{bundle.shirt.color} Shirt</p>
                    </div>
                  )}
                  
                  {/* Tie/Pocket Square Thumbnail */}
                  {!isCasualBundle && bundle.tie.image && (
                    <div className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border hover:border-gray-400 transition-colors">
                        <Image
                          src={bundle.tie.image}
                          alt={`${bundle.tie.color} Tie`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">{bundle.tie.color} Tie</p>
                    </div>
                  )}
                  {isCasualBundle && bundle.pocketSquare && (
                    <div className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border hover:border-gray-400 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded transform rotate-45" />
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">{bundle.pocketSquare.color} Pocket Square</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{bundle.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{bundle.description}</p>
              
              {/* Price */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold">${bundle.bundlePrice}</span>
                <span className="text-2xl text-gray-400 line-through">${bundle.originalPrice}</span>
                <span className="bg-green-600 text-white px-4 py-2 rounded-full font-medium">
                  Save ${bundle.savings}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-green-600">
                <Tag className="w-5 h-5" />
                <span className="font-medium">
                  {Math.round((bundle.savings / bundle.originalPrice) * 100)}% off when bundled
                </span>
              </div>
            </div>

            {/* Bundle Contents */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">This Bundle Includes:</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium">{bundle.suit.color} {bundle.suit.type} Suit</h3>
                    <p className="text-sm text-gray-600">Premium wool blend with tailored construction</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium">{bundle.shirt.color} {bundle.shirt.fit} Fit Shirt</h3>
                    <p className="text-sm text-gray-600">100% Egyptian cotton, wrinkle-resistant finish</p>
                  </div>
                </div>
                {!isCasualBundle && (
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium">{bundle.tie.color} {bundle.tie.style}</h3>
                      <p className="text-sm text-gray-600">Luxurious silk blend, handcrafted details</p>
                    </div>
                  </div>
                )}
                {isCasualBundle && bundle.pocketSquare && (
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium">{bundle.pocketSquare.color} Pocket Square</h3>
                      <p className="text-sm text-gray-600">Matching pocket square for sophisticated style</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select Your Size</h3>
                <Link 
                  href="/size-guide"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Size Guide
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedSize
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                Add Bundle to Cart
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="flex-1 py-4 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
                    }`}
                  />
                  {isFavorited ? 'Saved' : 'Save'}
                </button>
                <button className="flex-1 py-4 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Occasions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Perfect For:</h3>
              <div className="flex flex-wrap gap-2">
                {bundle.occasions.map((occasion) => (
                  <span
                    key={occasion}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {occasion}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Free Express Shipping</p>
                  <p className="text-xs text-gray-500">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Style Consultation</p>
                  <p className="text-xs text-gray-500">Free virtual session</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Bundle Savings</p>
                  <p className="text-xs text-gray-500">Up to 15% off</p>
                </div>
              </div>
            </div>

            {/* Customization CTA */}
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2">Want to Customize?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create your own combination with our Custom Bundle Builder
              </p>
              <Link
                href="/custom-suits"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
              >
                Build Your Own Bundle
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Bundles */}
        <div className="mt-20 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBundles.map((relatedBundle) => (
              <Link
                key={relatedBundle.id}
                href={`/bundles/${relatedBundle.id}`}
                className="group"
              >
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={relatedBundle.imageUrl}
                    alt={relatedBundle.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-semibold group-hover:underline">{relatedBundle.name}</h3>
                <p className="text-sm text-gray-600">
                  {relatedBundle.suit.color} • {relatedBundle.shirt.color} • {relatedBundle.tie.color}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold">${relatedBundle.bundlePrice}</span>
                  <span className="text-sm text-gray-400 line-through">${relatedBundle.originalPrice}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}