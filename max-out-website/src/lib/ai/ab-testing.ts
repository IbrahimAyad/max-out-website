// A/B Testing System for AI Response Optimization
// Automatically tests different response variations and learns what works best

import { metricsCollector } from './metrics-collector'
import type { TrainingScenario } from './advanced-training'

export interface ABTestVariant {
  id: string
  name: string
  response: string
  personality: 'professional' | 'friendly' | 'casual' | 'expert'
  impressions: number
  conversions: number
  satisfactionSum: number
  responseTimeSum: number
}

export interface ABTest {
  id: string
  scenarioId: string
  name: string
  status: 'active' | 'completed' | 'paused'
  startDate: Date
  endDate?: Date
  variants: ABTestVariant[]
  winningVariant?: string
  confidence: number
  minSampleSize: number
}

export class ABTestingEngine {
  private activeTests = new Map<string, ABTest>()
  private testResults = new Map<string, any>()
  
  // Create new A/B test
  createTest(
    scenarioId: string,
    name: string,
    variants: Omit<ABTestVariant, 'impressions' | 'conversions' | 'satisfactionSum' | 'responseTimeSum'>[],
    minSampleSize = 100
  ): ABTest {
    const test: ABTest = {
      id: `test_${Date.now()}`,
      scenarioId,
      name,
      status: 'active',
      startDate: new Date(),
      variants: variants.map(v => ({
        ...v,
        impressions: 0,
        conversions: 0,
        satisfactionSum: 0,
        responseTimeSum: 0
      })),
      confidence: 0,
      minSampleSize
    }
    
    this.activeTests.set(test.id, test)
    return test
  }
  
  // Select variant for user (with smart allocation)
  selectVariant(testId: string, userId?: string): ABTestVariant | null {
    const test = this.activeTests.get(testId)
    if (!test || test.status !== 'active') return null
    
    // Use Thompson Sampling for smart allocation
    const variantScores = test.variants.map(variant => {
      const conversionRate = variant.impressions > 0 
        ? variant.conversions / variant.impressions 
        : 0.5 // Prior assumption
      
      // Beta distribution parameters
      const alpha = variant.conversions + 1
      const beta = variant.impressions - variant.conversions + 1
      
      // Sample from beta distribution
      const sample = this.sampleBeta(alpha, beta)
      
      return { variant, score: sample }
    })
    
    // Select variant with highest sampled score
    variantScores.sort((a, b) => b.score - a.score)
    const selected = variantScores[0].variant
    
    // Record impression
    selected.impressions++
    
    // Store user assignment for consistency
    if (userId) {
      this.storeUserAssignment(userId, testId, selected.id)
    }
    
    return selected
  }
  
  // Record conversion event
  recordConversion(
    testId: string,
    variantId: string,
    satisfaction?: number,
    responseTime?: number
  ) {
    const test = this.activeTests.get(testId)
    if (!test) return
    
    const variant = test.variants.find(v => v.id === variantId)
    if (!variant) return
    
    variant.conversions++
    if (satisfaction) {
      variant.satisfactionSum += satisfaction
    }
    if (responseTime) {
      variant.responseTimeSum += responseTime
    }
    
    // Check if test should complete
    this.evaluateTestCompletion(test)
    
    // Track in metrics
    metricsCollector.trackResponseEffectiveness(
      variant.id,
      test.scenarioId,
      'primary',
      satisfaction,
      true
    )
  }
  
  // Evaluate if test has enough data
  private evaluateTestCompletion(test: ABTest) {
    // Check minimum sample size
    const totalImpressions = test.variants.reduce((sum, v) => sum + v.impressions, 0)
    if (totalImpressions < test.minSampleSize) return
    
    // Calculate statistical significance
    const { winner, confidence } = this.calculateWinner(test.variants)
    
    test.confidence = confidence
    
    // Complete test if confidence is high enough
    if (confidence > 0.95) {
      test.status = 'completed'
      test.winningVariant = winner?.id
      test.endDate = new Date()
      
      // Store results
      this.storeTestResults(test)
    }
  }
  
