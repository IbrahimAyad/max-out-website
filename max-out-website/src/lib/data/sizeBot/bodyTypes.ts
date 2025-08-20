// Size Bot Body Type Classifications
// Based on enhanced-size-bot-integration data

export interface BodyTypeCharacteristics {
  primary_features: string[];
  measurement_patterns: {
    shoulder_width: string;
    chest_measurement: string;
    waist_measurement: string;
    arm_circumference: string;
    drop: string;
  };
  proportion_ratios: {
    shoulder_to_chest: string;
    chest_to_waist: string;
    arm_length_to_height: string;
    torso_length: string;
  };
  bmi_range: [number, number];
  typical_age_range: [number, number];
  activity_level: string;
  frequency_in_population: number;
}

export interface SizingChallenge {
  primary_issues: string[];
  common_problems: Record<string, string>;
}

export interface AlterationRecommendation {
  type: string;
  frequency: number;
  description: string;
  typical_adjustment: string;
}

export interface BodyTypeData {
  body_type: string;
  description: string;
  characteristics: BodyTypeCharacteristics;
  sizing_challenges: SizingChallenge;
  sizing_strategy: {
    primary_approach: string;
    size_selection: {
      method: string;
      priority_order: string[];
    };
    fit_preferences: {
      jacket_fit: string;
      sleeve_fit: string;
      waist_fit: string;
      length_preference: string;
    };
  };
  alteration_recommendations: {
    common_alterations: AlterationRecommendation[];
    alteration_priorities: string[];
  };
  style_recommendations: {
    jacket_styles: string[];
    avoid_styles: string[];
    fabric_recommendations: string[];
  };
  success_metrics: {
    customer_satisfaction: number;
    return_rate: number;
    alteration_rate: number;
    repeat_purchase_rate: number;
  };
}

