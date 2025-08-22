import { createClient } from '@supabase/supabase-js'
import type { 
  SizeRecommendation, 
  FitPrediction, 
  FitRating,
  AlternativeSize,
  BrandAdjustment,
  BodyMeasurements
} from '../types'

// Initialize Supabase only if environment variables are available (not during build)
const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : null

interface ProductDetails {
  id: string
  brand: string
  category: string
  sizeChart?: any
  fitType?: string
}

interface UserSizeHistory {
  productId: string
  size: string
  fit: 'perfect' | 'too-small' | 'too-large'
  category: string
  brand: string
}

export class SizePredictionService {
  async predictSize(
    userId: string, 
    productId: string,
    measurements?: BodyMeasurements
  ): Promise<SizeRecommendation> {
    try {
      // Get product details
      const product = await this.getProductDetails(productId)
      
      // Get user's size history
      const sizeHistory = await this.getUserSizeHistory(userId)
      
      // Get user measurements if not provided
      const userMeasurements = measurements || await this.getUserMeasurements(userId)
      
      // Calculate size recommendation
      const recommendation = await this.calculateSizeRecommendation(
        product,
        userMeasurements,
        sizeHistory
      )
      
      // Store recommendation for analytics
      await this.storeRecommendation(userId, productId, recommendation)
      
      return recommendation
    } catch (error) {
      console.error('Size prediction error:', error)
      throw new Error('Failed to predict size')
    }
  }

  private async getProductDetails(productId: string): Promise<ProductDetails> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()
    
    if (error || !data) {
      throw new Error('Product not found')
    }
    
