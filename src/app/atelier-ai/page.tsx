"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  MessageSquare, 
  Camera, 
  Ruler, 
  ShirtIcon,
  ArrowRight,
  Brain,
  Zap,
  X,
  Play,
  Users,
  Award,
  CheckCircle,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OutfitRecommendations } from '@/components/ai/OutfitRecommendations'
import { StyleMatcher } from '@/components/ai/StyleMatcher'
import { SizeAssistant } from '@/components/ai/SizeAssistant'
import { ChatAssistant } from '@/components/ai/ChatAssistant'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

type AIFeature = 'outfit' | 'size' | 'style' | 'chat' | null

export default function AtelierAIPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('atelier-ai-visited')
    if (!visited) {
      setShowWelcome(true)
    } else {
      setHasVisited(true)
    }
  }, [])

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    setHasVisited(true)
    localStorage.setItem('atelier-ai-visited', 'true')
  }

  const features = [
    {
      id: 'outfit' as AIFeature,
      title: 'Smart Outfit Builder',
      description: 'Get AI-curated outfits for any occasion, from business to black-tie',
      longDescription: 'Our AI analyzes your preferences, body type, and occasion to create perfect outfits from our premium collection.',
      icon: ShirtIcon,
      color: 'bg-gradient-to-r from-burgundy to-red-700',
      available: true,
      stats: '95% match accuracy',
      badge: 'Most Popular',
      benefits: ['Occasion-specific styling', 'Budget-conscious options', 'Seasonal recommendations']
    },
    {
      id: 'size' as AIFeature,
      title: 'Perfect Fit Predictor',
      description: 'Revolutionary AI sizing that gets your measurements right every time',
      longDescription: 'Using advanced computer vision and machine learning, we predict your perfect size across all brands.',
      icon: Ruler,
      color: 'bg-gradient-to-r from-blue-600 to-indigo-700',
      available: true,
      stats: '98% accuracy rate',
      badge: 'New Technology',
      benefits: ['Cross-brand sizing', 'Fit guarantee', 'Virtual measurements']
    },
    {
      id: 'style' as AIFeature,
      title: 'Visual Style Matcher',
      description: 'Upload any photo and find matching styles from our collection',
      longDescription: 'Advanced image recognition identifies colors, patterns, and styles to find perfect matches.',
      icon: Camera,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      available: true,
      stats: 'Instant results',
      badge: 'AI Powered',
      benefits: ['Real-time analysis', 'Style breakdown', 'Similar alternatives']
    },
    {
      id: 'chat' as AIFeature,
      title: 'Personal Style Consultant',
      description: 'Chat with our AI stylist trained on 10+ years of fashion expertise',
      longDescription: 'Get personalized advice from an AI that understands menswear trends, fit, and styling.',
      icon: MessageSquare,
      color: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      available: true,
      stats: '24/7 availability',
      badge: 'Expert Level',
      benefits: ['Personalized advice', 'Trend insights', 'Care instructions']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-serif text-gray-900 mb-2">
                      Welcome to Atelier AI
                    </h2>
                    <p className="text-gray-600">Your personal AI fashion consultant</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWelcomeClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-burgundy/10 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-burgundy" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Personalized Styling</h3>
                        <p className="text-sm text-gray-600">Get outfit recommendations tailored to your style</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Perfect Fit Guarantee</h3>
                        <p className="text-sm text-gray-600">AI-powered sizing with 98% accuracy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Instant Results</h3>
                        <p className="text-sm text-gray-600">Get recommendations in seconds</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-burgundy/10 to-blue-100 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="font-semibold mb-1">Ready to get started?</h3>
                    <p className="text-sm text-gray-600 mb-4">Choose any feature below to begin your personalized styling journey</p>
                    <Button 
                      onClick={handleWelcomeClose}
                      className="bg-burgundy hover:bg-burgundy-700 text-white"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Exploring
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-burgundy/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto px-4"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-burgundy to-red-600 text-white px-4 sm:px-6 py-2 rounded-full mb-6 sm:mb-8 shadow-lg"
              role="banner"
              aria-label="AI-powered fashion technology"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider">AI-POWERED FASHION</span>
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-8xl font-serif bg-gradient-to-r from-gray-900 via-burgundy to-gray-900 bg-clip-text text-transparent mb-6 sm:mb-8"
            >
              Atelier AI
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2"
            >
              Your personal AI-powered fashion consultant. Get expert styling advice, 
              perfect fit recommendations, and curated outfits tailored just for you.
            </motion.p>

            {/* Stats & Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-12"
              role="list"
              aria-label="Key features and statistics"
            >
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-burgundy" />
                </div>
                <span className="font-semibold">GPT-4 Powered</span>
                <span className="text-sm text-gray-600">Advanced AI Technology</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold">Instant Results</span>
                <span className="text-sm text-gray-600">Real-time Recommendations</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-semibold">98% Accuracy</span>
                <span className="text-sm text-gray-600">Proven Performance</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            {!hasVisited && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowWelcome(true)}
                  className="bg-gradient-to-r from-burgundy to-red-600 hover:from-burgundy-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Take the Tour
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid or Active Feature */}
      {!activeFeature ? (
        <section className="py-20 relative">
          <div className="container-main">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                Choose Your AI Assistant
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover personalized fashion solutions powered by cutting-edge AI technology
              </p>
            </motion.div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <Card 
                    className={`relative overflow-hidden border-0 shadow-xl bg-white ${
                      feature.available 
                        ? 'hover:shadow-2xl cursor-pointer' 
                        : 'opacity-75'
                    } transition-all duration-500 h-full`}
                    onClick={() => feature.available && setActiveFeature(feature.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Access ${feature.title}: ${feature.description}`}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && feature.available) {
                        e.preventDefault()
                        setActiveFeature(feature.id)
                      }
                    }}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Badge */}
                    {feature.badge && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-gradient-to-r from-burgundy to-red-600 text-white border-0 shadow-md">
                          {feature.badge}
                        </Badge>
                      </div>
                    )}

                    <div className="p-6 sm:p-8 relative z-10">
                      {/* Icon with Gradient */}
                      <div className={`inline-flex p-3 sm:p-4 rounded-2xl ${feature.color} text-white mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-gray-900 mb-3 sm:mb-4 group-hover:text-burgundy transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <span className="text-sm font-semibold text-burgundy bg-burgundy/10 px-3 py-1 rounded-full w-fit">
                          {feature.stats}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>1000+ users</span>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mb-6 sm:mb-8">
                        <div className="flex flex-wrap gap-2">
                          {feature.benefits?.slice(0, 3).map((benefit, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="hidden sm:inline">{benefit}</span>
                              <span className="sm:hidden">{benefit.split(' ')[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      {feature.available ? (
                        <Button 
                          className="w-full bg-gradient-to-r from-burgundy to-red-600 hover:from-burgundy-700 hover:to-red-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveFeature(feature.id)
                          }}
                        >
                          <span>Start Using {feature.title.split(' ')[0]}</span>
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500 bg-gray-50 rounded-lg">
                          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                          Coming Soon
                        </div>
                      )}
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-burgundy/20 rounded-lg transition-colors duration-300" />
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <p className="text-gray-600 mb-6">
                Want to see more AI features? Let us know what you'd like to see next.
              </p>
              <Link href="/contact">
                <Button variant="outline">
                  Share Your Ideas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      ) : (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20"
        >
          <div className="container-main">
            {/* Enhanced Back Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveFeature(null)}
                  className="inline-flex items-center gap-2 px-6 py-3 border-burgundy/20 hover:border-burgundy hover:bg-burgundy/5 transition-colors duration-200"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  <span>Back to AI Features</span>
                </Button>
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">AI Assistant</span>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-semibold text-burgundy capitalize">
                    {features.find(f => f.id === activeFeature)?.title.split(' ')[0]}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Feature Container */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              {/* Feature Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  {(() => {
                    const feature = features.find(f => f.id === activeFeature)
                    if (!feature) return null
                    const IconComponent = feature.icon
                    return (
                      <>
                        <div className={`p-3 rounded-xl ${feature.color} text-white shadow-md`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-serif text-gray-900">{feature.title}</h2>
                          <p className="text-gray-600">{feature.longDescription}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Feature Content */}
              <div className="p-8">
                {activeFeature === 'outfit' && <OutfitRecommendations />}
                {activeFeature === 'style' && <StyleMatcher />}
                {activeFeature === 'size' && (
                  <div className="max-w-3xl mx-auto">
                    <SizeAssistant 
                      productId="demo-product" 
                      productName="Premium Navy Suit"
                      productBrand="Hugo Boss"
                    />
                  </div>
                )}
                {activeFeature === 'chat' && (
                  <div className="max-w-4xl mx-auto">
                    <ChatAssistant 
                      userId={undefined}
                      initialMessage="Welcome to your personal shopping assistant! I can help you find the perfect outfit, answer questions about sizing, or provide style recommendations. What are you looking for today?"
                      className="relative bottom-0 right-0 w-full h-[600px]"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Enhanced Benefits Section */}
      {!activeFeature && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-40 left-1/4 w-64 h-64 bg-burgundy/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container-main relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                Why Choose Atelier AI?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the future of menswear shopping with intelligent features designed to save you time and enhance your style
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Brain,
                  title: "Smart Learning Algorithm",
                  description: "Our AI learns your preferences over time to provide increasingly personalized recommendations",
                  stats: "Learns from 100+ style preferences",
                  color: "from-burgundy to-red-600"
                },
                {
                  icon: Zap,
                  title: "Lightning Fast Results",
                  description: "Get outfit suggestions, size predictions, and style matches in seconds, not hours",
                  stats: "Average response time: 2.3s",
                  color: "from-blue-600 to-indigo-600"
                },
                {
                  icon: Sparkles,
                  title: "Expert-Level Curation",
                  description: "Combines AI technology with fashion expertise for recommendations you can trust",
                  stats: "Trained on 10+ years of data",
                  color: "from-purple-600 to-pink-600"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="text-center p-8 h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                    <div className="relative mb-6">
                      <div className={`inline-flex p-6 bg-gradient-to-r ${benefit.color} rounded-2xl text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                        <benefit.icon className="h-10 w-10" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-burgundy/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-burgundy transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {benefit.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
                      <TrendingUp className="h-4 w-4" />
                      {benefit.stats}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-center mt-16 p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
            >
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-burgundy" />
                  <span className="font-semibold">5,000+</span>
                  <span>Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-burgundy" />
                  <span className="font-semibold">98%</span>
                  <span>Satisfaction Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-burgundy" />
                  <span className="font-semibold">24/7</span>
                  <span>AI Availability</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}