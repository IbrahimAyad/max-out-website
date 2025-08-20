import { Product } from '@/lib/types';

interface StyleBundle {
  id: string;
  name: string;
  image: string;
  category: 'formal' | 'wedding' | 'casual' | 'seasonal';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  colorPalette: string[];
  formality: 1 | 2 | 3 | 4 | 5; // 1 = most casual, 5 = most formal
  style: 'classic' | 'modern' | 'trendy' | 'traditional';
  primaryColor: string;
  secondaryColor?: string;
  occasion: string[];
}

// Map Swiper-v1 images to style bundles with metadata
export const styleBundles: StyleBundle[] = [
  // Start with diverse formal options
  {
    id: 'navy-classic',
    name: 'Classic Navy Professional',
    image: '/Swiper-v1/Season-1-bundles/navy-suit-white-burgunndy.webp',
    category: 'formal',
    colorPalette: ['navy', 'white', 'burgundy'],
    formality: 4,
    style: 'classic',
    primaryColor: 'navy',
    secondaryColor: 'burgundy',
    occasion: ['business', 'interview', 'dinner']
  },
  {
    id: 'black-modern',
    name: 'Modern Black Statement',
    image: '/Swiper-v1/Season-1-bundles/black-suit-black-shirt-black.webp',
    category: 'formal',
    colorPalette: ['black'],
    formality: 5,
    style: 'modern',
    primaryColor: 'black',
    occasion: ['gala', 'evening', 'cocktail']
  },
  {
    id: 'grey-versatile',
    name: 'Versatile Grey',
    image: '/Swiper-v1/Season-1-bundles/light-grey-2p-pink.webp',
    category: 'formal',
    colorPalette: ['grey', 'pink'],
    formality: 3,
    style: 'modern',
    primaryColor: 'grey',
    secondaryColor: 'pink',
    occasion: ['business', 'wedding-guest', 'social']
  },
  
  // Tuxedos - High formality
  {
    id: 'black-tux',
    name: 'Classic Black Tie',
    image: '/Swiper-v1/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.webp',
    category: 'formal',
    colorPalette: ['black', 'white'],
    formality: 5,
    style: 'traditional',
    primaryColor: 'black',
    occasion: ['black-tie', 'gala', 'formal-wedding']
  },
  {
    id: 'burgundy-tux',
    name: 'Bold Burgundy Tuxedo',
    image: '/Swiper-v1/Tuxedo-Bundles/burgunndy-tuxedo-white-tuxedo-shirt-black-bowtie.webp',
    category: 'formal',
    colorPalette: ['burgundy', 'white', 'black'],
    formality: 5,
    style: 'trendy',
    primaryColor: 'burgundy',
    occasion: ['prom', 'gala', 'special-event']
  },
  
  // Casual bundles - Lower formality
  {
    id: 'navy-casual',
    name: 'Navy Weekend Look',
    image: '/Swiper-v1/casual-bundles/navy-white-shirt-white-pocket-sqaure.webp',
    category: 'casual',
    colorPalette: ['navy', 'white'],
    formality: 2,
    style: 'classic',
    primaryColor: 'navy',
    occasion: ['brunch', 'date', 'casual-friday']
  },
  {
    id: 'black-edgy',
    name: 'All Black Edge',
    image: '/Swiper-v1/casual-bundles/black-suit-black-shirt.webp',
    category: 'casual',
    colorPalette: ['black'],
    formality: 3,
    style: 'modern',
    primaryColor: 'black',
    occasion: ['night-out', 'party', 'concert']
  },
  
  // Seasonal wedding options
  {
    id: 'fall-wedding',
    name: 'Autumn Wedding',
    image: '/Swiper-v1/Fall Wedding Bundles/burgundy-suit-white-shirt-mustard-tie.webp',
    category: 'wedding',
    season: 'fall',
    colorPalette: ['burgundy', 'white', 'mustard'],
    formality: 4,
    style: 'traditional',
    primaryColor: 'burgundy',
    secondaryColor: 'mustard',
    occasion: ['fall-wedding', 'outdoor-wedding']
  },
  {
    id: 'summer-wedding',
    name: 'Summer Elegance',
    image: '/Swiper-v1/Summer Wedding Bundles/light-grey-2p-coral.webp',
    category: 'wedding',
    season: 'summer',
    colorPalette: ['light-grey', 'coral'],
    formality: 4,
    style: 'modern',
    primaryColor: 'light-grey',
    secondaryColor: 'coral',
    occasion: ['summer-wedding', 'beach-wedding', 'garden-party']
  },
  
  // More diverse options
  {
    id: 'emerald-statement',
    name: 'Emerald Statement',
    image: '/Swiper-v1/Season-1-bundles/emerlad-green-white-burnt-orange.webp',
    category: 'formal',
    colorPalette: ['emerald', 'white', 'orange'],
    formality: 4,
    style: 'trendy',
    primaryColor: 'emerald',
    secondaryColor: 'orange',
    occasion: ['wedding', 'special-event', 'holiday-party']
  },
  {
    id: 'indigo-sophisticated',
    name: 'Indigo Sophistication',
    image: '/Swiper-v1/Season-1-bundles/indigo-2p-white-sage-green.webp',
    category: 'formal',
    colorPalette: ['indigo', 'white', 'sage'],
    formality: 4,
    style: 'modern',
    primaryColor: 'indigo',
    secondaryColor: 'sage',
    occasion: ['business', 'wedding-guest', 'cocktail']
  },
  {
    id: 'brown-traditional',
    name: 'Traditional Brown',
    image: '/Swiper-v1/Fall Wedding Bundles/brown-suit-white-shirt-brown-tie.webp',
    category: 'formal',
    colorPalette: ['brown', 'white'],
    formality: 3,
    style: 'traditional',
    primaryColor: 'brown',
    occasion: ['business-casual', 'daytime-event', 'brunch']
  },
  
  // Additional bundles for more variety
  {
    id: 'black-red-power',
    name: 'Power Red Accent',
    image: '/Swiper-v1/Season-1-bundles/black-suit-3p-red.webp',
    category: 'formal',
    colorPalette: ['black', 'red'],
    formality: 4,
    style: 'modern',
    primaryColor: 'black',
    secondaryColor: 'red',
    occasion: ['business', 'evening', 'power-meeting']
  },
  {
    id: 'black-emerald-luxury',
    name: 'Emerald Luxury',
    image: '/Swiper-v1/Season-1-bundles/black-suit-3p-emerald-green.webp',
    category: 'formal',
    colorPalette: ['black', 'emerald'],
    formality: 5,
    style: 'modern',
    primaryColor: 'black',
    secondaryColor: 'emerald',
    occasion: ['gala', 'luxury-event', 'vip']
  },
  {
    id: 'spring-sage',
    name: 'Spring Sage',
    image: '/Swiper-v1/Spring Wedding Bundles/midnight-blue-3p-white-sage.webp',
    category: 'wedding',
    season: 'spring',
    colorPalette: ['midnight-blue', 'white', 'sage'],
    formality: 4,
    style: 'modern',
    primaryColor: 'midnight-blue',
    secondaryColor: 'sage',
    occasion: ['spring-wedding', 'garden-party', 'outdoor-event']
  },
  {
    id: 'royal-statement',
    name: 'Royal Blue Statement',
    image: '/Swiper-v1/Season-1-bundles/black-suit-3p-royal-blue-.webp',
    category: 'formal',
    colorPalette: ['black', 'royal-blue'],
    formality: 4,
    style: 'trendy',
    primaryColor: 'black',
    secondaryColor: 'royal-blue',
    occasion: ['special-event', 'celebration', 'formal-party']
  },
  {
    id: 'burnt-orange-bold',
    name: 'Burnt Orange Bold',
    image: '/Swiper-v1/Season-1-bundles/black-suit-2p-burnt-orange.webp',
    category: 'formal',
    colorPalette: ['black', 'burnt-orange'],
    formality: 3,
    style: 'trendy',
    primaryColor: 'black',
    secondaryColor: 'burnt-orange',
    occasion: ['cocktail', 'art-gallery', 'creative-event']
  },
  {
    id: 'hunter-green-classic',
    name: 'Hunter Green Classic',
    image: '/Swiper-v1/Season-1-bundles/black-suit-3p-hunter-green.webp',
    category: 'formal',
    colorPalette: ['black', 'hunter-green'],
    formality: 4,
    style: 'classic',
    primaryColor: 'black',
    secondaryColor: 'hunter-green',
    occasion: ['business', 'dinner', 'traditional-event']
  },
  {
    id: 'fuschia-party',
    name: 'Fuschia Party',
    image: '/Swiper-v1/Season-1-bundles/black-suit-black-shirt-fuschia.webp',
    category: 'casual',
    colorPalette: ['black', 'fuschia'],
    formality: 3,
    style: 'trendy',
    primaryColor: 'black',
    secondaryColor: 'fuschia',
    occasion: ['party', 'club', 'celebration']
  },
  {
    id: 'burgundy-mustard',
    name: 'Autumn Burgundy',
    image: '/Swiper-v1/Season-1-bundles/burgundy-black-mustrard.webp',
    category: 'formal',
    colorPalette: ['burgundy', 'black', 'mustard'],
    formality: 4,
    style: 'traditional',
    primaryColor: 'burgundy',
    secondaryColor: 'mustard',
    occasion: ['fall-event', 'harvest-wedding', 'thanksgiving']
  },
  {
    id: 'dark-grey-silver',
    name: 'Silver Sophistication',
    image: '/Swiper-v1/Season-1-bundles/dark-grey-white-silver.webp',
    category: 'formal',
    colorPalette: ['dark-grey', 'white', 'silver'],
    formality: 5,
    style: 'classic',
    primaryColor: 'dark-grey',
    secondaryColor: 'silver',
    occasion: ['black-tie', 'award-ceremony', 'formal-gala']
  },
  {
    id: 'indigo-dusty-pink',
    name: 'Soft Indigo Romance',
    image: '/Swiper-v1/Season-1-bundles/indigo-2p-white-dusty-pink.webp',
    category: 'wedding',
    colorPalette: ['indigo', 'white', 'dusty-pink'],
    formality: 4,
    style: 'modern',
    primaryColor: 'indigo',
    secondaryColor: 'dusty-pink',
    occasion: ['wedding', 'romantic-dinner', 'anniversary']
  },
  {
    id: 'brown-pink-navy',
    name: 'Preppy Mix',
    image: '/Swiper-v1/Season-1-bundles/brown-pink-navy.webp',
    category: 'casual',
    colorPalette: ['brown', 'pink', 'navy'],
    formality: 2,
    style: 'classic',
    primaryColor: 'brown',
    secondaryColor: 'pink',
    occasion: ['country-club', 'yacht-party', 'polo-match']
  },
  {
    id: 'indigo-red-power',
    name: 'Red Power Tie',
    image: '/Swiper-v1/Season-1-bundles/indigo-2p-white-red.webp',
    category: 'formal',
    colorPalette: ['indigo', 'white', 'red'],
    formality: 5,
    style: 'traditional',
    primaryColor: 'indigo',
    secondaryColor: 'red',
    occasion: ['executive', 'board-meeting', 'power-lunch']
  }
];

