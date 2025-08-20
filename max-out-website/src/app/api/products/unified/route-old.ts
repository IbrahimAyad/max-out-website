import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unifiedSearch } from '@/lib/services/unifiedSearchEngine';
import { urlParamsToFilters } from '@/lib/utils/url-filters';
import { getFilterPreset } from '@/lib/config/filter-presets';
import { generateCDNUrls, fixLegacyUrl } from '@/lib/utils/cdn-url-generator';

// Complete mapping for enhanced products based on COMPLETE_MASTER_CDN_URLS
const enhancedProductImages: Record<string, { model: string; product?: string }> = {
  // Vest & Tie Sets - Complete list from CDN
  'Hunter Green Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/hunter-green-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/hunter-green-vest/vest.jpg'
  },
  'Blush Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/blush-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/blush-vest/vest.jpg'
  },
  'Carolina Blue Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-vest/10-gg_10.jpg'
  },
  'Chocolate Brown Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/chocolate-brown-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/chocolate-brown-vest/vest.jpg'
  },
  'Coral Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/coral-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/coral-vest/vest.jpg'
  },
  'Dark Burgundy Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dark-burgundy-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dark-burgundy-vest/vest.jpg'
  },
  'Dark Teal Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dark-teal/main.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dark-teal/vest.jpg'
  },
  'Dusty Rose Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-rose-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-rose-vest/vest.jpg'
  },
  'Dusty Sage Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-sage-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/dusty-sage-vest/vest.webp'
  },
  'Emerald Green Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/emerald-green-vest/main.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/emerald-green-vest/vest.jpg'
  },
  'Fuchsia Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/fuchsia-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/fuchsia-vest/vest.jpg'
  },
  'Gold Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/gold-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/gold-vest/vest.jpg'
  },
  'Grey Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/grey-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/grey-vest/vest.jpg'
  },
  'Lilac Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/lilac-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/lilac-vest/vest.jpg'
  },
  'Mint Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/mint-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/mint-vest/vest.jpg'
  },
  'Peach Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/peach-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/peach-vest/vest.jpg'
  },
  'Pink Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/pink-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/pink-vest/vest.jpg'
  },
  'Plum Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/plum-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/plum-vest/vest.jpg'
  },
  'Powder Blue Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/powder-blue-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/powder-blue-vest/vest.jpg'
  },
  'Red Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/red-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/red-vest/vest.jpg'
  },
  'Rose Gold Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest/vest.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest/rose-gold-vest.jpg'
  },
  'Royal Blue Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/royal-blue-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/royal-blue-vest/vest.jpg'
  },
  'Turquoise Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/turquoise-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/turquoise-vest/vest.jpg'
  },
  'Wine Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/wine-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/wine-vest/vest.jpg'
  },
  // Vest & Tie Set variations (with "& Tie Set" suffix)
  'Hunter Green Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/hunter-green-vest/model.webp'
  },
  'Carolina Blue Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-vest/model.webp'
  },
  'Chocolate Brown Vest & Tie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/chocolate-brown-vest/model.webp'
  },
  // Suspender & Bowtie Sets - Complete list
  'Hunter Green Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/hunter-green-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/hunter-green-suspender-bowtie-set/product.jpg'
  },
  'Black Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/black-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/black-suspender-bowtie-set/main.webp'
  },
  'Brown Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/brown-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/brown-suspender-bowtie-set/product.jpg'
  },
  'Burnt Orange Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/burnt-orange-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/burnt-orange-suspender-bowtie-set/product.jpg'
  },
  'Dusty Rose Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/dusty-rose-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/dusty-rose-suspender-bowtie-set/product.jpg'
  },
  'Fuchsia Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/fuchsia-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/fuchsia-suspender-bowtie-set/product.jpg'
  },
  'Gold Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/gold-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/gold-suspender-bowtie-set/product.jpg'
  },
  'Medium Red Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/medium-red-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/medium-red-suspender-bowtie-set/product.jpg'
  },
  'Orange Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/orange-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/orange-suspender-bowtie-set/product.jpg'
  },
  'Powder Blue Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/powder-blue-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/powder-blue-suspender-bowtie-set/product.jpg'
  },
  
  // Blazers - Prom Collection
  'Mens Navy Printed Design Prom Blazer': {
    model: 'https://cdn.kctmenswear.com/blazers/prom/mens-navy-printed-design-prom-blazer/main-2.webp',
    product: 'https://cdn.kctmenswear.com/blazers/prom/mens-navy-printed-design-prom-blazer/front-close.webp'
  },
  'Mens Pink Floral Pattern Prom Blazer': {
    model: 'https://cdn.kctmenswear.com/blazers/prom/mens-pink-floral-pattern-prom-blazer/main.webp',
    product: 'https://cdn.kctmenswear.com/blazers/prom/mens-pink-floral-pattern-prom-blazer/main-close.webp'
  },
  
  // Tuxedos
  'Black Gold Design Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/black-gold-design-tuxedo/mens_tuxedos_suit_2005_0.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/black-gold-design-tuxedo/mens_tuxedos_suit_2005_1.webp'
  },
  'Black on Black Slim Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/black-on-black-slim-tuxedo-tone-trim-tuxedo/mens_tuxedos_suit_model_2003_0.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/black-on-black-slim-tuxedo-tone-trim-tuxedo/mens_tuxedos_suit_2003_0.webp'
  },
  'Black Paisley Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/black-paisley-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/black-paisley-tuxedo/front.webp'
  },
  'Black Tone Trim Tuxedo Shawl Lapel': {
    model: 'https://cdn.kctmenswear.com/tuxedos/black-tone-trim-tuxedo-shawl-lapel/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/black-tone-trim-tuxedo-shawl-lapel/main.webp'
  },
  'Blush Pink Paisley Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/blush-pink-paisley-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/blush-pink-paisley-tuxedo/front.webp'
  },
  'Blush Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/blush-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/blush-tuxedo/lifestyle.webp'
  },
  'Burnt Orange Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/burnt-orange-tuxedo/mens_tuxedos_suit_model_2008_0.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/burnt-orange-tuxedo/mens_tuxedos_suit_2008_0.webp'
  },
  'Gold Paisley Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/gold-paisley-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/gold-paisley-tuxedo/front.webp'
  },
  'Hunter Green Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/hunter-green-tuxedo/mens_tuxedos_suit_model_2009_0.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/hunter-green-tuxedo/mens_tuxedos_suit_2009_0.webp'
  },
  'Ivory Black Tone Trim Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/ivory-black-tone-trim-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/ivory-black-tone-trim-tuxedo/main.webp'
  },
  'Ivory Gold Paisley Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/ivory-gold-paisley-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/ivory-gold-paisley-tuxedo/lifestyle.webp'
  },
  'Ivory Paisley Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/ivory-paisley-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/ivory-paisley-tuxedo/main.webp'
  },
  'Light Grey Slim Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/light-grey--on-light-grey-slim-tuxedo-tone-trim-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/light-grey--on-light-grey-slim-tuxedo-tone-trim-tuxedo/lifestyle.webp'
  },
  'Navy Tone Trim Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/navy-tone-trim-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/navy-tone-trim-tuxedo/main.webp'
  },
  'Pink Gold Design Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/pink-gold-design-tuxedo/mens_tuxedos_suit_2012_0.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/pink-gold-design-tuxedo/mens_tuxedos_suit_2012_1.webp'
  },
  'Sand Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/sand-tuxedo/mens_tuxedos_suit_model_2011_0.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/sand-tuxedo/mens_tuxedos_suit_2011_0.webp'
  },
  'Vivid Purple Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/vivid-purple- tuxedo-tone-trim-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/vivid-purple- tuxedo-tone-trim-tuxedo/main.webp'
  },
  'White Black Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/white-black-tuxedo/main.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/white-black-tuxedo/main.webp'
  },
  'Wine Tuxedo': {
    model: 'https://cdn.kctmenswear.com/tuxedos/wine-on-wine-slim-tuxedotone-trim-tuxedo/mens_tuxedos_suit_model_2015_0.webp',
    product: 'https://cdn.kctmenswear.com/tuxedos/wine-on-wine-slim-tuxedotone-trim-tuxedo/mens_tuxedos_suit_2015_0.webp'
  },
  
  // Mens Shirts
  'Black Collarless Dress Shirt': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/black-collarless-dress-shirt/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/black-collarless-dress-shirt/front.webp'
  },
  'Black Short Sleeve Mock Neck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/black-short-sleeve-moc-neck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/black-short-sleeve-moc-neck/main.webp'
  },
  'Black Turtleneck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/black-turtleneck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/black-turtleneck/main.webp'
  },
  'Black Ultra Stretch Dress Shirt': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/black-ultra-stretch-dress-shirt/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/black-ultra-stretch-dress-shirt/main.webp'
  },
  'Light Blue Collarless Dress Shirt': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/light-blue-collarless-dress-shirt/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/light-blue-collarless-dress-shirt/front.webp'
  },
  'Light Blue Turtleneck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/light-blue-turtleneck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/light-blue-turtleneck/main.webp'
  },
  'Light Grey Turtleneck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/light-grey-turtleneck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/light-grey-turtleneck/main.webp'
  },
  'Navy Short Sleeve Mock Neck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/navy-short-sleeve-moc-neck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/navy-short-sleeve-moc-neck/main.webp'
  },
  'Tan Short Sleeve Mock Neck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/tan-short-sleeve-moc-neck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/tan-short-sleeve-moc-neck/main.webp'
  },
  'Tan Turtleneck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/tan-turtleneck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/tan-turtleneck/main.webp'
  },
  'White Collarless Dress Shirt': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/white-collarless-dress-shirt/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/white-collarless-dress-shirt/front.webp'
  },
  'White Short Sleeve Mock Neck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/white-short-sleeve-moc-neck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/white-short-sleeve-moc-neck/main.webp'
  },
  'White Turtleneck': {
    model: 'https://cdn.kctmenswear.com/mens-shirts/white-turtleneck/main.webp',
    product: 'https://cdn.kctmenswear.com/mens-shirts/white-turtleneck/main.webp'
  },
  
  // Double Breasted Suits
  'Black Strip Shawl Lapel': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/black-strip-shawl-lapel/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/black-strip-shawl-lapel/front.webp'
  },
  'Fall Forest Green Mocha Double Breasted Suit': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/fall-forest-green-mocha-double-breasted-suit/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/fall-forest-green-mocha-double-breasted-suit/main.webp'
  },
  'Fall Mocha Double Breasted Suit': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/fall-mocha-double-breasted-suit/20250806_1901_Stylish Suit Display_remix_01k20srfr9ez1ag6z2kba3s8x3.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/fall-mocha-double-breasted-suit/20250806_1901_Stylish Suit Display_remix_01k20srfr9ez1ag6z2kba3s8x3.webp'
  },
  'Fall Smoked Blue Double Breasted Suit': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/fall-smoked-blue-double-breasted-suit/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/fall-smoked-blue-double-breasted-suit/main.webp'
  },
  'Light Grey Double Breasted': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/light-grey/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/light-grey/lifestyle.webp'
  },
  'Pin Stripe Canyon Clay Double Breasted Suit': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/pin-stripe-canyon-clay-double-breasted-suit/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/pin-stripe-canyon-clay-double-breasted-suit/main.webp'
  },
  'Pink Double Breasted': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/pink/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/pink/lifestyle.webp'
  },
  'Red Tuxedo Double Breasted': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/red-tuxedo-double-breasted/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/red-tuxedo-double-breasted/front.webp'
  },
  'Tan Tuxedo Double Breasted': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/tan-tuxedo-double-breasted/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/tan-tuxedo-double-breasted/main.webp'
  },
  'White Tuxedo Double Breasted': {
    model: 'https://cdn.kctmenswear.com/double-breasted-suits/white-tuxedo-double-breasted/main.webp',
    product: 'https://cdn.kctmenswear.com/double-breasted-suits/white-tuxedo-double-breasted/main.webp'
  },
  
  // Stretch Suits
  'Beige Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/beige-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/beige-slim-stretch/lifestlye.webp'
  },
  'Black Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/black-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/black-slim-stretch/front.webp'
  },
  'Burgundy Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/burgundy--slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/burgundy--slim-stretch/front.webp'
  },
  'Light Grey Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/light-grey-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/light-grey-slim-stretch/front.webp'
  },
  'Mauve Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/mauve-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/mauve-slim-stretch/front.webp'
  },
  'Mint Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/mint-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/mint-slim-stretch/lifestyle.webp'
  },
  'Pink Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/pink-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/pink-slim-stretch/lifestyle.webp'
  },
  'Salmon Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/salmon-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/salmon-slim-stretch/lifestyle.webp'
  },
  'Tan Slim Stretch': {
    model: 'https://cdn.kctmenswear.com/stretch-suits/tan-slim-stretch/main.webp',
    product: 'https://cdn.kctmenswear.com/stretch-suits/tan-slim-stretch/lifestyle.webp'
  },
  
  // Regular Suits
  'Brick Fall Suit': {
    model: 'https://cdn.kctmenswear.com/suits/brick-fall-suit/main.webp',
    product: 'https://cdn.kctmenswear.com/suits/brick-fall-suit/main.webp'
  },
  'Brown Gold Buttons': {
    model: 'https://cdn.kctmenswear.com/suits/brown-gold-buttons/mens_suits_suit_model_2035_0.webp',
    product: 'https://cdn.kctmenswear.com/suits/brown-gold-buttons/mens_suits_suit_2035_0.webp'
  },
  'Burnt Orange Suit': {
    model: 'https://cdn.kctmenswear.com/suits/burnt-orange/mens_suits_suit_model_2036_0.webp',
    product: 'https://cdn.kctmenswear.com/suits/burnt-orange/mens_suits_suit_2036_0.webp'
  },
  'Estate Blue': {
    model: 'https://cdn.kctmenswear.com/suits/estate-blue/main.webp',
    product: 'https://cdn.kctmenswear.com/suits/estate-blue/main.webp'
  },
  'Fall Rust': {
    model: 'https://cdn.kctmenswear.com/suits/fall-rust/20250806_1806_Trendy Orange Suit_remix_01k20pkyb6es9bnyz5c7ycrv7c.webp',
    product: 'https://cdn.kctmenswear.com/suits/fall-rust/20250806_1806_Trendy Orange Suit_remix_01k20pkyb9evr8t065byeycmqv.webp'
  },
  'Mint Suit': {
    model: 'https://cdn.kctmenswear.com/suits/mint/main.webp',
    product: 'https://cdn.kctmenswear.com/suits/mint/lifestlye.webp'
  },
  'Pin Stripe Black': {
    model: 'https://cdn.kctmenswear.com/suits/pin-stripe-black/main.webp',
    product: 'https://cdn.kctmenswear.com/suits/pin-stripe-black/main.webp'
  },
  'Pin Stripe Brown': {
    model: 'https://cdn.kctmenswear.com/suits/pin-stripe-brown/main.webp',
    product: 'https://cdn.kctmenswear.com/suits/pin-stripe-brown/main.webp'
  },
  'Pin Stripe Grey': {
    model: 'https://cdn.kctmenswear.com/suits/pin-stripe-grey/main.webp',
    product: 'https://cdn.kctmenswear.com/suits/pin-stripe-grey/main.webp'
  },
  'Pin Stripe Navy': {
    model: 'https://cdn.kctmenswear.com/suits/pin-stripe-navy/main.webp',
    product: 'https://cdn.kctmenswear.com/suits/pin-stripe-navy/front.webp'
  }
};

