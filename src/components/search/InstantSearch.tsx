"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Clock, TrendingUp, Command } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { EnhancedProduct } from '@/lib/supabase/types'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/format'

interface InstantSearchProps {
  isOpen: boolean
  onClose: () => void
}

const popularSearches = [
  'Black Tuxedo',
  'Burgundy Vest',
  'Wedding Suits',
  'Prom Collection',
  'Three Piece Suit',
  'Bow Ties'
]

const quickCategories = [
  { label: 'Suits', href: '/products/suits', color: 'bg-burgundy' },
  { label: 'Tuxedos', href: '/products/suits/tuxedos', color: 'bg-black' },
  { label: 'Dress Shirts', href: '/collections/dress-shirts', color: 'bg-gray-700' },
  { label: 'Accessories', href: '/collections/accessories', color: 'bg-gold' }
]

export function InstantSearch({ isOpen, onClose }: InstantSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<EnhancedProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/supabase/products?search=${encodeURIComponent(debouncedQuery)}&limit=6`)
        const data = await response.json()
        setResults(data.products || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchProducts()
  }, [debouncedQuery])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            window.location.href = `/products/${results[selectedIndex].id}`
          } else if (query) {
            handleSearch()
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, query, onClose])

  const handleSearch = () => {
    if (!query) return

    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(query)}`
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Header */}
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search suits, accessories, occasions..."
                  className="w-full px-6 py-5 pr-12 text-lg focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Search Body */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Loading State */}
                {isLoading && (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-burgundy border-t-transparent" />
                      Searching...
                    </div>
                  </div>
                )}

                {/* Search Results */}
                {!isLoading && results.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Products</h3>
                    <div className="space-y-2">
                      {results.map((product, index) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className={cn(
                            "flex items-center gap-4 p-3 rounded-lg transition-all",
                            "hover:bg-gray-50",
                            selectedIndex === index && "bg-gray-50 ring-2 ring-burgundy/20"
                          )}
                        >
                          <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={product.images[0]?.url || '/placeholder-suit.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(product.compareAtPrice)}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="mt-4 flex items-center justify-center gap-2 p-3 text-burgundy hover:bg-burgundy/5 rounded-lg transition-colors"
                    >
                      <span className="text-sm font-medium">View all results & Visual Search</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && query && results.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-600 mb-4">No products found for "{query}"</p>
                    <p className="text-sm text-gray-500">Try searching for:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {popularSearches.slice(0, 3).map(term => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Initial State */}
                {!query && (
                  <div className="p-6 space-y-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Recent Searches
                          </h3>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map(term => (
                            <button
                              key={term}
                              onClick={() => setQuery(term)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Searches */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4" />
                        Trending Now
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 bg-burgundy/10 hover:bg-burgundy/20 text-burgundy rounded-full text-sm font-medium transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Categories */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-3">Quick Browse</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {quickCategories.map(cat => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            className="group relative overflow-hidden rounded-lg p-4 text-white transition-transform hover:scale-105"
                          >
                            <div className={cn("absolute inset-0", cat.color)} />
                            <div className="relative">
                              <h4 className="font-semibold">{cat.label}</h4>
                              <p className="text-xs opacity-90 mt-1">Browse collection</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">↵</kbd> to search</span>
                  <span className="flex items-center gap-1">
                    <Command className="h-3 w-3" />K to open search
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}