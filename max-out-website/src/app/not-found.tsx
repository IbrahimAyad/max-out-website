'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 animate-pulse">404</h1>
          <div className="relative -mt-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 bg-gold/20 rounded-full animate-ping"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="h-24 w-24 bg-gold/30 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gold" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We can't seem to find the page you're looking for. It might have been moved, 
          deleted, or you may have mistyped the URL.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
          <Link href="/" className="group">
            <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Home className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-gold transition-colors">
                Homepage
              </p>
            </div>
          </Link>
          <Link href="/shop" className="group">
            <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <ShoppingBag className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-gold transition-colors">
                Shop
              </p>
            </div>
          </Link>
          <Link href="/contact" className="group">
            <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Search className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-gold transition-colors">
                Contact
              </p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-gold hover:bg-gold/90 text-black font-medium"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you believe this is an error or need assistance finding what you're looking for, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="tel:269-532-4852" className="text-gold hover:text-gold/80 font-medium">
              Call: (269) 532-4852
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="mailto:KCTMenswear@gmail.com" className="text-gold hover:text-gold/80 font-medium">
              Email: KCTMenswear@gmail.com
            </a>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Popular Categories:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/collections/suits">
              <Button variant="outline" size="sm">Suits</Button>
            </Link>
            <Link href="/collections/wedding">
              <Button variant="outline" size="sm">Wedding</Button>
            </Link>
            <Link href="/collections/prom">
              <Button variant="outline" size="sm">Prom</Button>
            </Link>
            <Link href="/collections/accessories">
              <Button variant="outline" size="sm">Accessories</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}