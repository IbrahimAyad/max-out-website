// Prom Knowledge Bank Data
// Based on trend analysis and age-appropriate formal wear research

export interface PromTrend {
  year: number;
  popularColors: string[];
  trendingStyles: string[];
  budgetRange: {
    min: number;
    max: number;
    average: number;
  };
  groupCoordination: {
    matchingElements: string[];
    popularThemes: string[];
  };
}

export interface PromBundle {
  name: string;
  items: string[];
  price: number;
  savings: number;
  popularity: number;
  ageAppropriate: boolean;
}

export interface ColorCoordination {
  primaryColor: string;
  complementaryColors: string[];
  avoidWith: string[];
  groupAppeal: number;
  photoFriendly: boolean;
  seasonalAppropriateness: string[];
}

// Prom Trends by Year
export const promTrends: Record<number, PromTrend> = {
  2023: {
    year: 2023,
    popularColors: ["Royal Blue", "Burgundy", "Black", "White", "Gold"],
    trendingStyles: ["Slim Fit Tuxedo", "Velvet Blazer", "Patterned Suits"],
    budgetRange: {
      min: 150,
      max: 500,
      average: 275
    },
    groupCoordination: {
      matchingElements: ["Bow Ties", "Pocket Squares", "Boutonnieres"],
      popularThemes: ["Hollywood Glamour", "Great Gatsby", "James Bond"]
    }
  },
  2024: {
    year: 2024,
    popularColors: ["Emerald Green", "Navy", "Blush Pink", "Silver", "Champagne"],
    trendingStyles: ["Colored Tuxedos", "Floral Patterns", "Metallic Accents"],
    budgetRange: {
      min: 175,
      max: 550,
      average: 300
    },
    groupCoordination: {
      matchingElements: ["Suspenders", "Tie Colors", "Shoe Styles"],
      popularThemes: ["Enchanted Garden", "Midnight in Paris", "Casino Royale"]
    }
  },
  2025: {
    year: 2025,
    popularColors: ["Sage Green", "Dusty Blue", "Mauve", "Copper", "Ivory"],
    trendingStyles: ["Sustainable Fabrics", "Mix-and-Match", "Bold Patterns"],
    budgetRange: {
      min: 200,
      max: 600,
      average: 325
    },
    groupCoordination: {
      matchingElements: ["Color Gradients", "Fabric Textures", "Accessory Themes"],
      popularThemes: ["Boho Chic", "Modern Romance", "Vintage Revival"]
    }
  }
};

// Budget-Friendly Prom Bundles
export const promBundles: PromBundle[] = [
  {
    name: "Classic Elegance",
    items: ["Black Tuxedo", "White Dress Shirt", "Black Bow Tie", "Cummerbund", "Pocket Square"],
    price: 199,
    savings: 50,
    popularity: 92,
    ageAppropriate: true
  },
  {
    name: "Modern Trendsetter",
    items: ["Navy Suit", "Light Blue Shirt", "Patterned Tie", "Suspenders", "Boutonniere"],
    price: 249,
    savings: 65,
    popularity: 88,
    ageAppropriate: true
  },
  {
    name: "Bold Statement",
    items: ["Burgundy Velvet Blazer", "Black Pants", "Black Shirt", "Bow Tie", "Lapel Pin"],
    price: 299,
    savings: 75,
    popularity: 85,
    ageAppropriate: true
  },
  {
    name: "Spring Formal",
    items: ["Light Grey Suit", "Pink Shirt", "Floral Tie", "Pocket Square", "Dress Shoes"],
    price: 279,
    savings: 60,
    popularity: 83,
    ageAppropriate: true
  },
  {
    name: "Group Coordinator",
    items: ["Customizable Suit", "White Shirt", "Matching Accessories Set", "Group Discount"],
    price: 225,
    savings: 100,
    popularity: 90,
    ageAppropriate: true
  }
];

// Color Coordination for Prom Groups
export const promColorCoordination: Record<string, ColorCoordination> = {
  royalBlue: {
    primaryColor: "Royal Blue",
    complementaryColors: ["Silver", "White", "Black", "Gold"],
    avoidWith: ["Orange", "Brown"],
    groupAppeal: 95,
    photoFriendly: true,
    seasonalAppropriateness: ["Spring", "Winter"]
  },
  burgundy: {
    primaryColor: "Burgundy",
    complementaryColors: ["Gold", "Ivory", "Navy", "Grey"],
    avoidWith: ["Purple", "Red"],
    groupAppeal: 92,
    photoFriendly: true,
    seasonalAppropriateness: ["Fall", "Winter"]
  },
  emeraldGreen: {
    primaryColor: "Emerald Green",
    complementaryColors: ["Gold", "Black", "Ivory", "Silver"],
    avoidWith: ["Red", "Orange"],
    groupAppeal: 88,
    photoFriendly: true,
    seasonalAppropriateness: ["Spring", "Winter"]
  },
  navy: {
    primaryColor: "Navy",
    complementaryColors: ["Blush", "Silver", "Gold", "Coral"],
    avoidWith: ["Black"],
    groupAppeal: 96,
    photoFriendly: true,
    seasonalAppropriateness: ["All Seasons"]
  },
  sageGreen: {
    primaryColor: "Sage Green",
    complementaryColors: ["Dusty Rose", "Cream", "Gold", "Terracotta"],
    avoidWith: ["Bright Green", "Neon Colors"],
    groupAppeal: 85,
    photoFriendly: true,
    seasonalAppropriateness: ["Spring", "Summer"]
  },
  dustyBlue: {
    primaryColor: "Dusty Blue",
    complementaryColors: ["Mauve", "Silver", "Ivory", "Rose Gold"],
    avoidWith: ["Bright Orange", "Yellow"],
    groupAppeal: 87,
    photoFriendly: true,
    seasonalAppropriateness: ["Spring", "Summer"]
  }
};

