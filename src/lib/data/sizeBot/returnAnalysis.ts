// Size Bot Return Analysis Data
// Based on enhanced-size-bot-integration return insights

export interface ReturnMetrics {
  total_return_rate: number;
  fit_related_returns: number;
  size_related_returns: number;
  style_related_returns: number;
  quality_related_returns: number;
}

export interface ReturnReason {
  frequency: number;
  description: string;
  common_causes: string[];
  affected_body_types: string[];
  confidence_impact: 'high' | 'medium' | 'low';
  prevention_strategies: string[];
}

export interface BodyTypeReturnPattern {
  return_rate: number;
  primary_reasons: Array<{
    reason: string;
    frequency: number;
    solution: string;
  }>;
  improvement_areas: string[];
}

export interface ConfidenceCorrelation {
  return_rate: number;
  description: string;
}

export const RETURN_ANALYSIS = {
  overall_metrics: {
    total_return_rate: 0.09,
    fit_related_returns: 0.75,
    size_related_returns: 0.60,
    style_related_returns: 0.15,
    quality_related_returns: 0.10
  } as ReturnMetrics,
  
  return_reasons: {
    size_too_large: {
      frequency: 0.25,
      description: "Customer received size larger than needed",
      common_causes: [
        "Overestimation of measurements",
        "Conservative sizing approach",
        "Inaccurate height-weight matrix lookup",
        "Body type misclassification"
      ],
      affected_body_types: ["slim", "regular"],
      confidence_impact: "high",
      prevention_strategies: [
        "Improve measurement accuracy",
        "Better body type classification",
        "More accurate size recommendations",
        "Clearer sizing guidance"
      ]
    },
    
    size_too_small: {
      frequency: 0.20,
      description: "Customer received size smaller than needed",
      common_causes: [
        "Underestimation of measurements",
        "Aggressive sizing approach",
        "Inaccurate chest/shoulder measurements",
        "Broad build misclassification"
      ],
      affected_body_types: ["broad", "athletic"],
      confidence_impact: "high",
      prevention_strategies: [
        "Better broad build recognition",
        "Improved shoulder-based sizing",
        "More accurate chest measurements",
        "Size up recommendations for broad builds"
      ]
    },
    
    sleeve_length_issues: {
      frequency: 0.18,
      description: "Sleeves too long or too short",
      common_causes: [
        "Inaccurate height-based length selection",
        "Arm length not considered",
        "Length category misclassification",
        "Standard length assumptions"
      ],
      affected_body_types: ["all"],
      confidence_impact: "medium",
      prevention_strategies: [
        "Better length classification",
        "Arm length consideration",
        "More accurate height ranges",
        "Length adjustment recommendations"
      ]
    },
    
    waist_fit_issues: {
      frequency: 0.15,
      description: "Waist too tight or too loose",
      common_causes: [
        "Athletic build waist suppression needed",
        "Broad build waist too tight",
        "Inaccurate waist measurements",
        "Body type misclassification"
      ],
      affected_body_types: ["athletic", "broad"],
      confidence_impact: "medium",
      prevention_strategies: [
        "Better athletic build recognition",
        "Waist alteration recommendations",
        "More accurate waist predictions",
        "Body type-specific sizing"
      ]
    },
    
    shoulder_fit_issues: {
      frequency: 0.12,
      description: "Shoulders too wide or too narrow",
      common_causes: [
        "Inaccurate shoulder measurements",
        "Athletic build shoulder sizing",
        "Broad build shoulder sizing",
        "Standard shoulder assumptions"
      ],
      affected_body_types: ["athletic", "broad"],
      confidence_impact: "high",
      prevention_strategies: [
        "Better shoulder measurement guidance",
        "Athletic build shoulder sizing",
        "Broad build shoulder sizing",
        "Professional fitting recommendations"
      ]
    },
    
    jacket_length_issues: {
      frequency: 0.10,
      description: "Jacket too long or too short",
      common_causes: [
        "Height-based length misclassification",
        "Torso length not considered",
        "Length category assumptions",
        "Style preference conflicts"
      ],
      affected_body_types: ["all"],
      confidence_impact: "medium",
      prevention_strategies: [
        "Better length classification",
        "Torso length consideration",
        "Style preference integration",
        "Length adjustment guidance"
      ]
    }
  } as Record<string, ReturnReason>,
  
  body_type_patterns: {
    athletic: {
      return_rate: 0.08,
      primary_reasons: [
        {
          reason: "waist_too_loose",
          frequency: 0.40,
          solution: "Waist suppression recommendation"
        },
        {
          reason: "sleeve_too_narrow",
          frequency: 0.30,
          solution: "Sleeve width adjustment"
        },
        {
          reason: "jacket_too_short",
          frequency: 0.20,
          solution: "Length adjustment"
        }
      ],
      improvement_areas: [
        "Better waist prediction",
        "Improved sleeve sizing",
        "Length consideration"
      ]
    },
    
    slim: {
      return_rate: 0.12,
      primary_reasons: [
        {
          reason: "jacket_too_wide",
          frequency: 0.45,
          solution: "Size down recommendation"
        },
        {
          reason: "sleeve_too_wide",
          frequency: 0.35,
          solution: "Sleeve width adjustment"
        },
        {
          reason: "waist_too_loose",
          frequency: 0.20,
          solution: "Waist suppression"
        }
      ],
      improvement_areas: [
        "Better size down guidance",
        "Improved sleeve sizing",
        "Waist fit prediction"
      ]
    },
    
    regular: {
      return_rate: 0.06,
      primary_reasons: [
        {
          reason: "sleeve_length",
          frequency: 0.50,
          solution: "Length adjustment"
        },
        {
          reason: "minor_waist_adjustment",
          frequency: 0.30,
          solution: "Waist suppression"
        },
        {
          reason: "jacket_length",
          frequency: 0.20,
          solution: "Length adjustment"
        }
      ],
      improvement_areas: [
        "Better length options",
        "Improved sleeve sizing",
        "Minor fit adjustments"
      ]
    },
    
    broad: {
      return_rate: 0.10,
      primary_reasons: [
        {
          reason: "sleeve_too_narrow",
          frequency: 0.40,
          solution: "Sleeve width adjustment"
        },
        {
          reason: "waist_too_tight",
          frequency: 0.35,
          solution: "Waist let out"
        },
        {
          reason: "shoulder_too_narrow",
          frequency: 0.25,
          solution: "Size up recommendation"
        }
      ],
      improvement_areas: [
        "Better size up guidance",
        "Improved sleeve sizing",
        "Waist comfort consideration"
      ]
    }
  } as Record<string, BodyTypeReturnPattern>,
  
  confidence_correlation: {
    high_confidence: {
      return_rate: 0.05,
      description: "Very reliable recommendations"
    },
    medium_high_confidence: {
      return_rate: 0.08,
      description: "Reliable with minor uncertainty"
    },
    medium_confidence: {
      return_rate: 0.12,
      description: "Good with some uncertainty"
    },
    low_medium_confidence: {
      return_rate: 0.18,
      description: "Significant uncertainty"
    },
    low_confidence: {
      return_rate: 0.25,
      description: "High uncertainty"
    }
  } as Record<string, ConfidenceCorrelation>,
  
  edge_cases: {
    very_tall: {
      return_rate: 0.15,
      primary_reasons: [
        "sleeve_too_short",
        "jacket_too_short",
        "limited_size_availability"
      ],
      solutions: [
        "Tall size recommendations",
        "Professional fitting",
        "Custom sizing options"
      ]
    },
    very_short: {
      return_rate: 0.12,
      primary_reasons: [
        "sleeve_too_long",
        "jacket_too_long",
        "proportion_issues"
      ],
      solutions: [
        "Short size recommendations",
        "Length adjustments",
        "Professional alterations"
      ]
    },
    extreme_bmi: {
      return_rate: 0.18,
      primary_reasons: [
        "proportion_issues",
        "limited_size_availability",
        "fit_complexity"
      ],
      solutions: [
        "Professional fitting",
        "Custom sizing",
        "Specialty options"
      ]
    }
  },
  
  seasonal_patterns: {
    spring: { return_rate: 0.08, factors: ["New collections", "Better inventory", "Improved algorithms"] },
    summer: { return_rate: 0.07, factors: ["Reduced demand", "Seasonal styles", "Lower complexity"] },
    fall: { return_rate: 0.10, factors: ["Back to school", "Higher demand", "More complex fits"] },
    winter: { return_rate: 0.11, factors: ["Holiday rush", "Gift purchases", "Limited time for fitting"] }
  }
};