    return {
      id: data.id,
      brand: data.vendor || 'Unknown',
      category: data.category,
      sizeChart: data.size_chart,
      fitType: data.tags?.find((tag: string) => 
        ['slim-fit', 'regular-fit', 'relaxed-fit', 'tailored-fit'].includes(tag)
      )
    }
  }

  private async getUserSizeHistory(userId: string): Promise<UserSizeHistory[]> {
    // In production, fetch from actual order history
    // For now, return mock data
    return []
  }

  private async getUserMeasurements(userId: string): Promise<BodyMeasurements | null> {
    const { data } = await supabase
      .from('user_style_profiles')
      .select('body_measurements')
      .eq('user_id', userId)
      .single()
    
    return data?.body_measurements || null
  }

  private async calculateSizeRecommendation(
    product: ProductDetails,
    measurements: BodyMeasurements | null,
    sizeHistory: UserSizeHistory[]
  ): Promise<SizeRecommendation> {
    // Base size calculation
    let recommendedSize = 'M' // Default
    let confidence = 0.5
    
    // If we have measurements, use them
    if (measurements) {
      recommendedSize = this.calculateSizeFromMeasurements(
        product.category,
        measurements,
        product.fitType
      )
      confidence = 0.8
    }
    
    // Adjust based on brand history
    const brandHistory = sizeHistory.filter(h => h.brand === product.brand)
    if (brandHistory.length > 0) {
      const brandAdjustment = this.analyzeBrandSizing(brandHistory)
      recommendedSize = this.adjustSizeForBrand(recommendedSize, brandAdjustment)
      confidence = Math.min(confidence + 0.1, 0.95)
    }
    
    // Generate fit prediction
    const fitPrediction = this.predictFit(
      recommendedSize,
      measurements,
      product.category,
      product.fitType
    )
    
    // Generate alternatives
    const alternativeSizes = this.generateAlternativeSizes(
      recommendedSize,
      fitPrediction,
      confidence
    )
    
    // Brand adjustment notes
    const brandAdjustment = this.getBrandAdjustment(product.brand, sizeHistory)
    
    // Calculate return probability
    const returnProbability = this.calculateReturnProbability(
      confidence,
      fitPrediction,
      sizeHistory
    )
    
    return {
      productId: product.id,
      recommendedSize,
      confidence,
      fitPrediction,
      alternativeSizes,
      brandAdjustment,
      returnProbability
    }
  }

  private calculateSizeFromMeasurements(
    category: string,
    measurements: BodyMeasurements,
    fitType?: string
  ): string {
    // Size charts for different categories
    const sizeCharts: Record<string, any> = {
      'suits': {
        'XS': { chest: [34, 36], waist: [28, 30] },
        'S': { chest: [36, 38], waist: [30, 32] },
        'M': { chest: [38, 40], waist: [32, 34] },
        'L': { chest: [40, 42], waist: [34, 36] },
        'XL': { chest: [42, 44], waist: [36, 38] },
        'XXL': { chest: [44, 46], waist: [38, 40] }
      },
      'dress-shirts': {
        'XS': { chest: [35, 37], neck: [14, 14.5] },
        'S': { chest: [37, 39], neck: [15, 15.5] },
        'M': { chest: [39, 41], neck: [15.5, 16] },
        'L': { chest: [41, 43], neck: [16, 16.5] },
        'XL': { chest: [43, 45], neck: [17, 17.5] },
        'XXL': { chest: [45, 47], neck: [17.5, 18] }
      }
    }
    
    // Get appropriate size chart
    const chart = sizeCharts[category] || sizeCharts['suits']
    
    // Find best matching size
    let bestSize = 'M'
    let bestScore = 0
    
    for (const [size, ranges] of Object.entries(chart)) {
      let score = 0
      if (measurements.chest >= ranges.chest[0] && measurements.chest <= ranges.chest[1]) {
        score += 0.5
      }
      if (ranges.waist && measurements.waist >= ranges.waist[0] && measurements.waist <= ranges.waist[1]) {
        score += 0.3
      }
      if (ranges.neck && measurements.neck >= ranges.neck[0] && measurements.neck <= ranges.neck[1]) {
        score += 0.2
      }
      
      if (score > bestScore) {
        bestScore = score
        bestSize = size
      }
    }
    
    // Adjust for fit type
    if (fitType === 'slim-fit' && bestSize !== 'XS') {
      // Consider sizing up for slim fit
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      const currentIndex = sizes.indexOf(bestSize)
      if (currentIndex > 0 && measurements.chest > chart[bestSize].chest[0] + 1) {
        bestSize = sizes[currentIndex - 1]
      }
    }
    
    return bestSize
  }

  private predictFit(
    size: string,
    measurements: BodyMeasurements | null,
    category: string,
    fitType?: string
  ): FitPrediction {
    // Default prediction
    const defaultFit: FitPrediction = {
      chestFit: { score: 0, description: 'Should fit well' },
      waistFit: { score: 0, description: 'Should fit well' },
      lengthFit: { score: 0, description: 'Standard length' },
      shoulderFit: { score: 0, description: 'Should align properly' },
      overallComfort: 85,
      mobilityRating: 80
    }
    
    if (!measurements) {
      return defaultFit
    }
    
    // Adjust predictions based on measurements and fit type
    if (fitType === 'slim-fit') {
      defaultFit.chestFit.description = 'Fitted through the chest'
      defaultFit.waistFit.description = 'Tapered at the waist'
      defaultFit.mobilityRating = 70
    } else if (fitType === 'relaxed-fit') {
      defaultFit.chestFit.description = 'Comfortable room in chest'
      defaultFit.waistFit.description = 'Relaxed through waist'
      defaultFit.mobilityRating = 90
    }
    
    return defaultFit
  }

  private generateAlternativeSizes(
    recommendedSize: string,
    fitPrediction: FitPrediction,
    confidence: number
  ): AlternativeSize[] {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const currentIndex = sizes.indexOf(recommendedSize)
    const alternatives: AlternativeSize[] = []
    
    // If confidence is low, suggest adjacent sizes
    if (confidence < 0.8) {
      if (currentIndex > 0) {
        alternatives.push({
          size: sizes[currentIndex - 1],
          fitAdjustment: 'Snugger fit, especially in chest and waist',
          confidence: confidence * 0.8
        })
      }
      if (currentIndex < sizes.length - 1) {
        alternatives.push({
          size: sizes[currentIndex + 1],
          fitAdjustment: 'Roomier fit with more comfort',
          confidence: confidence * 0.8
        })
      }
    }
    
    return alternatives
  }

  private analyzeBrandSizing(brandHistory: UserSizeHistory[]): 'size-up' | 'size-down' | 'true-to-size' {
    const tooSmallCount = brandHistory.filter(h => h.fit === 'too-small').length
    const tooLargeCount = brandHistory.filter(h => h.fit === 'too-large').length
    const perfectCount = brandHistory.filter(h => h.fit === 'perfect').length
    
    if (tooSmallCount > perfectCount && tooSmallCount > tooLargeCount) {
      return 'size-up'
    } else if (tooLargeCount > perfectCount && tooLargeCount > tooSmallCount) {
      return 'size-down'
    }
    
    return 'true-to-size'
  }

  private adjustSizeForBrand(
    size: string, 
    adjustment: 'size-up' | 'size-down' | 'true-to-size'
  ): string {
    if (adjustment === 'true-to-size') return size
    
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const currentIndex = sizes.indexOf(size)
    
    if (adjustment === 'size-up' && currentIndex < sizes.length - 1) {
      return sizes[currentIndex + 1]
    } else if (adjustment === 'size-down' && currentIndex > 0) {
      return sizes[currentIndex - 1]
    }
    
    return size
  }

  private getBrandAdjustment(brand: string, sizeHistory: UserSizeHistory[]): BrandAdjustment {
    // Known brand sizing tendencies
    const brandSizing: Record<string, BrandAdjustment> = {
      'Hugo Boss': {
        brand: 'Hugo Boss',
        adjustment: 'size-up',
        note: 'Hugo Boss tends to run small, consider sizing up'
      },
      'Calvin Klein': {
        brand: 'Calvin Klein',
        adjustment: 'true-to-size',
        note: 'Calvin Klein typically fits true to size'
      },
      'Ralph Lauren': {
        brand: 'Ralph Lauren',
        adjustment: 'true-to-size',
        note: 'Ralph Lauren offers consistent sizing'
      }
    }
    
    // Check if we have data for this brand
    if (brandSizing[brand]) {
      return brandSizing[brand]
    }
    
    // Analyze from user history
    const brandHistory = sizeHistory.filter(h => h.brand === brand)
    if (brandHistory.length > 0) {
      const adjustment = this.analyzeBrandSizing(brandHistory)
      return {
        brand,
        adjustment,
        note: adjustment === 'size-up' 
          ? `Based on your history, ${brand} tends to run small`
          : adjustment === 'size-down'
          ? `Based on your history, ${brand} tends to run large`
          : `${brand} fits true to size for you`
      }
    }
    
    return {
      brand,
      adjustment: 'true-to-size',
      note: 'Standard sizing for this brand'
    }
  }

  private calculateReturnProbability(
    confidence: number,
    fitPrediction: FitPrediction,
    sizeHistory: UserSizeHistory[]
  ): number {
    // Base return probability
    let probability = 0.15 // 15% base rate
    
    // Adjust based on confidence
    probability *= (1 - confidence)
    
    // Adjust based on fit prediction
    const avgFitScore = (
      Math.abs(fitPrediction.chestFit.score) +
      Math.abs(fitPrediction.waistFit.score) +
      Math.abs(fitPrediction.lengthFit.score)
    ) / 3
    
    probability += avgFitScore * 0.1
    
    // Adjust based on history
    if (sizeHistory.length > 0) {
      const returnRate = sizeHistory.filter(h => h.fit !== 'perfect').length / sizeHistory.length
      probability = (probability + returnRate) / 2
    }
    
    return Math.min(Math.max(probability, 0), 1)
  }

  private async storeRecommendation(
    userId: string,
    productId: string,
    recommendation: SizeRecommendation
  ): Promise<void> {
    try {
      await supabase.from('size_recommendations').insert({
        user_id: userId,
        product_id: productId,
        recommended_size: recommendation.recommendedSize,
        confidence_score: recommendation.confidence,
        fit_prediction: recommendation.fitPrediction,
        brand_adjustment: recommendation.brandAdjustment
      })
    } catch (error) {
      console.error('Failed to store size recommendation:', error)
    }
  }

  // Enhanced size prediction for size bot
  async predictSizeFromBasics(input: {
    height: number // cm or inches based on unit
    weight: number // kg or lbs based on unit
    fitPreference: 'slim' | 'regular' | 'relaxed'
    unit: 'metric' | 'imperial'
    productType?: 'suit' | 'shirt' | 'tuxedo'
  }): Promise<{
    primarySize: string
    primarySizeFull: string
    alternativeSize?: string
    alternativeSizeFull?: string
    confidence: number
    bodyType: string
    fitScore: number
    alterations?: string[]
    rationale?: string
  }> {
    // Convert to metric if needed
    const heightInches = input.unit === 'metric' ? input.height / 2.54 : input.height
    const weightLbs = input.unit === 'metric' ? input.weight * 2.20462 : input.weight
    
    // Calculate BMI
    const bmi = (weightLbs / (heightInches * heightInches)) * 703
    
    // Determine body type based on BMI and build
    let bodyType: string
    if (bmi < 18.5) bodyType = 'Slim'
    else if (bmi < 25) bodyType = 'Regular'
    else if (bmi < 30) bodyType = 'Athletic'
    else bodyType = 'Broad'
    
    // For shirts, use simple sizing
    if (input.productType === 'shirt') {
      let sizeIndex: number
      if (bmi < 18.5) sizeIndex = 0
      else if (bmi < 21) sizeIndex = 1
      else if (bmi < 23.5) sizeIndex = 2
      else if (bmi < 26) sizeIndex = 3
      else if (bmi < 29) sizeIndex = 4
      else sizeIndex = 5
      
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      const sizeNames = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Double XL']
      
      const primaryIndex = Math.round(sizeIndex)
      return {
        primarySize: sizes[primaryIndex],
        primarySizeFull: sizeNames[primaryIndex],
        confidence: 0.85,
        bodyType,
        fitScore: 8.5,
        rationale: `Based on your measurements, ${sizes[primaryIndex]} shirt will fit best.`
      }
    }
    
    // SUIT SIZING - Using actual suit size data
    // Determine chest size based on height/weight
    let chestSize: number
    
    // Enhanced chest size calculation based on the CSV data patterns
    if (weightLbs < 130) chestSize = 34
    else if (weightLbs < 145) chestSize = 36
    else if (weightLbs < 165) chestSize = 38
    else if (weightLbs < 180) chestSize = 40
    else if (weightLbs < 200) chestSize = 42
    else if (weightLbs < 220) chestSize = 44
    else if (weightLbs < 240) chestSize = 46
    else if (weightLbs < 260) chestSize = 48
    else if (weightLbs < 275) chestSize = 50
    else if (weightLbs < 290) chestSize = 52
    else chestSize = 54
    
    // Determine length (S/R/L) based on height
    let length: string
    if (heightInches < 68) length = 'S' // Under 5'8"
    else if (heightInches <= 72) length = 'R' // 5'8" to 6'0"
    else length = 'L' // Over 6'0"
    
    // Adjust for body type and fit preference
    if (bodyType === 'Athletic' && input.fitPreference === 'slim') {
      // Athletic builds with slim preference might need to size up
      if (chestSize < 54) chestSize += 2
    } else if (bodyType === 'Slim' && input.fitPreference === 'relaxed') {
      // Slim builds wanting relaxed fit should size up
      if (chestSize < 54) chestSize += 2
    } else if (bodyType === 'Broad' && input.fitPreference === 'slim') {
      // Broad builds wanting slim fit might struggle, recommend regular
      input.fitPreference = 'regular'
    }
    
    // Primary recommendation
    const primarySize = `${chestSize}${length}`
    
    // Alternative size logic
    let alternativeSize: string | undefined
    let alternativeSizeFull: string | undefined
    
    // If between sizes, suggest alternative
    if (weightLbs % 20 < 10 && chestSize > 34) {
      // Close to lower boundary, suggest size down as alternative
      alternativeSize = `${chestSize - 2}${length}`
      alternativeSizeFull = this.getFullSuitSizeName(alternativeSize)
    } else if (weightLbs % 20 > 15 && chestSize < 54) {
      // Close to upper boundary, suggest size up as alternative
      alternativeSize = `${chestSize + 2}${length}`
      alternativeSizeFull = this.getFullSuitSizeName(alternativeSize)
    }
    
    // Calculate confidence based on edge cases
    let confidence = 0.90
    
    // Reduce confidence for edge cases
    if (heightInches < 63 || heightInches > 77) confidence -= 0.15 // Height extremes
    if (weightLbs < 110 || weightLbs > 290) confidence -= 0.10 // Weight extremes
    if (bmi < 16 || bmi > 35) confidence -= 0.10 // BMI extremes
    
    // Calculate chest-to-waist drop for alterations
    const estimatedWaist = chestSize - 6 // Standard 6" drop
    
    // Determine alterations needed
    const alterations: string[] = []
    
    if (bodyType === 'Athletic') {
      alterations.push('Taper waist for athletic V-shape')
      if (chestSize >= 44) alterations.push('Let out chest slightly')
    }
    
    if (bodyType === 'Slim' && input.fitPreference === 'slim') {
      alterations.push('Take in waist for slimmer silhouette')
      alterations.push('Narrow sleeves for proportional fit')
    }
    
    if (length === 'S' && heightInches < 66) {
      alterations.push('Shorten jacket length by 1-2 inches')
      alterations.push('Hem trouser length')
    } else if (length === 'L' && heightInches > 74) {
      alterations.push('Extend sleeve length by 1 inch')
    }
    
    if (bodyType === 'Broad') {
      alterations.push('Let out waist for comfort')
      alterations.push('Widen sleeves if needed')
    }
    
    // Generate detailed rationale
    const rationale = `Based on your ${heightInches}" height and ${weightLbs} lbs weight, ` +
      `with a ${bodyType.toLowerCase()} build, size ${primarySize} suit will provide the best fit. ` +
      `The "${length}" length is ideal for your height range. ` +
      (alternativeSize ? 
        `Size ${alternativeSize} could also work if you prefer a ${alternativeSize > primarySize ? 'roomier' : 'more fitted'} feel. ` : 
        '') +
      (alterations.length > 0 ? 
        'Minor tailoring will perfect the fit.' : 
        'This should fit well with minimal alterations.')
    
    return {
      primarySize,
      primarySizeFull: this.getFullSuitSizeName(primarySize),
      alternativeSize,
      alternativeSizeFull,
      confidence: Math.max(0.5, confidence),
      bodyType,
      fitScore: 8.5 - ((1 - confidence) * 3),
      alterations: alterations.length > 0 ? alterations : undefined,
      rationale
    }
  }
  
  private getFullSuitSizeName(size: string): string {
    const chest = size.slice(0, -1)
    const length = size.slice(-1)
    const lengthNames: Record<string, string> = {
      'S': 'Short',
      'R': 'Regular',
      'L': 'Long'
    }
    return `${chest} ${lengthNames[length] || 'Regular'}`
  }
}

// Export singleton instance
export const sizePredictionService = new SizePredictionService()