  // Calculate winning variant with statistical significance
  private calculateWinner(variants: ABTestVariant[]) {
    if (variants.length < 2) return { winner: variants[0], confidence: 1 }
    
    // Sort by conversion rate
    const sorted = [...variants].sort((a, b) => {
      const rateA = a.impressions > 0 ? a.conversions / a.impressions : 0
      const rateB = b.impressions > 0 ? b.conversions / b.impressions : 0
      return rateB - rateA
    })
    
    const best = sorted[0]
    const secondBest = sorted[1]
    
    // Calculate confidence using z-test
    const confidence = this.calculateZTestConfidence(
      best.conversions,
      best.impressions,
      secondBest.conversions,
      secondBest.impressions
    )
    
    return { winner: best, confidence }
  }
  
  // Z-test for proportion comparison
  private calculateZTestConfidence(
    conversions1: number,
    impressions1: number,
    conversions2: number,
    impressions2: number
  ): number {
    if (impressions1 === 0 || impressions2 === 0) return 0
    
    const p1 = conversions1 / impressions1
    const p2 = conversions2 / impressions2
    const pPooled = (conversions1 + conversions2) / (impressions1 + impressions2)
    
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/impressions1 + 1/impressions2))
    if (se === 0) return 0
    
    const z = Math.abs(p1 - p2) / se
    
    // Convert z-score to confidence (simplified)
    if (z > 2.58) return 0.99  // 99% confidence
    if (z > 1.96) return 0.95  // 95% confidence
    if (z > 1.645) return 0.90 // 90% confidence
    return z / 2.58 // Linear approximation below 90%
  }
  
  // Thompson Sampling helper
  private sampleBeta(alpha: number, beta: number): number {
    // Simplified beta distribution sampling
    // In production, use proper library
    const x = this.sampleGamma(alpha)
    const y = this.sampleGamma(beta)
    return x / (x + y)
  }
  
  private sampleGamma(shape: number): number {
    // Simplified gamma sampling (Marsaglia & Tsang method)
    // In production, use proper statistical library
    if (shape < 1) {
      return this.sampleGamma(shape + 1) * Math.pow(Math.random(), 1 / shape)
    }
    
    const d = shape - 1/3
    const c = 1 / Math.sqrt(9 * d)
    
    while (true) {
      const x = this.normalRandom()
      const v = Math.pow(1 + c * x, 3)
      
      if (v > 0) {
        const u = Math.random()
        const xSquared = x * x
        
        if (u < 1 - 0.0331 * xSquared * xSquared) {
          return d * v
        }
        
        if (Math.log(u) < 0.5 * xSquared + d * (1 - v + Math.log(v))) {
          return d * v
        }
      }
    }
  }
  
  private normalRandom(): number {
    // Box-Muller transform for normal distribution
    const u1 = Math.random()
    const u2 = Math.random()
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  }
  
  // Store user assignment for consistency
  private storeUserAssignment(userId: string, testId: string, variantId: string) {
    const key = `${userId}_${testId}`
    sessionStorage.setItem(key, variantId)
  }
  
  // Get user's assigned variant
  getUserVariant(userId: string, testId: string): string | null {
    const key = `${userId}_${testId}`
    return sessionStorage.getItem(key)
  }
  
  // Store test results
  private async storeTestResults(test: ABTest) {
    this.testResults.set(test.id, {
      test,
      completedAt: new Date(),
      winner: test.winningVariant,
      confidence: test.confidence,
      variants: test.variants.map(v => ({
        id: v.id,
        name: v.name,
        impressions: v.impressions,
        conversions: v.conversions,
        conversionRate: v.impressions > 0 ? v.conversions / v.impressions : 0,
        avgSatisfaction: v.conversions > 0 ? v.satisfactionSum / v.conversions : 0,
        avgResponseTime: v.impressions > 0 ? v.responseTimeSum / v.impressions : 0
      }))
    })
    
    // Could also persist to database here
  }
  
  // Get active tests
  getActiveTests(): ABTest[] {
    return Array.from(this.activeTests.values()).filter(t => t.status === 'active')
  }
  
  // Get test results
  getTestResults(testId: string) {
    return this.testResults.get(testId)
  }
  
  // Get all results
  getAllResults() {
    return Array.from(this.testResults.values())
  }
  
  // Pause test
  pauseTest(testId: string) {
    const test = this.activeTests.get(testId)
    if (test) {
      test.status = 'paused'
    }
  }
  
  // Resume test
  resumeTest(testId: string) {
    const test = this.activeTests.get(testId)
    if (test && test.status === 'paused') {
      test.status = 'active'
    }
  }
}

