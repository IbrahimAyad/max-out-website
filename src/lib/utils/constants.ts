export const API_BASE_URL = 'https://kct-menswear.vercel.app/api';
export const WS_URL = 'wss://kct-menswear.vercel.app/ws';

export const MAX_CART_ITEMS = 50;
export const MIN_ORDER_AMOUNT = 5000; // $50.00 in cents

export const CLOUDFLARE_STREAM_URL = 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com';

export const VIDEO_IDS = {
  homepage: '482d89b6279491525878050607d570c3',
  prom: '6003e03beafc379e3f4fb5b81b703b84',
  wedding: '386f4bbf90dba1c6c0a3a33a3e9b6764',
} as const;

export const BUTTON_STYLES = {
  primary: "bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors",
  secondary: "bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-sm font-semibold transition-colors",
  outline: "border-2 border-black hover:bg-black hover:text-white px-6 py-3 rounded-sm font-semibold transition-all",
} as const;

export const CONTAINER_STYLES = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
export const SECTION_STYLES = "py-12 md:py-16 lg:py-20";