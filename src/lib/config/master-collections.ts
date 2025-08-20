// Master Collections Configuration
// These are the main collection pages with their sub-collections as filters

export interface SubCollection {
  id: string;
  name: string;
  filterParams: {
    categories?: string[];
    tags?: string[];
    priceRange?: { min: number; max: number };
  };
  image?: string;
  count?: number;
}

export interface MasterCollection {
  id: string;
  name: string;
  route: string;
  description: string;
  heroImage?: string;
  subCollections: SubCollection[];
}

export const masterCollections: MasterCollection[] = [
  {
    id: 'suits',
    name: 'Suits Collection',
    route: '/collections/suits',
    description: 'Premium suits for every occasion - from business to black tie',
    subCollections: [
      {
        id: 'all-suits',
        name: 'All Suits',
        filterParams: {
          categories: ['Classic 2-Piece Suits', 'Classic 3-Piece Suits', 'Double Breasted Suits', 'Slim Fit Suits', 'Modern Fit Suits']
        },
        count: 89
      },
      {
        id: '2-piece',
        name: '2-Piece Suits',
        filterParams: {
          categories: ['Classic 2-Piece Suits'],
          tags: ['2-piece']
        },
        count: 24
      },
      {
        id: '3-piece',
        name: '3-Piece Suits',
        filterParams: {
          categories: ['Classic 3-Piece Suits'],
          tags: ['3-piece']
        },
        count: 24
      },
      {
        id: 'tuxedos',
        name: 'Tuxedos',
        filterParams: {
          categories: ['Tuxedos', 'Dinner Jackets'],
          tags: ['tuxedo', 'black-tie']
        },
        count: 18
      },
      {
        id: 'blazers',
        name: 'Blazers & Sport Coats',
        filterParams: {
          categories: ['Blazers', 'Sport Coats'],
          tags: ['blazer', 'sport-coat']
        },
        count: 32
      },
      {
        id: 'velvet',
        name: 'Velvet Collection',
        filterParams: {
          categories: ['Blazers', 'Sport Coats'],
          tags: ['velvet', 'luxury']
        },
        count: 12
      }
    ]
  },
  {
    id: 'wedding',
    name: 'Wedding Collection',
    route: '/collections/wedding',
    description: 'Elegant wedding attire for grooms, groomsmen, and guests',
    subCollections: [
      {
        id: 'all-wedding',
        name: 'All Wedding',
        filterParams: {
          categories: ['Suits', 'Tuxedos', 'Formal Suits', 'Premium Suits', 'Ties', 'Bow Ties'],
          tags: ['wedding', 'wedding-guest', 'formal', 'special-occasion']
        },
        count: 126
      },
      {
        id: 'groom-suits',
        name: 'Groom Suits',
        filterParams: {
          categories: ['Classic 3-Piece Suits', 'Tuxedos'],
          tags: ['groom', 'wedding']
        },
        count: 42
      },
      {
        id: 'groomsmen',
        name: 'Groomsmen Attire',
        filterParams: {
          categories: ['Classic 2-Piece Suits', 'Classic 3-Piece Suits'],
          tags: ['groomsmen', 'wedding-party']
        },
        count: 36
      },
      {
        id: 'wedding-guest',
        name: 'Wedding Guest',
        filterParams: {
          categories: ['Classic 2-Piece Suits'],
          tags: ['wedding-guest', 'semi-formal']
        },
        count: 28
      },
      {
        id: 'black-tie',
        name: 'Black Tie',
        filterParams: {
          categories: ['Tuxedos', 'Dinner Jackets'],
          tags: ['black-tie', 'formal']
        },
        count: 20
      },
      {
        id: 'wedding-accessories',
        name: 'Wedding Accessories',
        filterParams: {
          categories: ['Ties', 'Bow Ties', 'Pocket Squares'],
          tags: ['wedding', 'accessories']
        },
        count: 45
      }
    ]
  },
  {
    id: 'prom',
    name: 'Prom 2025',
    route: '/collections/prom',
    description: 'Stand out at prom with our latest styles and trending colors',
    subCollections: [
      {
        id: 'all-prom',
        name: 'All Prom',
        filterParams: {
          // Use broader categories that actually exist in database
          categories: ['Suits', 'Tuxedos', 'Blazers', 'Formal Suits', 'Premium Suits'],
          tags: ['prom', 'prom-2025', 'tuxedo', 'formal', 'special-occasion']
        },
        count: 98
      },
      {
        id: 'prom-tuxedos',
        name: 'Prom Tuxedos',
        filterParams: {
          categories: ['Formal Tuxedos'],
          tags: ['prom', 'tuxedo', 'prom tuxedo']
        },
        count: 24
      },
      {
        id: 'sparkle-blazers',
        name: 'Sparkle Blazers',
        filterParams: {
          categories: ['Blazers'],
          tags: ['sparkle', 'sequin', 'prom']
        },
        count: 18
      },
      {
        id: 'colored-suits',
        name: 'Colored Suits',
        filterParams: {
          categories: ['Slim Fit Suits', 'Modern Fit Suits'],
          tags: ['colored', 'bold', 'prom']
        },
        count: 32
      },
      {
        id: 'prom-shoes',
        name: 'Prom Shoes',
        filterParams: {
          categories: ['Dress Shoes', 'Formal Shoes'],
          tags: ['prom', 'shoes']
        },
        count: 24
      }
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    route: '/collections/accessories',
    description: 'Complete your look with our premium accessories',
    subCollections: [
      {
        id: 'all-accessories',
        name: 'All Accessories',
        filterParams: {
          categories: ['Ties', 'Bow Ties', 'Pocket Squares', 'Cufflinks', 'Belts', 'Suspenders'],
          tags: ['ties', 'bow-ties', 'pocket-squares', 'accessories']
        },
        count: 193
      },
      {
        id: 'ties',
        name: 'Ties',
        filterParams: {
          categories: ['Ties'],
          tags: ['tie', 'necktie']
        },
        count: 68
      },
      {
        id: 'bow-ties',
        name: 'Bow Ties',
        filterParams: {
          categories: ['Bow Ties'],
          tags: ['bowtie', 'bow-tie']
        },
        count: 32
      },
      {
        id: 'vest-tie-sets',
        name: 'Vest & Tie Sets',
        filterParams: {
          categories: ['Vest Sets'],
          tags: ['vest-set', 'vest-tie']
        },
        count: 48
      },
      {
        id: 'suspender-sets',
        name: 'Suspender & Bowtie',
        filterParams: {
          categories: ['Suspenders'],
          tags: ['suspender-set', 'suspenders']
        },
        count: 28
      },
      {
        id: 'pocket-squares',
        name: 'Pocket Squares',
        filterParams: {
          categories: ['Pocket Squares'],
          tags: ['pocket-square', 'handkerchief']
        },
        count: 24
      }
    ]
  },
  {
    id: 'business-casual',
    name: 'Business & Casual',
    route: '/collections/business',
    description: 'From boardroom to date night - versatile styles for every occasion',
    subCollections: [
      {
        id: 'all-business',
        name: 'All Business & Casual',
        filterParams: {
          categories: ['Classic 2-Piece Suits', 'Dress Shirts', 'Dress Pants', 'Sport Coats', 'Blazers', 'Casual Shirts'],
          tags: ['business', 'professional', 'casual', 'smart-casual']
        },
        count: 156
      },
      {
        id: 'business-formal',
        name: 'Business Formal',
        filterParams: {
          categories: ['Classic 2-Piece Suits', 'Dress Shirts'],
          tags: ['business', 'professional', 'office']
        },
        count: 48
      },
      {
        id: 'business-casual',
        name: 'Business Casual',
        filterParams: {
          categories: ['Sport Coats', 'Dress Pants', 'Casual Shirts'],
          tags: ['business-casual', 'smart-casual']
        },
        count: 36
      },
      {
        id: 'cocktail',
        name: 'Cocktail Party',
        filterParams: {
          categories: ['Sport Coats', 'Blazers'],
          tags: ['cocktail', 'semi-formal', 'party']
        },
        count: 28
      },
      {
        id: 'date-night',
        name: 'Date Night',
        filterParams: {
          categories: ['Casual Shirts', 'Sport Coats'],
          tags: ['date-night', 'casual', 'romantic']
        },
        count: 24
      },
      {
        id: 'shirts',
        name: 'Shirts',
        filterParams: {
          categories: ['Dress Shirts', 'Casual Shirts'],
          tags: ['shirt']
        },
        count: 124
      }
    ]
  },
  {
    id: 'complete-looks',
    name: 'Complete Looks',
    route: '/collections/complete-looks',
    description: 'Pre-styled outfits and bundles - everything you need in one click',
    subCollections: [
      {
        id: 'all-bundles',
        name: 'All Complete Looks',
        filterParams: {
          categories: ['Bundles', 'Complete Outfits'],
          tags: ['bundle', 'complete-look', 'outfit']
        },
        count: 66
      },
      {
        id: 'starter-bundles',
        name: 'Starter Bundles',
        filterParams: {
          tags: ['bundle', 'starter'],
          priceRange: { min: 150, max: 250 }
        },
        count: 18
      },
      {
        id: 'professional-bundles',
        name: 'Professional Bundles',
        filterParams: {
          tags: ['bundle', 'professional'],
          priceRange: { min: 250, max: 350 }
        },
        count: 16
      },
      {
        id: 'executive-bundles',
        name: 'Executive Bundles',
        filterParams: {
          tags: ['bundle', 'executive'],
          priceRange: { min: 350, max: 500 }
        },
        count: 14
      },
      {
        id: 'wedding-bundles',
        name: 'Wedding Bundles',
        filterParams: {
          tags: ['bundle', 'wedding', 'complete-look']
        },
        count: 12
      },
      {
        id: 'prom-bundles',
        name: 'Prom Bundles',
        filterParams: {
          tags: ['bundle', 'prom', 'complete-look']
        },
        count: 10
      }
    ]
  }
];

// Helper function to get master collection by ID
export function getMasterCollection(id: string): MasterCollection | undefined {
  return masterCollections.find(mc => mc.id === id);
}

// Helper function to get sub-collection filters
export function getSubCollectionFilters(masterId: string, subId: string) {
  const master = getMasterCollection(masterId);
  if (!master) return null;
  
  const sub = master.subCollections.find(sc => sc.id === subId);
  return sub?.filterParams || null;
}

// Helper function to build URL with filters
export function buildCollectionUrl(masterId: string, subId?: string): string {
  const master = getMasterCollection(masterId);
  if (!master) return '/collections';
  
  if (!subId || subId === `all-${masterId}`) {
    return master.route;
  }
  
  return `${master.route}?filter=${subId}`;
}

// Enhanced filter preset function for smart routing
export function getSmartFilters(masterId: string, subId: string) {
  const filters = getSubCollectionFilters(masterId, subId);
  if (!filters) return null;
  
  return {
    categories: filters.categories || [],
    tags: filters.tags || [],
    priceRange: filters.priceRange || null,
    // Generate API-ready filter object
    toApiParams: () => ({
      categories: filters.categories,
      tags: filters.tags,
      minPrice: filters.priceRange?.min,
      maxPrice: filters.priceRange?.max
    })
  };
}

// Helper to get all available filter options for a collection
export function getCollectionFilterOptions(masterId: string) {
  const master = getMasterCollection(masterId);
  if (!master) return null;
  
  const allCategories = new Set<string>();
  const allTags = new Set<string>();
  let hasPrice = false;
  
  master.subCollections.forEach(sub => {
    sub.filterParams.categories?.forEach(cat => allCategories.add(cat));
    sub.filterParams.tags?.forEach(tag => allTags.add(tag));
    if (sub.filterParams.priceRange) hasPrice = true;
  });
  
  return {
    categories: Array.from(allCategories),
    tags: Array.from(allTags),
    hasPriceFilter: hasPrice,
    subCollections: master.subCollections.map(sub => ({
      id: sub.id,
      name: sub.name,
      count: sub.count
    }))
  };
}