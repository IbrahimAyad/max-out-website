// Atelier AI Type Definitions

export type OccasionType = 
  | 'wedding'
  | 'wedding-guest' 
  | 'business-formal'
  | 'business-casual'
  | 'cocktail'
  | 'black-tie'
  | 'prom'
  | 'date-night'
  | 'interview'
  | 'graduation'
  | 'holiday-party'
  | 'casual-friday'

export type Season = 'spring' | 'summer' | 'fall' | 'winter'

export type StylePersonality = 
  | 'classic'
  | 'modern'
  | 'trendy'
  | 'minimalist'
  | 'bold'
  | 'vintage'
  | 'sophisticated'
  | 'casual'

export type BodyType = 
  | 'athletic'
  | 'slim'
  | 'regular'
  | 'muscular'
  | 'broad'
  | 'tall-slim'
  | 'tall-broad'

export type FitPreference = 'slim' | 'tailored' | 'regular' | 'relaxed'

export type BudgetRange = {
  min: number
  max: number
  preferred: number
}

export interface WeatherConditions {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  humidity: number
}

export interface UserPreferences {
  favoriteColors: string[]
  avoidColors: string[]
  favoritePatterns: string[]
  avoidPatterns: string[]
  favoriteBrands: string[]
  fitPreferences: Record<string, FitPreference>
}

export interface StyleProfile {
  personality: StylePersonality
  formalityLevel: number // 0-10
  trendiness: number // 0-10
  colorfulness: number // 0-10
  uniqueness: number // 0-10
}

export interface BodyMeasurements {
  chest: number
  waist: number
  hips: number
  neck: number
  sleeve: number
  inseam: number
  height: number
  weight: number
  shoeSize: number
}

export interface WardrobeItem {
  id: string
  category: string
  color: string
  brand: string
  occasions: OccasionType[]
  seasons: Season[]
}

export interface RecommendationContext {
  occasion: OccasionType
  season: Season
  weather?: WeatherConditions
  budget: BudgetRange
  personalStyle: StyleProfile
  bodyType: BodyType
  existingWardrobe?: WardrobeItem[]
  preferences: UserPreferences
  eventDate?: Date
  venue?: string
  dressCode?: string
}

export interface RecommendedItem {
  productId: string
  category: string
  reason: string
  confidence: number
  sizeRecommendation?: SizeRecommendation
  alternatives: string[]
  stylingTips: string[]
}

export interface OutfitRecommendation {
  id: string
  confidence: number
  totalPrice: number
  items: RecommendedItem[]
  stylingNotes: string[]
  occasionFit: number // 0-100
  seasonAppropriateness: number // 0-100
  alternativeOptions: AlternativeOutfit[]
  visualHarmony: number // 0-100
  trendScore: number // 0-100
}

export interface AlternativeOutfit {
  reason: string
  priceAdjustment: number
  swapItems: Array<{
    originalItemId: string
    newItemId: string
    reason: string
  }>
}

// Size Recommendation Types
export interface SizeRecommendation {
  productId: string
  recommendedSize: string
  confidence: number
  fitPrediction: FitPrediction
  alternativeSizes: AlternativeSize[]
  brandAdjustment: BrandAdjustment
  returnProbability: number
}

export interface FitPrediction {
  chestFit: FitRating
  waistFit: FitRating
  lengthFit: FitRating
  shoulderFit: FitRating
  overallComfort: number // 0-100
  mobilityRating: number // 0-100
}

export interface FitRating {
  score: number // -2 (too tight) to +2 (too loose), 0 is perfect
  description: string
}

export interface AlternativeSize {
  size: string
  fitAdjustment: string
  confidence: number
}

export interface BrandAdjustment {
  brand: string
  adjustment: 'size-up' | 'size-down' | 'true-to-size'
  note: string
}

// Style Analysis Types
export interface StyleAnalysis {
  imageId: string
  detectedItems: DetectedItem[]
  styleCategory: string
  occasionType: OccasionType
  colorPalette: ColorAnalysis
  formalityLevel: number
  seasonAppropriateness: SeasonRating
  overallAesthetic: string
}

