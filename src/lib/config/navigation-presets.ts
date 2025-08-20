// Navigation links using the unified shop filter system
// All links route to /products with preset filters

export interface NavigationLink {
  label: string;
  href: string;
  icon?: string;
  description?: string;
  featured?: boolean;
}

export interface NavigationCategory {
  title: string;
  links: NavigationLink[];
}

// Main navigation structure with preset URLs
export const navigationConfig: NavigationCategory[] = [
  {
    title: 'Shop by Category',
    links: [
      {
        label: 'Complete Looks',
        href: '/products?type=bundle',
        icon: '👔',
        description: 'Professionally styled suits, shirts & ties',
        featured: true
      },
      {
        label: 'Suits',
        href: '/products?category=suits',
        icon: '🎩',
        description: 'Two-piece and three-piece suits'
      },
      {
        label: 'Tuxedos',
        href: '/products?category=tuxedos&preset=black-tie',
        icon: '🎭',
        description: 'Formal evening wear'
      },
      {
        label: 'Shirts',
        href: '/products?category=shirts',
        icon: '👔',
        description: 'Dress shirts and casual shirts'
      },
      {
        label: 'Accessories',
        href: '/products?category=ties,bowties,cummerbunds,suspenders',
        icon: '🎀',
        description: 'Ties, bowties, and more'
      },
      {
        label: 'Shoes',
        href: '/products?category=shoes,footwear',
        icon: '👞',
        description: 'Dress shoes and formal footwear'
      }
    ]
  },
  {
    title: 'Shop by Occasion',
    links: [
      {
        label: 'Black Tie Events',
        href: '/products?preset=black-tie',
        icon: '🎩',
        description: 'Tuxedos and formal evening wear',
        featured: true
      },
      {
        label: 'Wedding Guest',
        href: '/products?preset=wedding-guest',
        icon: '💒',
        description: 'Perfect attire for wedding celebrations'
      },
      {
        label: 'Business Professional',
        href: '/products?preset=business-professional',
        icon: '💼',
        description: 'Office-ready suits and separates'
      },
      {
        label: 'Prom 2025',
        href: '/products?preset=prom-special',
        icon: '🌟',
        description: 'Stand out at your prom',
        featured: true
      },
      {
        label: 'Cocktail Parties',
        href: '/products?occasions=cocktail,party&includeBundles=true',
        icon: '🍸',
        description: 'Smart casual to semi-formal'
      },
      {
        label: 'Summer Events',
        href: '/products?preset=summer-wedding',
        icon: '☀️',
        description: 'Light colors and breathable fabrics'
      }
    ]
  },
  {
    title: 'Shop by Style',
    links: [
      {
        label: 'Modern & Bold',
        href: '/products?preset=bold-statement',
        icon: '🔥',
        description: 'Contemporary cuts and colors'
      },
      {
        label: 'Classic Elegance',
        href: '/products?preset=classic-elegance',
        icon: '👔',
        description: 'Timeless traditional styles'
      },
      {
        label: 'All Black',
        href: '/products?preset=all-black',
        icon: '⚫',
        description: 'Sophisticated black suits and tuxedos'
      },
      {
        label: 'Navy Collection',
        href: '/products?preset=navy-collection',
        icon: '🔷',
        description: 'Versatile navy suits and blazers'
      },
      {
        label: 'Three-Piece Suits',
        href: '/products?preset=three-piece',
        icon: '🎭',
        description: 'Complete with matching vests'
      },
      {
        label: 'Velvet Luxury',
        href: '/products?preset=velvet-luxe',
        icon: '✨',
        description: 'Luxurious velvet blazers and suits'
      }
    ]
  },
  {
    title: 'Shop by Price',
    links: [
      {
        label: '$199 Complete Looks',
        href: '/products?preset=complete-looks-199',
        icon: '💰',
        description: 'Best value bundles',
        featured: true
      },
      {
        label: 'Premium Bundles',
        href: '/products?preset=premium-bundles',
        icon: '👑',
        description: 'Executive and premium collections'
      },
      {
        label: 'Under $200',
        href: '/products?maxPrice=200',
        icon: '🏷️',
        description: 'Budget-friendly options'
      },
      {
        label: '$200-$300',
        href: '/products?minPrice=200&maxPrice=300',
        icon: '💵',
        description: 'Mid-range suits and bundles'
      },
      {
        label: 'Over $500',
        href: '/products?minPrice=500',
        icon: '💎',
        description: 'Luxury suits and tuxedos'
      },
      {
        label: 'On Sale',
        href: '/products?onSale=true',
        icon: '🔖',
        description: 'Special offers and discounts'
      }
    ]
  },
  {
    title: 'Seasonal Collections',
    links: [
      {
        label: 'Spring Collection',
        href: '/products?seasonal=spring',
        icon: '🌸',
        description: 'Light colors for spring'
      },
      {
        label: 'Summer Weddings',
        href: '/products?preset=summer-wedding',
        icon: '☀️',
        description: 'Breathable fabrics and light tones'
      },
      {
        label: 'Fall Formal',
        href: '/products?preset=fall-formal',
        icon: '🍂',
        description: 'Rich autumn colors and textures'
      },
      {
        label: 'Winter Collection',
        href: '/products?seasonal=winter',
        icon: '❄️',
        description: 'Warm fabrics and darker tones'
      },
      {
        label: 'Holiday Parties',
        href: '/products?occasions=holiday,party&material=velvet',
        icon: '🎄',
        description: 'Festive suits and blazers'
      },
      {
        label: 'New Arrivals',
        href: '/products?newArrivals=true',
        icon: '✨',
        description: 'Latest additions to our collection'
      }
    ]
  },
  {
    title: 'Quick Links',
    links: [
      {
        label: 'Trending Now',
        href: '/products?trending=true&sort=trending',
        icon: '📈',
        description: 'Most popular items',
        featured: true
      },
      {
        label: 'AI Picks for You',
        href: '/products?sort=ai-score&minAiScore=85',
        icon: '🤖',
        description: 'Smart recommendations'
      },
      {
        label: 'Complete Your Look',
        href: '/products?type=bundle&sort=price-asc',
        icon: '🎯',
        description: 'All-in-one outfit solutions'
      },
      {
        label: 'Last Chance',
        href: '/products?stockLevel=low',
        icon: '⏰',
        description: 'Limited availability items'
      },
      {
        label: 'Gift Ideas',
        href: '/products?occasions=gift,special&type=bundle',
        icon: '🎁',
        description: 'Perfect gifts for him'
      },
      {
        label: 'Size Guide',
        href: '/size-guide',
        icon: '📏',
        description: 'Find your perfect fit'
      }
    ]
  }
];

