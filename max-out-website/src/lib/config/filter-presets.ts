import { FilterPreset } from '@/types/unified-shop';

// Predefined filter collections for common shopping scenarios
export const filterPresets: Record<string, FilterPreset> = {
  // Occasion-based presets
  'black-tie': {
    id: 'black-tie',
    name: 'Black Tie Collection',
    description: 'Formal evening wear for galas and special events',
    icon: '🎩',
    filters: {
      occasions: ['Black Tie', 'Gala', 'Formal Evening'],
      category: ['tuxedos', 'suits'],
      color: ['black', 'midnight-blue', 'white'],
      includeBundles: true,
      includeIndividual: true,
      sortBy: 'price-desc'
    },
    displayOptions: {
      showBundlesFirst: true,
      emphasizeSavings: true,
      gridLayout: 'large'
    },
    seo: {
      title: 'Black Tie & Formal Evening Wear | KCT Menswear',
      description: 'Shop our premium collection of tuxedos and formal suits perfect for black tie events, galas, and formal evenings.',
      keywords: ['black tie', 'tuxedo', 'formal wear', 'gala attire']
    }
  },

  'wedding-guest': {
    id: 'wedding-guest',
    name: 'Wedding Guest Attire',
    description: 'Perfect looks for wedding celebrations',
    icon: '💒',
    filters: {
      occasions: ['Wedding', 'Wedding Guest'],
      category: ['suits', 'blazers'],
      color: ['navy', 'grey', 'blue', 'tan'],
      includeBundles: true,
      includeIndividual: true,
      priceRanges: [{ min: 199, max: 499 }]
    },
    displayOptions: {
      showBundlesFirst: true,
      gridLayout: 'standard'
    },
    seo: {
      title: 'Wedding Guest Suits & Attire | KCT Menswear',
      description: 'Find the perfect wedding guest outfit. Shop suits and complete looks for any wedding celebration.',
      keywords: ['wedding guest', 'wedding suit', 'wedding attire']
    }
  },

  'business-professional': {
    id: 'business-professional',
    name: 'Business Professional',
    description: 'Sharp, professional attire for the office',
    icon: '💼',
    filters: {
      occasions: ['Business', 'Interview', 'Conference'],
      category: ['suits'],
      color: ['navy', 'charcoal', 'grey', 'black'],
      fit: ['Classic', 'Slim'],
      includeBundles: true,
      sortBy: 'trending'
    },
    seo: {
      title: 'Business & Professional Suits | KCT Menswear',
      description: 'Professional business suits for the modern executive. Perfect for interviews, meetings, and daily office wear.',
      keywords: ['business suit', 'professional attire', 'office wear']
    }
  },

  'prom-special': {
    id: 'prom-special',
    name: 'Prom 2025 Collection',
    description: 'Stand out styles for your special night',
    icon: '🌟',
    filters: {
      occasions: ['Prom', 'Formal Dance'],
      trending: true,
      includeBundles: true,
      bundleTier: ['starter', 'professional'],
      sortBy: 'trending'
    },
    displayOptions: {
      showBundlesFirst: true,
      emphasizeSavings: true,
      gridLayout: 'large'
    },
    seo: {
      title: 'Prom Suits & Tuxedos 2025 | KCT Menswear',
      description: 'Make your prom unforgettable with our trending suits and tuxedos. Complete looks starting at $199.',
      keywords: ['prom suit', 'prom tuxedo', 'prom 2025']
    }
  },

  // Style-based presets
  'bold-statement': {
    id: 'bold-statement',
    name: 'Bold & Modern',
    description: 'Make a statement with contemporary styles',
    icon: '🔥',
    filters: {
      style: ['bold', 'contemporary', 'modern'],
      color: ['burgundy', 'emerald', 'royal-blue', 'purple'],
      includeBundles: true,
      trending: true
    },
    seo: {
      title: 'Bold & Modern Suits | Statement Pieces | KCT Menswear',
      description: 'Stand out with our bold and modern suit collection. Unique colors and contemporary styles.',
      keywords: ['bold suits', 'modern menswear', 'statement suits']
    }
  },

  'classic-elegance': {
    id: 'classic-elegance',
    name: 'Classic Elegance',
    description: 'Timeless styles that never go out of fashion',
    icon: '👔',
    filters: {
      style: ['classic', 'traditional'],
      color: ['navy', 'charcoal', 'black', 'grey'],
      fit: ['Classic'],
      includeBundles: true
    },
    seo: {
      title: 'Classic & Timeless Suits | KCT Menswear',
      description: 'Discover our collection of classic, timeless suits. Traditional elegance for every occasion.',
      keywords: ['classic suits', 'timeless menswear', 'traditional suits']
    }
  },

  // Bundle-specific presets
  'complete-looks-199': {
    id: 'complete-looks-199',
    name: 'Starter Bundles - $199',
    description: 'Complete styled looks at an incredible value',
    icon: '💰',
    filters: {
      type: ['bundle'],
      bundleTier: ['starter'],
      includeBundles: true,
      includeIndividual: false
    },
    displayOptions: {
      emphasizeSavings: true,
      gridLayout: 'large'
    },
    seo: {
      title: '$199 Complete Suit Bundles | KCT Menswear',
      description: 'Get a complete look for just $199. Suit, shirt, and tie professionally styled.',
      keywords: ['affordable suits', 'suit bundles', 'complete outfit']
    }
  },

  'premium-bundles': {
    id: 'premium-bundles',
    name: 'Premium Collections',
    description: 'Our finest curated looks',
    icon: '👑',
    filters: {
      type: ['bundle'],
      bundleTier: ['executive', 'premium'],
      includeBundles: true,
      includeIndividual: false,
      sortBy: 'price-desc'
    },
    displayOptions: {
      gridLayout: 'large'
    },
    seo: {
      title: 'Premium Suit Bundles | Executive Collection | KCT Menswear',
      description: 'Shop our premium bundles featuring the finest fabrics and expert styling.',
      keywords: ['premium suits', 'executive bundles', 'luxury menswear']
    }
  },

  // Color-based presets
  'all-black': {
    id: 'all-black',
    name: 'All Black Everything',
    description: 'Sophisticated black suits and accessories',
    icon: '⚫',
    filters: {
      color: ['black'],
      suitColor: ['black'],
      includeBundles: true,
      includeIndividual: true
    },
    seo: {
      title: 'Black Suits & Tuxedos | All Black Collection | KCT Menswear',
      description: 'Shop our complete collection of black suits, tuxedos, and complete black outfits.',
      keywords: ['black suit', 'black tuxedo', 'all black outfit']
    }
  },

  'navy-collection': {
    id: 'navy-collection',
    name: 'Navy Collection',
    description: 'The versatile choice for any occasion',
    icon: '🔷',
    filters: {
      color: ['navy', 'midnight-blue'],
      suitColor: ['navy'],
      includeBundles: true,
      includeIndividual: true
    },
    seo: {
      title: 'Navy Suits & Blazers | Navy Collection | KCT Menswear',
      description: 'Discover our versatile navy suit collection. Perfect for business, weddings, and formal events.',
      keywords: ['navy suit', 'blue suit', 'navy blazer']
    }
  },

  // Seasonal presets
  'summer-wedding': {
    id: 'summer-wedding',
    name: 'Summer Wedding Collection',
    description: 'Light and breathable for warm weather',
    icon: '☀️',
    filters: {
      occasions: ['Wedding', 'Summer Event'],
      color: ['tan', 'light-grey', 'blue', 'cream'],
      seasonal: ['summer'],
      material: ['linen', 'cotton', 'lightweight'],
      includeBundles: true
    },
    seo: {
      title: 'Summer Wedding Suits | Lightweight Collection | KCT Menswear',
      description: 'Stay cool and stylish with our summer wedding collection. Light colors and breathable fabrics.',
      keywords: ['summer suit', 'wedding suit', 'lightweight suit']
    }
  },

  'fall-formal': {
    id: 'fall-formal',
    name: 'Fall Formal Collection',
    description: 'Rich colors and textures for autumn',
    icon: '🍂',
    filters: {
      seasonal: ['fall'],
      color: ['burgundy', 'brown', 'rust', 'olive'],
      material: ['wool', 'tweed'],
      includeBundles: true
    },
    seo: {
      title: 'Fall Suits & Formal Wear | Autumn Collection | KCT Menswear',
      description: 'Embrace fall with rich colors and premium textures. Perfect for autumn weddings and events.',
      keywords: ['fall suits', 'autumn formal wear', 'seasonal suits']
    }
  },

  // Special collections
  'velvet-luxe': {
    id: 'velvet-luxe',
    name: 'Velvet Luxury Collection',
    description: 'Luxurious velvet blazers and suits',
    icon: '✨',
    filters: {
      material: ['velvet'],
      occasions: ['Cocktail', 'Holiday Party', 'Special Event'],
      includeBundles: true,
      includeIndividual: true
    },
    seo: {
      title: 'Velvet Blazers & Suits | Luxury Collection | KCT Menswear',
      description: 'Make a statement with our luxurious velvet collection. Perfect for special occasions.',
      keywords: ['velvet blazer', 'velvet suit', 'luxury menswear']
    }
  },

  'three-piece': {
    id: 'three-piece',
    name: 'Three-Piece Suits',
    description: 'Complete sophistication with vest included',
    icon: '🎭',
    filters: {
      suitType: ['3-piece'],
      includeBundles: true,
      includeIndividual: true
    },
    seo: {
      title: 'Three-Piece Suits with Vests | KCT Menswear',
      description: 'Elevate your style with our three-piece suit collection. Includes matching vest for complete sophistication.',
      keywords: ['three piece suit', 'suit with vest', 'formal suits']
    }
  }
};

// Helper function to get preset by ID
export function getFilterPreset(presetId: string): FilterPreset | undefined {
  return filterPresets[presetId];
}

// Helper function to get all preset IDs
export function getAllPresetIds(): string[] {
  return Object.keys(filterPresets);
}

// Helper function to get presets by category
export function getPresetsByCategory(category: 'occasion' | 'style' | 'bundle' | 'color' | 'seasonal'): FilterPreset[] {
  const categoryMap: Record<string, string[]> = {
    occasion: ['black-tie', 'wedding-guest', 'business-professional', 'prom-special'],
    style: ['bold-statement', 'classic-elegance'],
    bundle: ['complete-looks-199', 'premium-bundles'],
    color: ['all-black', 'navy-collection'],
    seasonal: ['summer-wedding', 'fall-formal']
  };
  
  return (categoryMap[category] || []).map(id => filterPresets[id]).filter(Boolean);
}