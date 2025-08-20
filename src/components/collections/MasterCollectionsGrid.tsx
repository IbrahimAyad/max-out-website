'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getProductImageUrl, handleImageError, getCategoryFromProductType } from '@/lib/utils/imageHelpers';

interface CollectionCard {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
  description?: string;
  filterParams?: {
    category?: string;
    tags?: string[];
    occasions?: string[];
  };
  isComingSoon?: boolean;
}

// Master collections configuration - matches your image exactly
const masterCollections: CollectionCard[] = [
  {
    id: 'suits',
    name: 'Suits',
    slug: 'suits',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    count: 0,
    filterParams: { category: 'suits' }
  },
  {
    id: 'shirts',
    name: 'Shirts',
    slug: 'shirts',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/classic-fit-collection.jpg',
    count: 0,
    filterParams: { category: 'shirts' }
  },
  {
    id: 'vests',
    name: 'Vest',
    slug: 'vests',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-vest-tie.png',
    count: 0,
    filterParams: { category: 'vests' }
  },
  {
    id: 'jackets',
    name: 'Jackets',
    slug: 'jackets',
    image: 'https://cdn.kctmenswear.com/blazers/prom/mens-gold-sequin-pattern-prom-blazer/front.webp',
    count: 0,
    filterParams: { category: 'jackets', tags: ['blazer', 'jacket'] }
  },
  {
    id: 'pants',
    name: 'Pants',
    slug: 'pants',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/dd5c1f7d-722d-4e17-00be-60a3fdb33900/public',
    count: 0,
    filterParams: { category: 'pants' }
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    slug: 'knitwear',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    count: 0,
    filterParams: { category: 'knitwear', tags: ['sweater', 'cardigan'] }
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    count: 0,
    filterParams: { tags: ['tie', 'bowtie', 'pocket-square', 'cufflinks', 'belt'] }
  },
  {
    id: 'shoes',
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    count: 0,
    filterParams: { category: 'shoes' }
  },
  {
    id: 'velvet-blazers',
    name: 'Velvet Blazers',
    slug: 'velvet-blazers',
    image: 'https://cdn.kctmenswear.com/blazers/velvet/mens-emerald-velvet-dinner-jacket/front.webp',
    count: 0,
    filterParams: { tags: ['velvet', 'blazer'] }
  },
  {
    id: 'vest-tie',
    name: 'Vest & Tie',
    slug: 'vest-tie-sets',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/dusty-sage-vest-tie.png',
    count: 0,
    filterParams: { tags: ['vest-set', 'tie-set'] }
  },
  {
    id: 'complete-looks',
    name: 'Complete Looks',
    slug: 'bundles',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e5d7c2ed-5f6f-6b9f-5892-g1dceb4e0g00/public',
    count: 0,
    filterParams: { category: 'bundles' }
  },
  {
    id: 'wedding-guest',
    name: 'Wedding Guest',
    slug: 'wedding',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/indigo-2p-white-dusty-pink.png',
    count: 0,
    filterParams: { occasions: ['wedding'] },
    description: 'Formal'
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/casual-bundles/navy-white-shirt-white-pocket-sqaure.png',
    count: 0,
    filterParams: { occasions: ['business', 'professional'] },
    description: 'Formal'
  },
  {
    id: 'black-tie',
    name: 'Black Tie',
    slug: 'black-tie',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png',
    count: 0,
    filterParams: { occasions: ['black-tie', 'gala'] },
    description: 'Black-Tie'
  },
  {
    id: 'prom-2025',
    name: 'Prom 2025',
    slug: 'prom',
    image: 'https://cdn.kctmenswear.com/blazers/prom/mens-burgundy-sparkle-pattern-prom-blazer/front.webp',
    count: 0,
    filterParams: { occasions: ['prom'] },
    description: 'Formal'
  },
  {
    id: 'cocktail-party',
    name: 'Cocktail Party',
    slug: 'cocktail',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-brown-tie.png',
    count: 0,
    filterParams: { occasions: ['cocktail', 'party'] },
    description: 'Semi-Formal'
  },
  {
    id: 'suspender-bowtie',
    name: 'Suspender Bowtie',
    slug: 'suspender-sets',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    count: 0,
    filterParams: { tags: ['suspender', 'bowtie'] }
  },
  {
    id: 'date-night',
    name: 'Date Night',
    slug: 'date-night',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/a6e8c3fd-7f8f-7c0f-7893-h2edfc5f1h00/public',
    count: 0,
    filterParams: { occasions: ['date-night', 'casual'] },
    description: 'Casual',
    isComingSoon: true
  }
];

