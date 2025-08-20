'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Truck, 
  RefreshCw, 
  Award, 
  Star, 
  Users, 
  Clock, 
  MapPin, 
  Scissors,
  CheckCircle,
  Heart,
  TrendingUp,
  Globe,
  Phone,
  CreditCard,
  Package,
  Timer,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'

interface TrustFeature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  highlight?: string
  color: string
  bgColor: string
}

interface SocialProof {
  type: 'review' | 'purchase' | 'view' | 'wishlist'
  message: string
  timeAgo: string
  location?: string
  verified?: boolean
}

interface PremiumTrustSignalsProps {
  productName: string
  rating?: number
  reviewCount?: number
  recentActivity?: SocialProof[]
  deliveryLocation?: string
  className?: string
}

const TRUST_FEATURES: TrustFeature[] = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Over $200',
    highlight: '2-Day Delivery',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    description: 'Easy process',
    highlight: '97% Satisfaction',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Shield,
    title: '100% Secure',
    description: 'Checkout',
    highlight: 'SSL Protected',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Scissors,
    title: 'Free Alterations',
    description: 'In-store',
    highlight: 'Expert Tailors',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
]

const PREMIUM_BADGES = [
  {
    icon: Award,
    text: 'Editor\'s Choice',
    color: 'bg-gradient-to-r from-gold-500 to-yellow-500 text-black'
  },
  {
    icon: Sparkles,
    text: 'Premium Quality',
    color: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
  },
  {
    icon: TrendingUp,
    text: 'Trending Now',
    color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
  }
]

export function PremiumTrustSignals({ 
  productName, 
  rating = 4.8, 
  reviewCount = 127,
  recentActivity = [],
  deliveryLocation = 'Metro Detroit',
  className 
}: PremiumTrustSignalsProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  // Default activity if none provided
  const defaultActivity: SocialProof[] = [
    {
      type: 'purchase',
      message: 'Alex from Birmingham just purchased this blazer',
      timeAgo: '2 minutes ago',
      location: 'Birmingham, MI',
      verified: true
    },
    {
      type: 'review',
      message: 'Marcus rated this 5 stars',
      timeAgo: '15 minutes ago',
      location: 'Detroit, MI',
      verified: true
    },
    {
      type: 'view',
      message: '23 people are viewing this item',
      timeAgo: 'now',
      verified: false
    },
    {
      type: 'wishlist',
      message: 'Sarah added this to wishlist',
      timeAgo: '1 hour ago',
      location: 'Royal Oak, MI',
      verified: false
    }
  ]

  const activity = recentActivity.length > 0 ? recentActivity : defaultActivity

  // Rotate through social proof messages
  useEffect(() => {
    if (activity.length <= 1) return

    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % activity.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [activity.length])

  const getActivityIcon = (type: SocialProof['type']) => {
    switch (type) {
      case 'purchase':
        return <Package className="h-4 w-4 text-green-600" />
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'view':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'wishlist':
        return <Heart className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Premium Badges */}
      <div className="flex flex-wrap gap-2">
        {PREMIUM_BADGES.map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Badge className={cn("border-0 shadow-sm", badge.color)}>
              <badge.icon className="h-3 w-3 mr-1" />
              {badge.text}
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Rating and Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
          <span className="font-semibold text-gray-900">{rating}</span>
        </div>
        
        <span className="text-sm text-gray-600">
          ({reviewCount.toLocaleString()} reviews)
        </span>
        
        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified Purchases
        </Badge>
      </motion.div>

      {/* Social Proof Activity */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentActivityIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="p-1.5 bg-white rounded-full shadow-sm">
              {getActivityIcon(activity[currentActivityIndex].type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity[currentActivityIndex].message}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {activity[currentActivityIndex].timeAgo}
                </span>
                {activity[currentActivityIndex].location && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {activity[currentActivityIndex].location}
                      </span>
                    </div>
                  </>
                )}
                {activity[currentActivityIndex].verified && (
                  <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 text-xs py-0 px-1.5">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Trust Features Grid */}
      <div className="grid grid-cols-2 gap-4">
        {TRUST_FEATURES.slice(0, showAllFeatures ? TRUST_FEATURES.length : 4).map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 group"
          >
            <div className={cn("p-2 rounded-lg transition-colors", feature.bgColor)}>
              <feature.icon className={cn("h-5 w-5", feature.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 group-hover:text-gray-700">
                {feature.title}
              </p>
              <p className="text-xs text-gray-500">{feature.description}</p>
              {feature.highlight && (
                <p className="text-xs font-medium text-burgundy-600 mt-0.5">
                  {feature.highlight}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delivery Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-green-900">
              Order by 2 PM for next-day delivery to {deliveryLocation}
            </p>
            <p className="text-sm text-green-700 mt-1">
              Free same-day alterations available at our Troy location
            </p>
          </div>
        </div>
      </motion.div>

      {/* Customer Testimonial Highlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-purple-900 mb-1">Customer Favorite</p>
            <p className="text-sm text-purple-700 italic">
              "Perfect fit and exceptional quality. The alterations service made it absolutely perfect for my wedding."
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-purple-600 font-medium">Michael R., Verified Purchase</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Phone className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Need help with sizing?</p>
              <p className="text-xs text-gray-600">Call (248) 555-0123 for personal styling</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-burgundy-600 text-white rounded-lg text-sm font-medium hover:bg-burgundy-700 transition-colors"
          >
            Call Now
          </motion.button>
        </div>
      </motion.div>

      {/* Security Indicators */}
      <div className="flex items-center justify-center gap-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600">Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600">SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600">Privacy Protected</span>
        </div>
      </div>
    </div>
  )
}

export default PremiumTrustSignals