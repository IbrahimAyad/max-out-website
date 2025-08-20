/**
 * CORE PRODUCTS CONFIGURATION
 * These are the 28+ Stripe products that are NOT in Supabase
 * They use Stripe Price IDs directly for checkout
 * Already have working payment links and process payments successfully
 */

export interface CoreProduct {
  id: string;
  name: string;
  stripe_price_id: string;
  stripe_product_id?: string;
  price: number;
  category: string;
  product_type: 'core';
  image?: string;
  images?: string[];
  description?: string;
  customFields?: {
    size?: boolean;
    color?: boolean;
    fit?: boolean;
    selections?: boolean;
  };
}

// SUITS - 14 colors × 2 styles = 28 products
export const CORE_SUITS: CoreProduct[] = [
  // Navy Suit
  { 
    id: 'suit-navy-2p', 
    name: 'Navy Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv2tCHc12x7sCzVvLRto3m', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-2-maini.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/tie-shirt-navy-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-tie-shirt.jpg'
    ]
  },
  { 
    id: 'suit-navy-3p', 
    name: 'Navy Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv31CHc12x7sCzlFtlUflr', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-3-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-3-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-vest-tie-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-vest-tie-2.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg'
    ]
  },
  
  // Beige Suit
  { 
    id: 'suit-beige-2p', 
    name: 'Beige Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv3FCHc12x7sCzg9nHaXkM', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main.jpg'
  },
  { 
    id: 'suit-beige-3p', 
    name: 'Beige Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv3QCHc12x7sCzMVTfaqEE', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main-2.jpg'
  },
  
  // Black Suit
  { 
    id: 'suit-black-2p', 
    name: 'Black Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv3cCHc12x7sCzLtiatn73', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/front.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/detail-fabric.jpeg'
    ]
  },
  { 
    id: 'suit-black-3p', 
    name: 'Black Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv3iCHc12x7sCzJYg14SL8', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/blacksuit3p.jpeg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/blacksuit3p.jpeg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/front.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/detail-fabric.jpeg'
    ]
  },
  
  // Brown Suit
  { 
    id: 'suit-brown-2p', 
    name: 'Brown Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv3zCHc12x7sCzKMSpA4hP', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/dark-brown-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/dark-brown-main.jpg'
    ]
  },
  { 
    id: 'suit-brown-3p', 
    name: 'Brown Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv4ECHc12x7sCzhUuL9uCE', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/dark-brown-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/dark-brown-main.jpg'
    ]
  },
  
  // Burgundy Suit
  { 
    id: 'suit-burgundy-2p', 
    name: 'Burgundy Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv4XCHc12x7sCzSC3Mbtey', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/two-peice-main-bur.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/two-peice-main-bur.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/two-peice-bur-.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/open-but-main.jpg'
    ]
  },
  { 
    id: 'suit-burgundy-3p', 
    name: 'Burgundy Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv4eCHc12x7sCzwbuknObE', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/three-peice-burgundy-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/three-peice-burgundy-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/three-peice-burgundy-half.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/vest-tie-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/vest-tie-main-2.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/vest%2Btie%2Bpants%2Bbur.jpg'
    ]
  },
  
  // Charcoal Grey Suit
  { 
    id: 'suit-charcoal-2p', 
    name: 'Charcoal Grey Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv4sCHc12x7sCzgMUu7hLq', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-main-.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-main-two.jpg'
    ]
  },
  { 
    id: 'suit-charcoal-3p', 
    name: 'Charcoal Grey Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv4zCHc12x7sCzerWp2R07', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/vest-tie-dark-grey.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/vest-tie-dark-grey.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg'
    ]
  },
  
  // Dark Brown Suit
  { 
    id: 'suit-darkbrown-2p', 
    name: 'Dark Brown Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv5DCHc12x7sCzdWjcaCY4', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/dark-brown/brown-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/dark-brown/brown-main.jpg'
    ]
  },
  { 
    id: 'suit-darkbrown-3p', 
    name: 'Dark Brown Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv5JCHc12x7sCzPd619lQ8', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/dark-brown/brown-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/dark-brown/brown-main.jpg'
    ]
  },
  
  // Emerald Suit
  { 
    id: 'suit-emerald-2p', 
    name: 'Emerald Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv5XCHc12x7sCzzP57OQvP', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerlad-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerlad-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerland-main-2.jpg'
    ]
  },
  { 
    id: 'suit-emerald-3p', 
    name: 'Emerald Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv5eCHc12x7sCzIAVMbB7m', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerland-main-2.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerland-main-2.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerlad-main.jpg'
    ]
  },
  
  // Hunter Green Suit
  { 
    id: 'suit-hunter-2p', 
    name: 'Hunter Green Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv5vCHc12x7sCzAlFuGQNL', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-2-main.jpg'
    ]
  },
  { 
    id: 'suit-hunter-3p', 
    name: 'Hunter Green Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv61CHc12x7sCzIboI1eC8', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-2-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-2-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/hunter-green/hunter-main.jpg'
    ]
  },
  
  // Indigo Suit
  { 
    id: 'suit-indigo-2p', 
    name: 'Indigo Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv6ECHc12x7sCz7JjWOP0p', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main-2.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indio-on-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/shirt-tie-indigo-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/shirt-tie-indir-main.jpg'
    ]
  },
  { 
    id: 'suit-indigo-3p', 
    name: 'Indigo Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv6KCHc12x7sCzzaFWFxef', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main-2.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main-2.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/vest-tie-indigo-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main.jpg'
    ]
  },
  
  // Light Grey Suit
  { 
    id: 'suit-lightgrey-2p', 
    name: 'Light Grey Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv6WCHc12x7sCzDJI7Ypav', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-cloesd.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/shirt-tie-main.jpg'
    ]
  },
  { 
    id: 'suit-lightgrey-3p', 
    name: 'Light Grey Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv6dCHc12x7sCz3JOmrvuA', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/vest-shirt-tie-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/vest-shirt-tie-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg'
    ]
  },
  
  // Midnight Blue Suit
  { 
    id: 'suit-midnight-2p', 
    name: 'Midnight Blue Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv6sCHc12x7sCz6OZIkTR2', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-main-open.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-two-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-shirt-tie.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight%3Dblue%3Dmain.jpg'
    ]
  },
  { 
    id: 'suit-midnight-3p', 
    name: 'Midnight Blue Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv6yCHc12x7sCz1LFaN5gS', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-two-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-two-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/vest-tie-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-blue-main.jpg'
    ]
  },
  
  // Sand Suit
  { 
    id: 'suit-sand-2p', 
    name: 'Sand Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv7GCHc12x7sCzV9qUCc7I', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/sand/sand-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/sand/sand-main.jpg'
    ]
  },
  { 
    id: 'suit-sand-3p', 
    name: 'Sand Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv7PCHc12x7sCzbXQ9a1MG', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/sand/sand-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/sand/sand-main.jpg'
    ]
  },
  
  // Tan Suit
  { 
    id: 'suit-tan-2p', 
    name: 'Tan Suit - 2 Piece', 
    stripe_price_id: 'price_1Rpv7dCHc12x7sCzoWrXk2Ot', 
    price: 29999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg'
    ]
  },
  { 
    id: 'suit-tan-3p', 
    name: 'Tan Suit - 3 Piece', 
    stripe_price_id: 'price_1Rpv7mCHc12x7sCzixeUm5ep', 
    price: 34999, 
    category: 'suits', 
    product_type: 'core', 
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg'
    ]
  },
];

