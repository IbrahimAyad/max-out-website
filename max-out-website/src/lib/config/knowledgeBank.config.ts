/**
 * Knowledge Bank Configuration
 * Maps between our system and the AI Suit-Shirt-Tie knowledge bank
 */

export const KNOWLEDGE_BANK_CONFIG = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_API || 'http://localhost:3002/api',
    apiKey: process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_KEY || '',
    timeout: 5000,
    retryAttempts: 3
  },

  // Color Mapping between systems
  colorMapping: {
    // Our system -> Knowledge Bank system
    'navy-blue': 'navy',
    'charcoal-grey': 'charcoal',
    'light-grey': 'light_grey',
    'sage-green': 'sage_green',
    'burgundy-red': 'burgundy',
    'powder-blue': 'powder_blue',
    'hunter-green': 'hunter_green',
    'blush-pink': 'blush_pink',
    'mustard-yellow': 'mustard',
    'coral-pink': 'coral',
    'forest-green': 'forest_green',
    'dusty-rose': 'dusty_rose'
  },

  // Occasion Mapping
  occasionMapping: {
    // Our categories -> Knowledge Bank categories
    'business-meeting': 'business_meeting',
    'wedding-guest': 'wedding_guest',
    'black-tie': 'black_tie_event',
    'cocktail-party': 'cocktail_attire',
    'job-interview': 'job_interview',
    'casual-friday': 'business_casual',
    'date-night': 'date_night',
    'graduation': 'graduation_ceremony'
  },

  // Style Profile Mapping
  styleProfileMapping: {
    // Our profiles -> Knowledge Bank profiles
    'traditional': 'classic_conservative',
    'modern': 'modern_adventurous',
    'trendy': 'fashion_forward',
    'minimalist': 'understated_elegance',
    'bold': 'bold_experimenter',
    'professional': 'power_dresser'
  },

  // Integration Features
  features: {
    // Which features to enable
    colorValidation: true,
    combinationRules: true,
    conversionTracking: true,
    trendingAnalysis: true,
    styleProfiles: true,
    seasonalAdjustments: true,
    priceOptimization: true,
    socialProof: true
  },

  // Cache Configuration
  cache: {
    // How long to cache different types of data (in minutes)
    colorRelationships: 60,      // 1 hour
    combinationRules: 30,        // 30 minutes
    conversionData: 15,          // 15 minutes
    trendingData: 5,             // 5 minutes
    styleProfiles: 120,          // 2 hours
    staticRules: 1440            // 24 hours
  },

  // Fallback Data
  fallbacks: {
    // Default combinations when API is unavailable
    defaultCombinations: [
      {
        suit: 'navy',
        shirt: 'white',
        tie: 'burgundy',
        score: 95,
        occasions: ['business', 'wedding', 'formal']
      },
      {
        suit: 'charcoal',
        shirt: 'light_blue',
        tie: 'silver',
        score: 92,
        occasions: ['business', 'interview']
      },
      {
        suit: 'grey',
        shirt: 'white',
        tie: 'navy',
        score: 90,
        occasions: ['business', 'casual']
      }
    ],
    
    // Default color relationships
    defaultColorRules: {
      navy: {
        perfect: ['white', 'light_blue', 'pink'],
        good: ['cream', 'grey'],
        avoid: ['black', 'brown']
      },
      charcoal: {
        perfect: ['white', 'light_blue'],
        good: ['pink', 'lavender'],
        avoid: ['brown']
      }
    }
  },

  // Scoring Weights
  scoring: {
    // How much weight to give each factor
    fashionClipVisual: 0.35,      // 35% - Visual AI analysis
    knowledgeBankRules: 0.30,      // 30% - Business rules
    conversionRate: 0.20,          // 20% - Historical performance
    customerRating: 0.10,          // 10% - Customer satisfaction
    trendingScore: 0.05            // 5% - Current trends
  },

  // API Endpoints
  endpoints: {
    recommendations: '/recommendations',
    validate: '/combinations/validate',
    colorRelationships: '/colors/relationships',
    trending: '/trending',
    styleProfiles: '/profiles',
    conversions: '/analytics/conversions',
    rules: '/rules',
    seasons: '/seasonal'
  }
};

// Helper function to map colors
export function mapColorToKnowledgeBank(color: string): string {
  return KNOWLEDGE_BANK_CONFIG.colorMapping[color as keyof typeof KNOWLEDGE_BANK_CONFIG.colorMapping] || color;
}

// Helper function to map occasions
export function mapOccasionToKnowledgeBank(occasion: string): string {
  return KNOWLEDGE_BANK_CONFIG.occasionMapping[occasion as keyof typeof KNOWLEDGE_BANK_CONFIG.occasionMapping] || occasion;
}

// Helper function to calculate unified score
export function calculateUnifiedScore(scores: {
  fashionClip?: number;
  knowledgeBank?: number;
  conversion?: number;
  customerRating?: number;
  trending?: number;
}): number {
  const weights = KNOWLEDGE_BANK_CONFIG.scoring;
  let totalScore = 0;
  let totalWeight = 0;

  if (scores.fashionClip !== undefined) {
    totalScore += scores.fashionClip * weights.fashionClipVisual;
    totalWeight += weights.fashionClipVisual;
  }

  if (scores.knowledgeBank !== undefined) {
    totalScore += scores.knowledgeBank * weights.knowledgeBankRules;
    totalWeight += weights.knowledgeBankRules;
  }

  if (scores.conversion !== undefined) {
    totalScore += scores.conversion * weights.conversionRate;
    totalWeight += weights.conversionRate;
  }

  if (scores.customerRating !== undefined) {
    totalScore += (scores.customerRating / 5 * 100) * weights.customerRating;
    totalWeight += weights.customerRating;
  }

  if (scores.trending !== undefined) {
    totalScore += scores.trending * weights.trendingScore;
    totalWeight += weights.trendingScore;
  }

  // Normalize if not all scores are present
  return totalWeight > 0 ? Math.round(totalScore / totalWeight * 100) : 50;
}