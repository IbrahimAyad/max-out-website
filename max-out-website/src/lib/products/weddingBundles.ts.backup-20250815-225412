import { getSuitImage, getShirtImage, getTieImage } from './bundleImageMapping';

export interface WeddingBundle {
  id: string;
  name: string;
  category: 'wedding';
  season: 'fall' | 'spring' | 'summer';
  suit: {
    color: string;
    type: '2-piece' | '3-piece';
    image?: string;
  };
  shirt: {
    color: string;
    fit: 'Classic' | 'Slim';
    image?: string;
  };
  tie: {
    color: string;
    style: 'Classic' | 'Skinny' | 'Slim' | 'Bowtie';
    image?: string;
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

// Complete suit sizing for all wedding bundles
const WEDDING_BUNDLE_SIZES = [
  // SHORT sizes
  '34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S',
  // REGULAR sizes  
  '34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R',
  // LONG sizes
  '38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L'
];

// Helper function to add component images and sizes to a wedding bundle
function enhanceWeddingBundle(bundle: any): WeddingBundle {
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
    tie: {
      ...bundle.tie,
      image: getTieImage(bundle.tie.color)
    },
    sizes: WEDDING_BUNDLE_SIZES
  };
}

const rawWeddingBundles = {
  bundles: [
    // FALL WEDDING BUNDLES
    {
      category: 'wedding' as const,
      id: 'wedding-fall-001',
      name: 'Autumn Elegance',
      season: 'fall' as const,
      suit: { color: 'Brown', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Brown', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-brown-tie.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Warm earth tones perfect for rustic fall weddings. The monochromatic brown palette creates sophisticated harmony.',
      occasions: ['Fall Wedding', 'Outdoor Wedding', 'Rustic Wedding', 'Barn Wedding'],
      trending: true,
      aiScore: 94,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-fall-002',
      name: 'Harvest Romance',
      season: 'fall' as const,
      suit: { color: 'Brown', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Burgundy', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-burgundy-tie.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Rich burgundy accents complement the brown suit for a perfect autumn wedding look.',
      occasions: ['Fall Wedding', 'Vineyard Wedding', 'Evening Wedding', 'Garden Wedding'],
      trending: true,
      aiScore: 96,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-fall-003',
      name: 'Forest Ceremony',
      season: 'fall' as const,
      suit: { color: 'Brown', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Hunter Green', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-hunter-green.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Nature-inspired combination with deep forest green perfect for outdoor fall celebrations.',
      occasions: ['Fall Wedding', 'Forest Wedding', 'Mountain Wedding', 'Outdoor Ceremony'],
      trending: false,
      aiScore: 92,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-fall-004',
      name: 'Burgundy Harvest',
      season: 'fall' as const,
      suit: { color: 'Burgundy', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Mustard', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/burgundy-suit-white-shirt-mustard-tie.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Bold burgundy suit with mustard accent captures the warm colors of autumn leaves.',
      occasions: ['Fall Wedding', 'Winery Wedding', 'Evening Reception', 'Harvest Celebration'],
      trending: true,
      aiScore: 95,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-fall-005',
      name: 'Chocolate Elegance',
      season: 'fall' as const,
      suit: { color: 'Dark Brown', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Burgundy', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/dark-brown-suit-white-shirt-burgundy-green.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Deep chocolate brown with burgundy creates a luxurious fall wedding ensemble.',
      occasions: ['Fall Wedding', 'Evening Wedding', 'Formal Wedding', 'Church Wedding'],
      trending: false,
      aiScore: 91,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-fall-006',
      name: 'Emerald Autumn',
      season: 'fall' as const,
      suit: { color: 'Emerald Green', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Burnt Orange', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/emerlad-green-white-burnt-orange.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Statement emerald suit with burnt orange tie for the bold wedding guest.',
      occasions: ['Fall Wedding', 'Creative Wedding', 'Garden Party', 'Outdoor Reception'],
      trending: true,
      aiScore: 93,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-fall-007',
      name: 'Forest Formal',
      season: 'fall' as const,
      suit: { color: 'Hunter Green', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Burgundy', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/hunter-green-3p-suit-white-shirt-burgundy-tie.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      description: 'Sophisticated hunter green three-piece with burgundy accent for formal fall weddings.',
      occasions: ['Fall Wedding', 'Formal Wedding', 'Evening Wedding', 'Traditional Wedding'],
      trending: true,
      aiScore: 97,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-fall-008',
      name: 'Caramel Sunset',
      season: 'fall' as const,
      suit: { color: 'Light Brown', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Burnt Orange', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/light-brown-suit-white-shirt-burnt-orange-tie.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Light caramel brown with vibrant burnt orange perfect for daytime fall weddings.',
      occasions: ['Fall Wedding', 'Daytime Wedding', 'Outdoor Wedding', 'Casual Wedding'],
      trending: false,
      aiScore: 90,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },

    // SPRING WEDDING BUNDLES
    {
      category: 'wedding' as const,
      id: 'wedding-spring-001',
      name: 'Spring Romance',
      season: 'spring' as const,
      suit: { color: 'Indigo', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Dusty Pink', style: 'Slim' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/indigo-2p-white-dusty-pink.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Romantic indigo and dusty pink combination perfect for spring garden weddings.',
      occasions: ['Spring Wedding', 'Garden Wedding', 'Daytime Wedding', 'Romantic Wedding'],
      trending: true,
      aiScore: 95,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-spring-002',
      name: 'Sage Garden',
      season: 'spring' as const,
      suit: { color: 'Indigo', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Sage Green', style: 'Slim' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/indigo-2p-white-sage-green.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Fresh sage green accent on indigo for nature-inspired spring celebrations.',
      occasions: ['Spring Wedding', 'Outdoor Wedding', 'Garden Party', 'Botanical Wedding'],
      trending: true,
      aiScore: 94,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-spring-003',
      name: 'Midnight Sage',
      season: 'spring' as const,
      suit: { color: 'Midnight Blue', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Sage', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/midnight-blue-3p-white-sage.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      description: 'Elegant midnight blue three-piece with sage accent for formal spring weddings.',
      occasions: ['Spring Wedding', 'Evening Wedding', 'Formal Wedding', 'Classic Wedding'],
      trending: false,
      aiScore: 93,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-spring-004',
      name: 'Spring Meadow',
      season: 'spring' as const,
      suit: { color: 'Light Brown', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Emerald Green', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/light-brown-suit-white-shirt-emerlad-green.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Light brown suit with vibrant emerald green for fresh spring celebrations.',
      occasions: ['Spring Wedding', 'Daytime Wedding', 'Country Wedding', 'Casual Wedding'],
      trending: false,
      aiScore: 91,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    },

    // SUMMER WEDDING BUNDLES
    {
      category: 'wedding' as const,
      id: 'wedding-summer-001',
      name: 'Beach Elegance',
      season: 'summer' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Coral', style: 'Skinny' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Summer%20Wedding%20Bundles/light-grey-2p-coral.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      description: 'Light and breezy with coral accent perfect for beach and destination weddings.',
      occasions: ['Beach Wedding', 'Summer Wedding', 'Destination Wedding', 'Outdoor Wedding'],
      trending: true,
      aiScore: 96,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-summer-002',
      name: 'Dusty Blue Dream',
      season: 'summer' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Dusty Blue', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Summer%20Wedding%20Bundles/light-grey-suit-white-shirt-sage-dusty-blue-tie.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      description: 'Soft dusty blue complements light grey for romantic summer weddings.',
      occasions: ['Summer Wedding', 'Garden Wedding', 'Daytime Wedding', 'Coastal Wedding'],
      trending: true,
      aiScore: 94,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-summer-003',
      name: 'Blush Summer',
      season: 'summer' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Dusty Pink', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Summer%20Wedding%20Bundles/light-grey-suit-white-shirt-sage-dusty-pink-tie.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      description: 'Light grey with dusty pink for elegant summer celebrations.',
      occasions: ['Summer Wedding', 'Evening Wedding', 'Romantic Wedding', 'Garden Party'],
      trending: false,
      aiScore: 92,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5'
    },
    {
      category: 'wedding' as const,
      id: 'wedding-summer-004',
      name: 'Desert Sage',
      season: 'summer' as const,
      suit: { color: 'Sand', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Sage Green', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Summer%20Wedding%20Bundles/sand-suit-white-shirt-sage-green-tie-.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      description: 'Sandy beige with sage green perfect for outdoor summer celebrations.',
      occasions: ['Summer Wedding', 'Desert Wedding', 'Outdoor Wedding', 'Casual Wedding'],
      trending: true,
      aiScore: 93,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD'
    }
  ]
};

// Export enhanced bundles with component images and sizes
export const weddingBundles = {
  bundles: rawWeddingBundles.bundles.map(enhanceWeddingBundle)
};