"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Eye, ShoppingBag, MoveLeft, MoveRight, HandIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function GestureTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem('hasSeenGestureTutorial')
    if (!hasSeenTutorial && window.innerWidth < 768) {
      // Show tutorial after a short delay on mobile
      setTimeout(() => setShowTutorial(true), 2000)
    }
  }, [])

  const closeTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem('hasSeenGestureTutorial', 'true')
  }

  const tutorialSteps = [
    {
      icon: <Heart className="h-12 w-12 text-burgundy" />,
      title: "Swipe Left for Wishlist",
      description: "Quickly add items to your wishlist with a left swipe",
      gesture: <MoveLeft className="h-8 w-8 text-burgundy" />
    },
    {
      icon: <Eye className="h-12 w-12 text-burgundy" />,
      title: "Swipe Right for Quick View",
      description: "Preview product details without leaving the page",
      gesture: <MoveRight className="h-8 w-8 text-burgundy" />
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-burgundy" />,
      title: "Double Tap to Add to Cart",
      description: "Instantly add items to your cart with a double tap",
      gesture: <HandIcon className="h-8 w-8 text-burgundy" />
    }
  ]

  if (!showTutorial) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:hidden"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-2xl max-w-sm w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">Shopping Gestures</h3>
              <button
                onClick={closeTutorial}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Use these gestures for a faster shopping experience
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  {tutorialSteps[currentStep].icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  {tutorialSteps[currentStep].title}
                </h4>
                <p className="text-gray-600 mb-6">
                  {tutorialSteps[currentStep].description}
                </p>
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 rounded-full p-4">
                    {tutorialSteps[currentStep].gesture}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-burgundy w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={closeTutorial}
                  >
                    Skip
                  </Button>
                  <Button
                    className="flex-1 bg-burgundy hover:bg-burgundy-700 text-white"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-burgundy hover:bg-burgundy-700 text-white"
                  onClick={closeTutorial}
                >
                  Start Shopping
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}