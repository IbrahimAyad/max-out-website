'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EnhancedProduct } from '@/lib/supabase/types'
import { SupabaseProductCard } from '@/components/shop/SupabaseProductCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface RelatedProductsProps {
  currentProductId: string
  category?: string | null
  className?: string
}

export function RelatedProducts({ currentProductId, category, className }: RelatedProductsProps) {
  const [products, setProducts] = useState<EnhancedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        const params = new URLSearchParams()
        if (category) params.append('category', category)
        params.append('limit', '8')
        
        const response = await fetch(`/api/supabase/products?${params.toString()}`)
        const data = await response.json()
        
        // Filter out current product
        const related = data.products.filter((p: EnhancedProduct) => p.id !== currentProductId)
        setProducts(related.slice(0, 6))
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, category])

  if (isLoading || products.length === 0) {
    return null
  }

  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < products.length - 1

  const scrollLeft = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const scrollRight = () => {
    setCurrentIndex(Math.min(products.length - 1, currentIndex + 1))
  }

  return (
    <section className={cn("py-16 border-t", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">You May Also Like</h2>
            <p className="text-gray-600 mt-1">Discover similar styles from our collection</p>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2"
              >
                <SupabaseProductCard
                  product={product}
                  variant="default"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-gold w-6" : "bg-gray-300"
              )}
            />
          ))}
        </div>

        {/* View all link */}
        {category && (
          <div className="text-center mt-8">
            <Link href={`/products?category=${category}`}>
              <Button variant="outline">
                View All {category}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}