// TIES - Dynamic color selection, 4 widths
export const CORE_TIES: CoreProduct[] = [
  { 
    id: 'tie-ultra-skinny', 
    name: 'Ultra Skinny Tie (2.25")', 
    stripe_price_id: 'price_1RpvHlCHc12x7sCzp0TVNS92', 
    price: 2999, 
    category: 'ties', 
    product_type: 'core',
    customFields: { color: true }
  },
  { 
    id: 'tie-skinny', 
    name: 'Skinny Tie (2.75")', 
    stripe_price_id: 'price_1RpvHyCHc12x7sCzjX1WV931', 
    price: 2999, 
    category: 'ties', 
    product_type: 'core',
    customFields: { color: true }
  },
  { 
    id: 'tie-classic', 
    name: 'Classic Width Tie (3.25")', 
    stripe_price_id: 'price_1RpvI9CHc12x7sCzE8Q9emhw', 
    price: 2999, 
    category: 'ties', 
    product_type: 'core',
    customFields: { color: true }
  },
  { 
    id: 'tie-bowtie', 
    name: 'Pre-tied Bow Tie', 
    stripe_price_id: 'price_1RpvIMCHc12x7sCzj6ZTx21q', 
    price: 2999, 
    category: 'ties', 
    product_type: 'core',
    customFields: { color: true }
  },
];

