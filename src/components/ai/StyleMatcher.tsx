"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  ShoppingBag,
  Eye,
  Info,
  Sparkles,
  Image as ImageIcon,
  Check,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/format'
import Image from 'next/image'
import Link from 'next/link'
import type { StyleAnalysis, StyleMatch } from '@/lib/ai/types'

interface StyleMatcherProps {
  className?: string
}

export function StyleMatcher({ className }: StyleMatcherProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null)
  const [styleMatch, setStyleMatch] = useState<StyleMatch | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<'economy' | 'standard' | 'premium'>('standard')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeStyle = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('/api/ai/style-analysis', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
        setStyleMatch(data.matches)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Style analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setImageFile(null)
    setImagePreview(null)
    setAnalysis(null)
    setStyleMatch(null)
    setShowResults(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-burgundy mb-4">
          <Camera className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-widest uppercase">Style Match</span>
          <Camera className="h-5 w-5" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif mb-4">
          Find Your Look with AI
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a photo of an outfit you love, and our AI will find similar items from our collection
        </p>
      </div>

      {!showResults ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Enhanced Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300",
              "hover:border-burgundy hover:bg-burgundy/5 hover:shadow-lg",
              "group cursor-pointer",
              imagePreview ? "border-burgundy bg-burgundy/5 shadow-md" : "border-gray-300 hover:border-burgundy/50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {imagePreview ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="relative aspect-[3/4] max-h-96 mx-auto overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={imagePreview}
                    alt="Upload preview"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetAnalysis}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm shadow-md"
                    aria-label="Remove image and start over"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {/* Overlay with shimmer effect when analyzing */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-burgundy/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-white rounded-full p-4 shadow-lg">
                        <Loader2 className="h-8 w-8 text-burgundy animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <p className="text-sm text-gray-600 mb-6 flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Great choice! Ready to find your style matches
                  </p>
                  <Button
                    onClick={analyzeStyle}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-burgundy to-red-600 hover:from-burgundy-700 hover:to-red-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Analyzing Style...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        <span>Analyze Style</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                onClick={() => fileInputRef.current?.click()}
                className="text-center cursor-pointer py-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="inline-flex p-6 bg-gradient-to-r from-burgundy/10 to-blue-100 rounded-full mb-6 group-hover:from-burgundy/20 group-hover:to-blue-200 transition-colors duration-300"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Upload className="h-10 w-10 text-burgundy" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-burgundy transition-colors duration-300">
                  Drop an image here or click to upload
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Upload any fashion image to find similar styles from our collection<br />
                  <span className="text-xs text-gray-500">Supports JPG, PNG, WebP up to 10MB</span>
                </p>
                <Button 
                  variant="outline"
                  className="border-burgundy/30 hover:border-burgundy hover:bg-burgundy/5 group-hover:shadow-md transition-all duration-300"
                  size="lg"
                >
                  <ImageIcon className="mr-2 h-5 w-5" />
                  <span>Choose Image</span>
                </Button>

                {/* Floating elements for visual interest */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-burgundy/20 rounded-full animate-pulse" />
                <div className="absolute top-8 right-6 w-1 h-1 bg-blue-500/30 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
              </motion.div>
            )}
          </div>

          {/* Enhanced Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {[
              {
                icon: Camera,
                title: "Clear Photos",
                description: "Use well-lit photos with visible outfit details",
                color: "from-burgundy to-red-600"
              },
              {
                icon: Eye,
                title: "Full Outfit",
                description: "Include as many pieces as possible for best results",
                color: "from-blue-600 to-indigo-600"
              },
              {
                icon: Sparkles,
                title: "Any Style",
                description: "From casual to formal, we'll find matches",
                color: "from-purple-600 to-pink-600"
              }
            ].map((tip, index) => (
              <motion.div 
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -2 }}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${tip.color} rounded-full mb-4 shadow-lg`}>
                  <tip.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Enhanced Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="outline"
              onClick={resetAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3 border-burgundy/20 hover:border-burgundy hover:bg-burgundy/5 transition-colors duration-200"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Analyze Another Photo</span>
            </Button>
          </motion.div>

          {/* Analysis Results */}
          {analysis && styleMatch && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Original Image & Analysis */}
              <div className="md:col-span-1">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Style Analysis</h3>
                  
                  {/* Image */}
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview!}
                      alt="Analyzed outfit"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Detected Items */}
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Detected Items:</h4>
                    {analysis.detectedItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="capitalize">{item.category.replace('-', ' ')}</span>
                        <span className="text-gray-500">({item.color})</span>
                      </div>
                    ))}
                  </div>

                  {/* Style Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-medium capitalize">{analysis.styleCategory}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Formality:</span>
                      <span className="font-medium">{analysis.formalityLevel}/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Match Score:</span>
                      <span className="font-medium text-burgundy">
                        {Math.round(styleMatch.similarityScore * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Style Notes */}
                <Card className="p-6 mt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Style Notes
                  </h4>
                  <ul className="space-y-2">
                    {styleMatch.styleNotes.map((note, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-burgundy mt-0.5">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Matched Products */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Complete the Look</h3>
                  
                  {/* Budget Selector */}
                  <div className="flex gap-2">
                    {(['economy', 'standard', 'premium'] as const).map(tier => (
                      <button
                        key={tier}
                        onClick={() => setSelectedBudget(tier)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium transition-all",
                          selectedBudget === tier
                            ? "bg-burgundy text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        )}
                      >
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {styleMatch.completeLook.items.map((item, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded" />
                          <div className="flex-1">
                            <h4 className="font-medium capitalize">
                              {item.category.replace('-', ' ')}
                            </h4>
                            {item.essential && (
                              <Badge variant="secondary" className="mt-1">Essential</Badge>
                            )}
                          </div>
                          <Link href={`/products/${item.productId}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Missing Pieces */}
                {styleMatch.completeLook.missingPieces.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <Info className="inline h-4 w-4 mr-1" />
                      To complete this look, you might also need: {' '}
                      {styleMatch.completeLook.missingPieces.join(', ')}
                    </p>
                  </div>
                )}

                {/* Total Price & Actions */}
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total for {selectedBudget} option</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(
                        styleMatch.budgetOptions.find(b => b.tier === selectedBudget)?.totalPrice || 
                        styleMatch.completeLook.totalPrice
                      )}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      Save Look
                    </Button>
                    <Button className="bg-burgundy hover:bg-burgundy-700 text-white">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add All to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}