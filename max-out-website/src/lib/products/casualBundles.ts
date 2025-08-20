// Casual Bundles - Relaxed style outfits with pocket squares
// All bundles are priced at $199.99

import { getSuitImage, getShirtImage } from './bundleImageMapping';

const R2_BASE_URL = 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev';

export interface CasualBundle {
  id: string;
  name: string;
  category: 'monochrome' | 'contrast' | 'subtle' | 'bold';
  suit: {
    color: string;
    type: '2-piece';
    image?: string;
  };
  shirt: {
    color: string;
    fit: 'Classic' | 'Slim';
    image?: string;
  };
  pocketSquare: {
    color: string;
    pattern: 'Solid' | 'Patterned';
  };
  imageUrl: string;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  description: string;
  occasions: string[];
  trending?: boolean;
  aiScore?: number;
  stripePriceId: string;
  sizes?: string[];
}

// Using the $199.99 price ID
const CASUAL_BUNDLE_STRIPE_PRICE_ID = 'price_1RpvZUCHc12x7sCzM4sp9DY5';

// Complete suit sizing for all casual bundles
const CASUAL_BUNDLE_SIZES = [
  // SHORT sizes
  '34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S',
  // REGULAR sizes  
  '34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R',
  // LONG sizes
  '38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L'
];

// Helper function to add component images and sizes to a casual bundle
function enhanceCasualBundle(bundle: any): CasualBundle {
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
    sizes: CASUAL_BUNDLE_SIZES
  };
}

