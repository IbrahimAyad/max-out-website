'use client';

import { KNOWLEDGE_API_CONFIG, buildEndpointUrl, getCacheTTL } from '@/lib/config/knowledgeApi';

/**
 * Enhanced Knowledge Bank Adapter
 * Full integration with all V2 endpoints and advanced features
 */

export interface VisualAnalysisResult {
  imageUrl: string;
  analysis: {
    colors: Array<{ color: string; confidence: number }>;
    style: string;
    occasion: string[];
    season: string;
    formality: number;
  };
  recommendations: Array<{
    type: 'suit' | 'shirt' | 'tie' | 'accessory';
    items: Array<{
      id: string;
      name: string;
      matchScore: number;
      reason: string;
    }>;
  }>;
}

export interface SmartBundle {
  id: string;
  name: string;
  description: string;
  items: Array<{
    type: string;
    id: string;
    name: string;
    price: number;
    color: string;
    image: string;
  }>;
  pricing: {
    total: number;
    bundlePrice: number;
    savings: number;
    savingsPercentage: number;
  };
  scores: {
    overall: number;
    visual: number;
    compatibility: number;
    conversion: number;
    trending: number;
  };
  metadata: {
    occasion: string[];
    season: string;
    style: string;
    customerProfile: string;
  };
}

export interface TrendPrediction {
  item: string;
  currentTrend: number;
  predictedTrend: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

export interface CustomerInsight {
  profileId: string;
  characteristics: Record<string, any>;
  preferences: {
    colors: string[];
    styles: string[];
    priceRange: { min: number; max: number };
  };
  behavior: {
    conversionRate: number;
    averageOrderValue: number;
    returnRate: number;
    favoriteCategories: string[];
  };
  recommendations: {
    products: string[];
    bundles: string[];
    messaging: string[];
  };
}

class EnhancedKnowledgeAdapter {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private requestQueue: Map<string, Promise<unknown>> = new Map();
  
  constructor() {
    // Initialize with config
  }

  /**
   * Base request method with caching, retries, and circuit breaker
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, string>
  ): Promise<T> {
    const url = buildEndpointUrl(endpoint, params);
    const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
    
    // Check cache
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    
    // Check if request is already in flight
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }
    
    // Create request promise
    const requestPromise = this.executeRequest<T>(url, options)
      .then(data => {
        // Cache successful response
        const ttl = getCacheTTL(endpoint);
        this.setCache(cacheKey, data, ttl);
        this.requestQueue.delete(cacheKey);
        return data;
      })
      .catch(error => {
        this.requestQueue.delete(cacheKey);
        throw error;
      });
    
    this.requestQueue.set(cacheKey, requestPromise);
    return requestPromise;
  }

  private async executeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const config = KNOWLEDGE_API_CONFIG;
    let lastError: Error | null = null;
    
    // Retry logic
    for (let attempt = 0; attempt < config.requests.retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'x-api-key': config.apiKey,
            'Content-Type': 'application/json',
            ...options.headers,
          },
          signal: AbortSignal.timeout(config.requests.timeout),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Request attempt ${attempt + 1} failed:`, error);
        
        if (attempt < config.requests.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, config.requests.retryDelay));
        }
      }
    }
    
    throw lastError || new Error('Request failed after retries');
  }

  private getFromCache(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 0) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  /**
   * Visual Analysis Endpoints (Fashion-CLIP V2)
   */
  
  async analyzeImage(imageUrl: string): Promise<VisualAnalysisResult> {
    if (!KNOWLEDGE_API_CONFIG.features.fashionClip) {
      throw new Error('Fashion-CLIP features are not enabled');
    }
    
    return this.request<VisualAnalysisResult>(
      KNOWLEDGE_API_CONFIG.endpoints.visualAnalyze,
      {
        method: 'POST',
        body: JSON.stringify({ imageUrl }),
      }
    );
  }

  async findVisualMatches(imageUrl: string, category?: string): Promise<any[]> {
    return this.request<any[]>(
      KNOWLEDGE_API_CONFIG.endpoints.visualMatch,
      {
        method: 'POST',
        body: JSON.stringify({ imageUrl, category }),
      }
    );
  }

  async searchByImage(imageUrl: string, filters?: any): Promise<any[]> {
    return this.request<any[]>(
      KNOWLEDGE_API_CONFIG.endpoints.visualSearch,
      {
        method: 'POST',
        body: JSON.stringify({ imageUrl, filters }),
      }
    );
  }

  /**
   * Smart Bundle Endpoints (V2)
   */
  
