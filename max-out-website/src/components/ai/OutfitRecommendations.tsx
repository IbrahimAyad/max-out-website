"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  Sparkles, 
  Calendar,
  DollarSign,
  Sun,
  Cloud,
  Snowflake,
  Droplets,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Info,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/format'
import type { 
  OutfitRecommendation, 
  RecommendationContext, 
  OccasionType,
  Season 
} from '@/lib/ai/types'
import { EnhancedProduct } from '@/lib/supabase/types'
import Image from 'next/image'
import Link from 'next/link'

interface OutfitRecommendationsProps {
  userId?: string
  className?: string
}

const OCCASIONS: Array<{ value: OccasionType; label: string; icon: string }> = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'wedding-guest', label: 'Wedding Guest', icon: '👔' },
  { value: 'business-formal', label: 'Business Formal', icon: '💼' },
  { value: 'business-casual', label: 'Business Casual', icon: '👨‍💼' },
  { value: 'cocktail', label: 'Cocktail Party', icon: '🍸' },
  { value: 'black-tie', label: 'Black Tie', icon: '🎩' },
  { value: 'prom', label: 'Prom', icon: '🎉' },
  { value: 'date-night', label: 'Date Night', icon: '🌹' },
  { value: 'interview', label: 'Job Interview', icon: '🤝' },
  { value: 'graduation', label: 'Graduation', icon: '🎓' },
  { value: 'holiday-party', label: 'Holiday Party', icon: '🎄' },
  { value: 'casual-friday', label: 'Casual Friday', icon: '😎' }
]

const SEASONS: Array<{ value: Season; label: string; icon: any }> = [
  { value: 'spring', label: 'Spring', icon: Sun },
  { value: 'summer', label: 'Summer', icon: Sun },
  { value: 'fall', label: 'Fall', icon: Cloud },
  { value: 'winter', label: 'Winter', icon: Snowflake }
]

export function OutfitRecommendations({ userId, className }: OutfitRecommendationsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([])
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('business-formal')
  const [selectedSeason, setSelectedSeason] = useState<Season>('fall')
  const [budget, setBudget] = useState({ min: 200, max: 1000, preferred: 500 })
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitRecommendation | null>(null)

  const generateRecommendations = async () => {
    setIsLoading(true)
    try {
      const context: RecommendationContext = {
        occasion: selectedOccasion,
        season: selectedSeason,
        budget,
        personalStyle: {
          personality: 'modern',
          formalityLevel: 7,
          trendiness: 6,
          colorfulness: 5,
          uniqueness: 5
        },
        bodyType: 'regular',
        preferences: {
          favoriteColors: ['navy', 'gray', 'burgundy'],
          avoidColors: [],
          favoritePatterns: ['solid', 'subtle-stripe'],
          avoidPatterns: ['loud-print'],
          favoriteBrands: [],
          fitPreferences: { 'suit': 'tailored', 'shirt': 'slim' }
        }
      }

      const response = await fetch('/api/ai/outfit-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, userId })
      })

      const data = await response.json()
      if (data.success) {
        setRecommendations(data.recommendations)
        setShowRecommendations(true)
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-burgundy mb-4">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-widest uppercase">Atelier AI</span>
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif mb-4">
          AI-Powered Outfit Recommendations
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your occasion and let our AI stylist create the perfect outfit for you
        </p>
      </div>

      {!showRecommendations ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Occasion Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's the occasion?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {OCCASIONS.map(occasion => (
                <button
                  key={occasion.value}
                  onClick={() => setSelectedOccasion(occasion.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all",
                    "hover:border-burgundy hover:shadow-md",
                    selectedOccasion === occasion.value
                      ? "border-burgundy bg-burgundy/5"
                      : "border-gray-200"
                  )}
                >
                  <span className="text-2xl mb-1">{occasion.icon}</span>
                  <p className="text-sm font-medium">{occasion.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Season Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Season
            </label>
            <div className="grid grid-cols-4 gap-3">
              {SEASONS.map(season => (
                <button
                  key={season.value}
                  onClick={() => setSelectedSeason(season.value)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    "hover:border-burgundy hover:shadow-md",
                    "flex flex-col items-center gap-2",
                    selectedSeason === season.value
                      ? "border-burgundy bg-burgundy/5"
                      : "border-gray-200"
                  )}
                >
                  <season.icon className="h-6 w-6" />
                  <p className="text-sm font-medium">{season.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Budget Range
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <input
                  type="range"
                  min="100"
                  max="2000"
                  value={budget.preferred}
                  onChange={(e) => setBudget({ 
                    ...budget, 
                    preferred: Number(e.target.value),
                    min: Number(e.target.value) * 0.7,
                    max: Number(e.target.value) * 1.3
                  })}
                  className="flex-1"
                />
                <span className="font-semibold">{formatPrice(budget.preferred)}</span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                We'll find options between {formatPrice(budget.min)} - {formatPrice(budget.max)}
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateRecommendations}
            disabled={isLoading}
            className="w-full bg-burgundy hover:bg-burgundy-700 text-white py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating your perfect outfit...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Outfit Recommendations
              </>
            )}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setShowRecommendations(false)}
            className="mb-6"
          >
            ← Try Different Options
          </Button>

          {/* Recommendations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((outfit, index) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                index={index}
                onSelect={() => setSelectedOutfit(outfit)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Outfit Detail Modal */}
      <AnimatePresence>
        {selectedOutfit && (
          <OutfitDetailModal
            outfit={selectedOutfit}
            onClose={() => setSelectedOutfit(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface OutfitCardProps {
  outfit: OutfitRecommendation
  index: number
  onSelect: () => void
}

function OutfitCard({ outfit, index, onSelect }: OutfitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
        onClick={onSelect}
      >
        <div className="p-6">
          {/* Confidence Badge */}
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-burgundy text-white">
              {Math.round(outfit.confidence * 100)}% Match
            </Badge>
            <span className="text-lg font-semibold">{formatPrice(outfit.totalPrice)}</span>
          </div>

          {/* Items Preview */}
          <div className="space-y-2 mb-4">
            {outfit.items.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-burgundy rounded-full" />
                <span className="text-gray-600">{item.category.replace('-', ' ')}</span>
              </div>
            ))}
            {outfit.items.length > 3 && (
              <p className="text-xs text-gray-500">+{outfit.items.length - 3} more items</p>
            )}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">Occasion Fit</p>
              <p className="font-semibold">{outfit.occasionFit}%</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">Visual Harmony</p>
              <p className="font-semibold">{outfit.visualHarmony}%</p>
            </div>
          </div>

          {/* View Details */}
          <Button className="w-full bg-burgundy hover:bg-burgundy-700 text-white">
            View Outfit Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

interface OutfitDetailModalProps {
  outfit: OutfitRecommendation
  onClose: () => void
}

function OutfitDetailModal({ outfit, onClose }: OutfitDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif">Outfit Details</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Outfit Items */}
          <div className="space-y-4 mb-6">
            {outfit.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded" />
                <div className="flex-1">
                  <h4 className="font-medium capitalize">{item.category.replace('-', ' ')}</h4>
                  <p className="text-sm text-gray-600">{item.reason}</p>
                  <p className="text-sm font-semibold mt-1">Size recommendation available</p>
                </div>
                <Link href={`/products/${item.productId}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Styling Notes */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Styling Notes
            </h4>
            <ul className="space-y-2">
              {outfit.stylingNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-burgundy mt-0.5">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-burgundy hover:bg-burgundy-700 text-white">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add Outfit to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Save Outfit
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}