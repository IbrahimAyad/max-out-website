'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Info, 
  Ruler, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'

interface SizeOption {
  size: string
  label?: string
  inStock: boolean
  popularity?: 'high' | 'medium' | 'low'
  aiRecommended?: boolean
  previousPurchase?: boolean
  measurements?: {
    chest: string
    waist: string
    length: string
  }
}

interface LuxurySizeSelectorProps {
  productType: 'blazer' | 'suit' | 'pants' | 'shirt'
  sizes: SizeOption[] | string[]
  selectedSize: string
  onSizeSelect: (size: string) => void
  aiRecommendation?: {
    size: string
    confidence: number
    reason: string
  }
  userProfile?: {
    height: string
    weight: string
    preferredFit: 'slim' | 'regular' | 'relaxed'
  }
  onSizeGuideOpen?: () => void
  onAIAssistantOpen?: () => void
  className?: string
}

interface SizeGroup {
  category: string
  heightRange: string
  sizes: string[]
}

const SUIT_SIZE_GROUPS: SizeGroup[] = [
  { category: 'SHORT', heightRange: "5'4\" - 5'7\"", sizes: ['34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S'] },
  { category: 'REGULAR', heightRange: "5'8\" - 6'1\"", sizes: ['34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R'] },
  { category: 'LONG', heightRange: "6'2\" +", sizes: ['38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L'] }
]

const BLAZER_SIZES = ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R']

