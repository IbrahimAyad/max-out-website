// Static Stripe product and price IDs
// This file contains only client-safe data - no Stripe SDK initialization

export const stripeProducts = {
  suits: {
    navy: { 
      productId: 'prod_SlQuqaI2IR6FRm', 
      twoPiece: 'price_1Rpv2tCHc12x7sCzVvLRto3m', 
      threePiece: 'price_1Rpv31CHc12x7sCzlFtlUflr' 
    },
    beige: { 
      productId: 'prod_SlRx1FInciqpks', 
      twoPiece: 'price_1Rpv3FCHc12x7sCzg9nHaXkM', 
      threePiece: 'price_1Rpv3QCHc12x7sCzMVTfaqEE' 
    },
    black: { 
      productId: 'prod_SlRxbBl5ZnnoDy', 
      twoPiece: 'price_1RqeTbCHc12x7sCzWJsI2iDF', 
      threePiece: 'price_1Rf2leCHc12x7sCze2X4icnL' 
    },
    charcoalGrey: { 
      productId: 'prod_SlRy6SLQKpwQfz', 
      twoPiece: 'price_1Rpv4sCHc12x7sCzgMUu7hLq', 
      threePiece: 'price_1Rpv4zCHc12x7sCzerWp2R07' 
    },
    lightGrey: { 
      productId: 'prod_SlRyHCJXMJlqxo', 
      twoPiece: 'price_1Rpv6WCHc12x7sCzDJI7Ypav', 
      threePiece: 'price_1Rpv6dCHc12x7sCz3JOmrvuA' 
    },
    tan: { 
      productId: 'prod_SlRyRLJtIYIdyA', 
      twoPiece: 'price_1Rpv7dCHc12x7sCzoWrXk2Ot', 
      threePiece: 'price_1Rpv7mCHc12x7sCzixeUm5ep' 
    },
    brown: { 
      productId: 'prod_SlRyYQl1s5RVJP', 
      twoPiece: 'price_1Rpv3zCHc12x7sCzKMSpA4hP', 
      threePiece: 'price_1Rpv4ECHc12x7sCzhUuL9uCE' 
    },
    darkBrown: { 
      productId: 'prod_SlRydJMwdvBUkG', 
      twoPiece: 'price_1Rpv5DCHc12x7sCzdWjcaCY4', 
      threePiece: 'price_1Rpv5JCHc12x7sCzPd619lQ8' 
    },
    burgundy: { 
      productId: 'prod_SlRymQ4V8R4bkm', 
      twoPiece: 'price_1Rpv4XCHc12x7sCzSC3Mbtey', 
      threePiece: 'price_1Rpv4eCHc12x7sCzwbuknObE' 
    },
    sand: { 
      productId: 'prod_SlRyypASPU3cOA', 
      twoPiece: 'price_1Rpv7GCHc12x7sCzV9qUCc7I', 
      threePiece: 'price_1Rpv7PCHc12x7sCzbXQ9a1MG' 
    },
    emerald: { 
      productId: 'prod_SlRz7vOgZRdcYF', 
      twoPiece: 'price_1Rpv5XCHc12x7sCzzP57OQvP', 
      threePiece: 'price_1Rpv5eCHc12x7sCzIAVMbB7m' 
    },
    midnightBlue: { 
      productId: 'prod_SlRzE9fW3rNVdh', 
      twoPiece: 'price_1Rpv6sCHc12x7sCz6OZIkTR2', 
      threePiece: 'price_1Rpv6yCHc12x7sCz1LFaN5gS' 
    },
    hunterGreen: { 
      productId: 'prod_SlRzMHHbuMKaHV', 
      twoPiece: 'price_1Rpv5vCHc12x7sCzAlFuGQNL', 
      threePiece: 'price_1Rpv61CHc12x7sCzIboI1eC8' 
    },
    indigo: { 
      productId: 'prod_SlRzUCPxiGejzx', 
      twoPiece: 'price_1Rpv6ECHc12x7sCz7JjWOP0p', 
      threePiece: 'price_1Rpv6KCHc12x7sCzzaFWFxef' 
    },
  },
};

// Available sizes for products
export const availableSizes = {
  suits: [
    '34S', '34R',
    '36S', '36R',
    '38S', '38R', '38L',
    '40S', '40R', '40L',
    '42S', '42R', '42L',
    '44S', '44R', '44L',
    '46S', '46R', '46L',
    '48S', '48R', '48L',
    '50S', '50R', '50L',
    '52R', '52L',
    '54R', '54L'
  ],
  shirts: ['14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18'],
};

// Available tie colors
export const tieColors = {
  blues: ['Navy Blue', 'Royal Blue', 'Tiffany Blue', 'Sky Blue', 'Steel Blue', 'Powder Blue', 'Midnight Blue', 'Cornflower Blue', 'Periwinkle', 'Cerulean', 'Cobalt Blue', 'Electric Blue', 'Sapphire', 'Turquoise', 'Aquamarine', 'Cadet Blue', 'Slate Blue', 'Dodger Blue'],
  reds: ['Crimson Red', 'Wine Red', 'Cherry Red', 'Burgundy', 'Coral Red', 'Rose Red', 'Maroon', 'Scarlet', 'Ruby Red', 'Brick Red', 'Fire Engine Red', 'Cardinal Red'],
  greens: ['Forest Green', 'Emerald Green', 'Sage Green', 'Mint Green', 'Hunter Green', 'Olive Green', 'Sea Green', 'Lime Green', 'Pine Green', 'Kelly Green'],
  purples: ['Royal Purple', 'Lavender', 'Violet', 'Plum', 'Amethyst', 'Eggplant', 'Mauve', 'Orchid'],
  yellowsGolds: ['Golden Yellow', 'Mustard Yellow', 'Lemon Yellow', 'Champagne', 'Amber', 'Canary Yellow', 'Saffron', 'Honey'],
  oranges: ['Burnt Orange', 'Tangerine', 'Peach', 'Copper', 'Rust', 'Apricot'],
  pinks: ['Blush Pink', 'Rose Pink', 'Dusty Rose', 'Hot Pink', 'Salmon Pink', 'Magenta'],
  neutrals: ['Charcoal Gray', 'Silver Gray', 'Champagne Beige', 'Taupe', 'Cream', 'Ivory', 'Platinum', 'Pearl'],
};

// Note: Server-side Stripe functions have been moved to API routes
// Use these endpoints instead:
// - POST /api/stripe/products - for fetching products from Stripe
// - POST /api/stripe/checkout - for creating checkout sessions