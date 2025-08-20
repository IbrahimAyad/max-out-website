'use client'

import { useWishlistWithProducts, useWishlist } from '@/lib/hooks/useWishlist'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/format'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default function WishlistPage() {
  const { products, isLoading } = useWishlistWithProducts()
  const { removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    // Add the first available size
    const availableVariant = product.variants.find((v: any) => v.stock > 0)
    if (availableVariant) {
      addToCart(product.id, availableVariant.size, 1)
      toast.success('Added to cart', {
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart'
        }
      })
    } else {
      toast.error('Product is out of stock')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">Save items you love to view them later</p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-red-500 fill-current" />
                  <h1 className="text-2xl font-semibold">My Wishlist</h1>
                  <span className="text-gray-500">({products.length} items)</span>
                </div>
                
                {products.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your wishlist?')) {
                        clearWishlist()
                      }
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link href={`/products/${product.id}`}>
                      <div className="relative h-64 bg-gray-100">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-medium hover:text-gold transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-lg font-bold text-gold mt-1">{formatPrice(product.price)}</p>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}