export function LuxurySizeSelector({
  productType,
  sizes,
  selectedSize,
  onSizeSelect,
  aiRecommendation,
  userProfile,
  onSizeGuideOpen,
  onAIAssistantOpen,
  className
}: LuxurySizeSelectorProps) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null)
  const [showAIInsights, setShowAIInsights] = useState(false)

  // Normalize sizes to SizeOption format
  const normalizedSizes = useMemo(() => {
    if (typeof sizes[0] === 'string') {
      return (sizes as string[]).map(size => ({
        size,
        inStock: true,
        popularity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low' as const,
        aiRecommended: aiRecommendation?.size === size,
        previousPurchase: false // Could be populated from user history
      }))
    }
    return sizes as SizeOption[]
  }, [sizes, aiRecommendation])

  const handleSizeSelect = useCallback((size: string) => {
    onSizeSelect(size)
  }, [onSizeSelect])

  const getSizeGroups = () => {
    if (productType === 'blazer') {
      return [{ category: 'BLAZER', heightRange: 'All Heights', sizes: BLAZER_SIZES }]
    }
    if (productType === 'suit') {
      return SUIT_SIZE_GROUPS
    }
    // For other product types, return a single group
    return [{ category: 'SIZE', heightRange: '', sizes: normalizedSizes.map(s => s.size) }]
  }

  const getSizeInfo = (size: string) => {
    return normalizedSizes.find(s => s.size === size)
  }

  const getPopularityColor = (popularity?: 'high' | 'medium' | 'low') => {
    switch (popularity) {
      case 'high': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-gray-100 text-gray-600'
      default: return ''
    }
  }

  const sizeGroups = getSizeGroups()

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with AI Assistant */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Size</h3>
          {aiRecommendation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.3 }}
            >
              <Badge 
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 cursor-pointer"
                onClick={() => setShowAIInsights(!showAIInsights)}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI Recommended
              </Badge>
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {onAIAssistantOpen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAIAssistantOpen}
              className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1 px-3 py-1.5 rounded-full bg-burgundy-50 hover:bg-burgundy-100 transition-colors"
            >
              <Zap className="h-4 w-4" />
              AI Size Assistant
            </motion.button>
          )}
          
          {onSizeGuideOpen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSizeGuideOpen}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Ruler className="h-4 w-4" />
              Size Guide
            </motion.button>
          )}
        </div>
      </div>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {showAIInsights && aiRecommendation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 mb-1">
                    Size {aiRecommendation.size} - {aiRecommendation.confidence}% Match
                  </h4>
                  <p className="text-sm text-purple-700 mb-2">{aiRecommendation.reason}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${aiRecommendation.confidence}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-xs font-medium text-purple-600">
                      {aiRecommendation.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Selection */}
      <div className="space-y-4">
        {sizeGroups.map((group, groupIndex) => (
          <div key={group.category}>
            {/* Group Header (for suits) */}
            {sizeGroups.length > 1 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">{group.category}</h4>
                  <span className="text-xs text-gray-500">({group.heightRange})</span>
                </div>
              </div>
            )}

            {/* Size Grid */}
            <div className={cn(
              "grid gap-2",
              productType === 'blazer' ? "grid-cols-5" : "grid-cols-5 md:grid-cols-6"
            )}>
              {group.sizes.map((size, index) => {
                const sizeInfo = getSizeInfo(size)
                const isSelected = selectedSize === size
                const isRecommended = sizeInfo?.aiRecommended
                const isPopular = sizeInfo?.popularity === 'high'
                const isPrevious = sizeInfo?.previousPurchase
                
                return (
                  <motion.button
                    key={size}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 + index * 0.02 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSizeSelect(size)}
                    onMouseEnter={() => setHoveredSize(size)}
                    onMouseLeave={() => setHoveredSize(null)}
                    disabled={!sizeInfo?.inStock}
                    className={cn(
                      "relative py-3 px-2 border-2 rounded-xl transition-all duration-300 font-medium text-sm group disabled:opacity-50 disabled:cursor-not-allowed",
                      isSelected
                        ? "border-burgundy-600 bg-burgundy-50 text-burgundy-700 shadow-lg shadow-burgundy-200/50"
                        : sizeInfo?.inStock
                          ? "border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50/50"
                          : "border-gray-200 bg-gray-50",
                      isRecommended && !isSelected && "border-purple-300 bg-purple-50",
                      isPrevious && "ring-1 ring-green-300"
                    )}
                    aria-label={`Size ${size}${isRecommended ? ' (AI Recommended)' : ''}${isPrevious ? ' (Previously purchased)' : ''}`}
                  >
                    <span className="relative z-10">{size}</span>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="sizeSelection"
                        className="absolute inset-0 border-2 border-burgundy-600 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* AI Recommendation Badge */}
                    {isRecommended && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                      >
                        <Sparkles className="h-2.5 w-2.5 text-white" />
                      </motion.div>
                    )}
                    
                    {/* Popularity Indicator */}
                    {isPopular && !isRecommended && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full">
                        <TrendingUp className="h-2 w-2 text-white m-0.5" />
                      </div>
                    )}
                    
                    {/* Previous Purchase Indicator */}
                    {isPrevious && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                    
                    {/* Out of Stock Overlay */}
                    {!sizeInfo?.inStock && (
                      <div className="absolute inset-0 bg-gray-200/80 rounded-xl flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">Out</span>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Size Information Panel */}
      <AnimatePresence>
        {hoveredSize && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Size {hoveredSize}</h4>
                {getSizeInfo(hoveredSize)?.measurements && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Chest: {getSizeInfo(hoveredSize)?.measurements?.chest}</p>
                    <p>Waist: {getSizeInfo(hoveredSize)?.measurements?.waist}</p>
                    <p>Length: {getSizeInfo(hoveredSize)?.measurements?.length}</p>
                  </div>
                )}
                {getSizeInfo(hoveredSize)?.popularity && (
                  <div className="mt-2">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      getPopularityColor(getSizeInfo(hoveredSize)?.popularity)
                    )}>
                      <Users className="h-3 w-3" />
                      {getSizeInfo(hoveredSize)?.popularity} demand
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personal Recommendation */}
      {selectedSize && getSizeInfo(selectedSize)?.aiRecommended && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-900">Perfect Match!</p>
              <p className="text-sm text-green-700">
                This size is tailored to your measurements and style preferences.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Size Recommendation for Previous Purchase */}
      {selectedSize && getSizeInfo(selectedSize)?.previousPurchase && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-900">Great Choice!</p>
              <p className="text-sm text-blue-700">
                You've purchased this size before. We hope it fits perfectly again!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Profile Based Recommendation */}
      {userProfile && !selectedSize && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-purple-900 mb-1">Based on Your Profile</p>
              <p className="text-sm text-purple-700">
                Height: {userProfile.height} • Preferred Fit: {userProfile.preferredFit}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                We recommend starting with our suggested size above
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default LuxurySizeSelector