export const BODY_TYPES: Record<string, BodyTypeData> = {
  athletic: {
    body_type: "athletic",
    description: "Athletic build with developed shoulders, chest, and arms, typically with a V-shaped torso",
    characteristics: {
      primary_features: [
        "Developed shoulders",
        "Broad chest",
        "Defined arms",
        "V-shaped torso",
        "Narrow waist relative to chest"
      ],
      measurement_patterns: {
        shoulder_width: "Wider than chest",
        chest_measurement: "Well-developed",
        waist_measurement: "Narrow relative to chest",
        arm_circumference: "Larger than average",
        drop: "6-10 inches (chest to waist)"
      },
      proportion_ratios: {
        shoulder_to_chest: "1.02-1.08",
        chest_to_waist: "1.10-1.20",
        arm_length_to_height: "0.44-0.48",
        torso_length: "Proportional to height"
      },
      bmi_range: [20.0, 28.0],
      typical_age_range: [18, 45],
      activity_level: "High",
      frequency_in_population: 0.25
    },
    sizing_challenges: {
      primary_issues: [
        "Shoulder width vs chest fit",
        "Sleeve width vs arm size",
        "Jacket length vs torso",
        "Waist suppression needed"
      ],
      common_problems: {
        jacket_too_tight_shoulders: "Sizing down for waist makes shoulders tight",
        sleeve_too_narrow: "Standard sleeves too tight on arms",
        jacket_too_short: "Standard length may be too short",
        waist_too_loose: "Standard fit too loose at waist"
      }
    },
    sizing_strategy: {
      primary_approach: "Size for shoulders, tailor waist and sleeves",
      size_selection: {
        method: "shoulder_based_sizing",
        priority_order: [
          "Shoulder width",
          "Chest circumference",
          "Arm length",
          "Jacket length",
          "Waist circumference"
        ]
      },
      fit_preferences: {
        jacket_fit: "Slim to regular",
        sleeve_fit: "Comfortable around biceps",
        waist_fit: "Slightly suppressed",
        length_preference: "Standard to slightly longer"
      }
    },
    alteration_recommendations: {
      common_alterations: [
        {
          type: "waist_suppression",
          frequency: 0.85,
          description: "Take in waist for better fit",
          typical_adjustment: "1-2 inches"
        },
        {
          type: "sleeve_width",
          frequency: 0.70,
          description: "Let out sleeve width for arm comfort",
          typical_adjustment: "0.5-1 inch"
        },
        {
          type: "sleeve_length",
          frequency: 0.60,
          description: "Adjust sleeve length",
          typical_adjustment: "±0.5 inches"
        },
        {
          type: "jacket_length",
          frequency: 0.40,
          description: "Adjust jacket length",
          typical_adjustment: "±1 inch"
        }
      ],
      alteration_priorities: [
        "Waist suppression (most common)",
        "Sleeve width adjustment",
        "Sleeve length adjustment",
        "Jacket length adjustment"
      ]
    },
    style_recommendations: {
      jacket_styles: [
        "Slim fit suits",
        "Athletic fit options",
        "Single-breasted jackets",
        "Notch lapels",
        "Side vents"
      ],
      avoid_styles: [
        "Boxy cuts",
        "Double-breasted (unless very slim)",
        "Wide lapels",
        "Center vents (may emphasize waist)"
      ],
      fabric_recommendations: [
        "Wool with stretch",
        "Lightweight wool",
        "Cotton blends",
        "Performance fabrics"
      ]
    },
    success_metrics: {
      customer_satisfaction: 0.88,
      return_rate: 0.08,
      alteration_rate: 0.85,
      repeat_purchase_rate: 0.75
    }
  },
  
  slim: {
    body_type: "slim",
    description: "Slim build with narrow shoulders, chest, and waist, typically with a straight or slightly tapered torso",
    characteristics: {
      primary_features: [
        "Narrow shoulders",
        "Slim chest",
        "Narrow waist",
        "Straight or slightly tapered torso",
        "Slender arms"
      ],
      measurement_patterns: {
        shoulder_width: "Narrow relative to height",
        chest_measurement: "Slim",
        waist_measurement: "Narrow",
        arm_circumference: "Slender",
        drop: "2-6 inches (chest to waist)"
      },
      proportion_ratios: {
        shoulder_to_chest: "0.95-1.02",
        chest_to_waist: "1.05-1.12",
        arm_length_to_height: "0.44-0.48",
        torso_length: "Proportional to height"
      },
      bmi_range: [16.0, 22.0],
      typical_age_range: [16, 35],
      activity_level: "Low to moderate",
      frequency_in_population: 0.20
    },
    sizing_challenges: {
      primary_issues: [
        "Finding small enough sizes",
        "Jacket length vs torso",
        "Sleeve width vs arm size",
        "Overall proportion balance"
      ],
      common_problems: {
        jacket_too_wide: "Standard sizes too wide in shoulders and chest",
        sleeve_too_wide: "Standard sleeves too wide for slender arms",
        jacket_too_long: "Standard length may be too long",
        waist_too_loose: "Standard fit too loose at waist"
      }
    },
    sizing_strategy: {
      primary_approach: "Size down and focus on length adjustments",
      size_selection: {
        method: "chest_based_sizing_minus_one",
        priority_order: [
          "Chest circumference",
          "Shoulder width",
          "Arm length",
          "Jacket length",
          "Waist circumference"
        ]
      },
      fit_preferences: {
        jacket_fit: "Slim to very slim",
        sleeve_fit: "Close to arm",
        waist_fit: "Slightly fitted",
        length_preference: "Standard to slightly shorter"
      }
    },
    alteration_recommendations: {
      common_alterations: [
        {
          type: "sleeve_width",
          frequency: 0.80,
          description: "Take in sleeve width for better arm fit",
          typical_adjustment: "0.5-1 inch"
        },
        {
          type: "waist_suppression",
          frequency: 0.75,
          description: "Take in waist for better fit",
          typical_adjustment: "1-2 inches"
        },
        {
          type: "shoulder_width",
          frequency: 0.60,
          description: "Reduce shoulder width",
          typical_adjustment: "0.5-1 inch"
        },
        {
          type: "jacket_length",
          frequency: 0.50,
          description: "Shorten jacket length",
          typical_adjustment: "1-2 inches"
        }
      ],
      alteration_priorities: [
        "Sleeve width adjustment (most common)",
        "Waist suppression",
        "Shoulder width reduction",
        "Jacket length adjustment"
      ]
    },
    style_recommendations: {
      jacket_styles: [
        "Slim fit suits",
        "Italian cut jackets",
        "Single-breasted jackets",
        "Narrow lapels",
        "Side vents"
      ],
      avoid_styles: [
        "Boxy cuts",
        "Double-breasted (unless very tall)",
        "Wide lapels",
        "Heavy fabrics"
      ],
      fabric_recommendations: [
        "Lightweight wool",
        "Cotton blends",
        "Linen blends",
        "Stretch fabrics"
      ]
    },
    success_metrics: {
      customer_satisfaction: 0.85,
      return_rate: 0.12,
      alteration_rate: 0.80,
      repeat_purchase_rate: 0.70
    }
  },
  
  regular: {
    body_type: "regular",
    description: "Balanced proportions with standard chest-to-waist drop and average build",
    characteristics: {
      primary_features: [
        "Balanced shoulders",
        "Proportional chest",
        "Average waist",
        "Standard proportions",
        "Average arm size"
      ],
      measurement_patterns: {
        shoulder_width: "Proportional to chest",
        chest_measurement: "Average",
        waist_measurement: "Standard drop from chest",
        arm_circumference: "Average",
        drop: "6 inches (chest to waist)"
      },
      proportion_ratios: {
        shoulder_to_chest: "0.98-1.02",
        chest_to_waist: "1.08-1.15",
        arm_length_to_height: "0.44-0.48",
        torso_length: "Proportional to height"
      },
      bmi_range: [20.0, 26.0],
      typical_age_range: [25, 55],
      activity_level: "Moderate",
      frequency_in_population: 0.40
    },
    sizing_challenges: {
      primary_issues: [
        "Minor length adjustments",
        "Slight fit preferences",
        "Personal comfort variations",
        "Style preferences"
      ],
      common_problems: {
        minor_adjustments: "Small tweaks for perfect fit",
        sleeve_length: "May need slight length adjustment",
        jacket_length: "Personal preference variations",
        waist_comfort: "Minor suppression for style"
      }
    },
    sizing_strategy: {
      primary_approach: "Standard sizing with minor alterations",
      size_selection: {
        method: "standard_height_weight_matrix",
        priority_order: [
          "Chest circumference",
          "Height",
          "Weight",
          "Jacket length",
          "Personal preference"
        ]
      },
      fit_preferences: {
        jacket_fit: "Regular to slim",
        sleeve_fit: "Standard",
        waist_fit: "Comfortable",
        length_preference: "Standard"
      }
    },
    alteration_recommendations: {
      common_alterations: [
        {
          type: "sleeve_length",
          frequency: 0.50,
          description: "Adjust sleeve length",
          typical_adjustment: "±0.5-1 inch"
        },
        {
          type: "minor_waist_adjustment",
          frequency: 0.30,
          description: "Minor waist adjustment",
          typical_adjustment: "0.5-1 inch"
        },
        {
          type: "jacket_length",
          frequency: 0.20,
          description: "Adjust jacket length",
          typical_adjustment: "±0.5-1 inch"
        }
      ],
      alteration_priorities: [
        "Sleeve length (most common)",
        "Minor waist adjustment",
        "Jacket length preference"
      ]
    },
    style_recommendations: {
      jacket_styles: [
        "Regular fit suits",
        "Classic cuts",
        "Single or double-breasted",
        "Standard lapels",
        "Side or center vents"
      ],
      avoid_styles: [
        "Extreme slim fits",
        "Overly loose cuts"
      ],
      fabric_recommendations: [
        "All-season wool",
        "Wool blends",
        "Cotton suits",
        "Traditional fabrics"
      ]
    },
    success_metrics: {
      customer_satisfaction: 0.90,
      return_rate: 0.06,
      alteration_rate: 0.50,
      repeat_purchase_rate: 0.80
    }
  },
  
  broad: {
    body_type: "broad",
    description: "Broad build with wide shoulders and chest, larger frame overall",
    characteristics: {
      primary_features: [
        "Wide shoulders",
        "Broad chest",
        "Larger frame",
        "Strong build",
        "Substantial arms"
      ],
      measurement_patterns: {
        shoulder_width: "Significantly wider than average",
        chest_measurement: "Broad",
        waist_measurement: "Proportionally larger",
        arm_circumference: "Above average",
        drop: "4-8 inches (chest to waist)"
      },
      proportion_ratios: {
        shoulder_to_chest: "1.00-1.05",
        chest_to_waist: "1.05-1.15",
        arm_length_to_height: "0.44-0.48",
        torso_length: "Proportional to height"
      },
      bmi_range: [24.0, 32.0],
      typical_age_range: [30, 60],
      activity_level: "Variable",
      frequency_in_population: 0.15
    },
    sizing_challenges: {
      primary_issues: [
        "Finding wide enough shoulders",
        "Sleeve width constraints",
        "Chest room requirements",
        "Overall comfort"
      ],
      common_problems: {
        shoulders_too_narrow: "Standard sizes constrain shoulders",
        sleeves_too_narrow: "Arms feel restricted",
        chest_too_tight: "Limited movement in chest",
        waist_proportions: "May be too tight or too loose"
      }
    },
    sizing_strategy: {
      primary_approach: "Size up for comfort, tailor for fit",
      size_selection: {
        method: "shoulder_and_chest_priority",
        priority_order: [
          "Shoulder width",
          "Chest circumference",
          "Comfort",
          "Arm room",
          "Overall fit"
        ]
      },
      fit_preferences: {
        jacket_fit: "Regular to relaxed",
        sleeve_fit: "Comfortable room",
        waist_fit: "Comfortable",
        length_preference: "Standard to longer"
      }
    },
    alteration_recommendations: {
      common_alterations: [
        {
          type: "sleeve_width",
          frequency: 0.40,
          description: "Let out sleeve width if possible",
          typical_adjustment: "0.5-1 inch"
        },
        {
          type: "waist_adjustment",
          frequency: 0.35,
          description: "Adjust waist for comfort",
          typical_adjustment: "Let out 0.5-1 inch"
        },
        {
          type: "shoulder_adjustment",
          frequency: 0.25,
          description: "Ensure shoulder comfort",
          typical_adjustment: "Size up recommendation"
        }
      ],
      alteration_priorities: [
        "Ensure comfort first",
        "Sleeve width if needed",
        "Waist comfort",
        "Overall proportion"
      ]
    },
    style_recommendations: {
      jacket_styles: [
        "Regular fit suits",
        "Classic American cuts",
        "Single-breasted preferred",
        "Standard to wide lapels",
        "Side vents for movement"
      ],
      avoid_styles: [
        "Slim fits",
        "Narrow shoulders",
        "Tight sleeves",
        "Restrictive cuts"
      ],
      fabric_recommendations: [
        "Durable wool",
        "Wool with stretch",
        "Breathable fabrics",
        "Quality construction"
      ]
    },
    success_metrics: {
      customer_satisfaction: 0.86,
      return_rate: 0.10,
      alteration_rate: 0.40,
      repeat_purchase_rate: 0.75
    }
  }
};

