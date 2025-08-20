import { tieProducts } from './tieProducts';

// Color families and relationships
const colorFamilies = {
  reds: ['red', 'true-red', 'apple-red', 'dark-red', 'burgundy', 'chianti', 'rust', 'burnt-orange'],
  pinks: ['blush-pink', 'light-blush', 'pink', 'light-pink', 'dusty-rose', 'french-rose', 'rose-gold', 'coral', 'fushia', 'magenta'],
  oranges: ['burnt-orange', 'orange', 'salmon-orange', 'rust', 'coral', 'peach'],
  yellows: ['yellow', 'banana-yellow', 'canary', 'gold', 'champagne'],
  blues: ['navy', 'dark-navy', 'royal-blue', 'baby-blue', 'powder-blue', 'tiffany-blue', 'turquoise', 'teal', 'aqua', 'french-blue', 'carolina-blue', 'cobalt', 'sapphire-blue', 'denim-blue'],
  greens: ['emerald-green', 'hunter-green', 'olive-green', 'dark-olive', 'mint-green', 'mermaid-green', 'pastel-green', 'lettuce-green', 'lime', 'dusty-sage'],
  purples: ['light-lilac', 'lilac', 'lavender', 'medium-purple', 'plum', 'deep-purple', 'pastel-purple', 'mauve'],
  neutrals: ['black', 'charcoal', 'dark-grey', 'silver', 'dark-silver', 'white', 'ivory', 'beige', 'champagne'],
  browns: ['moca', 'chocolate-brown', 'medium-brown', 'nutmeg', 'taupe', 'rust']
};

// Occasion-based recommendations
const occasionRecommendations = {
  wedding: ['navy', 'burgundy', 'blush-pink', 'silver', 'charcoal', 'rose-gold', 'champagne', 'dusty-rose'],
  business: ['navy', 'black', 'charcoal', 'dark-grey', 'burgundy', 'red', 'royal-blue'],
  prom: ['royal-blue', 'emerald-green', 'gold', 'coral', 'tiffany-blue', 'magenta', 'deep-purple'],
  casual: ['mint-green', 'lavender', 'powder-blue', 'teal', 'coral', 'olive-green', 'dusty-sage'],
  fall: ['burnt-orange', 'rust', 'burgundy', 'chocolate-brown', 'olive-green', 'gold', 'nutmeg'],
  spring: ['mint-green', 'blush-pink', 'powder-blue', 'lavender', 'peach', 'coral', 'canary'],
  summer: ['turquoise', 'coral', 'lime', 'aqua', 'salmon-orange', 'yellow', 'teal'],
  winter: ['burgundy', 'deep-purple', 'emerald-green', 'charcoal', 'navy', 'dark-silver']
};

// Complementary color relationships
const complementaryColors: { [key: string]: string[] } = {
  // Reds
  'red': ['navy', 'white', 'black', 'charcoal', 'silver'],
  'burgundy': ['gold', 'navy', 'charcoal', 'blush-pink', 'ivory'],
  
  // Blues
  'navy': ['gold', 'burgundy', 'coral', 'silver', 'white'],
  'royal-blue': ['gold', 'orange', 'coral', 'white', 'silver'],
  'powder-blue': ['peach', 'coral', 'champagne', 'navy', 'charcoal'],
  
  // Greens
  'emerald-green': ['gold', 'burgundy', 'navy', 'rose-gold', 'black'],
  'mint-green': ['coral', 'peach', 'navy', 'charcoal', 'dusty-rose'],
  'olive-green': ['burnt-orange', 'burgundy', 'gold', 'rust', 'cream'],
  
  // Pinks
  'blush-pink': ['navy', 'charcoal', 'gold', 'sage', 'burgundy'],
  'coral': ['navy', 'mint-green', 'turquoise', 'gold', 'charcoal'],
  
  // Neutrals
  'black': ['any'], // Black goes with everything
  'white': ['any'], // White goes with everything
  'charcoal': ['burgundy', 'blush-pink', 'coral', 'mint-green', 'gold'],
  
  // Special
  'gold': ['navy', 'burgundy', 'emerald-green', 'black', 'charcoal']
};

export function getRelatedColors(colorId: string, limit: number = 5): typeof tieProducts.colors {
  const relatedColors: string[] = [];
  
  // 1. First, add colors from the same family
  const family = Object.entries(colorFamilies).find(([_, colors]) => colors.includes(colorId));
  if (family) {
    const familyColors = family[1].filter(c => c !== colorId);
    relatedColors.push(...familyColors.slice(0, 2));
  }
  
  // 2. Add complementary colors
  const complements = complementaryColors[colorId] || [];
  const validComplements = complements.filter(c => c !== 'any');
  relatedColors.push(...validComplements.slice(0, 2));
  
  // 3. Add occasion-based recommendations
  const occasions = Object.entries(occasionRecommendations)
    .filter(([_, colors]) => colors.includes(colorId))
    .flatMap(([_, colors]) => colors)
    .filter(c => c !== colorId && !relatedColors.includes(c));
  relatedColors.push(...occasions.slice(0, 2));
  
  // 4. Fill remaining slots with popular colors
  const popularColors = ['navy', 'burgundy', 'charcoal', 'gold', 'emerald-green'];
  const remaining = popularColors.filter(c => c !== colorId && !relatedColors.includes(c));
  relatedColors.push(...remaining);
  
  // Remove duplicates and limit
  const uniqueColors = [...new Set(relatedColors)].slice(0, limit);
  
  // Return the actual color objects
  return uniqueColors
    .map(id => tieProducts.colors.find(color => color.id === id))
    .filter(Boolean) as typeof tieProducts.colors;
}

export function getColorFamily(colorId: string): string | null {
  const family = Object.entries(colorFamilies).find(([_, colors]) => colors.includes(colorId));
  return family ? family[0] : null;
}

export function getColorOccasions(colorId: string): string[] {
  return Object.entries(occasionRecommendations)
    .filter(([_, colors]) => colors.includes(colorId))
    .map(([occasion]) => occasion);
}

export function getSeasonalColors(season: 'fall' | 'spring' | 'summer' | 'winter'): typeof tieProducts.colors {
  const seasonColors = occasionRecommendations[season] || [];
  return seasonColors
    .map(id => tieProducts.colors.find(color => color.id === id))
    .filter(Boolean) as typeof tieProducts.colors;
}