'use client';

import { Wifi, RefreshCw, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Offline Icon */}
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Wifi className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
          <div className="absolute w-1 h-8 bg-red-500 rotate-45 rounded-full"></div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Don't worry - you can still browse 
          some of our content that's been saved to your device.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          {/* Retry Button */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/products"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl text-left">
          <h3 className="font-semibold text-blue-900 mb-2">While you're offline:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Browse previously viewed products</li>
            <li>• Check your saved favorites</li>
            <li>• Review your cart items</li>
            <li>• Read our style guides</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-gray-500">
          <p>KCT Menswear - Premium Men's Formal Wear</p>
          <p className="mt-1">Your cart and favorites are saved locally</p>
        </div>
      </div>
    </div>
  );
}