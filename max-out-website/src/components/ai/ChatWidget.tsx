"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MessageSquare, X, Sparkles, Camera, TrendingUp } from 'lucide-react'
import { EnhancedChatAssistant } from './EnhancedChatAssistant'
import { cn } from '@/lib/utils/cn'

interface ChatWidgetProps {
  userId?: string
  className?: string
}

export function ChatWidget({ userId, className }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Enhanced Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn(
              "fixed bottom-6 right-6 z-40",
              className
            )}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-burgundy hover:bg-burgundy-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            
            {/* Enhanced Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-burgundy animate-ping opacity-20" />
            
            {/* Enhanced Badge with AI Features */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
              <Sparkles className="h-3 w-3" />
            </div>
            
            {/* Feature Preview Tooltip */}
            <div className="absolute bottom-16 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg border text-sm whitespace-nowrap">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="h-3 w-3 text-burgundy" />
                  <span className="font-medium">Visual Search</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-3 w-3 text-burgundy" />
                  <span className="font-medium">Smart Recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-burgundy" />
                  <span className="font-medium">AI Style Assistant</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Assistant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 right-0 z-50"
          >
            <div className="relative">
              <EnhancedChatAssistant 
                userId={userId}
                initialMessage="Hi! I'm your enhanced AI shopping assistant with visual search capabilities. I can help you find the perfect outfit, analyze images for similar styles, provide personalized recommendations, or answer questions about sizing and styling. How can I assist you today?"
                onProductClick={(productId) => {
                  // Navigate to product page
                  window.location.href = `/products/${productId}`
                }}
              />
              
              {/* Close Button */}
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-14 text-white hover:bg-white/20 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}