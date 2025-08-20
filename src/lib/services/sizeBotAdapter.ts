// Size Bot Adapter Service
// Connects to Railway API with fallback to static data

import { BODY_TYPES, determineBodyType, getAlterationRecommendations } from '../data/sizeBot/bodyTypes';
import { RETURN_ANALYSIS, getReturnRisk, getCommonAlterations } from '../data/sizeBot/returnAnalysis';
import { calculateSizeFromMeasurements } from '../data/sizeBot/sizingMatrices';

// Configuration
const SIZE_BOT_API = process.env.NEXT_PUBLIC_SIZE_BOT_API || 'https://kct-sizebot-api-production.up.railway.app';
const SIZE_BOT_KEY = process.env.NEXT_PUBLIC_SIZE_BOT_KEY || '';

interface SizeRecommendation {
  size: string;
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  bodyType: string;
  alterations: string[];
  rationale: string;
  measurements: {
    height: number;
    weight: number;
    chest?: number;
    waist?: number;
    drop?: number;
    bmi: number;
  };
  returnRisk?: {
    level: 'low' | 'medium' | 'high';
    percentage: number;
    recommendations: string[];
  };
  alternativeSize?: string;
  alterationCosts?: Array<{
    alteration: string;
    likelihood: number;
    cost_estimate: string;
  }>;
}

