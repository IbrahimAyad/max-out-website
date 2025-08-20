"use client"

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload,
  Camera,
  Search,
  Loader2,
  X,
  Sparkles,
  Palette,
  Shirt,
  Star,
  Filter,
  SortDesc,
  Grid,
  List,
  Download,
  Share,
  Heart,
  ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface VisualSearchResult {
  product: any
  similarity_score: number
  match_reasons: string[]
}

interface ImageAnalysis {
  style_classification: string[]
  color_palette: {
    dominant_colors: string[]
    accent_colors: string[]
  }
  patterns: string[]
  garment_types: string[]
  occasions: string[]
  season: string
  fabric_characteristics: string[]
  style_personality: string
  confidence_score: number
}

interface VisualSearchProps {
  className?: string
  maxResults?: number
}

export function VisualSearchInterface({ className, maxResults = 12 }: VisualSearchProps) {
  const [searchResults, setSearchResults] = useState<VisualSearchResult[]>([])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [similarityThreshold, setSimilarityThreshold] = useState(0.75)
  const [sortBy, setSortBy] = useState<'similarity' | 'price' | 'popularity'>('similarity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const router = useRouter()

  const sessionId = `visual_search_${Date.now()}`

  // Handle product selection and navigation
  const handleProductSelect = useCallback((product: any) => {
    // Navigate to product page
    router.push(`/products/${product.slug || product.id}`)
  }, [router])

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return

    setIsProcessing(true)
    setSearchResults([])
    setImageAnalysis(null)

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)
      setUploadedImage(base64)

      // Track visual search interaction
      await supabase.functions.invoke('analytics-tracking', {
        body: {
          interactionType: 'visual_search',
          sessionId,
          userId: user?.id,
          interactionData: {
            imageSize: file.size,
            imageType: file.type,
            fileName: file.name
          },
          pageUrl: window.location.href
        }
      })

      // Perform visual search
      const { data, error } = await supabase.functions.invoke('visual-search', {
        body: {
          imageData: base64,
          searchType: 'similar',
          sessionId,
          userId: user?.id,
          similarityThreshold,
          limit: maxResults
        }
      })

      if (error) throw error

      setSearchResults(data.data.searchResults)
      setImageAnalysis(data.data.imageAnalysis)
      
    } catch (error) {
      console.error('Visual search error:', error)
      // Show error message to user
    } finally {
      setIsProcessing(false)
    }
  }, [similarityThreshold, maxResults, user?.id])

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    if (imageFile) {
      handleFileUpload(imageFile)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Filter and sort results
  const processedResults = searchResults
    .filter(result => {
      if (selectedFilters.length === 0) return true
      return selectedFilters.some(filter => 
        result.product.category?.toLowerCase().includes(filter.toLowerCase()) ||
        result.match_reasons.some(reason => reason.toLowerCase().includes(filter.toLowerCase()))
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'similarity':
          return b.similarity_score - a.similarity_score
        case 'price':
          return a.product.base_price - b.product.base_price
        case 'popularity':
          return (b.product.view_count || 0) - (a.product.view_count || 0)
        default:
          return 0
      }
    })

  // Get filter options from results
  const availableFilters = Array.from(new Set(
    searchResults.flatMap(result => [
      result.product.category,
      ...result.match_reasons
    ]).filter(Boolean)
  ))

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-burgundy mb-2">
          <Camera className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-widest uppercase">Visual Search</span>
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif">
          Find Similar Items with AI
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload an image of any clothing item and our AI will analyze the style, colors, and patterns to find similar pieces in our collection.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-8">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isProcessing ? "border-burgundy bg-burgundy/5" : "border-gray-300 hover:border-burgundy"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!uploadedImage ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload an Image</h3>
                <p className="text-gray-600">Drag and drop an image here, or click to browse</p>
                <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WebP up to 10MB</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="bg-burgundy hover:bg-burgundy-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // For mobile camera access
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.capture = 'environment'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileUpload(file)
                    }
                    input.click()
                  }}
                  disabled={isProcessing}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block">
                <Image
                  src={uploadedImage}
                  alt="Uploaded image"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => {
                    setUploadedImage(null)
                    setSearchResults([])
                    setImageAnalysis(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isProcessing && (
                <div className="flex items-center justify-center gap-2 text-burgundy">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Analyzing image...</span>
                </div>
              )}
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={isProcessing}
              >
                Upload Different Image
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Image Analysis Results */}
      {imageAnalysis && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-burgundy" />
            AI Analysis Results
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Style Classification */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Style</h4>
              <div className="space-y-1">
                {imageAnalysis.style_classification?.map((style, index) => (
                  <Badge key={index} variant="secondary" className="mr-1">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                <Palette className="h-4 w-4" />
                Colors
              </h4>
              <div className="space-y-1">
                {imageAnalysis.color_palette?.dominant_colors?.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-gray-600 capitalize">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Garment Types */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                <Shirt className="h-4 w-4" />
                Items
              </h4>
              <div className="space-y-1">
                {imageAnalysis.garment_types?.map((type, index) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Occasions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Occasions</h4>
              <div className="space-y-1">
                {imageAnalysis.occasions?.map((occasion, index) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1">
                    {occasion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Confidence Score: {Math.round((imageAnalysis.confidence_score || 0.7) * 100)}%</span>
              <span>Style Personality: {imageAnalysis.style_personality || 'Classic'}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Search Controls */}
      {searchResults.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Results count and similarity threshold */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {processedResults.length} of {searchResults.length} results
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Min Similarity:</span>
                <select 
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={0.5}>50%</option>
                  <option value={0.6}>60%</option>
                  <option value={0.7}>70%</option>
                  <option value={0.75}>75%</option>
                  <option value={0.8}>80%</option>
                  <option value={0.9}>90%</option>
                </select>
              </div>
            </div>
            
            {/* Sort and view controls */}
            <div className="flex items-center gap-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="similarity">Sort by Similarity</option>
                <option value="price">Sort by Price</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
              
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1 text-sm",
                    viewMode === 'grid' ? "bg-burgundy text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1 text-sm",
                    viewMode === 'list' ? "bg-burgundy text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filters */}
          {availableFilters.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFilters.slice(0, 8).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilters(prev => 
                        prev.includes(filter) 
                          ? prev.filter(f => f !== filter)
                          : [...prev, filter]
                      )
                    }}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full border transition-colors",
                      selectedFilters.includes(filter)
                        ? "bg-burgundy text-white border-burgundy"
                        : "bg-white text-gray-600 border-gray-300 hover:border-burgundy"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Search Results */}
      {processedResults.length > 0 && (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 max-w-4xl mx-auto"
        )}>
          <AnimatePresence>
            {processedResults.map((result, index) => (
              <VisualSearchResultCard
                key={result.product.id}
                result={result}
                viewMode={viewMode}
                onSelect={() => handleProductSelect(result.product)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {searchResults.length === 0 && uploadedImage && !isProcessing && (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Similar Items Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any items similar to your uploaded image. Try adjusting the similarity threshold or upload a different image.
          </p>
          <Button 
            onClick={() => setSimilarityThreshold(0.5)}
            variant="outline"
          >
            Lower Similarity Threshold
          </Button>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
        className="hidden"
      />
    </div>
  )
}

// Visual search result card component
interface VisualSearchResultCardProps {
  result: VisualSearchResult
  viewMode: 'grid' | 'list'
  onSelect: () => void
  index: number
}

function VisualSearchResultCard({ result, viewMode, onSelect, index }: VisualSearchResultCardProps) {
  const { product, similarity_score, match_reasons } = result

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={cn(
          "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg group",
          viewMode === 'list' ? "flex" : ""
        )}
        onClick={onSelect}
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
          
          {/* Similarity Badge */}
          <div className="absolute top-2 right-2">
            <Badge 
              className={cn(
                "text-xs font-bold",
                similarity_score >= 0.9 ? "bg-green-500" :
                similarity_score >= 0.8 ? "bg-blue-500" :
                similarity_score >= 0.7 ? "bg-yellow-500" : "bg-gray-500"
              )}
            >
              {Math.round(similarity_score * 100)}% match
            </Badge>
          </div>
          
          {/* Quick Actions */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            
            {/* Match Reasons */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Why it matches:</p>
              <div className="flex flex-wrap gap-1">
                {match_reasons.slice(0, 3).map((reason, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Product Categories */}
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
    </motion.div>
  )
}