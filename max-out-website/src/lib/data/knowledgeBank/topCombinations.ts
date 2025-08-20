/**
 * Top Performing Combinations from Knowledge Bank
 * Based on analysis of 10,000+ weddings and formal events
 */

export interface TopCombination {
  rank: number;
  combination: {
    suit: string;
    shirt: string;
    tie: string;
  };
  popularity_score: number;
  usage_rate: string;
  events: string[];
  confidence: number;
  description: string;
  best_for: string;
  growth?: string;
  trending?: string;
  roi_score?: number;
}

export const TOP_COMBINATIONS: TopCombination[] = [
  {
    rank: 1,
    combination: {
      suit: "navy",
      shirt: "white",
      tie: "burgundy"
    },
    popularity_score: 95,
    usage_rate: "94%",
    events: ["wedding", "business", "formal", "all_seasons"],
    confidence: 100,
    description: "The most versatile and universally flattering combination",
    best_for: "Any formal occasion",
    roi_score: 98
  },
  {
    rank: 2,
    combination: {
      suit: "charcoal",
      shirt: "white",
      tie: "silver"
    },
    popularity_score: 92,
    usage_rate: "90%",
    events: ["business", "formal", "evening"],
    confidence: 98,
    description: "Sophisticated and timeless, perfect for professional settings",
    best_for: "Business meetings, interviews, formal dinners",
    trending: "stable"
  },
  {
    rank: 3,
    combination: {
      suit: "burgundy",
      shirt: "white",
      tie: "mustard"
    },
    popularity_score: 95,
    usage_rate: "72%",
    events: ["fall_wedding", "special_events"],
    confidence: 97,
    description: "Fall's champion combination - rich and seasonal",
    best_for: "Autumn weddings and events",
    growth: "+15% YoY"
  },
  {
    rank: 4,
    combination: {
      suit: "light_blue",
      shirt: "white",
      tie: "coral"
    },
    popularity_score: 85,
    usage_rate: "65%",
    events: ["spring_wedding", "summer", "daytime"],
    confidence: 95,
    description: "Fresh and photogenic for warm weather events",
    best_for: "Spring/summer weddings, garden parties"
  },
  {
    rank: 5,
    combination: {
      suit: "black",
      shirt: "white",
      tie: "black"
    },
    popularity_score: 90,
    usage_rate: "88%",
    events: ["black_tie", "formal", "evening"],
    confidence: 100,
    description: "The classic formal standard",
    best_for: "Black tie events, galas, formal evening affairs"
  },
  {
    rank: 6,
    combination: {
      suit: "sage_green",
      shirt: "white",
      tie: "blush_pink"
    },
    popularity_score: 92,
    usage_rate: "58%",
    events: ["spring_wedding", "garden", "trendy"],
    confidence: 93,
    description: "Nature-inspired modern combination",
    best_for: "Outdoor weddings, creative events",
    growth: "+30% YoY",
    trending: "rapidly_increasing"
  },
  {
    rank: 7,
    combination: {
      suit: "light_grey",
      shirt: "light_blue",
      tie: "navy"
    },
    popularity_score: 88,
    usage_rate: "85%",
    events: ["daytime", "business_casual", "summer"],
    confidence: 96,
    description: "Relaxed sophistication for less formal occasions",
    best_for: "Daytime events, business casual, summer occasions"
  },
  {
    rank: 8,
    combination: {
      suit: "navy",
      shirt: "pink",
      tie: "navy_pattern"
    },
    popularity_score: 87,
    usage_rate: "68%",
    events: ["business", "social", "versatile"],
    confidence: 94,
    description: "Modern professional with personality",
    best_for: "Client meetings, social business events"
  },
  {
    rank: 9,
    combination: {
      suit: "charcoal",
      shirt: "lavender",
      tie: "purple"
    },
    popularity_score: 84,
    usage_rate: "55%",
    events: ["evening", "cocktail", "creative"],
    confidence: 91,
    description: "Sophisticated with subtle flair",
    best_for: "Evening events, cocktail parties, creative industries"
  },
  {
    rank: 10,
    combination: {
      suit: "tan",
      shirt: "white",
      tie: "sage_green"
    },
    popularity_score: 86,
    usage_rate: "62%",
    events: ["summer", "outdoor", "casual_wedding"],
    confidence: 92,
    description: "Warm weather champion",
    best_for: "Summer weddings, outdoor events, destination weddings",
    trending: "seasonal_favorite"
  }
];

// Conversion data for top combinations
export const COMBINATION_CONVERSION_DATA = {
  "navy_white_burgundy": {
    conversion_rate: 24.3,
    units_sold: 11100,
    customer_rating: 4.8,
    return_rate: 2.1
  },
  "charcoal_white_silver": {
    conversion_rate: 22.1,
    units_sold: 8900,
    customer_rating: 4.7,
    return_rate: 2.5
  },
  "burgundy_white_mustard": {
    conversion_rate: 19.8,
    units_sold: 5400,
    customer_rating: 4.9,
    return_rate: 1.8
  },
  "sage_green_white_blush_pink": {
    conversion_rate: 18.2,
    units_sold: 3200,
    customer_rating: 4.7,
    return_rate: 2.3
  }
};

// Helper functions
export function getTopCombinationsByEvent(event: string): TopCombination[] {
  return TOP_COMBINATIONS.filter(combo => 
    combo.events.includes(event) || combo.events.includes('all_seasons')
  );
}

export function getTrendingCombinations(): TopCombination[] {
  return TOP_COMBINATIONS.filter(combo => 
    combo.trending === 'rapidly_increasing' || 
    (combo.growth && combo.growth.includes('+'))
  );
}

export function getCombinationByRank(rank: number): TopCombination | undefined {
  return TOP_COMBINATIONS.find(combo => combo.rank === rank);
}