// Footer navigation with preset URLs
export const footerNavigation = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Complete Looks', href: '/products?type=bundle' },
    { label: 'Suits', href: '/products?category=suits' },
    { label: 'Tuxedos', href: '/products?preset=black-tie' },
    { label: 'Accessories', href: '/products?category=ties,bowties' },
    { label: 'On Sale', href: '/products?onSale=true' }
  ],
  occasions: [
    { label: 'Weddings', href: '/products?preset=wedding-guest' },
    { label: 'Business', href: '/products?preset=business-professional' },
    { label: 'Black Tie', href: '/products?preset=black-tie' },
    { label: 'Prom', href: '/products?preset=prom-special' },
    { label: 'Cocktail', href: '/products?occasions=cocktail' },
    { label: 'Casual', href: '/products?occasions=casual' }
  ],
  bundles: [
    { label: '$199 Bundles', href: '/products?preset=complete-looks-199' },
    { label: 'Professional ($229)', href: '/products?bundleTier=professional' },
    { label: 'Executive ($249)', href: '/products?bundleTier=executive' },
    { label: 'Premium ($299)', href: '/products?bundleTier=premium' },
    { label: 'View All Bundles', href: '/products?type=bundle' }
  ],
  help: [
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Style Guide', href: '/style-guide' },
    { label: 'Care Instructions', href: '/care' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Contact Us', href: '/contact' }
  ]
};

