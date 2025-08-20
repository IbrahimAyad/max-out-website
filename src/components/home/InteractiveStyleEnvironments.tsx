'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Sun, Moon, Cloud, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleCategory {
  name: string;
  slug: string;
  description: string;
  backgroundImage: string;
  particleType?: 'fabric' | 'sparkle' | 'geometric';
  borderColor?: string;
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  styleDNA?: string[];
}

interface InteractiveStyleEnvironmentsProps {
  categories: StyleCategory[];
}

// Particle component for floating effects
function FabricParticle({ delay = 0 }: { delay?: number }) {
  const randomX = Math.random() * 100;
  const randomDuration = 10 + Math.random() * 10;
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white/30 rounded-full"
      initial={{ x: `${randomX}%`, y: '100%', opacity: 0 }}
      animate={{
        y: '-100%',
        x: `${randomX + (Math.random() - 0.5) * 50}%`,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

// Sparkle particle for luxury categories
function SparkleParticle({ delay = 0 }: { delay?: number }) {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${randomX}%`, top: `${randomY}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 3,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Sparkles className="w-3 h-3 text-gold" />
    </motion.div>
  );
}

// Get contextual message based on time and season
function getContextualMessage(category: StyleCategory) {
  const hour = new Date().getHours();
  const month = new Date().getMonth();
  
  // Time-based messages
  if (category.slug === 'business') {
    if (hour < 12) return "Power dress for morning meetings";
    if (hour < 17) return "Executive style for afternoon presentations";
    return "After-work elegance";
  }
  
  if (category.slug === 'wedding') {
    const seasons = ['Winter', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter', 'Winter', 'Winter'];
    return `${seasons[month]} wedding perfection`;
  }
  
  if (category.slug === 'formal') {
    if (hour >= 18) return "Evening gala ready";
    return "Black tie excellence";
  }
  
  if (category.slug === 'prom') {
    if (month >= 2 && month <= 5) return "Prom season is here!";
    return "Start planning your prom look";
  }
  
  return category.description;
}

// Style DNA compatibility indicator
function StyleDNAIndicator({ compatibility }: { compatibility: number }) {
  return (
    <div className="absolute top-4 left-4 z-20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-1.5 h-6 rounded-full",
                  i < Math.floor(compatibility / 20)
                    ? "bg-burgundy"
                    : "bg-gray-300"
                )}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
          <span className="text-xs font-semibold">{compatibility}% Match</span>
        </div>
      </motion.div>
    </div>
  );
}

export function InteractiveStyleEnvironments({ categories }: InteractiveStyleEnvironmentsProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [timeIcon, setTimeIcon] = useState<typeof Sun>(Sun);
  
  // Update time icon based on actual time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6 || hour >= 20) setTimeIcon(Moon);
    else if (hour < 12) setTimeIcon(Sun);
    else if (hour < 17) setTimeIcon(Cloud);
    else setTimeIcon(Star);
  }, []);

  const TimeIconComponent = timeIcon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {categories.map((category, index) => {
        const isHovered = hoveredCategory === category.slug;
        const contextualMessage = getContextualMessage(category);
        const compatibility = 65 + Math.floor(Math.random() * 35); // Mock compatibility score
        
        return (
          <Link key={category.slug} href={`/collections/${category.slug}`}>
            <motion.div
              className="group relative overflow-hidden aspect-[16/10] cursor-pointer rounded-2xl"
              onMouseEnter={() => setHoveredCategory(category.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Background Image with Ken Burns effect */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 10, ease: "linear" }}
              >
                <Image
                  src={category.backgroundImage}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index < 2}
                />
              </motion.div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
              >
                <div className="absolute inset-0 rounded-2xl">
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(90deg, ${category.borderColor || '#8B0000'}, transparent, ${category.borderColor || '#8B0000'})`,
                      padding: '2px',
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>

              {/* Particle Effects */}
              <AnimatePresence>
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    {category.particleType === 'fabric' && (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <FabricParticle key={i} delay={i * 0.5} />
                        ))}
                      </>
                    )}
                    {category.particleType === 'sparkle' && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <SparkleParticle key={i} delay={i * 0.3} />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </AnimatePresence>

              {/* Style DNA Indicator */}
              {isHovered && <StyleDNAIndicator compatibility={compatibility} />}

              {/* Time/Season Icon */}
              <motion.div
                className="absolute top-4 right-4 z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
              >
                <div className="bg-white/90 backdrop-blur rounded-full p-2 shadow-lg">
                  <TimeIconComponent className="w-4 h-4 text-burgundy" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <motion.h3
                  className="text-2xl md:text-3xl font-serif mb-2"
                  animate={{
                    x: isHovered ? 10 : 0,
                  }}
                >
                  {category.name}
                </motion.h3>
                
                {/* Contextual message that changes */}
                <motion.p
                  key={contextualMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-gray-200 mb-4"
                >
                  {contextualMessage}
                </motion.p>
                
                <motion.div
                  className="inline-flex items-center text-sm font-semibold"
                  animate={{
                    x: isHovered ? 5 : 0,
                  }}
                >
                  Shop Collection 
                  <motion.div
                    animate={{
                      x: isHovered ? 5 : 0,
                    }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </motion.div>

                {/* Style DNA Tags */}
                <AnimatePresence>
                  {isHovered && category.styleDNA && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex gap-2 mt-3"
                    >
                      {category.styleDNA.map((tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/20 backdrop-blur px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}