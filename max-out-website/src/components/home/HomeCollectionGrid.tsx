'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

// Collection configuration matching the screenshot layout
const homeCollections = [
  // Row 1 - Core Categories
  {
    id: 'suits',
    name: 'Suits',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    href: '/collections?category=suits',
    count: 0,
    gradient: 'from-gray-100 to-gray-200'
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/classic-fit-collection.jpg',
    href: '/collections?category=shirts',
    count: 0,
    gradient: 'from-blue-50 to-blue-100'
  },
  {
    id: 'vests',
    name: 'Vest',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-vest-tie.png',
    href: '/collections?category=vests',
    count: 0,
    gradient: 'from-burgundy-50 to-burgundy-100'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    image: 'https://cdn.kctmenswear.com/blazers/prom/mens-gold-sequin-pattern-prom-blazer/front.webp',
    href: '/collections?category=jackets',
    count: 0,
    gradient: 'from-amber-50 to-amber-100'
  },
  {
    id: 'pants',
    name: 'Pants',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/dd5c1f7d-722d-4e17-00be-60a3fdb33900/public',
    href: '/collections?category=pants',
    count: 0,
    gradient: 'from-slate-100 to-slate-200'
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    href: '/collections?category=knitwear',
    count: 0,
    gradient: 'from-beige-50 to-beige-100'
  },
  
  // Row 2 - Accessories & Special Collections
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    href: '/collections?tags=tie,bowtie,pocket-square,cufflinks,belt',
    count: 0,
    gradient: 'from-gray-100 to-gray-200'
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    href: '/collections?category=shoes',
    count: 0,
    gradient: 'from-gray-200 to-gray-300'
  },
  {
    id: 'velvet-blazers',
    name: 'Velvet Blazers',
    image: 'https://cdn.kctmenswear.com/blazers/velvet/mens-emerald-velvet-dinner-jacket/front.webp',
    href: '/collections?tags=velvet,blazer',
    count: 0,
    gradient: 'from-emerald-50 to-emerald-100'
  },
  {
    id: 'vest-tie',
    name: 'Vest & Tie',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/dusty-sage-vest-tie.png',
    href: '/collections?tags=vest-set,tie-set',
    count: 0,
    gradient: 'from-sage-50 to-sage-100'
  },
  {
    id: 'complete-looks',
    name: 'Complete Looks',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/indigo-2p-white-dusty-pink.png',
    href: '/collections?category=bundles',
    count: 0,
    gradient: 'from-indigo-50 to-indigo-100'
  },
  {
    id: 'wedding-guest',
    name: 'Wedding Guest',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/indigo-2p-white-dusty-pink.png',
    href: '/collections?occasions=wedding',
    count: 0,
    gradient: 'from-purple-50 to-purple-100',
    subtext: 'Formal'
  },
  
  // Row 3 - Occasion & Style Collections
  {
    id: 'business',
    name: 'Business',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/casual-bundles/navy-white-shirt-white-pocket-sqaure.png',
    href: '/collections?occasions=business,professional',
    count: 0,
    gradient: 'from-blue-100 to-blue-200',
    subtext: 'Professional'
  },
  {
    id: 'black-tie',
    name: 'Black Tie',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png',
    href: '/collections?occasions=black-tie,gala',
    count: 0,
    gradient: 'from-gray-800 to-gray-900',
    subtext: 'Formal'
  },
  {
    id: 'prom-2025',
    name: 'Prom 2025',
    image: 'https://cdn.kctmenswear.com/blazers/prom/mens-burgundy-sparkle-pattern-prom-blazer/front.webp',
    href: '/collections?occasions=prom',
    count: 0,
    gradient: 'from-pink-100 to-purple-100',
    subtext: 'Trendy'
  },
  {
    id: 'cocktail-party',
    name: 'Cocktail Party',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-brown-tie.png',
    href: '/collections?occasions=cocktail,party',
    count: 0,
    gradient: 'from-amber-100 to-amber-200'
  },
  {
    id: 'suspenders-bowtie',
    name: 'Suspender & Bowtie',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    href: '/collections?tags=suspenders,bowtie',
    count: 0,
    gradient: 'from-sky-50 to-sky-100'
  },
  {
    id: 'date-night',
    name: 'Date Night',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Summer%20Wedding%20Bundles/sand-suit-white-shirt-sage-green-tie.png',
    href: '/collections?occasions=date,evening',
    count: 0,
    gradient: 'from-rose-50 to-rose-100',
    subtext: 'Elegant',
    isNew: true
  }
];

export default function HomeCollectionGrid() {
  const [collections, setCollections] = useState(homeCollections);
  const [loading, setLoading] = useState(true);

  // Fetch product counts for each collection
  useEffect(() => {
    async function fetchCounts() {
      try {
        const supabase = createClient();
        const { data: products } = await supabase
          .from('products')
          .select('category, tags, occasions')
          .eq('status', 'active');

        if (products) {
          const updatedCollections = homeCollections.map(collection => {
            let count = 0;
            
            products.forEach(product => {
              // Check category match
              if (collection.href.includes('category=')) {
                const category = collection.href.split('category=')[1]?.split('&')[0];
                if (product.category?.toLowerCase().includes(category)) {
                  count++;
                  return;
                }
              }
              
              // Check tags match
              if (collection.href.includes('tags=')) {
                const tags = collection.href.split('tags=')[1]?.split('&')[0].split(',');
                const productTags = product.tags || [];
                if (tags.some(tag => productTags.some((pt: string) => pt.toLowerCase().includes(tag)))) {
                  count++;
                  return;
                }
              }
              
              // Check occasions match
              if (collection.href.includes('occasions=')) {
                const occasions = collection.href.split('occasions=')[1]?.split('&')[0].split(',');
                const productOccasions = product.occasions || [];
                if (occasions.some(occ => productOccasions.some((po: string) => po.toLowerCase().includes(occ)))) {
                  count++;
                }
              }
            });
            
            return { ...collection, count };
          });
          
          setCollections(updatedCollections);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our complete collection of premium menswear
          </p>
        </div>

        {/* Collection Grid - 6 columns on desktop, 3 on mobile */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <Link
                href={collection.href}
                className="group block relative"
              >
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Background Gradient */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-10",
                    collection.gradient
                  )} />
                  
                  {/* Product Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      priority={index < 6}
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Shopping Bag Icon */}
                  <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingBag className="w-3.5 h-3.5 text-gray-800" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm mb-0.5">
                      {collection.name}
                    </h3>
                    {collection.subtext && (
                      <p className="text-white/80 text-xs">
                        {collection.subtext}
                      </p>
                    )}
                    {!loading && (
                      <p className="text-white/60 text-xs mt-1">
                        {collection.count} items
                      </p>
                    )}
                  </div>

                  {/* New Badge */}
                  {collection.isNew && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        New
                      </span>
                    </div>
                  )}

                  {/* Hover Arrow */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 rounded-full p-1">
                      <ArrowRight className="w-3.5 h-3.5 text-gray-800" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/collections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              View All Collections
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}