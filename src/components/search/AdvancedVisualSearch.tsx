"use client"

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, 
  Upload, 
  Loader2, 
  Zap, 
  Eye, 
  Palette, 
  Sparkles,
  Search,
  ArrowRight,
  Filter,
  Grid,
  List,
  Shirt,
  Star,
  Heart,
  ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface AdvancedVisualSearchResult {
  product: any
  similarity_score: number
  match_reasons: string[]
  match_details: any
  intelligent_ranking?: boolean
  user_personalized?: boolean
}

interface AdvancedImageAnalysis {
  style_classification: {
    primary: string
    personality: string
    confidence: number
  }
  color_analysis: {
    dominant_colors: string[]
    secondary_colors: string[]
    harmony_type: string
    temperature: string
  }
  pattern_texture: {
    patterns: string[]
    texture: string[]
    fabric_appearance: string
  }
  garment_analysis: {
    types: string[]
    fit: string
    quality: string
  }
  occasion_formality: {
    occasions: string[]
    formality_level: number
    season: string
  }
  market_positioning: {
    price_tier: string
    target_demographic: string
    brand_style: string
  }
  confidence_score: number
}

interface AdvancedVisualSearchProps {
  className?: string
  onResultClick?: (productId: string) => void
  compact?: boolean
}

export function AdvancedVisualSearch({ 
  className, 
  onResultClick,
  compact = false 
}: AdvancedVisualSearchProps) {
  const [searchResults, setSearchResults] = useState<AdvancedVisualSearchResult[]>([])
  const [imageAnalysis, setImageAnalysis] = useState<AdvancedImageAnalysis | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState<'advanced_similarity' | 'style_match' | 'color_harmony'>('advanced_similarity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [similarityThreshold, setSimilarityThreshold] = useState(0.70)
  const [processingTime, setProcessingTime] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const sessionId = `visual_search_${Date.now()}`

  // Handle file upload and processing
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    
    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)
      setUploadedImage(base64)

      // Advanced visual search with enhanced AI
      const { data, error } = await supabase.functions.invoke('advanced-visual-ai-search', {
        body: {
          imageData: base64,
          searchType,
          sessionId,
          userId: user?.id,
          similarityThreshold,
          limit: 16,
          advancedFeatures: true
        }
      })

      if (error) throw error

      setSearchResults(data.data.searchResults || [])
      setImageAnalysis(data.data.imageAnalysis)
      setProcessingTime(data.data.processingTime)
      
    } catch (error) {
      console.error('Advanced visual search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchType, similarityThreshold, sessionId, user?.id])

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Handle search type change
  const handleSearchTypeChange = (type: typeof searchType) => {
    setSearchType(type)
    if (uploadedImage) {
      // Re-search with new type
      handleImageUpload({ target: { files: null } } as any)
    }
  }

  // Handle result click
  const handleResultClick = (result: AdvancedVisualSearchResult) => {
    onResultClick?.(result.product.id)
  }

  const searchTypeOptions = [
    {
      value: 'advanced_similarity' as const,
      label: 'AI Similarity',
      description: 'Advanced multi-factor similarity analysis',
      icon: Zap
    },
    {
      value: 'style_match' as const,
      label: 'Style Match',
      description: 'Match style personality and characteristics',
      icon: Sparkles
    },
    {
      value: 'color_harmony' as const,
      label: 'Color Harmony',
      description: 'Color palette and harmony matching',
      icon: Palette
    }
  ]

  if (compact) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="text-center">
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 text-purple-600 mb-2">
              <Eye className="h-5 w-5" />
              <span className="font-semibold">Visual AI Search</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="text-sm text-gray-600">Upload an image to find similar items</p>
          </div>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Search by Image
              </>
            )}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-purple-600 mb-2">
          <Eye className="h-6 w-6" />
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif">
          Advanced Visual AI Search
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload any menswear image and our advanced AI will analyze style, colors, patterns, and find perfectly matching items using cutting-edge visual recognition.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
              isLoading 
                ? "border-purple-300 bg-purple-50" 
                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
            )}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded image"
                    fill
                    className="object-cover"
                  />
                </div>
                {!isLoading && (
                  <p className="text-sm text-gray-600">Click to upload a different image</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {isLoading ? (
                    <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isLoading ? 'Analyzing image...' : 'Upload an image to search'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG, or WEBP up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Search Type Options */}
          <div className="flex flex-wrap justify-center gap-2">
            {searchTypeOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleSearchTypeChange(option.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                    searchType === option.value
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs opacity-80">{option.description}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </Card>

      {/* Analysis Results */}
      {imageAnalysis && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Advanced AI Analysis
              </h3>
              {processingTime > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Processed in {processingTime}ms
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Style Classification */}
              {imageAnalysis.style_classification && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Style Analysis</h4>
                  <div className="space-y-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      {imageAnalysis.style_classification.primary}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {imageAnalysis.style_classification.personality}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {Math.round(imageAnalysis.style_classification.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
              )}

              {/* Color Analysis */}
              {imageAnalysis.color_analysis && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Color Analysis</h4>
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {imageAnalysis.color_analysis.dominant_colors?.map((color, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {imageAnalysis.color_analysis.harmony_type} • {imageAnalysis.color_analysis.temperature}
                    </p>
                  </div>
                </div>
              )}

              {/* Occasion & Formality */}
              {imageAnalysis.occasion_formality && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Occasion Fit</h4>
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {imageAnalysis.occasion_formality.occasions?.map((occasion, index) => (
                        <Badge key={index} className="bg-amber-100 text-amber-800 text-xs">
                          {occasion}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Formality: {imageAnalysis.occasion_formality.formality_level}/10
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Found {searchResults.length} Similar Items
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2",
                    viewMode === 'grid' ? "bg-purple-600 text-white" : "bg-white text-gray-600"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2",
                    viewMode === 'list' ? "bg-purple-600 text-white" : "bg-white text-gray-600"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 max-w-4xl mx-auto"
          )}>
            <AnimatePresence>
              {searchResults.map((result, index) => (
                <VisualSearchResultCard
                  key={result.product.id}
                  result={result}
                  viewMode={viewMode}
                  index={index}
                  onClick={() => handleResultClick(result)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

// Visual search result card component
interface VisualSearchResultCardProps {
  result: AdvancedVisualSearchResult
  viewMode: 'grid' | 'list'
  index: number
  onClick: () => void
}

function VisualSearchResultCard({ result, viewMode, index, onClick }: VisualSearchResultCardProps) {
  const { product, similarity_score, match_reasons, intelligent_ranking, user_personalized } = result

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
    >
      <Link href={`/products/${product.slug || product.id}`}>
        <Card className={cn(
          "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg group",
          viewMode === 'list' ? "flex" : "",
          intelligent_ranking && "ring-2 ring-purple-200"
        )}>
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
            
            {/* Similarity Score Badge */}
            <div className="absolute top-2 right-2">
              <Badge 
                className={cn(
                  "text-xs font-bold",
                  similarity_score >= 0.9 ? "bg-green-500" :
                  similarity_score >= 0.8 ? "bg-blue-500" :
                  similarity_score >= 0.7 ? "bg-yellow-500" : "bg-gray-500"
                )}
              >
                {Math.round(similarity_score * 100)}%
              </Badge>
            </div>
            
            {/* Advanced Features Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {intelligent_ranking && (
                <Badge className="bg-purple-500 text-white text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Smart
                </Badge>
              )}
              {user_personalized && (
                <Badge className="bg-blue-500 text-white text-xs">
                  <Heart className="h-3 w-3 mr-1" />
                  For You
                </Badge>
              )}
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
                <p className="text-lg font-bold text-purple-600">
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
              
              {/* Match Reasons */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Why this matches:</p>
                <div className="flex flex-wrap gap-1">
                  {match_reasons.slice(0, 2).map((reason, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
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