'use client';

import { fashionClipService } from './fashionClipService';

export interface CustomerStyleProfile {
  customerId: string;
  email?: string;
  name?: string;
  styleVector: number[];
  preferredColors: string[];
  preferredStyles: string[];
  sizingPreferences: {
    fit: 'slim' | 'regular' | 'relaxed';
    preferredBrands: string[];
  };
  purchaseHistory: string[];
  browsingHistory: string[];
  styleScore: number;
  lastUpdated: Date;
}

export interface StyleMatch {
  customer: CustomerStyleProfile;
  similarityScore: number;
  commonPreferences: string[];
  recommendationReason: string;
}

export interface SocialProof {
  totalCustomersWithSimilarStyle: number;
  recentPurchases: Array<{
    productId: string;
    customerCount: number;
    averageRating: number;
  }>;
  styleInfluencers: CustomerStyleProfile[];
  trendingItems: Array<{
    productId: string;
    trendScore: number;
    adoptionRate: number;
  }>;
}

class SocialStyleMatchingService {
  private styleProfiles: Map<string, CustomerStyleProfile> = new Map();
  private readonly SIMILARITY_THRESHOLD = 0.75;
  private readonly MAX_MATCHES = 20;
  
  /**
   * Create or update a customer's style profile based on their interactions
   */
  async updateCustomerStyleProfile(
    customerId: string,
    data: {
      purchasedProducts?: string[];
      viewedProducts?: string[];
      uploadedImages?: File[];
      explicitPreferences?: {
        colors?: string[];
        styles?: string[];
        fit?: 'slim' | 'regular' | 'relaxed';
      };
    }
  ): Promise<CustomerStyleProfile> {
    let profile = this.styleProfiles.get(customerId) || {
      customerId,
      styleVector: [],
      preferredColors: [],
      preferredStyles: [],
      sizingPreferences: { fit: 'regular', preferredBrands: [] },
      purchaseHistory: [],
      browsingHistory: [],
      styleScore: 0,
      lastUpdated: new Date()
    };

    // Analyze images if provided to extract style preferences
    if (data.uploadedImages?.length) {
      for (const image of data.uploadedImages) {
        const analysis = await fashionClipService.analyzeImage(image);
        if (analysis) {
          // Extract style information from predictions
          const extractedStyles = analysis.predictions?.map((p: { label: string }) => p.label) || [];
          profile.preferredStyles = this.mergePreferences(
            profile.preferredStyles, 
            extractedStyles
          );
          // Fashion CLIP doesn't provide colors directly, keep existing preferences
          // profile.preferredColors unchanged
        }
      }
    }

    // Update based on explicit preferences
    if (data.explicitPreferences) {
      if (data.explicitPreferences.colors) {
        profile.preferredColors = this.mergePreferences(
          profile.preferredColors,
          data.explicitPreferences.colors
        );
      }
      if (data.explicitPreferences.styles) {
        profile.preferredStyles = this.mergePreferences(
          profile.preferredStyles,
          data.explicitPreferences.styles
        );
      }
      if (data.explicitPreferences.fit) {
        profile.sizingPreferences.fit = data.explicitPreferences.fit;
      }
    }

    // Update interaction history
    if (data.purchasedProducts) {
      profile.purchaseHistory = [...new Set([
        ...profile.purchaseHistory,
        ...data.purchasedProducts
      ])];
    }
    
    if (data.viewedProducts) {
      profile.browsingHistory = [...new Set([
        ...profile.browsingHistory,
        ...data.viewedProducts
      ])].slice(-50); // Keep last 50 viewed items
    }

    // Generate style vector (simplified - in production this would use ML embeddings)
    profile.styleVector = this.generateStyleVector(profile);
    profile.styleScore = this.calculateStyleScore(profile);
    profile.lastUpdated = new Date();

    this.styleProfiles.set(customerId, profile);
    return profile;
  }

  /**
   * Find customers with similar style preferences
   */
  async findSimilarCustomers(
    customerId: string,
    limit: number = 10
  ): Promise<StyleMatch[]> {
    const customerProfile = this.styleProfiles.get(customerId);
    if (!customerProfile) {
      throw new Error('Customer profile not found');
    }

    const matches: StyleMatch[] = [];

    for (const [id, profile] of this.styleProfiles) {
      if (id === customerId) continue;

      const similarityScore = this.calculateSimilarity(
        customerProfile.styleVector,
        profile.styleVector
      );

      if (similarityScore >= this.SIMILARITY_THRESHOLD) {
        const commonPreferences = this.findCommonPreferences(
          customerProfile,
          profile
        );

        matches.push({
          customer: profile,
          similarityScore,
          commonPreferences,
          recommendationReason: this.generateRecommendationReason(
            similarityScore,
            commonPreferences
          )
        });
      }
    }

    return matches
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }

  /**
   * Get social proof for a specific product
   */
  async getProductSocialProof(productId: string): Promise<SocialProof> {
    const customersWhoPurchased = Array.from(this.styleProfiles.values())
      .filter(profile => profile.purchaseHistory.includes(productId));

    const customersWhoViewed = Array.from(this.styleProfiles.values())
      .filter(profile => profile.browsingHistory.includes(productId));

    // Find customers with similar style to those who purchased
    const buyerStyleVectors = customersWhoPurchased.map(c => c.styleVector);
    const averageBuyerStyle = this.calculateAverageStyleVector(buyerStyleVectors);

    const similarStyleCustomers = Array.from(this.styleProfiles.values())
      .filter(profile => {
        const similarity = this.calculateSimilarity(
          profile.styleVector,
          averageBuyerStyle
        );
        return similarity >= 0.6;
      });

    // Identify style influencers (customers with high style scores)
    const styleInfluencers = customersWhoPurchased
      .filter(customer => customer.styleScore > 80)
      .slice(0, 5);

    return {
      totalCustomersWithSimilarStyle: similarStyleCustomers.length,
      recentPurchases: [{
        productId,
        customerCount: customersWhoPurchased.length,
        averageRating: 4.5 // Mock data - would come from reviews
      }],
      styleInfluencers,
      trendingItems: [] // Would be calculated based on recent purchase patterns
    };
  }

