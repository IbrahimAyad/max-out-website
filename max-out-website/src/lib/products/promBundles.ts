import { getSuitImage, getShirtImage, getTieImage } from './bundleImageMapping';

export interface PromBundle {
  id: string;
  name: string;
  category: 'classic' | 'modern' | 'bold' | 'unique';
  suit: {
    color: string;
    type: '2-piece' | '3-piece' | 'tuxedo';
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

// Complete suit sizing for all prom bundles
const PROM_BUNDLE_SIZES = [
  // SHORT sizes
  '34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S',
  // REGULAR sizes  
  '34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R',
  // LONG sizes
  '38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L'
];

// Helper function to add component images and sizes to a prom bundle
function enhancePromBundle(bundle: any): PromBundle {
  return {
    ...bundle,
    suit: {
      ...bundle.suit,
      image: getSuitImage(bundle.suit.color + (bundle.suit.type === 'tuxedo' ? 'Tuxedo' : ''))
    },
    shirt: {
      ...bundle.shirt,
      image: getShirtImage(bundle.shirt.color)
    },
    tie: {
      ...bundle.tie,
      image: getTieImage(bundle.tie.color)
    },
    sizes: PROM_BUNDLE_SIZES
  };
}

const rawPromBundles = {
  bundles: [
    // TUXEDO BUNDLES
    {
      id: 'prom-tux-001',
      name: 'Classic Black Tuxedo',
      category: 'classic' as const,
      suit: { color: 'Black', type: 'tuxedo' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Black', style: 'Bowtie' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.webp',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      description: 'The timeless classic. A traditional black tuxedo with white formal shirt and black bowtie for the ultimate prom elegance.',
      occasions: ['Prom', 'Formal Dance', 'Black Tie Event', 'Graduation'],
      trending: true,
      aiScore: 98,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im'
    },
    {
      id: 'prom-tux-002',
      name: 'Burgundy Statement Tuxedo',
      category: 'bold' as const,
      suit: { color: 'Burgundy', type: 'tuxedo' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Black', style: 'Bowtie' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/burgunndy-tuxedo-white-tuxedo-shirt-black-bowtie.webp',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      description: 'Make a bold statement with this rich burgundy tuxedo. Perfect for standing out while maintaining formal elegance.',
      occasions: ['Prom', 'Homecoming', 'Special Event', 'Formal Dance'],
      trending: true,
      aiScore: 96,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im'
    },
    {
      id: 'prom-tux-003',
      name: 'Light Grey Modern Tux',
      category: 'modern' as const,
      suit: { color: 'Light Grey', type: 'tuxedo' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Black', style: 'Bowtie' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/light-grey-tuxedo-white-tuxedo-shirt-black-bowtie.webp',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      description: 'Contemporary elegance with a light grey tuxedo. A fresh take on formal wear that\'s perfect for spring proms.',
      occasions: ['Prom', 'Spring Formal', 'Wedding Guest', 'Cocktail Party'],
      trending: true,
      aiScore: 94,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im'
    },
    {
      id: 'prom-tux-004',
      name: 'Midnight Blue Excellence',
      category: 'classic' as const,
      suit: { color: 'Midnight Blue', type: 'tuxedo' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Black', style: 'Bowtie' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/midnight-blue-tuxedo-white-tuxedo-shirt-black-bowtie.webp',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      description: 'Sophisticated midnight blue tuxedo that appears richer than black under evening lights. A refined choice for prom night.',
      occasions: ['Prom', 'Evening Event', 'Formal Gala', 'Awards Night'],
      trending: false,
      aiScore: 95,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im'
    },
    {
      id: 'prom-tux-005',
      name: 'Royal Blue Statement',
      category: 'bold' as const,
      suit: { color: 'Royal Blue', type: 'tuxedo' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Black', style: 'Bowtie' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/royal-blue-tuxedo-white-tuxedo-shirt-black-bowtie.webp',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      description: 'Stand out in vibrant royal blue. This eye-catching tuxedo ensures you\'ll be remembered on prom night.',
      occasions: ['Prom', 'Homecoming', 'School Dance', 'Special Event'],
      trending: true,
      aiScore: 93,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im'
    }
  ]
};

// Export enhanced bundles with component images and sizes
export const promBundles = {
  bundles: rawPromBundles.bundles.map(enhancePromBundle)
};