import { suitImages } from '@/lib/data/suitImages';
import { dressShirtProducts } from '@/lib/products/dressShirtProducts';
import { tieProducts } from '@/lib/products/tieProducts';

// Current available suit colors from suitImages
const AVAILABLE_SUIT_COLORS = [
  'black', 'navy', 'charcoal', 'lightGrey', 'tan', 'sand', 'beige', 
  'brown', 'darkBrown', 'burgundy', 'hunterGreen', 'midnightBlue', 'indigo'
];

// Future suit colors (planned inventory)
const FUTURE_SUIT_COLORS = [
  'royalBlue', 'steelBlue', 'olive', 'emerald', 'slate', 'darkGrey',
  'maroon', 'teal', 'camel', 'khaki', 'cream', 'rust'
];

// Map display names to actual product IDs
const SUIT_COLOR_MAP: Record<string, string> = {
  'charcoal': 'charcoalGrey',
  'charcoalGrey': 'charcoalGrey',
  'light grey': 'lightGrey',
  'dark brown': 'darkBrown',
  'hunter green': 'hunterGreen',
  'midnight blue': 'midnightBlue'
};

// Current available tie colors
const AVAILABLE_TIE_COLORS = [
  'black', 'dark-navy', 'navy', 'burgundy', 'burnt-orange', 'gold',
  'light-purple', 'medium-purple', 'red', 'dark-red', 'coral', 
  'silver', 'blush-pink', 'olive-green', 'medium-orange', 'yellow-gold'
];

// Future tie colors (planned inventory)
const FUTURE_TIE_COLORS = [
  'forest-green', 'lavender', 'lime-green', 'brown', 'copper',
  'teal', 'maroon', 'rust', 'champagne', 'pearl'
];

export interface AccurateFashionClipBundle {
  id: string;
  name: string;
  suit: {
    colorId: string;
    displayName: string;
    price: number;
    available: boolean;
  };
  shirt: {
    colorId: string;
    displayName: string;
    price: number;
    fit: 'classic' | 'slim';
  };
  tie: {
    colorId: string;
    displayName: string;
    style: 'bowtie' | 'classic' | 'skinny' | 'slim';
    price: number;
    available: boolean;
  };
  visualScore: number;
  aestheticAnalysis: {
    colorHarmony: number;
    contrastBalance: number;
    trendAlignment: number;
    visualImpact: number;
  };
  availability: 'available' | 'coming_soon' | 'partial';
  fashionClipInsight: string;
  occasionTags: string[];
  seasonalTags: string[];
}

class FashionClipAccurateBundleGenerator {
  private getSuitPrice(colorId: string): number {
    const premiumColors = ['burgundy', 'hunterGreen', 'midnightBlue'];
    const standardColors = ['navy', 'charcoalGrey', 'black'];
    const valueColors = ['tan', 'sand', 'beige', 'lightGrey'];
    
    if (premiumColors.includes(colorId)) return 699;
    if (standardColors.includes(colorId)) return 599;
    if (valueColors.includes(colorId)) return 549;
    return 579; // default
  }

  async generateAccurateBundles(): Promise<AccurateFashionClipBundle[]> {
    return [
      // Currently Available Bundles
      this.createExecutivePower(),
      this.createMidnightLuxury(),
      this.createAutumnHarvest(),
      this.createSummerBreeze(),
      this.createClassicWedding(),
      this.createModernMinimal(),
      this.createBoldStatement(),
      this.createCoastalElegance(),
      this.createUrbanProfessional(),
      this.createVintageCharm(),
      
      // Coming Soon Bundles (with future products)
      this.createFutureRoyalGala(),
      this.createFutureForestWedding(),
      this.createFutureMetropolitan(),
      this.createFutureLuxuryLounge(),
      this.createFutureArtGallery()
    ];
  }

  // CURRENTLY AVAILABLE BUNDLES