// Function to fix legacy image URLs or get correct CDN URL
function fixImageUrl(url: string | null, productName?: string): string | null {
  // First try smart generation based on product name
  if (productName) {
    // Check if we have a hardcoded mapping first (for backwards compatibility)
    if (enhancedProductImages[productName]) {
      return enhancedProductImages[productName].model;
    }
    
    // Try smart generation
    const generated = generateCDNUrls(productName);
    if (generated.model !== '/placeholder-product.jpg') {
      return generated.model;
    }
  }
  
  // Fall back to fixing legacy URLs
  return fixLegacyUrl(url, productName);
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Generate cache key from search params
    const cacheKey = searchParams.toString();
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }
    
    // Parse filters from URL
    const filters = urlParamsToFilters(searchParams);
    
    // Get preset information if specified
    const presetId = searchParams.get('preset');
    let presetData = null;
    if (presetId) {
      presetData = getFilterPreset(presetId);
    }
    
    // Product fetching strategy:
    // - Enhanced products from products_enhanced table
    // - Core products hardcoded with Stripe IDs (28 items)
    // - Bundles (enabled except on collections page)
    let enhancedProducts = [];
    
    // Only disable bundles on collections page, keep them on other pages
    const isCollectionsPage = request.nextUrl.pathname.includes('/collections');
    if (isCollectionsPage) {
      filters.includeBundles = false;
    }
    
    if (filters.includeIndividual !== false) {
      try {
        const supabase = await createClient();
        
        if (!supabase) {
          console.error('Supabase client is null - check environment variables');
        } else {
          // First, fetch enhanced products (blazers)
          try {
            let enhancedQuery = supabase
              .from('products_enhanced')
              .select('*')
              .eq('status', 'active');
            
            // Apply filters for enhanced products
            if (filters.category?.length) {
              const categories = filters.category.map(c => c.toLowerCase());
              // Check if blazers or jackets are in the filter
              if (categories.includes('blazers') || categories.includes('jackets') || categories.includes('blazer')) {
                // Get all blazers
                enhancedQuery = enhancedQuery.eq('category', 'Blazers');
              } else {
                // Skip enhanced products if not looking for blazers
                enhancedQuery = enhancedQuery.eq('category', 'NONE');
              }
            } else {
              // If no category filter, include all blazers
              enhancedQuery = enhancedQuery.eq('category', 'Blazers');
            }
            
            if (filters.minPrice) {
              enhancedQuery = enhancedQuery.gte('base_price', filters.minPrice);
            }
            if (filters.maxPrice) {
              enhancedQuery = enhancedQuery.lte('base_price', filters.maxPrice);
            }
            
            const { data: enhancedData, error: enhancedError } = await enhancedQuery;
            
            if (!enhancedError && enhancedData) {
              // Map enhanced products to unified format
              enhancedProducts = enhancedData.map((product: any) => {
                // Get image URL with multiple fallbacks
                let imageUrl = '/placeholder-product.jpg';
                
                // Try different image paths from Supabase
                if (product.images?.hero?.url) {
                  imageUrl = product.images.hero.url;
                } else if (product.images?.primary?.url) {
                  imageUrl = product.images.primary.url;
                } else if (product.images?.flat?.url) {
                  imageUrl = product.images.flat.url;
                } else if (product.images?.gallery?.[0]?.url) {
                  imageUrl = product.images.gallery[0].url;
                } else if (product.image_url) {
                  // Fallback to direct image_url field
                  imageUrl = product.image_url;
                }
                
                // Fix legacy URLs and ensure CDN domain
                imageUrl = fixImageUrl(imageUrl, product.name) || '/placeholder-product.jpg';
                
                // If still placeholder, try smart generation
                if (imageUrl === '/placeholder-product.jpg') {
                  const generated = generateCDNUrls(product.name);
                  if (generated.model !== '/placeholder-product.jpg') {
                    imageUrl = generated.model;
                  }
                }
                
                // Final fallback to avoid broken images
                if (!imageUrl || imageUrl.includes('undefined') || imageUrl === '/placeholder-product.jpg') {
                  imageUrl = '/placeholder-product.svg';
                }
                
                return {
                  id: `enhanced_${product.id}`,
                  source: 'enhanced',
                  type: 'individual',
                  name: product.name,
                  title: product.name,
                  description: product.description || '',
                  price: product.base_price / 100, // Convert cents to dollars (as number)
                  compare_at_price: product.compare_at_price ? product.compare_at_price / 100 : null,
                  currency: 'USD',
                  category: product.category || 'blazers',
                  product_type: product.category || 'blazers',
                  tags: product.tags || [],
                  slug: product.slug,
                  handle: product.slug,
                  url: `/products/${product.slug}`,
                  availability: 'in-stock',
                  available: true,
                  inventory_quantity: 100,
                  primary_image: imageUrl,
                  image: imageUrl, // Add for compatibility
                  featured_image: { src: imageUrl },
                  images: [{ src: imageUrl }],
                  vendor: 'KCT Menswear',
                  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
                  stripePriceId: product.stripe_price_id || null,
                  stripeActive: !!product.stripe_product_id,
                  variants: [],
                  ai_score: 95,
                  enhanced: true,
                  pricing_tier: product.price_tier || null
                };
              });
              
            }
          } catch (enhancedErr) {
            console.error('Error fetching enhanced products:', enhancedErr);
          }
          
          // LEGACY PRODUCTS REMOVED - No longer needed
          // All legacy products have been replaced by enhanced products
        }
      } catch (error) {
        console.error('Error fetching Supabase products:', error);
      }
    }
    
    // Enhanced products only (no legacy products)
    const allProducts = [...enhancedProducts];
    
    // Debug logging


    if (allProducts.length > 0) {

    }
    
    // Perform unified search with all products
    const results = await unifiedSearch(filters, allProducts);

    
    // Add preset metadata if applicable
    if (presetData) {
      (results as any).presetMetadata = {
        name: presetData.name,
        description: presetData.description,
        icon: presetData.icon,
        seo: presetData.seo
      };
    }
    
    // Cache the results
    cache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });
    
    // Clean old cache entries periodically
    if (cache.size > 100) {
      const entries = Array.from(cache.entries());
      const cutoff = Date.now() - CACHE_DURATION;
      entries.forEach(([key, value]) => {
        if (value.timestamp < cutoff) {
          cache.delete(key);
        }
      });
    }
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Unified products API error:', error);
    
    // Return empty results with error info (always return 200 to prevent client crashes)
    return NextResponse.json({
      products: [],
      totalCount: 0,
      filteredCount: 0,
      facets: {
        categories: [],
        colors: [],
        occasions: [],
        priceRanges: [],
        bundleTiers: []
      },
      pagination: {
        currentPage: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch products'
    }, { status: 200 }); // Always return 200 to prevent client-side errors
  }
}