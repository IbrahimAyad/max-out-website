import { getSuitImage, getShirtImage, getTieImage } from './bundleImageMapping';

export interface Bundle {
  id: string;
  name: string;
  category: 'classic' | 'bold' | 'sophisticated' | 'contemporary';
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
  seasonal?: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
  aiScore?: number;
  stripePriceId?: string;
  sizes?: string[];
}

// Complete suit sizing for all bundles
const BUNDLE_SIZES = [
  // SHORT sizes
  '34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S',
  // REGULAR sizes  
  '34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R',
  // LONG sizes
  '38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L'
];

// Helper function to add component images and sizes to a bundle
function enhanceBundle(bundle: any): Bundle {
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
    sizes: BUNDLE_SIZES
  };
}

const rawBundleProducts = {
  bundles: [
    // CLASSIC COLLECTION
    {
      id: 'bundle-001',
      name: 'The Timeless Tuxedo',
      category: 'classic' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Black', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-2-white-black.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'The ultimate formal ensemble. Perfect for black-tie events, galas, and the most formal occasions.',
      occasions: ['Black Tie', 'Gala', 'Wedding', 'Formal Evening'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 98
    },
    {
      id: 'bundle-002',
      name: 'The Executive Power',
      category: 'classic' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Burgundy', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Our #1 best-seller. The navy and burgundy combination exudes confidence and professionalism.',
      occasions: ['Business', 'Interview', 'Wedding Guest', 'Networking'],
      trending: true,
      seasonal: 'year-round',
      aiScore: 100
    },
    {
      id: 'bundle-003',
      name: 'The Metropolitan',
      category: 'classic' as const,
      suit: { color: 'Dark Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Silver', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/dark-grey-white-silver.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Sophisticated city style. The grey and silver combination is perfect for modern professionals.',
      occasions: ['Business', 'Cocktail', 'Evening Event', 'Conference'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 94
    },
    {
      id: 'bundle-004',
      name: 'The Power Player',
      category: 'classic' as const,
      suit: { color: 'Navy', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Red', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-3p-white-red.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'Make a statement with this bold power combination. The red tie adds confidence to the classic navy.',
      occasions: ['Business', 'Presentation', 'Power Lunch', 'Important Meeting'],
      trending: true,
      seasonal: 'year-round',
      aiScore: 96
    },
    {
      id: 'bundle-005',
      name: 'The Summer Classic',
      category: 'classic' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Light Blue', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/light-grey-2p-light-blue.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5',
      description: 'Light and breezy for warm weather elegance. Perfect for summer weddings and outdoor events.',
      occasions: ['Summer Wedding', 'Garden Party', 'Outdoor Event', 'Brunch'],
      trending: false,
      seasonal: 'summer',
      aiScore: 91
    },

    // BOLD & MODERN COLLECTION
    {
      id: 'bundle-006',
      name: 'The Triple Black',
      category: 'bold' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      tie: { color: 'Black', style: 'Skinny' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'All black everything. The ultimate modern power move for those who dare to be different.',
      occasions: ['Fashion Event', 'Club', 'Creative Industry', 'Evening Out'],
      trending: true,
      seasonal: 'year-round',
      aiScore: 93
    },
    {
      id: 'bundle-007',
      name: 'The Night Out',
      category: 'bold' as const,
      suit: { color: 'Burgundy', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      tie: { color: 'Fuchsia', style: 'Slim' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/burgundy-black-fusicha.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Bold and luxurious. The burgundy suit with fuchsia accent is perfect for making an entrance.',
      occasions: ['Cocktail Party', 'Date Night', 'Gallery Opening', 'Special Event'],
      trending: true,
      seasonal: 'fall',
      aiScore: 89
    },
    {
      id: 'bundle-008',
      name: 'The Dark Forest',
      category: 'bold' as const,
      suit: { color: 'Black', type: '3-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      tie: { color: 'Hunter Green', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-Hunter%20Green.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'Mysterious and sophisticated. The deep green accent adds intrigue to the all-black base.',
      occasions: ['Evening Event', 'Holiday Party', 'Theater', 'Upscale Dinner'],
      trending: false,
      seasonal: 'winter',
      aiScore: 91
    },
    {
      id: 'bundle-009',
      name: 'The Autumn Statement',
      category: 'bold' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Burnt Orange', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-2p-burnt-orange.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Perfect fall combination. The burnt orange tie adds warmth to the classic black suit.',
      occasions: ['Fall Wedding', 'Harvest Event', 'Thanksgiving', 'Autumn Celebration'],
      trending: true,
      seasonal: 'fall',
      aiScore: 92
    },
    {
      id: 'bundle-010',
      name: 'The Royal Blue',
      category: 'bold' as const,
      suit: { color: 'Black', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Royal Blue', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-3p-royal-blue-.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'Bold blue accent on classic black. Perfect for those who want to stand out professionally.',
      occasions: ['Business Event', 'Award Ceremony', 'Corporate Gala', 'Conference'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 90
    },

    // SOPHISTICATED COLLECTION
    {
      id: 'bundle-011',
      name: 'The Evening Elegance',
      category: 'sophisticated' as const,
      suit: { color: 'Midnight Blue', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Sage', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/midnight-blue-3p-white-sage.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'Sophisticated alternative to black. The midnight blue appears richer under evening lights.',
      occasions: ['Formal Dinner', 'Opera', 'Evening Wedding', 'Gala'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 95
    },
    {
      id: 'bundle-012',
      name: 'The Refined Professional',
      category: 'sophisticated' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'Light Blue', fit: 'Classic' as const },
      tie: { color: 'Burgundy', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-2p-light-blue-burgundy.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5',
      description: 'Professional with personality. The light blue shirt adds approachability to the power combo.',
      occasions: ['Client Meeting', 'Business Casual', 'Networking', 'Office'],
      trending: true,
      seasonal: 'year-round',
      aiScore: 93
    },
    {
      id: 'bundle-013',
      name: 'The Creative Director',
      category: 'sophisticated' as const,
      suit: { color: 'Brown', type: '2-piece' as const },
      shirt: { color: 'Pink', fit: 'Slim' as const },
      tie: { color: 'Navy', style: 'Skinny' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/brown-pink-navy.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Unexpected sophistication. The brown and pink combination shows creative confidence.',
      occasions: ['Creative Meeting', 'Art Event', 'Fashion Show', 'Design Conference'],
      trending: false,
      seasonal: 'spring',
      aiScore: 88
    },
    {
      id: 'bundle-014',
      name: 'The Autumn Elegance',
      category: 'sophisticated' as const,
      suit: { color: 'Burgundy', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      tie: { color: 'Mustard', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/burgundy-black-mustrard.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Rich autumn colors for sophisticated style. The mustard tie adds the perfect accent.',
      occasions: ['Fall Wedding', 'Wine Tasting', 'Harvest Dinner', 'Autumn Event'],
      trending: true,
      seasonal: 'fall',
      aiScore: 94
    },
    {
      id: 'bundle-015',
      name: 'The Pink Professional',
      category: 'sophisticated' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'Pink', fit: 'Slim' as const },
      tie: { color: 'Navy', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/Navy-2p-pink-navy.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5',
      description: 'Modern professional with a soft touch. The pink shirt adds contemporary flair.',
      occasions: ['Business Lunch', 'Smart Casual', 'Date Night', 'Social Event'],
      trending: false,
      seasonal: 'spring',
      aiScore: 91
    },

    // CONTEMPORARY COLLECTION
    {
      id: 'bundle-016',
      name: 'The Modern Romance',
      category: 'contemporary' as const,
      suit: { color: 'Indigo', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Dusty Pink', style: 'Slim' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/indigo-2p-white-dusty-pink.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Contemporary romance. The indigo and dusty pink combination is perfectly on-trend.',
      occasions: ['Spring Wedding', 'Date Night', 'Romantic Dinner', 'Engagement Party'],
      trending: true,
      seasonal: 'spring',
      aiScore: 92
    },
    {
      id: 'bundle-017',
      name: 'The Beach Wedding',
      category: 'contemporary' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Coral', style: 'Skinny' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/light-grey-2p-coral.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5',
      description: 'Perfect for coastal celebrations. The coral accent brings seaside charm.',
      occasions: ['Beach Wedding', 'Summer Party', 'Destination Wedding', 'Resort Event'],
      trending: true,
      seasonal: 'summer',
      aiScore: 90
    },
    {
      id: 'bundle-018',
      name: 'The Emerald City',
      category: 'contemporary' as const,
      suit: { color: 'Emerald Green', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Burnt Orange', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/emerlad-green-white-burnt-orange.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Bold color confidence. The emerald and orange combination is unexpectedly perfect.',
      occasions: ['Creative Event', 'Holiday Party', 'Special Occasion', 'Fashion Event'],
      trending: false,
      seasonal: 'fall',
      aiScore: 87
    },
    {
      id: 'bundle-019',
      name: 'The Garden Party',
      category: 'contemporary' as const,
      suit: { color: 'Light Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Pink', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/light-grey-2p-pink.png',
      originalPrice: 239.99,
      bundlePrice: 199.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZUCHc12x7sCzM4sp9DY5',
      description: 'Light and romantic. Perfect for daytime celebrations and garden parties.',
      occasions: ['Garden Party', 'Brunch Wedding', 'Spring Event', 'Daytime Celebration'],
      trending: false,
      seasonal: 'spring',
      aiScore: 89
    },
    {
      id: 'bundle-020',
      name: 'The Sage Wisdom',
      category: 'contemporary' as const,
      suit: { color: 'Indigo', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Sage Green', style: 'Slim' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/indigo-2p-white-sage-green.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Nature-inspired elegance. The indigo and sage combination is calming yet sophisticated.',
      occasions: ['Outdoor Wedding', 'Nature Event', 'Spring Celebration', 'Eco-Event'],
      trending: true,
      seasonal: 'spring',
      aiScore: 93
    },

    // Additional Bold Combinations
    {
      id: 'bundle-021',
      name: 'The Emerald Statement',
      category: 'bold' as const,
      suit: { color: 'Black', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Emerald Green', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-3p-emerald-green.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'Luxurious and bold. The emerald tie adds richness to the formal black suit.',
      occasions: ['Holiday Gala', 'Luxury Event', 'Casino Night', 'Upscale Party'],
      trending: false,
      seasonal: 'winter',
      aiScore: 92
    },
    {
      id: 'bundle-022',
      name: 'The Fuchsia Fire',
      category: 'bold' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      tie: { color: 'Fuchsia', style: 'Skinny' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-fuschia.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Electric energy. The fuchsia accent electrifies the all-black ensemble.',
      occasions: ['Night Out', 'Club Event', 'Fashion Party', 'Creative Industry'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 88
    },
    {
      id: 'bundle-023',
      name: 'The Burnt Orange Blaze',
      category: 'bold' as const,
      suit: { color: 'Black', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      tie: { color: 'Burnt Orange', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-burnt-orange.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Warm and mysterious. The burnt orange adds depth to the black-on-black base.',
      occasions: ['Fall Event', 'Evening Party', 'Artistic Event', 'Halloween Formal'],
      trending: false,
      seasonal: 'fall',
      aiScore: 87
    },

    // Additional Sophisticated
    {
      id: 'bundle-024',
      name: 'The Pink Sophisticate',
      category: 'sophisticated' as const,
      suit: { color: 'Dark Grey', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Pink', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/dark-grey-white-pink.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Refined with a touch of color. The pink tie softens the strong grey suit.',
      occasions: ['Business Lunch', 'Spring Wedding', 'Daytime Event', 'Social Business'],
      trending: false,
      seasonal: 'spring',
      aiScore: 90
    },
    {
      id: 'bundle-025',
      name: 'The Burgundy Elite',
      category: 'sophisticated' as const,
      suit: { color: 'Burgundy', type: '2-piece' as const },
      shirt: { color: 'Black', fit: 'Slim' as const },
      tie: { color: 'Black', style: 'Skinny' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/burgundy-black-black.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Wine-dark elegance. The burgundy suit with black accents is pure luxury.',
      occasions: ['Wine Tasting', 'Evening Event', 'Holiday Party', 'Upscale Dinner'],
      trending: false,
      seasonal: 'fall',
      aiScore: 93
    },

    // Additional Contemporary
    {
      id: 'bundle-026',
      name: 'The Red Revolution',
      category: 'contemporary' as const,
      suit: { color: 'Indigo', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Red', style: 'Slim' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/indigo-2p-white-red.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'Bold and patriotic. The indigo suit with red tie makes a confident statement.',
      occasions: ['Political Event', 'Power Meeting', 'National Holiday', 'Important Presentation'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 91
    },

    // Additional Classic
    {
      id: 'bundle-027',
      name: 'The Classic Tuxedo Plus',
      category: 'classic' as const,
      suit: { color: 'Black', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Black', style: 'Bowtie' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-3p-white-black.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'The ultimate formal ensemble with vest. Perfect for the most prestigious events.',
      occasions: ['Black Tie', 'Wedding Groom', 'Award Ceremony', 'Opera'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 99
    },
    {
      id: 'bundle-028',
      name: 'The Red Carpet',
      category: 'classic' as const,
      suit: { color: 'Black', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Red', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/%20black-suit-3p-red.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'Hollywood glamour. The classic black suit with red tie screams confidence.',
      occasions: ['Red Carpet', 'Premiere', 'Award Show', 'VIP Event'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 95
    },
    {
      id: 'bundle-029',
      name: 'The Navy Standard',
      category: 'classic' as const,
      suit: { color: 'Navy', type: '2-piece' as const },
      shirt: { color: 'White', fit: 'Classic' as const },
      tie: { color: 'Red', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-red.png',
      originalPrice: 269.99,
      bundlePrice: 229.99,
      savings: 40.00,
      stripePriceId: 'price_1RpvZtCHc12x7sCzny7VmEWD',
      description: 'The power standard. Navy suit with red tie is the ultimate professional combination.',
      occasions: ['Business Meeting', 'Interview', 'Presentation', 'Corporate Event'],
      trending: false,
      seasonal: 'year-round',
      aiScore: 97
    },

    // Bold Hunter Green
    {
      id: 'bundle-030',
      name: 'The Hunter Elite',
      category: 'bold' as const,
      suit: { color: 'Black', type: '3-piece' as const },
      shirt: { color: 'White', fit: 'Slim' as const },
      tie: { color: 'Hunter Green', style: 'Classic' as const },
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-3p-hunter-green.png',
      originalPrice: 299.99,
      bundlePrice: 249.99,
      savings: 50.00,
      stripePriceId: 'price_1RpvaBCHc12x7sCzRV6Hy0Im',
      description: 'Forest elegance. The hunter green tie brings nature\'s richness to formal wear.',
      occasions: ['Fall Wedding', 'Holiday Event', 'Outdoor Formal', 'Evening Reception'],
      trending: false,
      seasonal: 'fall',
      aiScore: 91
    }
  ]
};

// Export enhanced bundles with component images and sizes
export const bundleProducts = {
  bundles: rawBundleProducts.bundles.map(enhanceBundle)
};