// Helper function to determine body type from measurements
export function determineBodyType(
  height: number, // in inches
  weight: number, // in pounds
  chestMeasurement?: number,
  waistMeasurement?: number
): string {
  const bmi = (weight / (height * height)) * 703;
  const drop = chestMeasurement && waistMeasurement 
    ? chestMeasurement - waistMeasurement 
    : 6; // default drop
  
  // Athletic: High drop (8+) and moderate to high BMI
  if (drop >= 8 && bmi >= 20 && bmi <= 28) {
    return 'athletic';
  }
  
  // Slim: Low BMI and smaller drop
  if (bmi < 22 && drop <= 6) {
    return 'slim';
  }
  
  // Broad: Higher BMI and lower drop
  if (bmi >= 26 && drop <= 6) {
    return 'broad';
  }
  
  // Default to regular
  return 'regular';
}

// Get alteration recommendations for a body type
export function getAlterationRecommendations(bodyType: string): AlterationRecommendation[] {
  const bodyTypeData = BODY_TYPES[bodyType];
  if (!bodyTypeData) return [];
  
  return bodyTypeData.alteration_recommendations.common_alterations;
}

// Get style recommendations for a body type
export function getStyleRecommendations(bodyType: string) {
  const bodyTypeData = BODY_TYPES[bodyType];
  if (!bodyTypeData) return null;
  
  return bodyTypeData.style_recommendations;
}