// Age-Appropriate Styling Guidelines
export const ageAppropriateGuidelines = {
  formalWearBasics: {
    acceptable: [
      "Classic Tuxedos",
      "Well-fitted Suits",
      "Appropriate Length Pants",
      "Dress Shoes",
      "Conservative Patterns"
    ],
    avoid: [
      "Overly Casual Styles",
      "Inappropriate Graphics",
      "Extremely Tight Fits",
      "Sneakers with Formal Wear",
      "Offensive Patterns"
    ]
  },
  colorGuidelines: {
    classic: ["Black", "Navy", "Grey", "White"],
    trendy: ["Burgundy", "Emerald", "Royal Blue", "Blush"],
    statement: ["Patterns", "Velvet Textures", "Metallic Accents"],
    considerations: "School dress code requirements"
  },
  accessoryRules: {
    recommended: [
      "Bow Ties or Neckties",
      "Pocket Squares",
      "Cufflinks",
      "Dress Watches",
      "Boutonnieres"
    ],
    optional: [
      "Suspenders",
      "Vests",
      "Cummerbunds",
      "Lapel Pins"
    ]
  }
};

// Group Coordination Tools
export const groupCoordinationOptions = {
  matchingStrategies: [
    {
      strategy: "Identical Suits",
      description: "Everyone wears the same color suit",
      coordination: 100,
      flexibility: 20,
      cost: "High"
    },
    {
      strategy: "Same Color Family",
      description: "Different shades of the same color",
      coordination: 85,
      flexibility: 60,
      cost: "Medium"
    },
    {
      strategy: "Matching Accessories",
      description: "Different suits, same tie/bow tie color",
      coordination: 70,
      flexibility: 90,
      cost: "Low"
    },
    {
      strategy: "Complementary Colors",
      description: "Colors that work well together",
      coordination: 75,
      flexibility: 85,
      cost: "Medium"
    }
  ],
  popularThemes: {
    classic: {
      name: "Black Tie Affair",
      colors: ["Black", "White", "Silver"],
      formality: "Very High",
      budget: "$$$$"
    },
    modern: {
      name: "Ocean Blues",
      colors: ["Navy", "Light Blue", "Teal", "White"],
      formality: "High",
      budget: "$$$"
    },
    trendy: {
      name: "Garden Party",
      colors: ["Sage", "Blush", "Ivory", "Tan"],
      formality: "Medium-High",
      budget: "$$$"
    },
    bold: {
      name: "Jewel Tones",
      colors: ["Emerald", "Burgundy", "Gold", "Navy"],
      formality: "High",
      budget: "$$$$"
    }
  }
};

// Prom Timeline Recommendations
export const promTimeline = {
  threeMonthsBefore: [
    "Browse styles and colors",
    "Set budget",
    "Coordinate with date/group"
  ],
  twoMonthsBefore: [
    "Take measurements",
    "Order or rent formal wear",
    "Select accessories"
  ],
  oneMonthBefore: [
    "Schedule fittings",
    "Finalize group coordination",
    "Confirm all details"
  ],
  oneWeekBefore: [
    "Final fitting",
    "Pick up formal wear",
    "Try on complete outfit"
  ],
  promDay: [
    "Allow extra time for photos",
    "Bring emergency kit",
    "Have backup accessories"
  ]
};

// Budget Breakdown Guide
export const promBudgetGuide = {
  economical: {
    range: "$150-250",
    recommendations: [
      "Rental options",
      "Bundle deals",
      "Group discounts",
      "Off-season shopping"
    ],
    includesOptions: [
      "Basic tuxedo rental",
      "Shoes rental",
      "Basic accessories"
    ]
  },
  moderate: {
    range: "$250-400",
    recommendations: [
      "Purchase suit for future use",
      "Mix rental and purchase",
      "Quality accessories",
      "Professional fitting"
    ],
    includesOptions: [
      "Suit purchase",
      "Dress shoes",
      "Multiple accessories",
      "Alterations"
    ]
  },
  premium: {
    range: "$400+",
    recommendations: [
      "Designer options",
      "Custom tailoring",
      "Complete wardrobe",
      "Luxury accessories"
    ],
    includesOptions: [
      "Designer suit/tuxedo",
      "Premium shoes",
      "Full accessory set",
      "Custom fitting"
    ]
  }
};