// Get return risk for a specific scenario
export function getReturnRisk(
  bodyType: string,
  confidence: number,
  isFirstTimeBuyer: boolean = false
): {
  riskLevel: 'low' | 'medium' | 'high';
  riskPercentage: number;
  recommendations: string[];
} {
  // Base risk from body type
  const bodyTypePattern = bodyType in RETURN_ANALYSIS.body_type_patterns
    ? RETURN_ANALYSIS.body_type_patterns[bodyType as keyof typeof RETURN_ANALYSIS.body_type_patterns]
    : null;
  let baseRisk = bodyTypePattern?.return_rate || 0.09;
  
  // Adjust for confidence
  if (confidence >= 0.90) {
    baseRisk *= 0.5; // High confidence reduces risk by 50%
  } else if (confidence >= 0.75) {
    baseRisk *= 0.8; // Medium-high confidence reduces risk by 20%
  } else if (confidence < 0.50) {
    baseRisk *= 2.0; // Low confidence doubles risk
  }
  
  // First-time buyer adjustment
  if (isFirstTimeBuyer) {
    baseRisk *= 1.5; // 50% higher risk for first-time buyers
  }
  
  // Determine risk level and recommendations
  let riskLevel: 'low' | 'medium' | 'high';
  let recommendations: string[] = [];
  
  if (baseRisk < 0.08) {
    riskLevel = 'low';
    recommendations = ["Standard sizing should work well"];
  } else if (baseRisk < 0.15) {
    riskLevel = 'medium';
    recommendations = [
      "Consider professional measurements",
      "Review our detailed size guide",
      "Chat with our sizing expert"
    ];
  } else {
    riskLevel = 'high';
    recommendations = [
      "Professional fitting strongly recommended",
      "Contact our size specialists before ordering",
      "Consider ordering multiple sizes",
      "Review our easy exchange policy"
    ];
  }
  
  // Add body type specific recommendations
  if (bodyType === 'athletic') {
    recommendations.push("Waist suppression likely needed");
  } else if (bodyType === 'slim') {
    recommendations.push("Consider sizing down for better fit");
  } else if (bodyType === 'broad') {
    recommendations.push("Size for shoulders and chest comfort");
  }
  
  return {
    riskLevel,
    riskPercentage: Math.round(baseRisk * 100),
    recommendations
  };
}

// Get common alterations needed for a body type
export function getCommonAlterations(bodyType: string): Array<{
  alteration: string;
  likelihood: number;
  cost_estimate: string;
}> {
  const pattern = RETURN_ANALYSIS.body_type_patterns[bodyType];
  if (!pattern) return [];
  
  return pattern.primary_reasons.map(reason => {
    let alteration = '';
    let cost_estimate = '';
    
    switch (reason.reason) {
      case 'waist_too_loose':
        alteration = 'Waist suppression';
        cost_estimate = '$30-50';
        break;
      case 'sleeve_too_narrow':
      case 'sleeve_too_wide':
        alteration = 'Sleeve width adjustment';
        cost_estimate = '$25-40';
        break;
      case 'jacket_too_short':
      case 'jacket_too_wide':
        alteration = 'Jacket length/width adjustment';
        cost_estimate = '$40-60';
        break;
      case 'sleeve_length':
        alteration = 'Sleeve length adjustment';
        cost_estimate = '$20-30';
        break;
      default:
        alteration = reason.solution;
        cost_estimate = '$30-50';
    }
    
    return {
      alteration,
      likelihood: reason.frequency,
      cost_estimate
    };
  });
}