  /**
   * Get style-based recommendations for a customer
   */
  async getStyleBasedRecommendations(
    customerId: string,
    productCategories?: string[]
  ): Promise<Array<{
    productId: string;
    recommendationScore: number;
    reason: string;
    socialProof: string;
  }>> {
    const customerProfile = this.styleProfiles.get(customerId);
    if (!customerProfile) return [];

    const similarCustomers = await this.findSimilarCustomers(customerId, 20);
    
    // Aggregate products from similar customers' purchase history
    const recommendedProducts = new Map<string, {
      count: number;
      customers: string[];
      avgStyleScore: number;
    }>();

    similarCustomers.forEach(match => {
      match.customer.purchaseHistory.forEach(productId => {
        if (customerProfile.purchaseHistory.includes(productId)) return;

        const existing = recommendedProducts.get(productId) || {
          count: 0,
          customers: [],
          avgStyleScore: 0
        };

        existing.count++;
        existing.customers.push(match.customer.customerId);
        existing.avgStyleScore = (existing.avgStyleScore + match.customer.styleScore) / existing.count;

        recommendedProducts.set(productId, existing);
      });
    });

    // Convert to recommendation format
    return Array.from(recommendedProducts.entries())
      .map(([productId, data]) => ({
        productId,
        recommendationScore: (data.count / similarCustomers.length) * (data.avgStyleScore / 100),
        reason: `Based on preferences of ${data.count} customers with similar style`,
        socialProof: `${data.count} customers with similar taste purchased this item`
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 12);
  }

  /**
   * Generate anonymous style insights for display
   */
  getAnonymousStyleInsights(productId: string): {
    similarCustomersCount: number;
    topStylePreferences: string[];
    averageAge?: string;
    popularCombinations: string[];
  } {
    const customers = Array.from(this.styleProfiles.values())
      .filter(profile => profile.purchaseHistory.includes(productId));

    const allPreferences = customers.flatMap(c => [...c.preferredStyles, ...c.preferredColors]);
    const preferenceCount = allPreferences.reduce((acc, pref) => {
      acc[pref] = (acc[pref] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPreferences = Object.entries(preferenceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([pref]) => pref);

    return {
      similarCustomersCount: customers.length,
      topStylePreferences: topPreferences,
      popularCombinations: this.findPopularCombinations(customers)
    };
  }

  // Private helper methods
  private mergePreferences(existing: string[], newPrefs: string[]): string[] {
    const merged = [...existing, ...newPrefs];
    const counted = merged.reduce((acc, pref) => {
      acc[pref] = (acc[pref] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counted)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([pref]) => pref);
  }

  private generateStyleVector(profile: CustomerStyleProfile): number[] {
    // Simplified style vector generation
    // In production, this would use Fashion-CLIP embeddings
    const features = [
      ...profile.preferredColors.slice(0, 5),
      ...profile.preferredStyles.slice(0, 5),
      profile.sizingPreferences.fit
    ];

    return features.map(feature => {
      return feature.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
    });
  }

  private calculateSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) return 0;
    
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
    
    return dotProduct / (magnitudeA * magnitudeB) || 0;
  }

  private calculateStyleScore(profile: CustomerStyleProfile): number {
    let score = 50; // Base score

    // More interactions = higher score
    score += Math.min(profile.purchaseHistory.length * 5, 30);
    score += Math.min(profile.browsingHistory.length * 0.5, 10);
    
    // Diversity in preferences = higher score
    score += Math.min(profile.preferredStyles.length * 2, 10);
    
    return Math.min(score, 100);
  }

  private findCommonPreferences(
    profileA: CustomerStyleProfile,
    profileB: CustomerStyleProfile
  ): string[] {
    const commonColors = profileA.preferredColors.filter(color => 
      profileB.preferredColors.includes(color)
    );
    
    const commonStyles = profileA.preferredStyles.filter(style => 
      profileB.preferredStyles.includes(style)
    );

    return [...commonColors, ...commonStyles];
  }

  private generateRecommendationReason(
    similarity: number,
    commonPreferences: string[]
  ): string {
    const simPercent = Math.round(similarity * 100);
    
    if (commonPreferences.length > 3) {
      return `${simPercent}% style match with shared preferences for ${commonPreferences.slice(0, 3).join(', ')}`;
    } else if (commonPreferences.length > 0) {
      return `${simPercent}% style match with shared love for ${commonPreferences.join(' and ')}`;
    } else {
      return `${simPercent}% overall style compatibility`;
    }
  }

  private calculateAverageStyleVector(vectors: number[][]): number[] {
    if (vectors.length === 0) return [];
    
    const length = vectors[0].length;
    const average = new Array(length).fill(0);
    
    vectors.forEach(vector => {
      vector.forEach((value, index) => {
        average[index] += value;
      });
    });
    
    return average.map(sum => sum / vectors.length);
  }

  private findPopularCombinations(customers: CustomerStyleProfile[]): string[] {
    // Simplified - would analyze actual product combinations
    return ['Navy suit + Brown shoes', 'Charcoal suit + Black shoes', 'Blue shirt + Navy suit'];
  }
}

export const socialStyleMatching = new SocialStyleMatchingService();