// Singleton instance
export const abTestingEngine = new ABTestingEngine()

// Pre-configured tests for common scenarios
export const DEFAULT_AB_TESTS = [
  {
    name: 'Wedding Greeting Style',
    scenarioId: 'wedding_greeting',
    variants: [
      {
        id: 'formal',
        name: 'Formal',
        response: "Congratulations on your upcoming wedding. Let's find you the perfect attire.",
        personality: 'professional' as const
      },
      {
        id: 'enthusiastic',
        name: 'Enthusiastic',
        response: "How exciting! Your big day deserves an amazing look. Let's make it perfect!",
        personality: 'friendly' as const
      },
      {
        id: 'casual',
        name: 'Casual',
        response: "Congrats! October weddings are beautiful. What style are you thinking?",
        personality: 'casual' as const
      }
    ]
  },
  {
    name: 'Sizing Anxiety Response',
    scenarioId: 'sizing_help',
    variants: [
      {
        id: 'technical',
        name: 'Technical',
        response: "I'll guide you through precise measurements. It's easier than you think.",
        personality: 'expert' as const
      },
      {
        id: 'reassuring',
        name: 'Reassuring',
        response: "No worries! We'll find your perfect fit together. Let's start simple.",
        personality: 'friendly' as const
      },
      {
        id: 'confident',
        name: 'Confident',
        response: "Easy - I'll have you sized perfectly in 2 minutes. Ready?",
        personality: 'casual' as const
      }
    ]
  },
  {
    name: 'Budget Concern Handling',
    scenarioId: 'budget_inquiry',
    variants: [
      {
        id: 'value_focus',
        name: 'Value Focus',
        response: "Great suits at every price point. What's your comfort zone?",
        personality: 'professional' as const
      },
      {
        id: 'bundle_push',
        name: 'Bundle Push',
        response: "Our $199 bundles are incredible value - complete outfit sorted!",
        personality: 'friendly' as const
      },
      {
        id: 'quality_emphasis',
        name: 'Quality Emphasis',
        response: "Investment pieces from $395. Quality that lasts years.",
        personality: 'expert' as const
      }
    ]
  }
]

// Initialize default tests
export function initializeDefaultTests() {
  DEFAULT_AB_TESTS.forEach(test => {
    abTestingEngine.createTest(
      test.scenarioId,
      test.name,
      test.variants,
      100 // minimum sample size
    )
  })
}

// Helper function to get best performing variant
export function getBestVariant(scenarioId: string): string | null {
  const tests = abTestingEngine.getActiveTests()
  const test = tests.find(t => t.scenarioId === scenarioId)
  
  if (!test) return null
  
  // Return variant with highest conversion rate
  const best = test.variants.reduce((prev, current) => {
    const prevRate = prev.impressions > 0 ? prev.conversions / prev.impressions : 0
    const currRate = current.impressions > 0 ? current.conversions / current.impressions : 0
    return currRate > prevRate ? current : prev
  })
  
  return best.response
}