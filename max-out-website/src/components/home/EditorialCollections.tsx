'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Collection {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
  size: 'large' | 'medium' | 'small';
}

interface EditorialCollectionsProps {
  collections: Collection[];
}

export function EditorialCollections({ collections }: EditorialCollectionsProps) {
  const getSizeClasses = (size: string, index: number) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-[4/5]';
      case 'medium':
        return 'md:col-span-1 md:row-span-2 aspect-square md:aspect-[3/4]';
      case 'small':
        return 'md:col-span-1 md:row-span-1 aspect-square';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="container-main">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="font-serif text-5xl md:text-6xl font-light mb-6 tracking-tight">
          Collections
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl font-light">
          Discover our curated collections, each telling a unique story of style and sophistication.
        </p>
      </motion.div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4 md:gap-6 h-auto md:h-[120vh]">
        {(collections || []).map((collection, index) => (
          <motion.div
            key={collection.id}
            className={cn(
              "group relative overflow-hidden cursor-pointer",
              getSizeClasses(collection.size, index)
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <Link href={collection.href}>
              <div className="relative w-full h-full">
                {/* Image */}
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes={collection.size === 'large' ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <motion.div
                    className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-light mb-2 opacity-90">
                      {collection.subtitle}
                    </p>
                    <h3 className={cn(
                      "font-serif font-light leading-tight mb-4",
                      collection.size === 'large' ? "text-3xl md:text-4xl lg:text-5xl" :
                      collection.size === 'medium' ? "text-2xl md:text-3xl" :
                      "text-xl md:text-2xl"
                    )}>
                      {collection.name}
                    </h3>
                    
                    {/* Hover CTA */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <div className="inline-flex items-center text-sm font-medium">
                        <span>Explore Collection</span>
                        <svg 
                          className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Subtle border on hover */}
                <div className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-20"
      >
        <Link href="/collections">
          <motion.button 
            className="group px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium tracking-wide"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Collections
            <svg 
              className="w-4 h-4 ml-2 inline transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}