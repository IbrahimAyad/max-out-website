"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Camera, 
  Palette, 
  Calendar,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { ProductFilters } from '@/lib/supabase/types'

interface AIStyleAssistantProps {
  onSuggestionApply: (filters: Partial<ProductFilters>) => void
  currentFilters: ProductFilters
  className?: string
}

interface StyleSuggestion {
  id: string
  title: string
  description: string
  icon: React.ElementType
  filters: Partial<ProductFilters>
  tags: string[]
  priority: 'high' | 'medium' | 'low'
}

export function AIStyleAssistant({
  onSuggestionApply,
  currentFilters,
  className
}: AIStyleAssistantProps) {
  const [activeSuggestions, setActiveSuggestions] = useState<StyleSuggestion[]>([])
  const [userContext, setUserContext] = useState({
    timeOfDay: 'day',
    season: 'fall',
    location: 'urban',
    occasion: null as string | null
  })

  // Get dynamic suggestions based on context
  useEffect(() => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    const month = new Date().getMonth()
    const season = month >= 2 && month <= 4 ? 'spring' :
                  month >= 5 && month <= 7 ? 'summer' :
                  month >= 8 && month <= 10 ? 'fall' : 'winter'
    
    setUserContext(prev => ({
      ...prev,
      timeOfDay,
      season
    }))

    // Generate smart suggestions
    const suggestions: StyleSuggestion[] = []

    // Time-based suggestions
    if (timeOfDay === 'evening') {
      suggestions.push({
        id: 'evening-elegant',
        title: 'Evening Elegance',
        description: 'Perfect for dinner dates and evening events',
        icon: Clock,
        filters: { 
          color: 'black',
          category: 'formal wear',
          minPrice: 200
        },
        tags: ['sophisticated', 'formal'],
        priority: 'high'
      })
    }

    // Seasonal suggestions
    if (season === 'fall') {
      suggestions.push({
        id: 'fall-essentials',
        title: 'Fall Essentials',
        description: 'Warm colors and layering pieces for autumn',
        icon: Calendar,
        filters: { 
          seasonal: 'fall',
          color: 'burgundy'
        },
        tags: ['seasonal', 'cozy'],
        priority: 'high'
      })
    }

    // Trending suggestions
    suggestions.push({
      id: 'trending-now',
      title: "What's Hot",
      description: 'Most popular items this week',
      icon: TrendingUp,
      filters: { 
        trending: true
      },
      tags: ['popular', 'bestseller'],
      priority: 'medium'
    })

    // Occasion-based
    const dayOfWeek = new Date().getDay()
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
      suggestions.push({
        id: 'weekend-ready',
        title: 'Weekend Ready',
        description: 'Casual yet stylish for your days off',
        icon: Zap,
        filters: { 
          category: 'apparel',
          maxPrice: 150
        },
        tags: ['casual', 'comfortable'],
        priority: 'medium'
      })
    }

    // Wedding season (May-September)
    if (month >= 4 && month <= 8) {
      suggestions.push({
        id: 'wedding-guest',
        title: 'Wedding Guest',
        description: 'Look your best at summer weddings',
        icon: Users,
        filters: { 
          occasion: 'wedding',
          category: 'formal wear'
        },
        tags: ['wedding', 'formal'],
        priority: 'high'
      })
    }

    setActiveSuggestions(suggestions)
  }, [])

  const handleSuggestionClick = (suggestion: StyleSuggestion) => {
    onSuggestionApply(suggestion.filters)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* AI Assistant Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gold/10 to-yellow-50 rounded-lg">
        <div className="p-2 bg-gold/20 rounded-full">
          <Sparkles className="h-5 w-5 text-gold" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">AI Style Assistant</h3>
          <p className="text-sm text-gray-600">
            Personalized suggestions based on trends and your preferences
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          onClick={() => {
            // Trigger camera for outfit matching
            console.log('Camera outfit matching triggered');
          }}
        >
          <Camera className="h-4 w-4" />
          Match Outfit
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          onClick={() => {
            // Color palette suggestions
            onSuggestionApply({ color: 'trending' });
          }}
        >
          <Palette className="h-4 w-4" />
          Color Me
        </Button>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {activeSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Sparkles className="h-4 w-4 text-gold" />
              Smart Suggestions
            </div>
            
            <div className="space-y-2">
              {activeSuggestions.slice(0, 3).map((suggestion) => (
                <Card 
                  key={suggestion.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200 hover:border-gold/30"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-1.5 rounded-full flex-shrink-0",
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      <suggestion.icon className="h-3 w-3" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {suggestion.title}
                        </h4>
                        {suggestion.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            Hot
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {suggestion.description}
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {suggestion.tags.slice(0, 2).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
