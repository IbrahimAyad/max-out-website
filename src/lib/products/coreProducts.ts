// Core Products Configuration - Suits, Shirts, Ties
// All products with working Stripe Price IDs

export interface CoreProduct {
  id: string;
  name: string;
  category: 'suits' | 'shirts' | 'ties' | 'tie-bundles';
  subcategory?: string;
  stripePriceId: string;
  stripeProductId?: string;
  price: number;
  imageUrl: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  customizable?: boolean;
  metadata?: Record<string, any>;
}

// Complete suit sizing
const SUIT_SIZES = [
  // SHORT sizes
  '34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S',
  // REGULAR sizes  
  '34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R',
  // LONG sizes
  '38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L'
];

// Shirt sizing
const SHIRT_SIZES = [
  '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18'
];

// ============================================
// SUITS - 28 Core Products (14 colors × 2 styles)
// ============================================

export const coreSuits: CoreProduct[] = [
  // Navy Suits
  {
    id: 'suit-navy-2p',
    name: 'Navy Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv2tCHc12x7sCzVvLRto3m',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    description: 'Classic navy two-piece suit. The foundation of every professional wardrobe.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-navy-3p',
    name: 'Navy Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv31CHc12x7sCzlFtlUflr',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-3-main.jpg',
    description: 'Navy three-piece suit with vest. Perfect for formal occasions.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Beige Suits
  {
    id: 'suit-beige-2p',
    name: 'Beige Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv3FCHc12x7sCzg9nHaXkM',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main.jpg',
    description: 'Light beige suit perfect for summer weddings and outdoor events.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-beige-3p',
    name: 'Beige Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv3QCHc12x7sCzMVTfaqEE',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main-2.jpg',
    description: 'Elegant beige three-piece suit for sophisticated occasions.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Black Suits
  {
    id: 'suit-black-2p',
    name: 'Black Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv3cCHc12x7sCzLtiatn73',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    description: 'Timeless black suit. Essential for formal events and business.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-black-3p',
    name: 'Black Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv3iCHc12x7sCzJYg14SL8',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/blacksuit3p.jpeg',
    description: 'Classic black three-piece suit with vest. Ultimate formal elegance.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Brown Suits
  {
    id: 'suit-brown-2p',
    name: 'Brown Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv3zCHc12x7sCzKMSpA4hP',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/brown-suit-main.jpg',
    description: 'Rich brown suit for a distinguished professional look.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-brown-3p',
    name: 'Brown Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv4ECHc12x7sCzhUuL9uCE',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/brown-suit-.jpg',
    description: 'Sophisticated brown three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Burgundy Suits
  {
    id: 'suit-burgundy-2p',
    name: 'Burgundy Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv4XCHc12x7sCzSC3Mbtey',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/two-peice-main-bur.jpg',
    description: 'Bold burgundy suit for making a sophisticated statement.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-burgundy-3p',
    name: 'Burgundy Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv4eCHc12x7sCzwbuknObE',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/three-peice-burgundy-main.jpg',
    description: 'Luxurious burgundy three-piece suit for special occasions.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Charcoal Grey Suits
  {
    id: 'suit-charcoal-2p',
    name: 'Charcoal Grey Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv4sCHc12x7sCzgMUu7hLq',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    description: 'Versatile charcoal grey suit for business and formal events.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-charcoal-3p',
    name: 'Charcoal Grey Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv4zCHc12x7sCzerWp2R07',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/vest-tie-dark-grey.jpg',
    description: 'Professional charcoal grey three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Dark Brown Suits
  {
    id: 'suit-darkbrown-2p',
    name: 'Dark Brown Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv5DCHc12x7sCzdWjcaCY4',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/dark-brown/brown-main.jpg',
    description: 'Deep chocolate brown suit for autumn elegance.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-darkbrown-3p',
    name: 'Dark Brown Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv5JCHc12x7sCzPd619lQ8',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/dark-brown/brown-main.jpg',
    description: 'Rich dark brown three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Emerald Suits
  {
    id: 'suit-emerald-2p',
    name: 'Emerald Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv5XCHc12x7sCzzP57OQvP',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerlad-main.jpg',
    description: 'Bold emerald green suit for making a statement.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-emerald-3p',
    name: 'Emerald Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv5eCHc12x7sCzIAVMbB7m',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerland-main-2.jpg',
    description: 'Luxurious emerald three-piece suit for special occasions.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Hunter Green Suits
  {
    id: 'suit-hunter-2p',
    name: 'Hunter Green Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv5vCHc12x7sCzAlFuGQNL',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-main.jpg',
    description: 'Deep hunter green suit for sophisticated style.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-hunter-3p',
    name: 'Hunter Green Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv61CHc12x7sCzIboI1eC8',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-2-main.jpg',
    description: 'Elegant hunter green three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Indigo Suits
  {
    id: 'suit-indigo-2p',
    name: 'Indigo Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv6ECHc12x7sCz7JjWOP0p',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main.jpg',
    description: 'Rich indigo suit with contemporary appeal.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-indigo-3p',
    name: 'Indigo Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv6KCHc12x7sCzzaFWFxef',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main-2.jpg',
    description: 'Modern indigo three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Light Grey Suits
  {
    id: 'suit-lightgrey-2p',
    name: 'Light Grey Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv6WCHc12x7sCzDJI7Ypav',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
    description: 'Fresh light grey suit perfect for spring and summer.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-lightgrey-3p',
    name: 'Light Grey Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv6dCHc12x7sCz3JOmrvuA',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/vest-shirt-tie-main.jpg',
    description: 'Elegant light grey three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Midnight Blue Suits
  {
    id: 'suit-midnight-2p',
    name: 'Midnight Blue Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv6sCHc12x7sCz6OZIkTR2',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-main.jpg',
    description: 'Sophisticated midnight blue suit for evening elegance.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-midnight-3p',
    name: 'Midnight Blue Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv6yCHc12x7sCz1LFaN5gS',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-two-main.jpg',
    description: 'Luxurious midnight blue three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Sand Suits
  {
    id: 'suit-sand-2p',
    name: 'Sand Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv7GCHc12x7sCzV9qUCc7I',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/sand/sand-main.jpg',
    description: 'Light sand suit perfect for beach and outdoor weddings.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-sand-3p',
    name: 'Sand Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv7PCHc12x7sCzbXQ9a1MG',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/sand/sand-main.jpg',
    description: 'Elegant sand three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  },

  // Tan Suits
  {
    id: 'suit-tan-2p',
    name: 'Tan Suit - 2 Piece',
    category: 'suits',
    subcategory: '2-piece',
    stripePriceId: 'price_1Rpv7dCHc12x7sCzoWrXk2Ot',
    price: 299.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    description: 'Classic tan suit for warm-weather sophistication.',
    sizes: SUIT_SIZES,
    customizable: true
  },
  {
    id: 'suit-tan-3p',
    name: 'Tan Suit - 3 Piece',
    category: 'suits',
    subcategory: '3-piece',
    stripePriceId: 'price_1Rpv7mCHc12x7sCzixeUm5ep',
    price: 349.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    description: 'Sophisticated tan three-piece suit with vest.',
    sizes: SUIT_SIZES,
    customizable: true
  }
];

// ============================================
// TIES - 4 Core Products (Dynamic Color Selection)
// ============================================

export const coreTies: CoreProduct[] = [
  {
    id: 'tie-ultra-skinny',
    name: 'Ultra Skinny Tie (2.25")',
    category: 'ties',
    subcategory: 'ultra-skinny',
    stripePriceId: 'price_1RpvHlCHc12x7sCzp0TVNS92',
    price: 29.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    description: 'Modern ultra-skinny tie, 2.25" width. Perfect for contemporary style.',
    colors: ['Black', 'Navy', 'Burgundy', 'Red', 'Pink', 'Light Blue', 'Silver', 'Gold'],
    customizable: true,
    metadata: {
      width: '2.25 inches',
      material: 'Silk blend'
    }
  },
  {
    id: 'tie-skinny',
    name: 'Skinny Tie (2.75")',
    category: 'ties',
    subcategory: 'skinny',
    stripePriceId: 'price_1RpvHyCHc12x7sCzjX1WV931',
    price: 29.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    description: 'Trendy skinny tie, 2.75" width. Ideal for modern formal wear.',
    colors: ['Black', 'Navy', 'Burgundy', 'Red', 'Pink', 'Light Blue', 'Silver', 'Gold'],
    customizable: true,
    metadata: {
      width: '2.75 inches',
      material: 'Silk blend'
    }
  },
  {
    id: 'tie-classic',
    name: 'Classic Width Tie (3.25")',
    category: 'ties',
    subcategory: 'classic',
    stripePriceId: 'price_1RpvI9CHc12x7sCzE8Q9emhw',
    price: 29.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    description: 'Traditional classic tie, 3.25" width. Timeless professional choice.',
    colors: ['Black', 'Navy', 'Burgundy', 'Red', 'Pink', 'Light Blue', 'Silver', 'Gold', 'Hunter Green', 'Royal Blue'],
    customizable: true,
    metadata: {
      width: '3.25 inches',
      material: 'Silk blend'
    }
  },
  {
    id: 'tie-bowtie',
    name: 'Pre-tied Bow Tie',
    category: 'ties',
    subcategory: 'bowtie',
    stripePriceId: 'price_1RpvIMCHc12x7sCzj6ZTx21q',
    price: 29.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    description: 'Elegant pre-tied bow tie with adjustable neck strap.',
    colors: ['Black', 'Navy', 'Burgundy', 'Red', 'White', 'Silver'],
    customizable: true,
    metadata: {
      style: 'Pre-tied',
      adjustable: true
    }
  }
];

// ============================================
// TIE BUNDLES - 3 Core Products
// ============================================

export const tieBundles: CoreProduct[] = [
  {
    id: 'tie-bundle-5',
    name: '5-Tie Bundle',
    category: 'tie-bundles',
    stripePriceId: 'price_1RpvQqCHc12x7sCzfRrWStZb',
    price: 119.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    description: 'Buy 4 ties, get 1 free! Mix and match any colors and styles.',
    metadata: {
      savings: 29.99,
      quantity: 5,
      deal: 'Buy 4 Get 1 Free'
    }
  },
  {
    id: 'tie-bundle-8',
    name: '8-Tie Bundle',
    category: 'tie-bundles',
    stripePriceId: 'price_1RpvRACHc12x7sCzVYFZh6Ia',
    price: 179.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/8-tie-bundle.jpg',
    description: 'Buy 6 ties, get 2 free! Build your complete tie collection.',
    metadata: {
      savings: 59.98,
      quantity: 8,
      deal: 'Buy 6 Get 2 Free'
    }
  },
  {
    id: 'tie-bundle-11',
    name: '11-Tie Bundle',
    category: 'tie-bundles',
    stripePriceId: 'price_1RpvRSCHc12x7sCzpo0fgH6A',
    price: 239.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/11-tie-bundle.jpg',
    description: 'Buy 8 ties, get 3 free! The ultimate tie collection.',
    metadata: {
      savings: 89.97,
      quantity: 11,
      deal: 'Buy 8 Get 3 Free'
    }
  }
];

// ============================================
// DRESS SHIRTS - 2 Core Products (Dynamic Color Selection)
// ============================================

export const coreShirts: CoreProduct[] = [
  {
    id: 'shirt-slim',
    name: 'Slim Cut Dress Shirt',
    category: 'shirts',
    subcategory: 'slim-fit',
    stripePriceId: 'price_1RpvWnCHc12x7sCzzioA64qD',
    price: 69.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/slim-fit-collection.jpg',
    description: 'Modern slim fit dress shirt with tapered cut for a contemporary silhouette.',
    sizes: SHIRT_SIZES,
    colors: ['White', 'Light Blue', 'Pink', 'Black', 'Navy', 'Grey', 'Lilac'],
    customizable: true,
    metadata: {
      fit: 'Slim',
      material: 'Cotton blend',
      collar: 'Spread collar'
    }
  },
  {
    id: 'shirt-classic',
    name: 'Classic Fit Dress Shirt',
    category: 'shirts',
    subcategory: 'classic-fit',
    stripePriceId: 'price_1RpvXACHc12x7sCz2Ngkmp64',
    price: 69.99,
    imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/classic-fit-collection.jpg',
    description: 'Traditional classic fit dress shirt with comfortable room through chest and waist.',
    sizes: SHIRT_SIZES,
    colors: ['White', 'Light Blue', 'Pink', 'Black', 'Navy', 'Grey', 'Lilac'],
    customizable: true,
    metadata: {
      fit: 'Classic',
      material: 'Cotton blend',
      collar: 'Spread collar'
    }
  }
];

// ============================================
// ALL CORE PRODUCTS COMBINED
// ============================================

export const allCoreProducts: CoreProduct[] = [
  ...coreSuits,
  ...coreTies,
  ...tieBundles,
  ...coreShirts
];

// Helper functions
export function getCoreProductById(id: string): CoreProduct | undefined {
  return allCoreProducts.find(product => product.id === id);
}

export function getCoreProductsByCategory(category: CoreProduct['category']): CoreProduct[] {
  return allCoreProducts.filter(product => product.category === category);
}

export function getCoreProductByStripeId(stripePriceId: string): CoreProduct | undefined {
  return allCoreProducts.find(product => product.stripePriceId === stripePriceId);
}

// Export totals for reference
export const CORE_PRODUCT_TOTALS = {
  suits: coreSuits.length,           // 28 products
  ties: coreTies.length,              // 4 products
  tieBundles: tieBundles.length,      // 3 products
  shirts: coreShirts.length,          // 2 products
  total: allCoreProducts.length       // 37 total core products
};