export interface DetectedItem {
  category: string
  color: string
  pattern: string
  fitStyle: string
  confidence: number
  boundingBox: BoundingBox
  matchingProducts?: string[]
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface ColorAnalysis {
  dominantColors: Array<{
    hex: string
    name: string
    percentage: number
  }>
  colorHarmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic'
  seasonalAlignment: Season[]
}

export interface SeasonRating {
  spring: number
  summer: number
  fall: number
  winter: number
}

export interface StyleMatch {
  similarityScore: number
  matchingProducts: MatchingProduct[]
  completeLook: CompleteOutfit
  styleNotes: string[]
  budgetOptions: BudgetTier[]
}

export interface MatchingProduct {
  productId: string
  similarityScore: number
  matchedAttributes: string[]
  category: string
  price: number
}

export interface CompleteOutfit {
  items: OutfitItem[]
  totalPrice: number
  missingPieces: string[]
  alternativeOptions: AlternativeItem[]
}

export interface OutfitItem {
  productId: string
  category: string
  essential: boolean
  alternatives: string[]
}

export interface AlternativeItem {
  productId: string
  reason: string
  priceDifference: number
}

export interface BudgetTier {
  tier: 'economy' | 'standard' | 'premium'
  totalPrice: number
  items: string[]
}

// Conversation Types
export interface ConversationContext {
  sessionId: string
  userId?: string
  conversationHistory: Message[]
  currentIntent?: Intent
  extractedPreferences: ExtractedPreferences
  shoppingCart: CartItem[]
  activeProducts: string[]
  userProfile?: UserProfile
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  intent?: string
  entities?: ExtractedEntity[]
}

export interface Intent {
  type: IntentType
  confidence: number
  entities: ExtractedEntity[]
  context: IntentContext
}

export type IntentType = 
  | 'product-search'
  | 'size-help'
  | 'style-advice'
  | 'occasion-help'
  | 'order-status'
  | 'general-question'
  | 'checkout-help'
  | 'comparison'
  | 'budget-constraint'

export interface ExtractedEntity {
  type: string
  value: string
  confidence: number
}

export interface IntentContext {
  previousIntent?: IntentType
  conversationStage: 'greeting' | 'discovery' | 'consideration' | 'decision' | 'checkout'
  mood: 'positive' | 'neutral' | 'frustrated'
}

export interface ExtractedPreferences {
  occasion?: OccasionType
  budget?: BudgetRange
  colors?: string[]
  style?: StylePersonality
  urgency?: 'immediate' | 'planning' | 'browsing'
  specificItems?: string[]
}

export interface AIResponse {
  message: string
  intent: string
  confidence: number
  suggestedActions: Action[]
  productRecommendations: ProductSuggestion[]
  clarifyingQuestions?: string[]
  visualAids?: VisualAid[]
  metadata?: {
    agent?: {
      name: string
      avatar: string
      title: string
      specialty: string
    }
    shouldHandoff?: boolean
    emotion?: string
    urgency?: string
  }
}

export interface Action {
  type: 'navigate' | 'filter' | 'add-to-cart' | 'size-guide' | 'contact-support'
  label: string
  data: ActionData
}

export interface ProductSuggestion {
  productId: string
  reason: string
  relevanceScore: number
  highlight: string
}

export interface VisualAid {
  type: 'size-chart' | 'style-guide' | 'color-swatch' | 'outfit-visualization'
  data: VisualAidData
}

export interface CartItem {
  productId: string
  size: string
  quantity: number
  price: number
}

export interface UserProfile {
  id: string
  styleProfile: StyleProfile
  measurements?: BodyMeasurements
  preferences: UserPreferences
  purchaseHistory: PurchaseHistoryItem[]
  savedOutfits: SavedOutfit[]
}

export interface PurchaseHistoryItem {
  orderId: string
  items: Array<{
    productId: string
    size: string
    fit: 'perfect' | 'too-small' | 'too-large'
  }>
  occasion: OccasionType
  satisfaction: number // 1-5
}

export interface SavedOutfit {
  id: string
  name: string
  items: string[]
  occasion: OccasionType
  season: Season
  notes: string
}

// Supporting interface definitions for Action and VisualAid data
export interface ActionData {
  // Navigation data
  url?: string
  route?: string
  params?: Record<string, string>
  
  // Filter data
  filterType?: string
  filterValue?: string | string[] | number[]
  category?: string
  
  // Product data
  productId?: string
  size?: string
  quantity?: number
  
  // Generic data
  [key: string]: string | string[] | number | number[] | boolean | Record<string, unknown> | undefined
}

export interface VisualAidData {
  // Size chart data
  sizeChart?: {
    measurements: Array<{
      size: string
      chest: number
      waist: number
      length: number
    }>
    fitGuide?: string
  }
  
  // Style guide data
  styleGuide?: {
    images: string[]
    tips: string[]
    dosDonts?: {
      dos: string[]
      donts: string[]
    }
  }
  
  // Color swatch data
  colorSwatch?: {
    colors: Array<{
      name: string
      hex: string
      available: boolean
    }>
    recommendations?: string[]
  }
  
  // Outfit visualization data
  outfitVisualization?: {
    image?: string
    items: Array<{
      productId: string
      position: { x: number; y: number }
      highlight: boolean
    }>
    alternatives?: string[]
  }
  
  // Generic data
  [key: string]: unknown
}