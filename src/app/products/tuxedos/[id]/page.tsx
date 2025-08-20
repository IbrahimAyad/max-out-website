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
  Truck,
  Shield,
  Sparkles,
  ChevronRight,
  Calendar,
  Users
} from 'lucide-react';
import { getTuxedoById, tuxedoProducts } from '@/lib/products/tuxedoProducts';
import { useCart } from '@/hooks/useCart';

export default function TuxedoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  const tuxedo = getTuxedoById(params.id as string);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!tuxedo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tuxedo not found</h1>
          <Link 
            href="/products/suits"
            className="text-blue-600 hover:underline"
          >
            Return to suits & tuxedos
          </Link>
        </div>
      </div>
    );
  }

  const sizes = ['34S', '36S', '38S', '40R', '42R', '44R', '46L', '48L', '50L', '52L', '54L'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: tuxedo.id,
      name: tuxedo.name,
      price: tuxedo.price,
      image: tuxedo.image,
      quantity: 1,
      category: 'tuxedo',
      size: selectedSize,
      metadata: {
        color: tuxedo.color,
        type: '2-piece'
      }
    });
  };

  // Related tuxedos
  const relatedTuxedos = tuxedoProducts
    .filter(t => t.id !== tuxedo.id)
    .slice(0, 3);

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
            <Link href="/products" className="text-gray-500 hover:text-gray-700">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/products/suits" className="text-gray-500 hover:text-gray-700">
              Suits & Tuxedos
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{tuxedo.name}</span>
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
                  src={tuxedo.gallery[activeImageIndex]}
                  alt={tuxedo.name}
                  fill
                  className="object-cover"
                  priority
                />
                <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Statement Piece
                </span>
              </div>

              {/* Thumbnail Gallery */}
              {tuxedo.gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tuxedo.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImageIndex === index ? 'border-purple-600' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${tuxedo.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{tuxedo.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{tuxedo.description}</p>
              
              {/* Price */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold">${tuxedo.price}</span>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium">
                  2-Piece Formal Tuxedo
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-green-600">
                <Truck className="w-5 h-5" />
                <span className="font-medium">Free Express Shipping</span>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Premium Features:</h2>
              <div className="space-y-3">
                {tuxedo.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
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
                        ? 'border-purple-600 bg-purple-600 text-white'
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
                Add to Cart
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
                {['Prom Night', 'Weddings', 'Black Tie Events', 'Galas', 'Formal Dinners', 'Quinceañeras'].map((occasion) => (
                  <span
                    key={occasion}
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {occasion}
                  </span>
                ))}
              </div>
            </div>

            {/* Rush Delivery */}
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-lg">Need it for an upcoming event?</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Rush delivery available! Order by 2PM EST for next-day shipping. 
                Perfect for last-minute prom or formal event needs.
              </p>
              <button className="text-purple-600 font-medium hover:underline">
                Learn about rush delivery options →
              </button>
            </div>

            {/* Group Discount CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Going with friends?</h3>
              </div>
              <p className="mb-4">
                Order 4 or more tuxedos and save! Perfect for prom groups and wedding parties.
              </p>
              <Link
                href="/prom-groups"
                className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Group Discount
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t">
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
            </div>
          </div>
        </div>

        {/* Related Tuxedos */}
        <div className="mt-20 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-8">More Statement Tuxedos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTuxedos.map((relatedTuxedo) => (
              <Link
                key={relatedTuxedo.id}
                href={`/products/tuxedos/${relatedTuxedo.id}`}
                className="group"
              >
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={relatedTuxedo.image}
                    alt={relatedTuxedo.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-semibold group-hover:underline">{relatedTuxedo.name}</h3>
                <p className="text-sm text-gray-600">2-Piece Formal Tuxedo</p>
                <p className="font-bold mt-1">${relatedTuxedo.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}