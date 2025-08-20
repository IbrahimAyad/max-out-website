'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  ChevronDown, 
  Scissors, 
  Package, 
  Shield, 
  Award,
  Info,
  Sparkles,
  Calendar,
  Ruler,
  Shirt,
  Palette,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'

interface ProductDetail {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface PremiumProductInfoProps {
  product: {
    name: string
    price: number
    originalPrice?: number
    description: string
    category?: string
    occasions?: string[]
    material?: string
    careInstructions?: string[]
    features?: string[]
    isBundle?: boolean
    enhanced?: boolean
  }
  selectedStyle?: '2-piece' | '3-piece'
  rating?: number
  reviewCount?: number
  className?: string
  showExpandableSections?: boolean
}

export function PremiumProductInfo({
  product,
  selectedStyle,
  rating = 4.8,
  reviewCount = 127,
  className,
  showExpandableSections = true
}: PremiumProductInfoProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Calculate effective price
  const effectivePrice = selectedStyle === '3-piece' ? product.price + 20 : product.price
  const savings = product.originalPrice ? product.originalPrice - effectivePrice : 0
  const savingsPercentage = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0

  // Product details with enhanced information
  const productDetails: ProductDetail[] = [
    { label: 'Material', value: product.material || 'Premium Wool Blend', icon: Shirt },
    { label: 'Category', value: product.category || 'Blazers', icon: Package },
    { label: 'Fit', value: 'Modern Tailored', icon: Ruler },
    { label: 'Season', value: 'All Season', icon: Calendar },
    { label: 'Care', value: 'Dry Clean Only', icon: Shield }
  ]

  const expandableSections = [
    {
      id: 'details',
      title: 'Product Details',
      icon: Info,
      content: (
        <div className="space-y-3">
          {productDetails.map((detail, index) => (
            <div key={detail.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                {detail.icon && <detail.icon className="h-4 w-4 text-gray-500" />}
                <span className="text-sm font-medium text-gray-700">{detail.label}</span>
              </div>
              <span className="text-sm text-gray-900">{detail.value}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'care',
      title: 'Care Instructions',
      icon: Scissors,
      content: (
        <div className="space-y-2">
          {(product.careInstructions || [
            'Dry clean only for best results',
            'Steam to remove wrinkles',
            'Store on padded hangers',
            'Professional pressing recommended'
          ]).map((instruction, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-burgundy-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">{instruction}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'features',
      title: 'Key Features',
      icon: Award,
      content: (
        <div className="space-y-2">
          {(product.features || [
            'Half-canvas construction',
            'Natural shoulder line',
            'Functional button holes',
            'Peak lapels',
            'Two-button closure'
          ]).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      )
    }
  ]

  return (
    <div className={cn("space-y-8", className)}>
      {/* Product Title with Enhanced Typography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 leading-tight tracking-tight">
            {product.name}
          </h1>
          {product.category && (
            <p className="text-lg text-gray-600 font-light tracking-wide uppercase">
              {product.category}
            </p>
          )}
        </div>

        {/* Premium Badges */}
        <div className="flex flex-wrap gap-2">
          {product.enhanced && (
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          {product.isBundle && (
            <Badge className="bg-gradient-to-r from-burgundy-600 to-red-600 text-white border-0">
              <Package className="h-3 w-3 mr-1" />
              Complete Look
            </Badge>
          )}
          <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-black border-0">
            <Award className="h-3 w-3 mr-1" />
            Editor's Choice
          </Badge>
        </div>
      </motion.div>

      {/* Enhanced Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-baseline gap-4">
          <span className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
            ${effectivePrice.toFixed(2)}
          </span>
          {product.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-400 line-through font-light">
                ${product.originalPrice.toFixed(2)}
              </span>
              {savingsPercentage > 0 && (
                <Badge variant="destructive" className="text-sm font-medium">
                  Save {savingsPercentage}%
                </Badge>
              )}
            </div>
          )}
        </div>

        {selectedStyle === '3-piece' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-burgundy-600 font-medium"
          >
            +$20.00 for vest included
          </motion.p>
        )}

        {savings > 0 && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
          >
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              You save ${savings.toFixed(2)} today
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.floor(rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : i < rating 
                      ? "fill-yellow-200 text-yellow-400"
                      : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-lg font-semibold text-gray-900">{rating}</span>
        </div>
        
        <span className="text-gray-600">
          ({reviewCount.toLocaleString()} reviews)
        </span>
        
        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
          Verified
        </Badge>
      </motion.div>

      {/* Enhanced Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="prose prose-lg max-w-none">
          <p className={cn(
            "text-gray-700 leading-relaxed",
            !showFullDescription && "line-clamp-3"
          )}>
            {product.description}
          </p>
        </div>
        
        {product.description && product.description.length > 200 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-burgundy-600 hover:text-burgundy-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            {showFullDescription ? 'Show less' : 'Read more'}
            <motion.div
              animate={{ rotate: showFullDescription ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
        )}
      </motion.div>

      {/* Perfect For Section */}
      {product.occasions && product.occasions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-gray-900">Perfect For</h3>
          <div className="flex flex-wrap gap-2">
            {product.occasions.map((occasion, index) => (
              <motion.span
                key={occasion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {occasion}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Expandable Sections - Conditionally rendered */}
      {showExpandableSections && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {expandableSections.map((section, index) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <motion.button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <section.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{section.title}</span>
                </div>
                <motion.div
                  animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-gray-100">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default PremiumProductInfo