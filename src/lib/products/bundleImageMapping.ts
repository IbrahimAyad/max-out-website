import { suitImages } from '@/lib/data/suitImages';
import { dressShirtProducts } from '@/lib/products/dressShirtProducts';
import { tieProducts } from '@/lib/products/tieProducts';

// Map bundle color names to product IDs
export const bundleColorMapping = {
  suits: {
    'Black': 'black',
    'Navy': 'navy',
    'Dark Grey': 'charcoalGrey',
    'Light Grey': 'lightGrey',
    'Charcoal Grey': 'charcoalGrey',
    'Tan': 'tan',
    'Burgundy': 'burgundy',
    'Espresso Brown': 'darkBrown',
    'Brown': 'brown',
    'Forest Hunter Green': 'hunterGreen',
    'Hunter Green': 'hunterGreen',
    'Midnight Blue': 'midnightBlue',
    'Indigo': 'indigo',
    'Emerald Green': 'emerald',
    'Ocean Teal': 'teal',
    'French Blue': 'indigo',
    'Light Brown': 'brown',
    'Dark Brown': 'darkBrown',
    'Royal Blue': 'indigo',
    'Sand': 'sand',
  },
  shirts: {
    'White': 'white',
    'Black': 'black',
    'Light Blue': 'light-blue',
    'Pink': 'light-pink',
    'Tan': 'tan',
    'Pearl Grey': 'light-grey',
    'Soft Pink': 'light-pink',
    'Soft Peach': 'peach',
    'Sage Green': 'sage',
    'Sage': 'sage',
    'Deep Burgundy': 'burgundy',
    'Museum White': 'white',
    'Ivory White': 'white',
    'Onyx Black': 'black',
    'Midnight Black': 'black',
    'Sky Blue': 'light-blue',
    'Lilac': 'lilac',
    'Hunter Green': 'sage',
    'Emerald Green': 'sage',
  },
  ties: {
    'Black': 'black',
    'Burgundy': 'burgundy',
    'Silver': 'silver',
    'Red': 'red',
    'Light Blue': 'light-blue',
    'Fuchsia': 'fuchsia',
    'Hunter Green': 'hunter-green',
    'Burnt Orange': 'burnt-orange',
    'Royal Blue': 'royal-blue',
    'Emerald Green': 'emerald-green',
    'Gold': 'gold',
    'Antique Gold': 'gold',
    'Navy Blue': 'navy',
    'Navy': 'navy',
    'Dusty Pink': 'blush-pink',
    'Coral': 'coral',
    'Sage Green': 'sage',
    'Sage': 'sage',
    'Mustard': 'mustard',
    'Pink': 'blush-pink',
    'Champagne Gold': 'gold',
    'Copper Orange': 'burnt-orange',
    'Burnished Copper': 'burnt-orange',
    'Burnished Rust': 'burnt-orange',
    'Pearl Grey': 'silver',
    'Soft Lavender': 'lavender',
    'Blush Pink': 'blush-pink',
    'Dusty Blue': 'powder-blue',
    'Mustard': 'banana-yellow',
    'Sage': 'dusty-sage',
  }
};

// Get suit image
export function getSuitImage(color: string): string | undefined {
  const colorId = bundleColorMapping.suits[color as keyof typeof bundleColorMapping.suits];
  if (colorId && suitImages[colorId as keyof typeof suitImages]) {
    return suitImages[colorId as keyof typeof suitImages].main;
  }
  return undefined;
}

// Get shirt image
export function getShirtImage(color: string): string | undefined {
  const colorId = bundleColorMapping.shirts[color as keyof typeof bundleColorMapping.shirts];
  if (colorId) {
    const shirtColor = dressShirtProducts.colors.find(c => c.id === colorId);
    return shirtColor?.imageUrl;
  }
  return undefined;
}

// Get tie image
export function getTieImage(color: string): string | undefined {
  const colorId = bundleColorMapping.ties[color as keyof typeof bundleColorMapping.ties];
  if (colorId) {
    const tieColor = tieProducts.colors.find(c => c.id === colorId);
    return tieColor?.imageUrl;
  }
  return undefined;
}

// Update bundle with individual product images
export function addProductImages(bundle: any): any {
  return {
    ...bundle,
    suit: {
      ...bundle.suit,
      image: getSuitImage(bundle.suit.color)
    },
    shirt: {
      ...bundle.shirt,
      image: getShirtImage(bundle.shirt.color)
    },
    ...(bundle.tie && {
      tie: {
        ...bundle.tie,
        image: getTieImage(bundle.tie.color)
      }
    }),
    ...(bundle.pocketSquare && {
      pocketSquare: {
        ...bundle.pocketSquare,
        image: undefined // Pocket squares don't have individual images in our system
      }
    })
  };
}