  async generateSmartBundle(options: {
    occasion?: string;
    season?: string;
    budget?: { min: number; max: number };
    style?: string;
    customerProfile?: string;
  }): Promise<SmartBundle[]> {
    if (!KNOWLEDGE_API_CONFIG.features.smartBundles) {
      throw new Error('Smart bundle features are not enabled');
    }
    
    return this.request<SmartBundle[]>(
      KNOWLEDGE_API_CONFIG.endpoints.bundleGenerate,
      {
        method: 'POST',
        body: JSON.stringify(options),
      }
    );
  }

  async optimizeBundle(items: string[], targetMetrics?: any): Promise<SmartBundle> {
    return this.request<SmartBundle>(
      KNOWLEDGE_API_CONFIG.endpoints.bundleOptimize,
      {
        method: 'POST',
        body: JSON.stringify({ items, targetMetrics }),
      }
    );
  }

  async getSeasonalBundles(season: string): Promise<SmartBundle[]> {
    return this.request<SmartBundle[]>(
      KNOWLEDGE_API_CONFIG.endpoints.bundleSeasonal,
      {
        method: 'GET',
      },
      { season }
    );
  }

  async getTrendingBundles(limit: number = 10): Promise<SmartBundle[]> {
    return this.request<SmartBundle[]>(
      KNOWLEDGE_API_CONFIG.endpoints.bundleTrending,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Analytics & Intelligence Endpoints (V2)
   */
  
  async getConversionAnalytics(timeframe?: string): Promise<any> {
    if (!KNOWLEDGE_API_CONFIG.features.conversionAnalytics) {
      throw new Error('Conversion analytics features are not enabled');
    }
    
    return this.request<any>(
      KNOWLEDGE_API_CONFIG.endpoints.analyticsConversion,
      {
        method: 'GET',
      }
    );
  }

  async getCustomerInsights(customerId?: string): Promise<CustomerInsight> {
    if (!KNOWLEDGE_API_CONFIG.features.customerProfiling) {
      throw new Error('Customer profiling features are not enabled');
    }
    
    return this.request<CustomerInsight>(
      KNOWLEDGE_API_CONFIG.endpoints.analyticsCustomer,
      {
        method: 'GET',
      }
    );
  }

  async getTrendPredictions(category?: string): Promise<TrendPrediction[]> {
    if (!KNOWLEDGE_API_CONFIG.features.predictiveTrends) {
      throw new Error('Predictive trends features are not enabled');
    }
    
    return this.request<TrendPrediction[]>(
      KNOWLEDGE_API_CONFIG.endpoints.analyticsPredict,
      {
        method: 'GET',
      }
    );
  }

  async getMarketIntelligence(): Promise<any> {
    if (!KNOWLEDGE_API_CONFIG.features.marketIntelligence) {
      throw new Error('Market intelligence features are not enabled');
    }
    
    return this.request<any>(
      KNOWLEDGE_API_CONFIG.endpoints.analyticsMarket,
      {
        method: 'GET',
      }
    );
  }

  async getRealTimeMetrics(): Promise<any> {
    if (!KNOWLEDGE_API_CONFIG.features.realTimeAnalytics) {
      throw new Error('Real-time analytics features are not enabled');
    }
    
    return this.request<any>(
      KNOWLEDGE_API_CONFIG.endpoints.analyticsRealtime,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Core V1 Endpoints (maintained for compatibility)
   */
  
  async getColorRelationships(suitColor: string): Promise<any> {
    return this.request<any>(
      KNOWLEDGE_API_CONFIG.endpoints.colorRelationships,
      {
        method: 'GET',
      },
      { color: suitColor }
    );
  }

  async validateCombination(suit: string, shirt: string, tie: string): Promise<any> {
    return this.request<any>(
      KNOWLEDGE_API_CONFIG.endpoints.validate,
      {
        method: 'POST',
        body: JSON.stringify({ suit, shirt, tie }),
      }
    );
  }

  async getRecommendations(options: any): Promise<any[]> {
    return this.request<any[]>(
      KNOWLEDGE_API_CONFIG.endpoints.recommendations,
      {
        method: 'POST',
        body: JSON.stringify(options),
      }
    );
  }

  async getTrending(limit?: number): Promise<any[]> {
    return this.request<any[]>(
      KNOWLEDGE_API_CONFIG.endpoints.trending,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Health & Monitoring
   */
  
  async checkHealth(): Promise<{ status: string; services: any }> {
    try {
      const response = await fetch(
        `${KNOWLEDGE_API_CONFIG.apiUrl}${KNOWLEDGE_API_CONFIG.endpoints.healthDetailed}`,
        {
          signal: AbortSignal.timeout(5000),
        }
      );
      
      if (response.ok) {
        return await response.json();
      }
      
      return { status: 'unhealthy', services: {} };
    } catch (error) {
      return { status: 'unreachable', services: {} };
    }
  }
}

// Export singleton instance
export const enhancedKnowledgeAPI = new EnhancedKnowledgeAdapter();

// Export types
export type { EnhancedKnowledgeAdapter };