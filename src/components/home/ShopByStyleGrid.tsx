'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Define the collections that map to our master collections and database
const collectionsConfig = [
  // Row 1 - Main Product Categories
  {
    name: 'Suits',
    link: '/collections/suits',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    bgColor: 'bg-gradient-to-br from-beige-100 to-beige-200',
    dbCategory: ['Classic 2-Piece Suits', 'Classic 3-Piece Suits', 'Double Breasted Suits'],
    masterId: 'suits'
  },
  {
    name: 'Shirts',
    link: '/collections/shirts',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/classic-fit-collection.jpg',
    bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
    dbCategory: ['Dress Shirts', 'Casual Shirts', 'Formal Shirts'],
    masterId: 'shirts'
  },
  {
    name: 'Vests',
    link: '/collections/vests',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/vest-tie-main-2.jpg',
    bgColor: 'bg-gradient-to-br from-burgundy-50 to-burgundy-100',
    dbCategory: ['Vests', 'Vest Sets'],
    masterId: 'vests'
  },
  {
    name: 'Jackets',
    link: '/collections/jackets',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
    dbCategory: ['Sport Coats', 'Blazers', 'Dinner Jackets'],
    masterId: 'jackets'
  },
  {
    name: 'Pants',
    link: '/collections/pants',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
    dbCategory: ['Dress Pants', 'Suit Pants', 'Formal Trousers'],
    masterId: 'pants'
  },
  {
    name: 'Knitwear',
    link: '/collections/knitwear',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    bgColor: 'bg-gradient-to-br from-beige-50 to-beige-100',
    dbCategory: ['Sweaters', 'Cardigans', 'Knit Vests'],
    masterId: 'knitwear'
  },
  {
    name: 'Accessories',
    link: '/collections/accessories',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
    dbCategory: ['Ties', 'Bow Ties', 'Pocket Squares', 'Cufflinks', 'Belts', 'Suspenders'],
    masterId: 'accessories'
  },
  {
    name: 'Shoes',
    link: '/collections/shoes',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    bgColor: 'bg-gradient-to-br from-gray-200 to-gray-300',
    dbCategory: ['Dress Shoes', 'Formal Shoes', 'Loafers', 'Oxfords'],
    masterId: 'shoes'
  },
  {
    name: 'Velvet Blazers',
    link: '/collections/suits?filter=velvet',
    image: 'https://cdn.kctmenswear.com/blazers/velvet/mens-emerald-velvet-dinner-jacket/front.webp',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    dbTags: ['velvet', 'luxury'],
    masterId: 'suits'
  },
  
  // Row 2 - Style/Occasion Categories
  {
    name: 'Vest & Tie',
    link: '/collections/accessories?filter=vest-tie-sets',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/dusty-sage-vest-tie.png',
    bgColor: 'bg-gradient-to-br from-sage-50 to-sage-100',
    dbTags: ['vest-set', 'vest-tie-set'],
    masterId: 'accessories'
  },
  {
    name: 'Complete Looks',
    link: '/collections/complete-looks',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
    dbCategory: ['Bundles', 'Complete Outfits'],
    masterId: 'complete-looks'
  },
  {
    name: 'Wedding Guest',
    link: '/collections/wedding?filter=wedding-guest',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    dbTags: ['wedding', 'wedding-guest'],
    masterId: 'wedding',
    occasionText: 'Formal'
  },
  {
    name: 'Business',
    link: '/collections/business',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    bgColor: 'bg-gradient-to-br from-gray-200 to-gray-300',
    dbTags: ['business', 'professional'],
    masterId: 'business-casual',
    occasionText: 'Formal'
  },
  {
    name: 'Black Tie',
    link: '/collections/wedding?filter=black-tie',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    bgColor: 'bg-gradient-to-br from-gray-800 to-gray-900',
    textColor: 'text-white',
    dbCategory: ['Tuxedos', 'Dinner Jackets'],
    masterId: 'wedding',
    occasionText: 'Black-Tie'
  },
  {
    name: 'Prom 2025',
    link: '/collections/prom',
    image: 'https://cdn.kctmenswear.com/blazers/prom/mens-red-floral-pattern-prom-blazer/front.webp',
    bgColor: 'bg-gradient-to-br from-purple-100 to-blue-200',
    dbTags: ['prom', 'prom-2025'],
    masterId: 'prom',
    occasionText: 'Formal'
  },
  {
    name: 'Cocktail Party',
    link: '/collections/business?filter=cocktail',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/brown-suit-main.jpg',
    bgColor: 'bg-gradient-to-br from-orange-100 to-amber-100',
    dbTags: ['cocktail', 'semi-formal'],
    masterId: 'business-casual',
    occasionText: 'Semi-Formal'
  },
  {
    name: 'Suspender Bowtie',
    link: '/collections/accessories?filter=suspender-sets',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
    dbTags: ['suspenders', 'bowtie', 'suspender-set'],
    masterId: 'accessories'
  },
  {
    name: 'Date Night',
    link: '/collections/business?filter=date-night',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/indigo/indigo-main.jpg',
    bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    dbTags: ['casual', 'date-night'],
    masterId: 'business-casual',
    occasionText: 'Casual'
  }
];

interface CollectionData {
  name: string;
  link: string;
  image: string;
  bgColor: string;
  textColor?: string;
  itemCount: number;
  occasionText?: string;
}

export function ShopByStyleGrid() {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductCounts() {
      try {
        const supabase = createClient();
        const collectionsWithCounts: CollectionData[] = [];

        for (const config of collectionsConfig) {
          let count = 0;

          // Build query based on category or tags
          if (config.dbCategory) {
            const { count: categoryCount } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .in('product_type', config.dbCategory)
              .eq('visibility', true)
              .eq('status', 'active');
            
            count = categoryCount || 0;
          } else if (config.dbTags) {
            const { count: tagCount } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .overlaps('tags', config.dbTags)
              .eq('visibility', true)
              .eq('status', 'active');
            
            count = tagCount || 0;
          }

          collectionsWithCounts.push({
            name: config.name,
            link: config.link,
            image: config.image,
            bgColor: config.bgColor,
            textColor: config.textColor,
            itemCount: count,
            occasionText: config.occasionText
          });
        }

        setCollections(collectionsWithCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product counts:', error);
        // Fallback to static data if database fetch fails
        setCollections(collectionsConfig.map(config => ({
          name: config.name,
          link: config.link,
          image: config.image,
          bgColor: config.bgColor,
          textColor: config.textColor,
          itemCount: 0,
          occasionText: config.occasionText
        })));
        setLoading(false);
      }
    }

    fetchProductCounts();
  }, []);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container-main">
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-2 md:gap-4">
          {collections.map((category) => (
            <Link 
              key={category.name} 
              href={category.link}
              className="group cursor-pointer"
            >
              <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] ${category.bgColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 12.5vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">?</span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-3 ${category.textColor || 'text-white'}`}>
                  <h3 className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1">{category.name}</h3>
                  <p className="text-[10px] md:text-xs opacity-90">
                    {category.occasionText || (
                      loading ? (
                        <span className="inline-block h-2 w-12 bg-white/20 animate-pulse rounded" />
                      ) : (
                        `${category.itemCount} items`
                      )
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}