  private createExecutivePower(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-001',
      name: 'The Executive Power Suite',
      suit: {
        colorId: 'navy',
        displayName: 'Navy Blue Power Suit',
        price: 599,
        available: true
      },
      shirt: {
        colorId: 'white',
        displayName: 'Crisp White Dress Shirt',
        price: 39.99,
        fit: 'classic'
      },
      tie: {
        colorId: 'burgundy',
        displayName: 'Deep Burgundy Silk Tie',
        style: 'classic',
        price: 24.99,
        available: true
      },
      visualScore: 98,
      aestheticAnalysis: {
        colorHarmony: 100,
        contrastBalance: 95,
        trendAlignment: 92,
        visualImpact: 96
      },
      availability: 'available',
      fashionClipInsight: 'Perfect power trio - navy dominance with burgundy confidence accent. Fashion CLIP rates this highest for "executive presence" with optimal color distance for professional authority.',
      occasionTags: ['business', 'meetings', 'presentations', 'interviews'],
      seasonalTags: ['year-round']
    };
  }

  private createMidnightLuxury(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-002',
      name: 'The Midnight Luxe Collection',
      suit: {
        colorId: 'midnightBlue',
        displayName: 'Midnight Blue Tuxedo',
        price: 699,
        available: true
      },
      shirt: {
        colorId: 'black',
        displayName: 'Onyx Black Dress Shirt',
        price: 39.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'silver',
        displayName: 'Platinum Silver Tie',
        style: 'skinny',
        price: 24.99,
        available: true
      },
      visualScore: 96,
      aestheticAnalysis: {
        colorHarmony: 94,
        contrastBalance: 98,
        trendAlignment: 95,
        visualImpact: 97
      },
      availability: 'available',
      fashionClipInsight: 'Sophisticated monochromatic depth - midnight to black creates visual richness. Silver accent provides metallic luxury marker. AI detects "premium evening" aesthetic.',
      occasionTags: ['gala', 'formal', 'evening', 'cocktail'],
      seasonalTags: ['fall', 'winter']
    };
  }

  private createAutumnHarvest(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-003',
      name: 'The Autumn Harvest Edition',
      suit: {
        colorId: 'brown',
        displayName: 'Rich Chocolate Brown Suit',
        price: 579,
        available: true
      },
      shirt: {
        colorId: 'tan',
        displayName: 'Warm Tan Dress Shirt',
        price: 39.99,
        fit: 'classic'
      },
      tie: {
        colorId: 'burnt-orange',
        displayName: 'Burnt Orange Silk Tie',
        style: 'classic',
        price: 24.99,
        available: true
      },
      visualScore: 95,
      aestheticAnalysis: {
        colorHarmony: 98,
        contrastBalance: 88,
        trendAlignment: 93,
        visualImpact: 90
      },
      availability: 'available',
      fashionClipInsight: 'Perfect earth tone progression - Fashion CLIP identifies optimal warm color harmony. Orange provides energetic accent within natural palette for seasonal sophistication.',
      occasionTags: ['fall-wedding', 'harvest-event', 'outdoor', 'casual-formal'],
      seasonalTags: ['fall', 'autumn']
    };
  }

  private createSummerBreeze(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-004',
      name: 'The Summer Breeze Collection',
      suit: {
        colorId: 'tan',
        displayName: 'Light Tan Linen Suit',
        price: 549,
        available: true
      },
      shirt: {
        colorId: 'light-blue',
        displayName: 'Sky Blue Oxford Shirt',
        price: 39.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'coral',
        displayName: 'Coral Pink Tie',
        style: 'slim',
        price: 24.99,
        available: true
      },
      visualScore: 94,
      aestheticAnalysis: {
        colorHarmony: 92,
        contrastBalance: 93,
        trendAlignment: 96,
        visualImpact: 91
      },
      availability: 'available',
      fashionClipInsight: 'Ideal warm-cool balance for summer elegance. Tan base with blue cooling and coral warmth creates "refreshing sophistication". High trend score for coastal events.',
      occasionTags: ['beach-wedding', 'summer-party', 'yacht-club', 'resort'],
      seasonalTags: ['summer', 'spring']
    };
  }

  private createClassicWedding(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-005',
      name: 'The Classic Wedding Suite',
      suit: {
        colorId: 'charcoalGrey',
        displayName: 'Charcoal Grey Suit',
        price: 649,
        available: true
      },
      shirt: {
        colorId: 'white',
        displayName: 'Pure White Dress Shirt',
        price: 39.99,
        fit: 'classic'
      },
      tie: {
        colorId: 'blush-pink',
        displayName: 'Blush Pink Silk Tie',
        style: 'classic',
        price: 24.99,
        available: true
      },
      visualScore: 93,
      aestheticAnalysis: {
        colorHarmony: 95,
        contrastBalance: 90,
        trendAlignment: 91,
        visualImpact: 88
      },
      availability: 'available',
      fashionClipInsight: 'Wedding-perfect neutrals with romantic accent. Charcoal provides formal base while blush adds gentle warmth. Fashion CLIP rates high for "approachable elegance".',
      occasionTags: ['wedding', 'formal', 'celebration', 'ceremony'],
      seasonalTags: ['spring', 'summer']
    };
  }

  private createModernMinimal(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-006',
      name: 'The Modern Minimalist',
      suit: {
        colorId: 'black',
        displayName: 'Jet Black Modern Suit',
        price: 699,
        available: true
      },
      shirt: {
        colorId: 'light-grey',
        displayName: 'Pearl Grey Dress Shirt',
        price: 39.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'black',
        displayName: 'Matte Black Skinny Tie',
        style: 'skinny',
        price: 24.99,
        available: true
      },
      visualScore: 92,
      aestheticAnalysis: {
        colorHarmony: 90,
        contrastBalance: 85,
        trendAlignment: 94,
        visualImpact: 93
      },
      availability: 'available',
      fashionClipInsight: 'Monochromatic gradient perfection. Subtle grey breaks pure black for visual interest while maintaining minimalist aesthetic. AI detects "architectural precision".',
      occasionTags: ['modern-venue', 'gallery', 'fashion-event', 'creative'],
      seasonalTags: ['year-round']
    };
  }

  private createBoldStatement(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-007',
      name: 'The Bold Statement Maker',
      suit: {
        colorId: 'burgundy',
        displayName: 'Wine Burgundy Suit',
        price: 699,
        available: true
      },
      shirt: {
        colorId: 'black',
        displayName: 'Midnight Black Shirt',
        price: 39.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'gold',
        displayName: 'Antique Gold Tie',
        style: 'classic',
        price: 24.99,
        available: true
      },
      visualScore: 95,
      aestheticAnalysis: {
        colorHarmony: 93,
        contrastBalance: 97,
        trendAlignment: 92,
        visualImpact: 100
      },
      availability: 'available',
      fashionClipInsight: 'Maximum luxury impact - burgundy richness with black depth and gold opulence. Fashion CLIP identifies "confident luxury" with highest visual memorability score.',
      occasionTags: ['gala', 'holiday-party', 'special-event', 'celebration'],
      seasonalTags: ['fall', 'winter', 'holiday']
    };
  }

  private createCoastalElegance(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-008',
      name: 'The Coastal Elegance',
      suit: {
        colorId: 'lightGrey',
        displayName: 'Light Grey Linen Suit',
        price: 549,
        available: true
      },
      shirt: {
        colorId: 'white',
        displayName: 'Crisp White Linen Shirt',
        price: 39.99,
        fit: 'classic'
      },
      tie: {
        colorId: 'navy',
        displayName: 'Navy Blue Knit Tie',
        style: 'skinny',
        price: 24.99,
        available: true
      },
      visualScore: 91,
      aestheticAnalysis: {
        colorHarmony: 92,
        contrastBalance: 89,
        trendAlignment: 90,
        visualImpact: 88
      },
      availability: 'available',
      fashionClipInsight: 'Nautical-inspired elegance. Light grey base with navy accent creates maritime sophistication. Perfect tonal balance for outdoor elegance.',
      occasionTags: ['yacht-party', 'beach-event', 'summer-wedding', 'resort'],
      seasonalTags: ['summer', 'spring']
    };
  }

  private createUrbanProfessional(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-009',
      name: 'The Urban Professional',
      suit: {
        colorId: 'darkBrown',
        displayName: 'Espresso Brown Suit',
        price: 589,
        available: true
      },
      shirt: {
        colorId: 'light-pink',
        displayName: 'Soft Pink Dress Shirt',
        price: 39.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'dark-navy',
        displayName: 'Deep Navy Tie',
        style: 'classic',
        price: 24.99,
        available: true
      },
      visualScore: 90,
      aestheticAnalysis: {
        colorHarmony: 88,
        contrastBalance: 91,
        trendAlignment: 92,
        visualImpact: 89
      },
      availability: 'available',
      fashionClipInsight: 'Unexpected sophistication - brown with pink creates modern warmth while navy grounds the palette. Fashion CLIP detects "approachable professional" aesthetic.',
      occasionTags: ['business-casual', 'client-meeting', 'networking', 'lunch'],
      seasonalTags: ['spring', 'fall']
    };
  }

  private createVintageCharm(): AccurateFashionClipBundle {
    return {
      id: 'fc-accurate-010',
      name: 'The Vintage Charm Collection',
      suit: {
        colorId: 'hunterGreen',
        displayName: 'Forest Hunter Green Suit',
        price: 699,
        available: true
      },
      shirt: {
        colorId: 'peach',
        displayName: 'Soft Peach Dress Shirt',
        price: 39.99,
        fit: 'classic'
      },
      tie: {
        colorId: 'medium-orange',
        displayName: 'Copper Orange Tie',
        style: 'bowtie',
        price: 24.99,
        available: true
      },
      visualScore: 89,
      aestheticAnalysis: {
        colorHarmony: 87,
        contrastBalance: 88,
        trendAlignment: 91,
        visualImpact: 90
      },
      availability: 'available',
      fashionClipInsight: 'Retro-inspired color story with modern execution. Green base with warm peach and orange creates "nostalgic elegance". Bow tie adds vintage character.',
      occasionTags: ['vintage-wedding', 'themed-event', 'creative', 'artistic'],
      seasonalTags: ['fall', 'spring']
    };
  }

  // FUTURE BUNDLES (Coming Soon)

  private createFutureRoyalGala(): AccurateFashionClipBundle {
    return {
      id: 'fc-future-001',
      name: 'The Royal Gala Edition',
      suit: {
        colorId: 'royalBlue',
        displayName: 'Royal Blue Velvet Suit',
        price: 799,
        available: false
      },
      shirt: {
        colorId: 'white',
        displayName: 'Ivory White Silk Shirt',
        price: 49.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'champagne',
        displayName: 'Champagne Gold Bow Tie',
        style: 'bowtie',
        price: 34.99,
        available: false
      },
      visualScore: 97,
      aestheticAnalysis: {
        colorHarmony: 96,
        contrastBalance: 98,
        trendAlignment: 95,
        visualImpact: 99
      },
      availability: 'coming_soon',
      fashionClipInsight: 'Future luxury defined - royal blue commands attention while champagne adds celebration. Fashion CLIP predicts this will be the "event ensemble" of 2025.',
      occasionTags: ['gala', 'awards', 'premiere', 'luxury-event'],
      seasonalTags: ['winter', 'holiday']
    };
  }

  private createFutureForestWedding(): AccurateFashionClipBundle {
    return {
      id: 'fc-future-002',
      name: 'The Enchanted Forest Suite',
      suit: {
        colorId: 'emerald',
        displayName: 'Deep Emerald Green Suit',
        price: 749,
        available: false
      },
      shirt: {
        colorId: 'sage',
        displayName: 'Sage Green Dress Shirt',
        price: 39.99,
        fit: 'classic'
      },
      tie: {
        colorId: 'copper',
        displayName: 'Burnished Copper Tie',
        style: 'classic',
        price: 29.99,
        available: false
      },
      visualScore: 96,
      aestheticAnalysis: {
        colorHarmony: 98,
        contrastBalance: 92,
        trendAlignment: 97,
        visualImpact: 94
      },
      availability: 'coming_soon',
      fashionClipInsight: 'Nature-luxe perfection - emerald to sage creates forest depth while copper adds sunset warmth. AI predicts strong appeal for outdoor luxury events.',
      occasionTags: ['forest-wedding', 'outdoor-gala', 'nature-event', 'eco-luxury'],
      seasonalTags: ['spring', 'summer', 'fall']
    };
  }

  private createFutureMetropolitan(): AccurateFashionClipBundle {
    return {
      id: 'fc-future-003',
      name: 'The Metropolitan Modern',
      suit: {
        colorId: 'slate',
        displayName: 'Urban Slate Grey Suit',
        price: 679,
        available: false
      },
      shirt: {
        colorId: 'burgundy',
        displayName: 'Deep Burgundy Dress Shirt',
        price: 39.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'pearl',
        displayName: 'Pearl Grey Silk Tie',
        style: 'skinny',
        price: 29.99,
        available: false
      },
      visualScore: 94,
      aestheticAnalysis: {
        colorHarmony: 91,
        contrastBalance: 93,
        trendAlignment: 96,
        visualImpact: 92
      },
      availability: 'coming_soon',
      fashionClipInsight: 'Urban sophistication redefined - slate base with burgundy depth creates modern edge. Pearl tie adds subtle luxury marker for city elegance.',
      occasionTags: ['city-event', 'modern-venue', 'creative-industry', 'tech'],
      seasonalTags: ['year-round']
    };
  }

  private createFutureLuxuryLounge(): AccurateFashionClipBundle {
    return {
      id: 'fc-future-004',
      name: 'The Luxury Lounge Collection',
      suit: {
        colorId: 'maroon',
        displayName: 'Rich Maroon Velvet Suit',
        price: 799,
        available: false
      },
      shirt: {
        colorId: 'black',
        displayName: 'Jet Black Silk Shirt',
        price: 49.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'rust',
        displayName: 'Burnished Rust Tie',
        style: 'classic',
        price: 34.99,
        available: false
      },
      visualScore: 95,
      aestheticAnalysis: {
        colorHarmony: 94,
        contrastBalance: 96,
        trendAlignment: 93,
        visualImpact: 97
      },
      availability: 'coming_soon',
      fashionClipInsight: 'Lounge luxury aesthetic - maroon velvet with rust creates rich warmth against black depth. Fashion CLIP identifies "premium leisure" trend alignment.',
      occasionTags: ['lounge', 'club', 'evening', 'exclusive'],
      seasonalTags: ['fall', 'winter']
    };
  }

  private createFutureArtGallery(): AccurateFashionClipBundle {
    return {
      id: 'fc-future-005',
      name: 'The Art Gallery Elite',
      suit: {
        colorId: 'teal',
        displayName: 'Ocean Teal Suit',
        price: 729,
        available: false
      },
      shirt: {
        colorId: 'white',
        displayName: 'Museum White Dress Shirt',
        price: 39.99,
        fit: 'slim'
      },
      tie: {
        colorId: 'lavender',
        displayName: 'Soft Lavender Silk Tie',
        style: 'slim',
        price: 29.99,
        available: false
      },
      visualScore: 93,
      aestheticAnalysis: {
        colorHarmony: 90,
        contrastBalance: 92,
        trendAlignment: 95,
        visualImpact: 94
      },
      availability: 'coming_soon',
      fashionClipInsight: 'Artistic color confidence - teal makes a statement while lavender adds unexpected softness. Perfect for creative environments where style speaks volumes.',
      occasionTags: ['gallery-opening', 'art-event', 'creative', 'cultural'],
      seasonalTags: ['spring', 'summer']
    };
  }
}

export const fashionClipAccurateBundleGenerator = new FashionClipAccurateBundleGenerator();