// TIE BUNDLES
export const CORE_TIE_BUNDLES: CoreProduct[] = [
  { 
    id: 'tie-bundle-5', 
    name: '5-Tie Bundle (Buy 4 Get 1 Free)', 
    stripe_price_id: 'price_1RpvQqCHc12x7sCzfRrWStZb', 
    price: 11999, 
    category: 'bundles', 
    product_type: 'core',
    customFields: { selections: true }
  },
  { 
    id: 'tie-bundle-8', 
    name: '8-Tie Bundle (Buy 6 Get 2 Free)', 
    stripe_price_id: 'price_1RpvRACHc12x7sCzVYFZh6Ia', 
    price: 17999, 
    category: 'bundles', 
    product_type: 'core',
    customFields: { selections: true }
  },
  { 
    id: 'tie-bundle-11', 
    name: '11-Tie Bundle (Buy 8 Get 3 Free)', 
    stripe_price_id: 'price_1RpvRSCHc12x7sCzpo0fgH6A', 
    price: 23999, 
    category: 'bundles', 
    product_type: 'core',
    customFields: { selections: true }
  },
];

// DRESS SHIRTS - Dynamic color selection, 2 fits
export const CORE_SHIRTS: CoreProduct[] = [
  { 
    id: 'shirt-slim', 
    name: 'Slim Cut Dress Shirt', 
    stripe_price_id: 'price_1RpvWnCHc12x7sCzzioA64qD', 
    price: 6999, 
    category: 'shirts', 
    product_type: 'core',
    customFields: { color: true, size: true }
  },
  { 
    id: 'shirt-classic', 
    name: 'Classic Fit Dress Shirt', 
    stripe_price_id: 'price_1RpvXACHc12x7sCz2Ngkmp64', 
    price: 6999, 
    category: 'shirts', 
    product_type: 'core',
    customFields: { color: true, size: true }
  },
];

// OUTFIT BUNDLES - Suit + Shirt + Tie combinations
export const CORE_OUTFIT_BUNDLES: CoreProduct[] = [
  { 
    id: 'bundle-starter', 
    name: 'Starter Bundle - Suit + Shirt + Tie', 
    stripe_price_id: 'price_1RpvZUCHc12x7sCzM4sp9DY5', 
    price: 19999, 
    category: 'bundles', 
    product_type: 'core',
    description: 'Perfect for your first suit - includes 2-piece suit, dress shirt, and tie',
    customFields: { selections: true }
  },
  { 
    id: 'bundle-professional', 
    name: 'Professional Bundle - Suit + Shirt + Tie', 
    stripe_price_id: 'price_1RpvZtCHc12x7sCzny7VmEWD', 
    price: 24999, 
    category: 'bundles', 
    product_type: 'core',
    description: 'Ideal for business professionals - premium fabric suit with coordinated accessories',
    customFields: { selections: true }
  },
  { 
    id: 'bundle-executive', 
    name: 'Executive Bundle - Suit + Shirt + Tie', 
    stripe_price_id: 'price_1RpvaBCHc12x7sCzRV6Hy0Im', 
    price: 27999, 
    category: 'bundles', 
    product_type: 'core',
    description: 'Executive level quality - 3-piece suit with luxury shirt and tie',
    customFields: { selections: true }
  },
  { 
    id: 'bundle-premium', 
    name: 'Premium Bundle - Suit + Shirt + Tie', 
    stripe_price_id: 'price_1RpvfvCHc12x7sCzq1jYfG9o', 
    price: 29999, 
    category: 'bundles', 
    product_type: 'core',
    description: 'Our finest collection - premium 3-piece suit with designer shirt and tie',
    customFields: { selections: true }
  },
];

// ALL CORE PRODUCTS COMBINED
export const ALL_CORE_PRODUCTS: CoreProduct[] = [
  ...CORE_SUITS,
  ...CORE_TIES,
  ...CORE_TIE_BUNDLES,
  ...CORE_SHIRTS,
  ...CORE_OUTFIT_BUNDLES,
];

// Helper function to get core product by ID
export function getCoreProductById(id: string): CoreProduct | undefined {
  return ALL_CORE_PRODUCTS.find(product => product.id === id);
}

// Helper function to get core product by Stripe Price ID
export function getCoreProductByPriceId(priceId: string): CoreProduct | undefined {
  return ALL_CORE_PRODUCTS.find(product => product.stripe_price_id === priceId);
}

// Helper function to check if a product is a core product
export function isCoreProduct(productId: string): boolean {
  return ALL_CORE_PRODUCTS.some(product => product.id === productId);
}

// Helper function to get all core products
export function getAllCoreProducts(): CoreProduct[] {
  return ALL_CORE_PRODUCTS;
}

// Get all suit sizes
export const SUIT_SIZES = [
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
];

// Get all shirt sizes
export const SHIRT_SIZES = [
  '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18'
];

// Suit colors available
export const SUIT_COLORS = [
  'Navy', 'Beige', 'Black', 'Brown', 'Burgundy', 'Charcoal Grey',
  'Dark Brown', 'Emerald', 'Hunter Green', 'Indigo', 'Light Grey',
  'Midnight Blue', 'Sand', 'Tan'
];

// Export type for use in components
export type { CoreProduct };