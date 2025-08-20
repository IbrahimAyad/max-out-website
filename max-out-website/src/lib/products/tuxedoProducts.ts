// Tuxedo Products - Individual formal tuxedos for purchase
// All tuxedos are 2-piece at $199.99

import { getSuitImages } from '@/lib/data/suitImages';

export interface TuxedoProduct {
  id: string;
  name: string;
  color: string;
  price: number;
  stripePriceId: string;
  description: string;
  features: string[];
  image: string;
  gallery: string[];
  inStock: boolean;
}

// Use the same Stripe price ID for all tuxedos at $199.99
const TUXEDO_STRIPE_PRICE_ID = 'price_1RpvZUCHc12x7sCzM4sp9DY5'; // This is the $199.99 price ID

export const tuxedoProducts: TuxedoProduct[] = [
  {
    id: 'classic-black-tuxedo',
    name: 'Classic Black Tuxedo',
    color: 'blackTuxedo',
    price: 199.99,
    stripePriceId: TUXEDO_STRIPE_PRICE_ID,
    description: 'Timeless elegance with satin peak lapels and stripe detailing. Perfect for formal events and black-tie occasions.',
    features: [
      'Premium wool blend fabric',
      'Satin peak lapels',
      'Satin stripe trouser detailing',
      'Single button closure',
      'Available in regular, short, and long fits'
    ],
    image: getSuitImages('blackTuxedo').main,
    gallery: getSuitImages('blackTuxedo').gallery,
    inStock: true
  },
  {
    id: 'burgundy-velvet-tuxedo',
    name: 'Burgundy Velvet Tuxedo',
    color: 'burgundyTuxedo',
    price: 199.99,
    stripePriceId: TUXEDO_STRIPE_PRICE_ID,
    description: 'Make a bold statement with luxurious burgundy velvet. Features black satin lapels for striking contrast.',
    features: [
      'Luxurious velvet fabric',
      'Black satin shawl collar',
      'Side-stripe tuxedo trousers',
      'Single button closure',
      'Perfect for prom and special events'
    ],
    image: getSuitImages('burgundyTuxedo').main,
    gallery: getSuitImages('burgundyTuxedo').gallery,
    inStock: true
  },
  {
    id: 'light-grey-tuxedo',
    name: 'Light Grey Tuxedo',
    color: 'lightGreyTuxedo',
    price: 199.99,
    stripePriceId: TUXEDO_STRIPE_PRICE_ID,
    description: 'Modern sophistication in light grey with black satin accents. Ideal for daytime formal events.',
    features: [
      'Lightweight wool blend',
      'Black satin peak lapels',
      'Contrast satin trouser stripe',
      'Single button closure',
      'Contemporary slim fit available'
    ],
    image: getSuitImages('lightGreyTuxedo').main,
    gallery: getSuitImages('lightGreyTuxedo').gallery,
    inStock: true
  },
  {
    id: 'midnight-blue-tuxedo',
    name: 'Midnight Blue Tuxedo',
    color: 'midnightBlueTuxedo',
    price: 199.99,
    stripePriceId: TUXEDO_STRIPE_PRICE_ID,
    description: 'Sophisticated alternative to black. Deep midnight blue appears black in low light but reveals rich color in bright settings.',
    features: [
      'Premium midnight blue fabric',
      'Matching satin peak lapels',
      'Satin trouser stripe',
      'Single button closure',
      'Preferred by style connoisseurs'
    ],
    image: getSuitImages('midnightBlueTuxedo').main,
    gallery: getSuitImages('midnightBlueTuxedo').gallery,
    inStock: true
  },
  {
    id: 'royal-blue-tuxedo',
    name: 'Royal Blue Tuxedo',
    color: 'royalBlueTuxedo',
    price: 199.99,
    stripePriceId: TUXEDO_STRIPE_PRICE_ID,
    description: 'Stand out in vibrant royal blue. Perfect for prom, quinceañeras, and festive formal events.',
    features: [
      'Bold royal blue fabric',
      'Black satin shawl collar',
      'Contrast trouser stripe',
      'Single button closure',
      'Statement piece for special occasions'
    ],
    image: getSuitImages('royalBlueTuxedo').main,
    gallery: getSuitImages('royalBlueTuxedo').gallery,
    inStock: true
  }
];

// Helper function to get tuxedo by ID
export function getTuxedoById(id: string): TuxedoProduct | undefined {
  return tuxedoProducts.find(tuxedo => tuxedo.id === id);
}

// Helper function to get tuxedo images
export function getTuxedoImages(color: string) {
  return getSuitImages(color);
}