// Smart ordering algorithm
export function getSmartStyleOrder(): StyleBundle[] {
  const ordered: StyleBundle[] = [];
  const remaining = [...styleBundles];
  
  // Start with a classic, safe option (navy)
  const starter = remaining.find(b => b.id === 'navy-classic');
  if (starter) {
    ordered.push(starter);
    remaining.splice(remaining.indexOf(starter), 1);
  }
  
  // Diversify by alternating between:
  // 1. Formality levels
  // 2. Color families
  // 3. Style types
  // 4. Categories
  
  let lastFormality = 4;
  let lastStyle = 'classic';
  let lastCategory = 'formal';
  let lastPrimaryColor = 'navy';
  
  while (remaining.length > 0) {
    // Score each remaining bundle
    const scores = remaining.map(bundle => {
      let score = 0;
      
      // Prefer different formality (but not too extreme jump)
      const formalityDiff = Math.abs(bundle.formality - lastFormality);
      if (formalityDiff >= 1 && formalityDiff <= 2) score += 3;
      
      // Prefer different style
      if (bundle.style !== lastStyle) score += 2;
      
      // Prefer different category
      if (bundle.category !== lastCategory) score += 2;
      
      // Prefer different primary color
      if (bundle.primaryColor !== lastPrimaryColor) score += 3;
      
      // Bonus for covering different occasions
      if (bundle.occasion.some(o => !ordered.some(ob => ob.occasion.includes(o)))) score += 1;
      
      return { bundle, score };
    });
    
    // Sort by score and pick the best
    scores.sort((a, b) => b.score - a.score);
    const next = scores[0].bundle;
    
    ordered.push(next);
    remaining.splice(remaining.indexOf(next), 1);
    
    // Update last values
    lastFormality = next.formality;
    lastStyle = next.style;
    lastCategory = next.category;
    lastPrimaryColor = next.primaryColor;
  }
  
  return ordered;
}