export class SizeBotAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string = SIZE_BOT_API, apiKey: string = SIZE_BOT_KEY) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  // Main recommendation method with API fallback
  async getSizeRecommendation(
    height: number,
    weight: number,
    fitPreference: 'slim' | 'regular' | 'relaxed' = 'regular',
    isFirstTimeBuyer: boolean = false
  ): Promise<SizeRecommendation> {
    try {
      // Try API first
      const response = await fetch(`${this.apiUrl}/api/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          height,
          weight,
          fitPreference
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.recommendation) {
          // Enhance API response with additional data
          const enhanced = this.enhanceRecommendation(
            data.recommendation,
            isFirstTimeBuyer
          );
          return enhanced;
        }
      }
    } catch (error) {

    }

    // Fallback to offline calculation
    return this.calculateOffline(height, weight, fitPreference, isFirstTimeBuyer);
  }

  // Offline size calculation using static data
  private calculateOffline(
    height: number,
    weight: number,
    fitPreference: 'slim' | 'regular' | 'relaxed',
    isFirstTimeBuyer: boolean
  ): SizeRecommendation {
    const bmi = (weight / (height * height)) * 703;

    // Determine body type
    const bodyType = determineBodyType(height, weight);

    // Calculate size from matrices
    const sizeResult = calculateSizeFromMeasurements(height, weight, bodyType, fitPreference);

    // Get confidence level
    const confidenceLevel = this.getConfidenceLevel(sizeResult.confidence);

    // Get alterations
    const alterations = getAlterationRecommendations(bodyType);
    const alterationNames = alterations
      .filter(alt => alt.frequency > 0.5)
      .map(alt => alt.type);

    // Get return risk
    const riskData = getReturnRisk(bodyType, sizeResult.confidence, isFirstTimeBuyer);
    const returnRisk = {
      level: riskData.riskLevel,
      percentage: riskData.riskPercentage,
      recommendations: riskData.recommendations
    };

    // Get alteration costs
    const alterationCosts = getCommonAlterations(bodyType);

    // Build rationale
    const rationale = this.buildRationale(bodyType, sizeResult.size, fitPreference);

    return {
      size: sizeResult.size,
      confidence: sizeResult.confidence,
      confidenceLevel,
      bodyType,
      alterations: alterationNames,
      rationale,
      measurements: {
        height,
        weight,
        bmi,
        drop: this.estimateDrop(bodyType)
      },
      returnRisk,
      alternativeSize: sizeResult.alternativeSize,
      alterationCosts
    };
  }

  // Enhance API recommendation with additional data
  private enhanceRecommendation(
    recommendation: any,
    isFirstTimeBuyer: boolean
  ): SizeRecommendation {
    const bodyType = recommendation.bodyType || 'regular';
    const confidence = recommendation.confidence || 0.85;

    // Add return risk analysis
    const riskData = getReturnRisk(bodyType, confidence, isFirstTimeBuyer);
    const returnRisk = {
      level: riskData.riskLevel,
      percentage: riskData.riskPercentage,
      recommendations: riskData.recommendations
    };

    // Add alteration costs
    const alterationCosts = getCommonAlterations(bodyType);

    return {
      ...recommendation,
      returnRisk,
      alterationCosts,
      confidenceLevel: this.getConfidenceLevel(confidence)
    };
  }

  // Get body type data
  async getBodyTypeInfo(bodyType: string) {
    const data = bodyType in BODY_TYPES 
      ? BODY_TYPES[bodyType as keyof typeof BODY_TYPES]
      : null;
    if (!data) return null;

    return {
      ...data,
      returnAnalysis: bodyType in RETURN_ANALYSIS.body_type_patterns
        ? RETURN_ANALYSIS.body_type_patterns[bodyType as keyof typeof RETURN_ANALYSIS.body_type_patterns]
        : undefined
    };
  }

  // Get all body types for UI
  async getAllBodyTypes() {
    return Object.entries(BODY_TYPES).map(([key, data]) => ({
      id: key,
      name: data.body_type,
      description: data.description,
      frequency: data.characteristics.frequency_in_population,
      returnRate: key in RETURN_ANALYSIS.body_type_patterns
        ? RETURN_ANALYSIS.body_type_patterns[key as keyof typeof RETURN_ANALYSIS.body_type_patterns]?.return_rate || 0.09
        : 0.09
    }));
  }

  // Validate size recommendation
  async validateSize(
    size: string,
    height: number,
    weight: number,
    bodyType: string
  ): Promise<{
    isValid: boolean;
    confidence: number;
    concerns: string[];
    suggestions: string[];
  }> {
    const recommended = await this.getSizeRecommendation(height, weight, 'regular');
    const isValid = recommended.size === size;

    const concerns: string[] = [];
    const suggestions: string[] = [];

    if (!isValid) {
      concerns.push(`Recommended size is ${recommended.size}, not ${size}`);

      // Check if size is too large or too small
      const recommendedNumber = parseInt(recommended.size);
      const selectedNumber = parseInt(size);

      if (selectedNumber > recommendedNumber) {
        concerns.push('Selected size may be too large');
        suggestions.push('Consider the recommended size for better fit');
      } else {
        concerns.push('Selected size may be too small');
        suggestions.push('Size up for comfort, especially in shoulders');
      }
    }

    // Add body type specific concerns
    if (bodyType === 'athletic') {
      suggestions.push('Athletic builds typically benefit from waist suppression alterations');
    }

    if (bodyType === 'broad') {
      suggestions.push('Broad builds may need shoulder adjustments');
    }

    return {
      isValid,
      confidence: isValid ? recommended.confidence : recommended.confidence * 0.7,
      concerns,
      suggestions
    };
  }

  // Helper methods
  private getConfidenceLevel(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence >= 0.9) return 'high';
    if (confidence >= 0.75) return 'medium';
    return 'low';
  }

  private estimateDrop(bodyType: string): number {
    switch (bodyType) {
      case 'athletic': return 8;
      case 'slim': return 4;
      case 'broad': return 5;
      default: return 6;
    }
  }

  private buildRationale(bodyType: string, size: string, fitPreference: string): string {
    const bodyTypeData = bodyType in BODY_TYPES 
      ? BODY_TYPES[bodyType as keyof typeof BODY_TYPES]
      : null;
    const approach = bodyTypeData?.sizing_strategy.primary_approach || 'Standard sizing';

    let rationale = `Based on your ${bodyType} build, we recommend size ${size}. `;
    rationale += `${approach}. `;

    if (fitPreference === 'slim') {
      rationale += 'You selected a slim fit preference, which will provide a closer fit. ';
    } else if (fitPreference === 'relaxed') {
      rationale += 'You selected a relaxed fit preference for extra comfort. ';
    }

    if (bodyType === 'athletic') {
      rationale += 'Your athletic build may require waist suppression for the best fit.';
    } else if (bodyType === 'slim') {
      rationale += 'Your slim build works best with our slim fit options.';
    }

    return rationale;
  }
}

// Export singleton instance
export const sizeBotAdapter = new SizeBotAdapter();