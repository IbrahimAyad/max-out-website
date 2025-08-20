// Collection Mapping: Marketing Names → Database Categories
// This maps the homepage marketing categories to actual database product types

export interface CollectionMapping {
  id: string;
  marketingName: string;  // Display name on homepage
  dbCategories: string[];  // Actual database product_type values
  dbTags?: string[];       // Additional tags to filter by
  route: string;           // URL route
  description?: string;
  image: string;
  itemCount?: number;      // Override count if needed
}

export const collectionMappings: CollectionMapping[] = [
  // Row 1 - Main Categories
  {
    id: 'suits',
    marketingName: 'Suits',
    dbCategories: ['Classic 2-Piece Suits', 'Classic 3-Piece Suits', 'Double Breasted Suits', 'Slim Fit Suits', 'Modern Fit Suits'],
    route: '/collections/suits',
    description: 'Premium quality suits for every occasion',
    image: '/images/collections/suits.jpg',
    itemCount: 89
  },
  {
    id: 'shirts',
    marketingName: 'Shirts',
    dbCategories: ['Dress Shirts', 'Casual Shirts', 'Formal Shirts', 'Tuxedo Shirts'],
    route: '/collections/shirts',
    description: 'Classic and modern shirt styles',
    image: '/images/collections/shirts.jpg',
    itemCount: 124
  },
  {
    id: 'vests',
    marketingName: 'Vest',
    dbCategories: ['Vests', 'Vest Sets', 'Suit Vests', 'Formal Vests'],
    dbTags: ['vest'],
    route: '/collections/vests',
    description: 'Elegant vests and waistcoats',
    image: '/images/collections/vests.jpg',
    itemCount: 52
  },
  {
    id: 'jackets',
    marketingName: 'Jackets',
    dbCategories: ['Sport Coats', 'Blazers', 'Dinner Jackets', 'Casual Jackets'],
    dbTags: ['jacket', 'blazer'],
    route: '/collections/jackets',
    description: 'Stylish jackets and blazers',
    image: '/images/collections/jackets.jpg',
    itemCount: 58
  },
  {
    id: 'pants',
    marketingName: 'Pants',
    dbCategories: ['Dress Pants', 'Suit Pants', 'Formal Trousers', 'Casual Pants'],
    dbTags: ['pants', 'trousers'],
    route: '/collections/pants',
    description: 'Perfect fit pants and trousers',
    image: '/images/collections/pants.jpg',
    itemCount: 76
  },
  {
    id: 'knitwear',
    marketingName: 'Knitwear',
    dbCategories: ['Sweaters', 'Cardigans', 'Knit Vests', 'Pullovers'],
    dbTags: ['knit', 'sweater'],
    route: '/collections/knitwear',
    description: 'Comfortable and stylish knitwear',
    image: '/images/collections/knitwear.jpg',
    itemCount: 45
  },
  {
    id: 'accessories',
    marketingName: 'Accessories',
    dbCategories: ['Ties', 'Bow Ties', 'Pocket Squares', 'Cufflinks', 'Belts', 'Suspenders'],
    dbTags: ['accessory', 'accessories'],
    route: '/collections/accessories',
    description: 'Complete your look with accessories',
    image: '/images/collections/accessories.jpg',
    itemCount: 93
  },
  {
    id: 'shoes',
    marketingName: 'Shoes',
    dbCategories: ['Dress Shoes', 'Formal Shoes', 'Casual Shoes', 'Loafers', 'Oxfords'],
    dbTags: ['shoes', 'footwear'],
    route: '/collections/shoes',
    description: 'Premium footwear collection',
    image: '/images/collections/shoes.jpg',
    itemCount: 67
  },
  {
    id: 'velvet-blazers',
    marketingName: 'Velvet Blazers',
    dbCategories: ['Blazers', 'Sport Coats'],
    dbTags: ['velvet', 'luxury', 'premium'],
    route: '/collections/velvet-blazers',
    description: 'Luxurious velvet blazers',
    image: '/images/collections/velvet-blazers.jpg',
    itemCount: 32
  },

  // Row 2 - Occasion/Style Categories
  {
    id: 'vest-tie-sets',
    marketingName: 'Vest & Tie',
    dbCategories: ['Vest Sets', 'Vests'],
    dbTags: ['vest-set', 'vest-tie-set'],
    route: '/collections/vest-tie-sets',
    description: 'Coordinated vest and tie combinations',
    image: '/images/collections/vest-tie.jpg',
    itemCount: 48
  },
  {
    id: 'complete-looks',
    marketingName: 'Complete Looks',
    dbCategories: ['Bundles', 'Complete Outfits'],
    dbTags: ['bundle', 'complete-look', 'outfit'],
    route: '/collections/complete-looks',
    description: 'Full outfit bundles',
    image: '/images/collections/complete-looks.jpg',
    itemCount: 66
  },
  {
    id: 'wedding-guest',
    marketingName: 'Wedding Guest',
    dbCategories: ['Classic 2-Piece Suits', 'Classic 3-Piece Suits'],
    dbTags: ['wedding', 'wedding-guest', 'formal'],
    route: '/collections/wedding-guest',
    description: 'Perfect attire for wedding guests',
    image: '/images/collections/wedding-guest.jpg'
  },
  {
    id: 'business',
    marketingName: 'Business',
    dbCategories: ['Classic 2-Piece Suits', 'Dress Shirts', 'Dress Pants'],
    dbTags: ['business', 'professional', 'office'],
    route: '/collections/business',
    description: 'Professional business attire',
    image: '/images/collections/business.jpg'
  },
  {
    id: 'black-tie',
    marketingName: 'Black Tie',
    dbCategories: ['Tuxedos', 'Dinner Jackets', 'Formal Suits'],
    dbTags: ['black-tie', 'formal', 'tuxedo'],
    route: '/collections/black-tie',
    description: 'Formal black tie attire',
    image: '/images/collections/black-tie.jpg'
  },
  {
    id: 'prom-2025',
    marketingName: 'Prom 2025',
    dbCategories: ['Tuxedos', 'Slim Fit Suits', 'Modern Fit Suits'],
    dbTags: ['prom', 'prom-2025', 'formal'],
    route: '/collections/prom',
    description: 'Latest prom styles for 2025',
    image: '/images/collections/prom-2025.jpg'
  },
  {
    id: 'cocktail-party',
    marketingName: 'Cocktail Party',
    dbCategories: ['Sport Coats', 'Blazers', 'Dress Shirts'],
    dbTags: ['cocktail', 'semi-formal', 'party'],
    route: '/collections/cocktail',
    description: 'Semi-formal cocktail attire',
    image: '/images/collections/cocktail.jpg'
  },
  {
    id: 'suspender-bowtie',
    marketingName: 'Suspender Bowtie',
    dbCategories: ['Accessories'],
    dbTags: ['suspenders', 'bowtie', 'suspender-set'],
    route: '/collections/suspender-bowtie',
    description: 'Classic suspender and bowtie sets',
    image: '/images/collections/suspender-bowtie.jpg',
    itemCount: 28
  },
  {
    id: 'date-night',
    marketingName: 'Date Night',
    dbCategories: ['Casual Shirts', 'Sport Coats', 'Casual Pants'],
    dbTags: ['casual', 'date-night', 'smart-casual'],
    route: '/collections/date-night',
    description: 'Stylish casual date night looks',
    image: '/images/collections/date-night.jpg'
  }
];

// Helper function to get database filters from marketing category
export function getDbFiltersFromMarketing(marketingId: string) {
  const mapping = collectionMappings.find(m => m.id === marketingId);
  if (!mapping) {
    return {
      categories: [],
      tags: []
    };
  }
  
  return {
    categories: mapping.dbCategories,
    tags: mapping.dbTags || []
  };
}

// Helper function to get all unique database categories
export function getAllDbCategories(): string[] {
  const categories = new Set<string>();
  collectionMappings.forEach(mapping => {
    mapping.dbCategories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories);
}

// Helper function to get collection by route
export function getCollectionByRoute(route: string): CollectionMapping | undefined {
  return collectionMappings.find(m => m.route === route);
}

// Helper function to get collection by ID
export function getCollectionById(id: string): CollectionMapping | undefined {
  return collectionMappings.find(m => m.id === id);
}