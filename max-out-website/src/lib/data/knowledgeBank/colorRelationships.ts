/**
 * Color Relationships from Knowledge Bank
 * This is static data that serves as fallback when API is unavailable
 */

export const COLOR_RELATIONSHIPS = {
  navy: {
    perfect_matches: {
      shirts: ["white", "light_blue", "pink", "lavender"],
      ties: ["burgundy", "silver", "gold", "coral", "forest_green"],
      confidence: 98
    },
    good_matches: {
      shirts: ["cream", "light_grey"],
      ties: ["navy_pattern", "rust", "mustard"],
      confidence: 85
    },
    seasonal_boosts: {
      spring: ["coral", "lavender"],
      summer: ["light_blue", "pink"],
      fall: ["burgundy", "mustard"],
      winter: ["silver", "forest_green"]
    }
  },
  charcoal: {
    perfect_matches: {
      shirts: ["white", "light_blue", "light_grey"],
      ties: ["burgundy", "silver", "navy", "purple"],
      confidence: 96
    },
    good_matches: {
      shirts: ["pink", "lavender"],
      ties: ["emerald", "gold"],
      confidence: 82
    }
  },
  light_grey: {
    perfect_matches: {
      shirts: ["white", "light_blue", "pink", "lavender"],
      ties: ["navy", "burgundy", "purple", "silver"],
      confidence: 94
    },
    good_matches: {
      shirts: ["light_grey", "cream"],
      ties: ["coral", "sage_green", "dusty_rose"],
      confidence: 88
    }
  },
  burgundy: {
    perfect_matches: {
      shirts: ["white", "light_blue", "cream"],
      ties: ["navy", "gold", "burgundy_pattern", "grey"],
      confidence: 95
    },
    good_matches: {
      shirts: ["light_pink", "light_grey"],
      ties: ["mustard", "forest_green"],
      confidence: 83
    },
    popularity_score: 95,
    trending: "stable"
  },
  black: {
    perfect_matches: {
      shirts: ["white"],
      ties: ["black", "silver", "white"],
      confidence: 92
    },
    limited_use: "formal_only",
    avoid_casual: true
  },
  tan: {
    perfect_matches: {
      shirts: ["white", "light_blue", "cream"],
      ties: ["navy", "burgundy", "brown", "sage_green"],
      confidence: 90
    },
    good_matches: {
      shirts: ["pink", "lavender"],
      ties: ["coral", "rust", "olive"],
      confidence: 85
    }
  },
  light_blue: {
    perfect_matches: {
      shirts: ["white", "light_pink", "cream"],
      ties: ["navy", "coral", "burgundy", "brown"],
      confidence: 93
    },
    seasonal_favorite: "spring_summer"
  },
  sage_green: {
    perfect_matches: {
      shirts: ["white", "cream", "light_blue"],
      ties: ["blush_pink", "rust", "navy", "brown"],
      confidence: 92
    },
    trending: "up_30_percent",
    popularity_peak: "spring_2024"
  }
};

// Never combine rules
export const NEVER_COMBINE_RULES = [
  {
    suit: "black",
    shirt: "brown",
    tie: "*",
    reason: "Classic color clash - black and brown don't mix in formal wear"
  },
  {
    suit: "navy",
    shirt: "navy",
    tie: "navy",
    reason: "Monochrome overload - too much of the same color"
  },
  {
    suit: "brown",
    shirt: "black",
    tie: "*",
    reason: "Inverse color clash - brown suits don't pair with black shirts"
  },
  {
    suit: "*",
    shirt: "red",
    tie: "orange",
    reason: "Aggressive color combination - too bold for professional settings"
  },
  {
    suit: "grey",
    shirt: "grey",
    tie: "grey",
    reason: "Lacks visual interest - needs color contrast"
  }
];

// Helper function to check if a combination is forbidden
export function isForbiddenCombination(
  suit: string,
  shirt: string,
  tie: string
): { forbidden: boolean; reason?: string } {
  for (const rule of NEVER_COMBINE_RULES) {
    const suitMatch = rule.suit === "*" || rule.suit === suit;
    const shirtMatch = rule.shirt === "*" || rule.shirt === shirt;
    const tieMatch = rule.tie === "*" || rule.tie === tie;
    
    if (suitMatch && shirtMatch && tieMatch) {
      return { forbidden: true, reason: rule.reason };
    }
  }
  
  return { forbidden: false };
}

// Get color harmony score
export function getColorHarmonyScore(
  suitColor: string,
  shirtColor: string,
  tieColor: string
): number {
  // Type-safe access with proper checking
  const suitRelations = suitColor in COLOR_RELATIONSHIPS 
    ? COLOR_RELATIONSHIPS[suitColor as keyof typeof COLOR_RELATIONSHIPS]
    : null;
  if (!suitRelations) return 50; // Default middle score
  
  let score = 50; // Base score
  
  // Check shirt match
  if (suitRelations.perfect_matches.shirts.includes(shirtColor)) {
    score += 25;
  } else if ('good_matches' in suitRelations && suitRelations.good_matches.shirts.includes(shirtColor)) {
    score += 15;
  }
  
  // Check tie match
  if (suitRelations.perfect_matches.ties.includes(tieColor)) {
    score += 25;
  } else if ('good_matches' in suitRelations && suitRelations.good_matches.ties.includes(tieColor)) {
    score += 15;
  }
  
  return Math.min(score, 100);
}