// Mobile navigation with preset URLs
export const mobileNavigation = [
  {
    label: 'Shop All',
    href: '/products',
    icon: '🛍️'
  },
  {
    label: 'Complete Looks',
    href: '/products?type=bundle',
    icon: '👔',
    featured: true
  },
  {
    label: 'Wedding Guest',
    href: '/products?preset=wedding-guest',
    icon: '💒'
  },
  {
    label: 'Business',
    href: '/products?preset=business-professional',
    icon: '💼'
  },
  {
    label: 'Prom 2025',
    href: '/products?preset=prom-special',
    icon: '🌟',
    featured: true
  },
  {
    label: 'Black Tie',
    href: '/products?preset=black-tie',
    icon: '🎩'
  },
  {
    label: '$199 Deals',
    href: '/products?preset=complete-looks-199',
    icon: '💰',
    featured: true
  },
  {
    label: 'Trending',
    href: '/products?trending=true',
    icon: '📈'
  }
];

// Header mega menu configuration
export const megaMenuConfig = {
  suits: {
    title: 'Suits & Tuxedos',
    featured: {
      title: 'Featured Collection',
      items: [
        {
          label: 'Complete Styled Looks',
          href: '/products?type=bundle',
          image: '/images/bundle-preview.jpg',
          price: 'From $199'
        },
        {
          label: 'Black Tie Collection',
          href: '/products?preset=black-tie',
          image: '/images/tuxedo-preview.jpg',
          price: 'Premium Tuxedos'
        }
      ]
    },
    categories: [
      {
        title: 'By Style',
        links: [
          { label: 'All Suits', href: '/products?category=suits' },
          { label: 'Two-Piece', href: '/products?category=suits&suitType=2-piece' },
          { label: 'Three-Piece', href: '/products?preset=three-piece' },
          { label: 'Tuxedos', href: '/products?category=tuxedos' },
          { label: 'Double Breasted', href: '/products?style=double-breasted' }
        ]
      },
      {
        title: 'By Color',
        links: [
          { label: 'Black Suits', href: '/products?category=suits&color=black' },
          { label: 'Navy Suits', href: '/products?category=suits&color=navy' },
          { label: 'Grey Suits', href: '/products?category=suits&color=grey' },
          { label: 'Blue Suits', href: '/products?category=suits&color=blue' },
          { label: 'Burgundy Suits', href: '/products?category=suits&color=burgundy' }
        ]
      },
      {
        title: 'By Occasion',
        links: [
          { label: 'Wedding Suits', href: '/products?category=suits&occasions=wedding' },
          { label: 'Business Suits', href: '/products?category=suits&occasions=business' },
          { label: 'Prom Suits', href: '/products?category=suits&occasions=prom' },
          { label: 'Cocktail Attire', href: '/products?occasions=cocktail' }
        ]
      }
    ]
  },
  bundles: {
    title: 'Complete Looks',
    featured: {
      title: 'Bundle & Save',
      items: [
        {
          label: 'Starter Bundles',
          href: '/products?preset=complete-looks-199',
          image: '/images/starter-bundle.jpg',
          price: '$199'
        },
        {
          label: 'Premium Bundles',
          href: '/products?preset=premium-bundles',
          image: '/images/premium-bundle.jpg',
          price: '$249-$299'
        }
      ]
    },
    categories: [
      {
        title: 'By Price',
        links: [
          { label: 'All Bundles', href: '/products?type=bundle' },
          { label: '$199 Bundles', href: '/products?bundleTier=starter' },
          { label: '$229 Bundles', href: '/products?bundleTier=professional' },
          { label: '$249 Bundles', href: '/products?bundleTier=executive' },
          { label: '$299 Bundles', href: '/products?bundleTier=premium' }
        ]
      },
      {
        title: 'By Occasion',
        links: [
          { label: 'Wedding Bundles', href: '/products?type=bundle&occasions=wedding' },
          { label: 'Business Bundles', href: '/products?type=bundle&occasions=business' },
          { label: 'Prom Bundles', href: '/products?type=bundle&occasions=prom' },
          { label: 'Black Tie Bundles', href: '/products?type=bundle&occasions=black-tie' }
        ]
      }
    ]
  }
};

// Get navigation link by preset
export function getNavigationLinkForPreset(presetId: string): string {
  return `/products?preset=${presetId}`;
}

// Get navigation link for category
export function getNavigationLinkForCategory(category: string): string {
  return `/products?category=${category}`;
}

// Get navigation link for filters
export function getNavigationLinkForFilters(filters: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, value.toString());
      }
    }
  });
  return `/products?${params.toString()}`;
}