/**
 * Knowledge API Configuration
 * Enables all enhanced V2 endpoints and features
 */

export const KNOWLEDGE_API_CONFIG = {
  // Base configuration
  apiUrl: process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_API || 'https://kct-knowledge-api-2-production.up.railway.app',
  apiKey: process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_KEY || '',
  
  // Cache configuration (matching enhanced API)
  caching: {
    colorRelationships: 60 * 60 * 1000,     // 60 minutes
    combinationRules: 30 * 60 * 1000,       // 30 minutes
    conversionData: 15 * 60 * 1000,         // 15 minutes
    trendingData: 5 * 60 * 1000,            // 5 minutes
    styleProfiles: 2 * 60 * 60 * 1000,      // 2 hours
    bundles: 10 * 60 * 1000,                // 10 minutes
    visualAnalysis: 30 * 60 * 1000,         // 30 minutes
  },
  
  // Feature flags for V2 endpoints
  features: {
    // Core endpoints (V1)
    colorRelationships: true,
    combinationValidation: true,
    recommendations: true,
    trending: true,
    venues: true,
    styles: true,
    rules: true,
    
    // Enhanced V2 endpoints
    fashionClip: true,              // Visual analysis endpoints
    smartBundles: true,             // AI bundle generation
    conversionAnalytics: true,      // Conversion tracking
    customerProfiling: true,        // Advanced profiling
    predictiveTrends: true,         // Trend forecasting
    marketIntelligence: true,       // Inventory insights
    visualSearch: true,             // Image-based search
    realTimeAnalytics: true,        // Live metrics
  },
  
  // V2 Endpoints mapping
  endpoints: {
    // Core V2 endpoints (updated from V1)
    colors: '/api/v2/colors',
    colorRelationships: '/api/v2/colors/:color/relationships',
    validate: '/api/v2/combinations/validate',
    recommendations: '/api/v2/recommendations',
    trending: '/api/v2/intelligence/trending',
    venues: '/api/v2/venues/:type/recommendations',
    styles: '/api/v2/styles/:profile',
    rules: '/api/v2/rules/check',
    
    // Fashion-CLIP V2 endpoints
    visualAnalyze: '/api/v2/visual/analyze',
    visualMatch: '/api/v2/visual/match',
    visualSearch: '/api/v2/visual/search',
    visualSimilar: '/api/v2/visual/similar',
    visualTrend: '/api/v2/visual/trending',
    visualCompatibility: '/api/v2/visual/compatibility',
    visualEnhance: '/api/v2/visual/enhance',
    visualProfile: '/api/v2/visual/profile',
    visualBundle: '/api/v2/visual/bundle',
    
    // Smart Bundle V2 endpoints
    bundleGenerate: '/api/v2/bundles/generate',
    bundleOptimize: '/api/v2/bundles/optimize',
    bundlePersonalize: '/api/v2/bundles/personalize',
    bundleSeasonal: '/api/v2/bundles/seasonal',
    bundleOccasion: '/api/v2/bundles/occasion',
    bundleTrending: '/api/v2/bundles/trending',
    bundleScore: '/api/v2/bundles/score',
    bundleValidate: '/api/v2/bundles/validate',
    bundlePrice: '/api/v2/bundles/price',
    
    // Analytics & Intelligence endpoints
    analyticsConversion: '/api/v2/analytics/conversion',
    analyticsCustomer: '/api/v2/analytics/customer',
    analyticsTrend: '/api/v2/analytics/trend',
    analyticsMarket: '/api/v2/analytics/market',
    analyticsPredict: '/api/v2/analytics/predict',
    analyticsRealtime: '/api/v2/analytics/realtime',
    
    // Health & monitoring
    health: '/health',
    healthDetailed: '/health/detailed',
    metrics: '/metrics',
    status: '/status',
  },
  
  // Request configuration
  requests: {
    timeout: 10000,                 // 10 seconds
    retries: 3,
    retryDelay: 1000,              // 1 second
    rateLimit: {
      maxRequests: 1000,
      windowMs: 15 * 60 * 1000,    // 15 minutes
    },
  },
  
  // Response configuration
  responses: {
    enableCompression: true,
    enableCaching: true,
    cacheControl: 'public, max-age=300', // 5 minutes
  },
  
  // Circuit breaker configuration
  circuitBreaker: {
    enabled: true,
    errorThreshold: 5,
    resetTimeout: 60000,           // 1 minute
    requestTimeout: 5000,          // 5 seconds
  },
  
  // Scoring weights (matching enhanced API)
  scoringWeights: {
    visualMatch: 0.35,             // Fashion-CLIP visual: 35%
    knowledgeRules: 0.30,          // Knowledge Bank rules: 30%
    conversionRate: 0.20,          // Conversion rate: 20%
    customerRating: 0.10,          // Customer rating: 10%
    trendingScore: 0.05,           // Trending score: 5%
  },
};

// Helper function to build full endpoint URL
export function buildEndpointUrl(endpoint: string, params?: Record<string, string>): string {
  let url = `${KNOWLEDGE_API_CONFIG.apiUrl}${endpoint}`;
  
  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
}

// Helper function to get cache TTL for endpoint
export function getCacheTTL(endpoint: string): number {
  if (endpoint.includes('color')) return KNOWLEDGE_API_CONFIG.caching.colorRelationships;
  if (endpoint.includes('trending')) return KNOWLEDGE_API_CONFIG.caching.trendingData;
  if (endpoint.includes('conversion')) return KNOWLEDGE_API_CONFIG.caching.conversionData;
  if (endpoint.includes('bundle')) return KNOWLEDGE_API_CONFIG.caching.bundles;
  if (endpoint.includes('visual')) return KNOWLEDGE_API_CONFIG.caching.visualAnalysis;
  if (endpoint.includes('style') || endpoint.includes('profile')) return KNOWLEDGE_API_CONFIG.caching.styleProfiles;
  
  // Default cache time
  return KNOWLEDGE_API_CONFIG.caching.combinationRules;
}

// Export type for endpoints
export type KnowledgeAPIEndpoint = keyof typeof KNOWLEDGE_API_CONFIG.endpoints;