// Convert StyleBundle to Product format for the swiper
export function styleBundleToProduct(bundle: StyleBundle, index: number): Product {
  return {
    id: bundle.id,
    sku: `STYLE-${index + 1}`,
    name: bundle.name,
    price: 0, // Style discovery is free
    images: [bundle.image],
    category: 'suits', // Use a valid ProductCategory
    stock: {},
    variants: [],
    // Store metadata for analysis using existing ProductMetadata interface
    metadata: {
      colors: bundle.colorPalette,
      occasions: bundle.occasion,
      season: bundle.season,
      tags: [
        bundle.style,
        `formality-${bundle.formality}`,
        bundle.primaryColor,
        ...(bundle.secondaryColor ? [bundle.secondaryColor] : [])
      ]
    }
  };
}

// Analyze user preferences based on swipes
export function analyzeStylePreferences(likedBundles: StyleBundle[]) {
  const analysis = {
    preferredColors: new Map<string, number>(),
    averageFormality: 0,
    preferredStyles: new Map<string, number>(),
    preferredOccasions: new Map<string, number>(),
    colorCombinations: [] as string[][]
  };
  
  likedBundles.forEach(bundle => {
    // Count color preferences
    bundle.colorPalette.forEach(color => {
      analysis.preferredColors.set(color, (analysis.preferredColors.get(color) || 0) + 1);
    });
    
    // Track style preferences
    analysis.preferredStyles.set(bundle.style, (analysis.preferredStyles.get(bundle.style) || 0) + 1);
    
    // Track occasion preferences
    bundle.occasion.forEach(occ => {
      analysis.preferredOccasions.set(occ, (analysis.preferredOccasions.get(occ) || 0) + 1);
    });
    
    // Track color combinations
    if (bundle.primaryColor && bundle.secondaryColor) {
      analysis.colorCombinations.push([bundle.primaryColor, bundle.secondaryColor]);
    }
  });
  
  // Calculate average formality
  analysis.averageFormality = likedBundles.reduce((sum, b) => sum + b.formality, 0) / likedBundles.length;
  
  return {
    topColors: Array.from(analysis.preferredColors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color),
    formalityPreference: analysis.averageFormality > 3.5 ? 'formal' : analysis.averageFormality < 2.5 ? 'casual' : 'versatile',
    averageFormality: analysis.averageFormality,
    dominantStyle: Array.from(analysis.preferredStyles.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'classic',
    topOccasions: Array.from(analysis.preferredOccasions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([occ]) => occ),
    favoriteColorCombos: analysis.colorCombinations
  };
}