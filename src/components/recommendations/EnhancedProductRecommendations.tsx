"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles,
  TrendingUp,
  Heart,
  ShoppingBag,
  Star,
  ArrowRight,
  Shuffle,
  Filter,
  Grid,
  List,
  Calendar,
  Palette,
  Shirt,
  Users,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface ProductRecommendation {
  product: any
  reason: string
  score: number
  type: string
  metadata?: any
}

interface EnhancedRecommendationsProps {
  productId?: string
  userId?: string
  context?: {
    occasion?: string
    season?: string
    budget?: { min: number; max: number }
    style?: string
  }
  recommendationType?: 'complementary' | 'behavioral' | 'trending' | 'occasion_based' | 'style_match' | 'ai_powered' | 'advanced_complementary' | 'behavioral_analytics' | 'complete_outfit_builder' | 'smart_cross_category' | 'occasion_intelligent' | 'ai_curated'
  className?: string
  limit?: number
  showHeader?: boolean
  compact?: boolean
  advancedFeatures?: boolean
}

export function EnhancedProductRecommendations({
  productId,
  userId,
  context,
  recommendationType = 'complementary',
  className,
  limit = 8,
  showHeader = true,
  compact = false
  advancedFeatures = false
}: EnhancedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentType, setCurrentType] = useState(recommendationType)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { user } = useAuth()

  const sessionId = `recommendations_${Date.now()}`

  // Enhanced recommendation types with advanced AI capabilities
  const recommendationTypes = [
    {
      type: 'complementary',
      label: 'Complete the Look',
      icon: Shirt,
      description: 'Items that perfectly complement your selection',
      advanced: false
    },
    {
      type: 'advanced_complementary',
      label: 'AI-Powered Complements',
      icon: Zap,
      description: 'Advanced AI analysis for perfect item combinations',
      advanced: true
    },
    {
      type: 'behavioral',
      label: 'Based on Your Style',
      icon: Users,
      description: 'Curated based on your browsing and purchase history',
      advanced: false
    },
    {
      type: 'behavioral_analytics',
      label: 'Smart Behavioral Insights',
      icon: BarChart3,
      description: 'Advanced customer analytics and preference matching',
      advanced: true
    },
    {
      type: 'complete_outfit_builder',
      label: 'Complete Outfit Builder',
      icon: Target,
      description: 'AI-assembled complete outfits for any occasion',
      advanced: true
    },
    {
      type: 'smart_cross_category',
      label: 'Smart Upselling',
      icon: TrendingUp,
      description: 'Intelligent cross-category recommendations',
      advanced: true
    },
    {
      type: 'trending',
      label: 'Trending Now',
      icon: TrendingUp,
      description: 'Most popular items among our customers',
      advanced: false
    },
    {
      type: 'occasion_based',
      label: 'For This Occasion',
      icon: Calendar,
      description: 'Perfect for specific events and occasions',
      advanced: false
    },
    {
      type: 'occasion_intelligent',
      label: 'AI Occasion Intelligence',
      icon: Sparkles,
      description: 'Smart occasion-based recommendations with formality matching',
      advanced: true
    },
    {
      type: 'style_match',
      label: 'Your Style Profile',
      icon: Target,
      description: 'Matched to your personal style preferences',
      advanced: false
    },
    {
      type: 'ai_curated',
      label: 'AI Master Curator',
      icon: Zap,
      description: 'Premium AI curation using advanced algorithms',
      advanced: true
    }
  ]

  // Load recommendations with advanced AI support
  const loadRecommendations = async (type: string) => {
    setIsLoading(true)
    try {
      // Track recommendation request
      await supabase.functions.invoke('analytics-tracking', {
        body: {
          interactionType: 'recommendation_request',
          sessionId,
          userId: user?.id || userId,
          productId,
          interactionData: {
            recommendationType: type,
            context,
            advancedFeatures
          },
          pageUrl: window.location.href
        }
      })

      // Determine if this is an advanced recommendation type
      const isAdvancedType = ['advanced_complementary', 'behavioral_analytics', 'complete_outfit_builder', 
                              'smart_cross_category', 'occasion_intelligent', 'ai_curated'].includes(type)
      
      const functionName = isAdvancedType ? 'advanced-recommendation-engine' : 'enhanced-recommendations'

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          type,
          context: {
            ...context,
            productId,
            advanced: isAdvancedType
          },
          sessionId,
          userId: user?.id || userId,
          productId,
          limit,
          advanced: isAdvancedType
        }
      })

      if (error) {
        throw error
      }

      setRecommendations(data.data.recommendations || [])
    } catch (error) {
      console.error('Error loading recommendations:', error)
      // Enhanced fallback with better error handling
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load recommendations on mount and when type changes
  useEffect(() => {
    loadRecommendations(currentType)
  }, [currentType, productId, userId])

  // Handle recommendation click tracking
  const handleRecommendationClick = async (recommendation: ProductRecommendation, index: number) => {
    try {
      // Track recommendation click
      await supabase.functions.invoke('analytics-tracking', {
        body: {
          interactionType: 'recommendation_click',
          sessionId,
          userId: user?.id || userId,
          productId: recommendation.product.id,
          interactionData: {
            sourceProductId: productId,
            recommendationType: currentType,
            position: index,
            score: recommendation.score,
            reason: recommendation.reason
          },
          pageUrl: window.location.href
        }
      })
    } catch (error) {
      console.error('Error tracking recommendation click:', error)
    }
  }

  // Filter recommendations by category
  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedCategories.length === 0) return true
    return selectedCategories.includes(rec.product.category)
  })

  // Get available categories
  const availableCategories = Array.from(new Set(
    recommendations.map(rec => rec.product.category).filter(Boolean)
  ))

  const currentTypeInfo = recommendationTypes.find(t => t.type === currentType)

  if (compact) {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {currentTypeInfo?.icon && <currentTypeInfo.icon className="h-5 w-5 text-burgundy" />}
            {currentTypeInfo?.label || 'Recommendations'}
          </h3>
          {recommendations.length > 4 && (
            <Button variant="ghost" size="sm" className="text-burgundy">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredRecommendations.slice(0, 4).map((recommendation, index) => (
            <CompactRecommendationCard
              key={recommendation.product.id}
              recommendation={recommendation}
              index={index}
              onClick={() => handleRecommendationClick(recommendation, index)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {showHeader && (
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-burgundy mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Smart Recommendations</span>
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif">
              Curated Just for You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes your style preferences, browsing history, and current trends to recommend the perfect pieces.
            </p>
          </div>

          {/* Enhanced Recommendation Type Selector */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-2">
              {recommendationTypes
                .filter(type => advancedFeatures ? true : !type.advanced)
                .map((type) => {
                  const Icon = type.icon
                  const isAdvanced = type.advanced
                  const isSelected = currentType === type.type
                  
                  return (
                    <button
                      key={type.type}
                      onClick={() => setCurrentType(type.type as any)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all relative",
                        isSelected
                          ? isAdvanced 
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600"
                            : "bg-burgundy text-white border-burgundy"
                          : "bg-white text-gray-700 border-gray-300 hover:border-burgundy",
                        isAdvanced && "ring-2 ring-purple-200 ring-offset-1"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isAdvanced && "text-purple-300")} />
                      <span className="text-sm font-medium">{type.label}</span>
                      {isAdvanced && (
                        <Sparkles className="h-3 w-3 ml-1 text-purple-300" />
                      )}
                    </button>
                  )
                })}
            </div>
            
            {currentTypeInfo && (
              <div className={cn(
                "mt-3 p-3 rounded-lg",
                currentTypeInfo.advanced 
                  ? "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200"
                  : "bg-gray-50 border border-gray-200"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  {currentTypeInfo.advanced && <Zap className="h-4 w-4 text-purple-600" />}
                  <p className={cn(
                    "text-sm",
                    currentTypeInfo.advanced ? "text-purple-800 font-medium" : "text-gray-600"
                  )}>
                    {currentTypeInfo.description}
                  </p>
                </div>
                {currentTypeInfo.advanced && (
                  <p className="text-xs text-purple-600 mt-1">
                    Enhanced with advanced AI algorithms
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Controls */}
      {filteredRecommendations.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Results info */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredRecommendations.length} recommendations
              </span>
              
              {isLoading && (
                <div className="flex items-center gap-2 text-burgundy">
                  <div className="w-4 h-4 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadRecommendations(currentType)}
                disabled={isLoading}
              >
                <Shuffle className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 text-sm",
                    viewMode === 'grid' ? "bg-burgundy text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 text-sm",
                    viewMode === 'list' ? "bg-burgundy text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          {availableCategories.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by category:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full border transition-colors",
                    selectedCategories.length === 0
                      ? "bg-burgundy text-white border-burgundy"
                      : "bg-white text-gray-600 border-gray-300 hover:border-burgundy"
                  )}
                >
                  All
                </button>
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategories(prev => 
                        prev.includes(category) 
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                      )
                    }}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full border transition-colors",
                      selectedCategories.includes(category)
                        ? "bg-burgundy text-white border-burgundy"
                        : "bg-white text-gray-600 border-gray-300 hover:border-burgundy"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Recommendations Grid */}
      {filteredRecommendations.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 max-w-4xl mx-auto"
        )}>
          <AnimatePresence>
            {filteredRecommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.product.id}
                recommendation={recommendation}
                viewMode={viewMode}
                index={index}
                onClick={() => handleRecommendationClick(recommendation, index)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        !isLoading && (
          <Card className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Available</h3>
            <p className="text-gray-600 mb-4">
              We're working on finding the perfect recommendations for you. Try a different recommendation type or check back soon.
            </p>
            <Button 
              onClick={() => loadRecommendations(currentType)}
              disabled={isLoading}
            >
              Try Again
            </Button>
          </Card>
        )
      )}
    </div>
  )
}

// Full recommendation card component
interface RecommendationCardProps {
  recommendation: ProductRecommendation
  viewMode: 'grid' | 'list'
  index: number
  onClick: () => void
}

function RecommendationCard({ recommendation, viewMode, index, onClick }: RecommendationCardProps) {
  const { product, reason, score, type } = recommendation

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
    >
      <Link href={`/products/${product.slug || product.id}`}>
        <Card 
          className={cn(
            "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg group",
            viewMode === 'list' ? "flex" : ""
          )}
        >
          {/* Product Image */}
          <div className={cn(
            "relative bg-gray-100",
            viewMode === 'list' ? "w-48 flex-shrink-0" : "aspect-square"
          )}>
            {product.images?.main ? (
              <Image
                src={product.images.main}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Shirt className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {/* Score Badge */}
            <div className="absolute top-2 right-2">
              <Badge 
                className={cn(
                  "text-xs font-bold",
                  score >= 0.9 ? "bg-green-500" :
                  score >= 0.8 ? "bg-blue-500" :
                  score >= 0.7 ? "bg-yellow-500" : "bg-gray-500"
                )}
              >
                {Math.round(score * 100)}%
              </Badge>
            </div>
            
            {/* Type Badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs">
                {type.replace('_', ' ')}
              </Badge>
            </div>
            
            {/* Quick Actions */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className={cn(
            "p-4",
            viewMode === 'list' ? "flex-1" : ""
          )}>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-burgundy">
                  ${product.base_price}
                </p>
                
                {product.average_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.average_rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Recommendation Reason */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Why we recommend this:</p>
                <p className="text-sm text-burgundy bg-burgundy/5 px-2 py-1 rounded">
                  {reason}
                </p>
              </div>
              
              {/* Product Details */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{product.category}</span>
                {product.subcategory && (
                  <>
                    <span>•</span>
                    <span>{product.subcategory}</span>
                  </>
                )}
              </div>
              
              {viewMode === 'list' && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                  {product.short_description || product.description}
                </p>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

// Compact recommendation card for sidebar use
interface CompactRecommendationCardProps {
  recommendation: ProductRecommendation
  index: number
  onClick: () => void
}

function CompactRecommendationCard({ recommendation, index, onClick }: CompactRecommendationCardProps) {
  const { product, score } = recommendation

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
    >
      <Link href={`/products/${product.slug || product.id}`}>
        <Card className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md group">
          <div className="relative aspect-square bg-gray-100">
            {product.images?.main ? (
              <Image
                src={product.images.main}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Shirt className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            <div className="absolute top-1 right-1">
              <Badge size="sm" className="text-xs bg-white/90 text-gray-800">
                {Math.round(score * 100)}%
              </Badge>
            </div>
          </div>
          
          <div className="p-2">
            <h4 className="font-medium text-sm line-clamp-2 mb-1">
              {product.name}
            </h4>
            <p className="text-sm font-bold text-burgundy">
              ${product.base_price}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}