const rawCasualBundles = {
  bundles: [
    // NAVY BUNDLES
    {
      id: 'casual-001',
      name: 'Navy & Lilac Elegance',
      category: 'subtle' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'Lilac', fit: 'Slim' as const },
      pocketSquare: { color: 'Lilac', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/Navy-Suit-Lilac-Shirt-lilac-pocketsqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Sophisticated navy suit paired with a soft lilac shirt and matching pocket square. Perfect for cocktail parties and semi-formal events.',
      occasions: ['Cocktail Party', 'Business Casual', 'Date Night', 'Art Gallery'],
      trending: true,
      aiScore: 94,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-002',
      name: 'Navy & Pink Charm',
      category: 'subtle' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'Pink', fit: 'Slim' as const },
      pocketSquare: { color: 'Pink', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/navy-suit-pink-shirt-pink-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Classic navy suit with a refreshing pink shirt. A confident choice for modern cocktail events.',
      occasions: ['Cocktail Party', 'Summer Wedding', 'Rooftop Party', 'Evening Reception'],
      trending: true,
      aiScore: 92,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-003',
      name: 'Navy Monochrome',
      category: 'monochrome' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Classic' as const },
      pocketSquare: { color: 'Black', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/navy-black-shirt-black-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Bold navy and black combination for a sophisticated evening look. Modern and sleek.',
      occasions: ['Evening Event', 'Cocktail Hour', 'Night Out', 'Club Event'],
      trending: false,
      aiScore: 90,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-004',
      name: 'Navy Classic White',
      category: 'subtle' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      pocketSquare: { color: 'White', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/navy-white-shirt-white-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Timeless navy and white combination. Versatile for any cocktail occasion.',
      occasions: ['Cocktail Party', 'Business Event', 'Dinner Party', 'Theater Night'],
      trending: false,
      aiScore: 88,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },

    // BLACK BUNDLES
    {
      id: 'casual-005',
      name: 'All Black Everything',
      category: 'monochrome' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      pocketSquare: { color: 'Black', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/black-suit-black-shirt.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Sleek all-black ensemble for the ultimate sophisticated look. Modern minimalism at its finest.',
      occasions: ['Night Event', 'Gallery Opening', 'Fashion Show', 'VIP Party'],
      trending: true,
      aiScore: 95,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-006',
      name: 'Black & Burgundy Bold',
      category: 'bold' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'Burgundy', fit: 'Slim' as const },
      pocketSquare: { color: 'Burgundy', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/black-suit-burgundy-shirt-burgundy-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Dramatic black suit with rich burgundy accents. Perfect for making a memorable impression.',
      occasions: ['Wine Tasting', 'Evening Reception', 'Holiday Party', 'Anniversary'],
      trending: true,
      aiScore: 93,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-007',
      name: 'Black & Emerald Luxury',
      category: 'bold' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'Emerald Green', fit: 'Slim' as const },
      pocketSquare: { color: 'Emerald Green', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/black-suit-emerlad-green-shirt-emerlad-green-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Luxurious black suit with vibrant emerald green. A bold choice for upscale events.',
      occasions: ['Gala Event', 'Casino Night', 'New Year Party', 'Award Ceremony'],
      trending: false,
      aiScore: 91,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-008',
      name: 'Black & Hunter Green',
      category: 'bold' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'Hunter Green', fit: 'Classic' as const },
      pocketSquare: { color: 'Hunter Green', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/black-suit-hunter-green-shirt-hunter-green-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Sophisticated black with deep hunter green. Perfect for fall and winter cocktail events.',
      occasions: ['Fall Event', 'Corporate Party', 'Evening Reception', 'Whiskey Tasting'],
      trending: false,
      aiScore: 89,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-009',
      name: 'Black & White Classic',
      category: 'monochrome' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      pocketSquare: { color: 'White', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/black-white-shirt-white-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Timeless black and white combination. The foundation of cocktail elegance.',
      occasions: ['Cocktail Hour', 'Business Event', 'Evening Wedding', 'Formal Dinner'],
      trending: false,
      aiScore: 87,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },

    // LIGHT GREY BUNDLES
    {
      id: 'casual-010',
      name: 'Light Grey & Blue Sky',
      category: 'subtle' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'Light Blue', fit: 'Slim' as const },
      pocketSquare: { color: 'Light Blue', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/light-grey-suit-light-blue-shirt-light-blue-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Fresh light grey suit with sky blue accents. Perfect for daytime cocktail events.',
      occasions: ['Garden Party', 'Brunch Event', 'Day Wedding', 'Yacht Party'],
      trending: true,
      aiScore: 92,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-011',
      name: 'Light Grey Minimalist',
      category: 'monochrome' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      pocketSquare: { color: 'White', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/light-grey-white-shirt-white-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Clean and sophisticated light grey with white. Modern minimalism for any occasion.',
      occasions: ['Summer Party', 'Beach Wedding', 'Cocktail Reception', 'Art Show'],
      trending: false,
      aiScore: 88,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },

    // INDIGO BUNDLES
    {
      id: 'casual-012',
      name: 'Indigo Contrast',
      category: 'contrast' as const,
      suit: { color: 'Indigo', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      pocketSquare: { color: 'White', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/indigo-black-shirt-white-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Bold indigo suit with black shirt and white pocket square. Contemporary and striking.',
      occasions: ['Evening Event', 'Club Night', 'Birthday Party', 'Concert'],
      trending: false,
      aiScore: 90,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-013',
      name: 'Indigo Classic',
      category: 'subtle' as const,
      suit: { color: 'Indigo', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      pocketSquare: { color: 'White', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/indigo-white-shirt-white-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Rich indigo suit with crisp white shirt. A modern twist on classic elegance.',
      occasions: ['Cocktail Party', 'Business Casual', 'Dinner Date', 'Theater'],
      trending: true,
      aiScore: 91,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },

    // MIDNIGHT BLUE & FRENCH BLUE
    {
      id: 'casual-014',
      name: 'Midnight Blue Sophistication',
      category: 'subtle' as const,
      suit: { color: 'Midnight Blue', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      pocketSquare: { color: 'White', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/midnight-blue--white-shirt-white-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Elegant midnight blue with white accents. Perfect for evening cocktail events.',
      occasions: ['Evening Reception', 'Opera Night', 'Charity Gala', 'Anniversary'],
      trending: true,
      aiScore: 93,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },
    {
      id: 'casual-015',
      name: 'French Blue Statement',
      category: 'contrast' as const,
      suit: { color: 'French Blue', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      pocketSquare: { color: 'Black', pattern: 'Solid' as const },
      imageUrl: `${R2_BASE_URL}/kct-prodcuts/casual-bundles/french-blue-black-shirt-black-pocket-sqaure.webp`,
      originalPrice: 249.99,
      bundlePrice: 199.99,
      savings: 50.00,
      description: 'Unique French blue suit with black shirt for a memorable cocktail look.',
      occasions: ['Fashion Event', 'Gallery Opening', 'Rooftop Party', 'Summer Evening'],
      trending: false,
      aiScore: 89,
      stripePriceId: CASUAL_BUNDLE_STRIPE_PRICE_ID
    },

    // NOTE: One duplicate was removed (indigo--white-shirt-white-pocket-sqaure.png appears to be a duplicate of indigo-white)
  ]
};

// Export enhanced bundles with component images and sizes
export const casualBundles = {
  bundles: rawCasualBundles.bundles.map(enhanceCasualBundle)
};

// Helper function to get casual bundle by ID
export function getCasualBundleById(id: string): CasualBundle | undefined {
  return casualBundles.bundles.find(bundle => bundle.id === id);
}

// Helper function to filter bundles by category
export function getCasualBundlesByCategory(category: CasualBundle['category']): CasualBundle[] {
  return casualBundles.bundles.filter(bundle => bundle.category === category);
}