export default function MasterCollectionsGrid() {
  const [collections, setCollections] = useState<CollectionCard[]>(masterCollections);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic product counts
  useEffect(() => {
    async function fetchProductCounts() {
      try {
        const supabase = createClient();
        
        // Get all products to calculate counts
        const { data: products, error } = await supabase
          .from('products')
          .select('category, tags, occasions, master_category, subcategory')
          .eq('status', 'active')
          .eq('visibility', true);

        if (error) throw error;

        // Calculate counts for each collection
        const updatedCollections = masterCollections.map(collection => {
          let count = 0;

          if (products) {
            products.forEach(product => {
              // Check category match
              if (collection.filterParams?.category) {
                if (
                  product.category?.toLowerCase().includes(collection.filterParams.category.toLowerCase()) ||
                  product.master_category?.toLowerCase().includes(collection.filterParams.category.toLowerCase())
                ) {
                  count++;
                  return;
                }
              }

              // Check tags match
              if (collection.filterParams?.tags) {
                const productTags = product.tags || [];
                const hasMatchingTag = collection.filterParams.tags.some(tag =>
                  productTags.some((pt: string) => pt.toLowerCase().includes(tag.toLowerCase()))
                );
                if (hasMatchingTag) {
                  count++;
                  return;
                }
              }

              // Check occasions match
              if (collection.filterParams?.occasions) {
                const productOccasions = product.occasions || [];
                const hasMatchingOccasion = collection.filterParams.occasions.some(occasion =>
                  productOccasions.some((po: string) => po.toLowerCase().includes(occasion.toLowerCase()))
                );
                if (hasMatchingOccasion) {
                  count++;
                }
              }
            });
          }

          return { ...collection, count };
        });

        setCollections(updatedCollections);
      } catch (error) {
        console.error('Error fetching product counts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductCounts();
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our complete collection of premium menswear, from classic suits to modern accessories
        </p>
      </div>

      {/* Collections Grid - 6x3 on desktop, 3x3 on mobile */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 px-4 max-w-[1600px] mx-auto">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            className="group"
          >
            <Link
              href={collection.isComingSoon ? '#' : `/collections?${new URLSearchParams(
                collection.filterParams?.category ? { category: collection.filterParams.category } :
                collection.filterParams?.tags ? { tags: collection.filterParams.tags.join(',') } :
                collection.filterParams?.occasions ? { occasions: collection.filterParams.occasions.join(',') } :
                {}
              ).toString()}`}
              className={`block relative overflow-hidden rounded-xl ${
                collection.isComingSoon ? 'cursor-not-allowed' : ''
              }`}
            >
              {/* Card Container with aspect ratio */}
              <div className="relative aspect-[3/4] bg-gray-100">
                {/* Image */}
                <div className="absolute inset-0">
                  {collection.isComingSoon ? (
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <div className="text-6xl md:text-8xl text-purple-300">?</div>
                    </div>
                  ) : (
                    <Image
                      src={getProductImageUrl(collection.image, getCategoryFromProductType(collection.name))}
                      alt={collection.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 33vw, 16vw"
                      priority={index < 6}
                      onError={(e) => handleImageError(e, getCategoryFromProductType(collection.name))}
                    />
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base lg:text-lg mb-1">
                    {collection.name}
                  </h3>
                  
                  {/* Count or Description */}
                  <div className="flex items-center justify-between">
                    <p className="text-white/80 text-xs md:text-sm">
                      {collection.description || (
                        loading ? (
                          <span className="inline-block w-12 h-4 bg-white/20 rounded animate-pulse" />
                        ) : collection.isComingSoon ? (
                          'Coming Soon'
                        ) : (
                          `${collection.count} items`
                        )
                      )}
                    </p>
                    
                    {/* Hover Arrow */}
                    {!collection.isComingSoon && (
                      <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                    )}
                  </div>
                </div>

                {/* Coming Soon Badge */}
                {collection.isComingSoon && (
                  <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Soon
                  </div>
                )}

                {/* Hover Overlay */}
                {!collection.isComingSoon && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}