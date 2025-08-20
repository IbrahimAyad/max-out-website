"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Ruler, 
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Loader2,
  User,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { 
  SizeRecommendation, 
  BodyMeasurements,
  FitRating 
} from '@/lib/ai/types'

interface SizeAssistantProps {
  productId: string
  userId?: string
  productName?: string
  productBrand?: string
  className?: string
  onSizeSelect?: (size: string) => void
}

const MEASUREMENT_FIELDS: Array<{
  key: keyof BodyMeasurements
  label: string
  unit: string
  placeholder: string
  helpText: string
}> = [
  { key: 'chest', label: 'Chest', unit: 'in', placeholder: '38', helpText: 'Measure around the fullest part' },
  { key: 'waist', label: 'Waist', unit: 'in', placeholder: '32', helpText: 'Measure at natural waistline' },
  { key: 'neck', label: 'Neck', unit: 'in', placeholder: '15', helpText: 'Measure around base of neck' },
  { key: 'sleeve', label: 'Sleeve', unit: 'in', placeholder: '33', helpText: 'From shoulder to wrist' },
  { key: 'height', label: 'Height', unit: 'ft/in', placeholder: '5\'10"', helpText: 'Your total height' },
  { key: 'weight', label: 'Weight', unit: 'lbs', placeholder: '170', helpText: 'Your current weight' }
]

export function SizeAssistant({ 
  productId, 
  userId, 
  productName = 'this item',
  productBrand,
  className,
  onSizeSelect 
}: SizeAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null)
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [measurements, setMeasurements] = useState<Partial<BodyMeasurements>>({})
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const getSizeRecommendation = async (withMeasurements = false) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/size-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId,
          measurements: withMeasurements ? measurements : undefined
        })
      })

      const data = await response.json()
      if (data.success) {
        setRecommendation(data.recommendation)
        if (data.recommendation.confidence < 0.7 && !withMeasurements) {
          setShowMeasurements(true)
        }
      }
    } catch (error) {
      console.error('Size prediction error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMeasurementChange = (key: keyof BodyMeasurements, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }))
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    onSizeSelect?.(size)
  }

  const getFitIcon = (score: number) => {
    if (score > 0.5) return <TrendingUp className="h-4 w-4 text-orange-500" />
    if (score < -0.5) return <TrendingDown className="h-4 w-4 text-blue-500" />
    return <Check className="h-4 w-4 text-green-500" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-orange-600 bg-orange-50'
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="h-5 w-5 text-burgundy" />
        <h3 className="text-lg font-semibold">AI Size Assistant</h3>
      </div>

      {!recommendation ? (
        <Card className="p-6">
          <p className="text-gray-600 mb-4">
            Let our AI help you find the perfect size for {productName}
          </p>
          <Button
            onClick={() => getSizeRecommendation(false)}
            disabled={isLoading}
            className="w-full bg-burgundy hover:bg-burgundy-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Ruler className="mr-2 h-4 w-4" />
                Get Size Recommendation
              </>
            )}
          </Button>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Main Recommendation */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Recommended Size: {recommendation.recommendedSize}
                  </h4>
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm",
                    getConfidenceColor(recommendation.confidence)
                  )}>
                    {recommendation.confidence >= 0.8 ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {Math.round(recommendation.confidence * 100)}% Confidence
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSizeSelect(recommendation.recommendedSize)}
                  className="bg-burgundy hover:bg-burgundy-700 text-white"
                >
                  Select Size
                </Button>
              </div>

              {/* Brand Adjustment */}
              {recommendation.brandAdjustment && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Info className="inline h-4 w-4 mr-1" />
                    {recommendation.brandAdjustment.note}
                  </p>
                </div>
              )}

              {/* Fit Prediction */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm text-gray-700">Fit Prediction:</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Chest</span>
                    <div className="flex items-center gap-1">
                      {getFitIcon(recommendation.fitPrediction.chestFit.score)}
                      <span className="text-xs text-gray-600">
                        {recommendation.fitPrediction.chestFit.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Waist</span>
                    <div className="flex items-center gap-1">
                      {getFitIcon(recommendation.fitPrediction.waistFit.score)}
                      <span className="text-xs text-gray-600">
                        {recommendation.fitPrediction.waistFit.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Length</span>
                    <div className="flex items-center gap-1">
                      {getFitIcon(recommendation.fitPrediction.lengthFit.score)}
                      <span className="text-xs text-gray-600">
                        {recommendation.fitPrediction.lengthFit.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Shoulders</span>
                    <div className="flex items-center gap-1">
                      {getFitIcon(recommendation.fitPrediction.shoulderFit.score)}
                      <span className="text-xs text-gray-600">
                        {recommendation.fitPrediction.shoulderFit.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Scores */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Comfort Score</p>
                  <p className="text-xl font-bold text-burgundy">
                    {recommendation.fitPrediction.overallComfort}%
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Mobility Rating</p>
                  <p className="text-xl font-bold text-burgundy">
                    {recommendation.fitPrediction.mobilityRating}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Alternative Sizes */}
            {recommendation.alternativeSizes.length > 0 && (
              <Card className="p-6">
                <h4 className="font-semibold mb-3">Alternative Options</h4>
                <div className="space-y-2">
                  {recommendation.alternativeSizes.map((alt, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleSizeSelect(alt.size)}
                    >
                      <div>
                        <span className="font-medium">Size {alt.size}</span>
                        <p className="text-sm text-gray-600">{alt.fitAdjustment}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Improve Accuracy */}
            {recommendation.confidence < 0.8 && !showMeasurements && (
              <Card className="p-6 border-dashed border-2 border-burgundy/30 bg-burgundy/5">
                <h4 className="font-semibold mb-2">Want More Accurate Sizing?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Add your measurements for a personalized fit prediction
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowMeasurements(true)}
                  className="w-full"
                >
                  <User className="mr-2 h-4 w-4" />
                  Add My Measurements
                </Button>
              </Card>
            )}

            {/* Measurements Form */}
            <AnimatePresence>
              {showMeasurements && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4">Your Measurements</h4>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      {MEASUREMENT_FIELDS.map(field => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium mb-1">
                            {field.label} ({field.unit})
                          </label>
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={measurements[field.key] || ''}
                            onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                          />
                          <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => getSizeRecommendation(true)}
                      disabled={isLoading}
                      className="w-full bg-burgundy hover:bg-burgundy-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Recalculating...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Update Recommendation
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Return Risk */}
            {recommendation.returnProbability > 0.2 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  Higher return risk detected. Consider trying on in-store or ordering multiple sizes.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}