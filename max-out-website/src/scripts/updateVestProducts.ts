import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Vest & Tie products data with Cloudflare R2 URLs
const vestProducts = [
  {
    name: 'Turquoise Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/Turquoise-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/Turquoise-vest.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Blush Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/blush-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/blush-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Burnt Orange Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/burnt-orange-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/burnt-orange-vest.jpg',
    colorFamily: 'Orange'
  },
  {
    name: 'Canary Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/canary-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/canary-vest.jpg',
    colorFamily: 'Yellow'
  },
  {
    name: 'Carolina Blue Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/carolina-blue-men-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/carolina-blue-men-vest.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Chocolate Brown Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/chocolate-brown-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/chocolate-brown-vest.jpg',
    colorFamily: 'Brown'
  },
  {
    name: 'Coral Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/coral-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/coral-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Dark Burgundy Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dark-burgundy-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dar-burgundy-vest.jpg',
    colorFamily: 'Red'
  },
  {
    name: 'Dusty Rose Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-rose-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-rose-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Dusty Sage Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-vest.png',
    colorFamily: 'Green'
  },
  {
    name: 'Emerald Green Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/emerald-green=model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/emerald-green-vest.jpg',
    colorFamily: 'Green'
  },
  {
    name: 'Fuchsia Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/fuchsia-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/fuchsia-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Gold Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/gold-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/gold-vest.jpg',
    colorFamily: 'Yellow'
  },
  {
    name: 'Grey Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/grey-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/grey-vest.jpg',
    colorFamily: 'Grey'
  },
  {
    name: 'Hunter Green Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/hunter-green-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/hunter-green-model.jpg',
    colorFamily: 'Green'
  },
  {
    name: 'Lilac Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/lilac-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/lilac-vest.jpg',
    colorFamily: 'Purple'
  },
  {
    name: 'Mint Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/mint-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/mint-vest.jpg',
    colorFamily: 'Green'
  },
  {
    name: 'Peach Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/peach-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/peach-vest.jpg',
    colorFamily: 'Orange'
  },
  {
    name: 'Pink Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/pink-vest-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/pink-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Plum Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/plum-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/plum-vest.jpg',
    colorFamily: 'Purple'
  },
  {
    name: 'Powder Blue Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/powder-blue-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/powder-blue-vest.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Red Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/red-vest-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/red-vest.jpg',
    colorFamily: 'Red'
  },
  {
    name: 'Rose Gold Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/rose-gold-vest.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/rose-gold-vest.jpg',
    colorFamily: 'Pink'
  },
  {
    name: 'Royal Blue Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/royal-blue-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/royal-blue-model.jpg',
    colorFamily: 'Blue'
  },
  {
    name: 'Wine Vest & Tie Set',
    modelImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/wine-model.png',
    productImage: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/wine-veset.jpg',
    colorFamily: 'Red'
  }
]

async function updateVestProducts() {
  console.log('Script placeholder - implementation needed');
}

// Execute if run directly
if (require.main === module) {
  updateVestProducts();
}
