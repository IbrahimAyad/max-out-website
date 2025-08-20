'use client'

import { useState, useEffect } from 'react'

interface SizeMemory {
  [category: string]: string
}

const SIZE_MEMORY_KEY = 'kct-size-memory'
const RECENT_SIZE_KEY = 'kct-recent-size'

export function useSizeMemory() {
  const [sizeMemory, setSizeMemory] = useState<SizeMemory>({})
  const [recentSize, setRecentSize] = useState<string>('')

  // Load size memory from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SIZE_MEMORY_KEY)
        const recent = localStorage.getItem(RECENT_SIZE_KEY)
        
        if (saved) {
          setSizeMemory(JSON.parse(saved))
        }
        if (recent) {
          setRecentSize(recent)
        }
      } catch (error) {
        console.error('Error loading size memory:', error)
      }
    }
  }, [])

  // Save size for a category
  const rememberSize = (category: string, size: string) => {
    const normalizedCategory = normalizeCategory(category)
    const updated = { ...sizeMemory, [normalizedCategory]: size }
    
    setSizeMemory(updated)
    setRecentSize(size)
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SIZE_MEMORY_KEY, JSON.stringify(updated))
        localStorage.setItem(RECENT_SIZE_KEY, size)
      } catch (error) {
        console.error('Error saving size memory:', error)
      }
    }
  }

  // Get remembered size for a category
  const getRememberedSize = (category: string, availableSizes: string[]): string | null => {
    const normalizedCategory = normalizeCategory(category)
    
    // First, check if we have a size for this specific category
    const categorySize = sizeMemory[normalizedCategory]
    if (categorySize && availableSizes.includes(categorySize)) {
      return categorySize
    }

    // If not, check if the recent size is available
    if (recentSize && availableSizes.includes(recentSize)) {
      return recentSize
    }

    // For dress shirts, try to find a matching size pattern
    if (normalizedCategory === 'shirts' && recentSize) {
      // If recent size is like "15/32", try to find similar neck size
      const neckSize = recentSize.split('/')[0]
      const matchingSize = availableSizes.find(size => size.startsWith(neckSize + '/'))
      if (matchingSize) return matchingSize
    }

    // For suits/jackets, try to match the numeric part
    if (['suits', 'blazers', 'jackets'].includes(normalizedCategory) && recentSize) {
      const numericPart = recentSize.match(/\d+/)?.[0]
      if (numericPart) {
        const matchingSize = availableSizes.find(size => size.includes(numericPart))
        if (matchingSize) return matchingSize
      }
    }

    return null
  }

  // Clear all size memory
  const clearSizeMemory = () => {
    setSizeMemory({})
    setRecentSize('')
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SIZE_MEMORY_KEY)
      localStorage.removeItem(RECENT_SIZE_KEY)
    }
  }

  return {
    rememberSize,
    getRememberedSize,
    clearSizeMemory,
    sizeMemory,
    recentSize
  }
}

// Normalize category names for consistent storage
function normalizeCategory(category: string): string {
  const normalized = category.toLowerCase().trim()
  
  // Group similar categories
  if (normalized.includes('shirt')) return 'shirts'
  if (normalized.includes('suit') || normalized.includes('tuxedo')) return 'suits'
  if (normalized.includes('blazer') || normalized.includes('jacket')) return 'blazers'
  if (normalized.includes('pant') || normalized.includes('trouser')) return 'pants'
  if (normalized.includes('shoe') || normalized.includes('footwear')) return 'shoes'
  if (normalized.includes('tie')) return 'ties'
  if (normalized.includes('vest')) return 'vests'
  
  return normalized
}