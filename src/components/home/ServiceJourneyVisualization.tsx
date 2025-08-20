'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, 
  Package, 
  Calendar, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Users,
  Ruler,
  Palette,
  Truck,
  Heart,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: string;
  color: string;
  highlights: string[];
}

interface Service {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  icon: React.ElementType;
  color: string;
  steps: ServiceStep[];
  benefits: string[];
  rating: number;
  reviews: number;
}

const services: Service[] = [
  {
    title: 'Atelier AI',
    subtitle: 'AI-Powered Styling',
    description: 'Experience personalized outfit recommendations powered by advanced AI',
    link: '/atelier-ai',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    rating: 4.9,
    reviews: 1247,
    benefits: ['Instant recommendations', 'Perfect color matching', 'Occasion-specific styling'],
    steps: [
      {
        id: 'ai-1',
        title: 'Upload Your Photo',
        description: 'Take or upload a photo for instant analysis',
        icon: Zap,
        duration: '30 seconds',
        color: 'bg-purple-500',
        highlights: ['Face shape analysis', 'Skin tone detection', 'Body type recognition']
      },
      {
        id: 'ai-2',
        title: 'AI Processing',
        description: 'Our AI analyzes your features and preferences',
        icon: Sparkles,
        duration: '10 seconds',
        color: 'bg-pink-500',
        highlights: ['Style DNA creation', 'Color palette matching', 'Trend alignment']
      },
      {
        id: 'ai-3',
        title: 'Personalized Recommendations',
        description: 'Receive curated outfit suggestions',
        icon: Heart,
        duration: 'Instant',
        color: 'bg-red-500',
        highlights: ['Complete outfits', 'Alternative options', 'Shopping links']
      }
    ]
  },
  {
    title: 'Occasion Bundles',
    subtitle: 'Pre-Styled Collections',
    description: 'Complete outfits for every occasion with exclusive bundle pricing',
    link: '/bundles',
    icon: Package,
    color: 'from-amber-500 to-orange-500',
    rating: 4.8,
    reviews: 892,
    benefits: ['Save up to 30%', 'Expertly coordinated', 'No guesswork'],
    steps: [
      {
        id: 'bundle-1',
        title: 'Choose Your Occasion',
        description: 'Select from weddings, business, prom, or formal events',
        icon: Calendar,
        duration: '1 minute',
        color: 'bg-amber-500',
        highlights: ['50+ occasions', 'Seasonal options', 'Style guides']
      },
      {
        id: 'bundle-2',
        title: 'Select Your Bundle',
        description: 'Browse curated complete outfits',
        icon: Package,
        duration: '2 minutes',
        color: 'bg-orange-500',
        highlights: ['3-piece sets', 'Color coordinated', 'Size availability']
      },
      {
        id: 'bundle-3',
        title: 'Customize & Order',
        description: 'Adjust sizes and add to cart',
        icon: CheckCircle,
        duration: '1 minute',
        color: 'bg-green-500',
        highlights: ['Free alterations', 'Express shipping', 'Easy returns']
      }
    ]
  },
  {
    title: 'Wedding Hub',
    subtitle: 'Complete Wedding Services',
    description: 'Comprehensive wedding party management with group discounts',
    link: '/wedding',
    icon: Calendar,
    color: 'from-blue-500 to-indigo-500',
    rating: 5.0,
    reviews: 567,
    benefits: ['Group discounts 15%+', 'Dedicated coordinator', 'Free groom suit'],
    steps: [
      {
        id: 'wedding-1',
        title: 'Initial Consultation',
        description: 'Meet with our wedding specialist',
        icon: Users,
        duration: '45 minutes',
        color: 'bg-blue-500',
        highlights: ['Vision boarding', 'Budget planning', 'Timeline creation']
      },
      {
        id: 'wedding-2',
        title: 'Party Measurements',
        description: 'Schedule group fitting appointments',
        icon: Ruler,
        duration: '30 min/person',
        color: 'bg-indigo-500',
        highlights: ['Professional tailoring', 'Group coordination', 'Size tracking']
      },
      {
        id: 'wedding-3',
        title: 'Style Selection',
        description: 'Choose coordinated looks for the party',
        icon: Palette,
        duration: '1 hour',
        color: 'bg-purple-500',
        highlights: ['Color matching', 'Style variations', 'Accessory pairing']
      },
      {
        id: 'wedding-4',
        title: 'Final Fitting & Delivery',
        description: 'Perfect fit guarantee with delivery',
        icon: Truck,
        duration: '1 week before',
        color: 'bg-green-500',
        highlights: ['Final adjustments', 'Pressed & ready', 'Emergency support']
      }
    ]
  }
];

// Connection line component
function ConnectionLine({ from, to, progress }: { from: HTMLElement | null; to: HTMLElement | null; progress: number }) {
  if (!from || !to) return null;

  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  
  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;
  
  const controlX = (startX + endX) / 2;
  const controlY = Math.min(startY, endY) - 50;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-0" 
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={`gradient-${from.id}-${to.id}`}>
          <stop offset="0%" stopColor="rgb(212, 175, 55)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(139, 0, 0)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
        stroke={`url(#gradient-${from.id}-${to.id})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5 5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: progress,
          opacity: progress > 0 ? 0.6 : 0
        }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}

// Step card component
function StepCard({ 
  step, 
  index, 
  isActive,
  onActivate 
}: { 
  step: ServiceStep; 
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const Icon = step.icon;
  
  return (
    <motion.div
      id={step.id}
      className={cn(
        "relative bg-white rounded-xl p-4 cursor-pointer transition-all duration-300",
        isActive ? "ring-2 ring-burgundy shadow-xl scale-105 z-10" : "shadow-md hover:shadow-lg"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onActivate}
      whileHover={{ y: -5 }}
    >
      {/* Step number badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">
        {index + 1}
      </div>

      {/* Icon with animated background */}
      <div className="relative mb-3">
        <motion.div
          className={cn("w-12 h-12 rounded-lg flex items-center justify-center", step.color)}
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isActive ? Infinity : 0,
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        {/* Duration badge */}
        <div className="absolute -top-2 -right-2">
          <div className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">{step.duration}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
      <p className="text-xs text-gray-600 mb-2">{step.description}</p>

      {/* Highlights (shown when active) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t"
          >
            <div className="space-y-1">
              {step.highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-gray-700">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Service journey card
function ServiceJourney({ service, index }: { service: Service; index: number }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = service.icon;
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance steps when expanded
  useEffect(() => {
    if (!isExpanded) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % service.steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isExpanded, service.steps.length]);

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      {/* Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
              service.color
            )}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.subtitle}</p>
            </div>
          </div>
          
          {/* Rating */}
          <div className="text-right">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(service.rating) ? "text-gold fill-gold" : "text-gray-300"
                  )} 
                />
              ))}
              <span className="text-sm font-semibold ml-1">{service.rating}</span>
            </div>
            <p className="text-xs text-gray-600">{service.reviews} reviews</p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{service.description}</p>

        {/* Benefits */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.benefits.map((benefit, i) => (
            <span 
              key={i}
              className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-200"
            >
              {benefit}
            </span>
          ))}
        </div>

        {/* Expand/Collapse button */}
        <motion.button
          className="flex items-center gap-2 text-burgundy font-semibold"
          animate={{ x: isExpanded ? 5 : 0 }}
        >
          {isExpanded ? 'Hide Journey' : 'View Journey'}
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>

      {/* Journey Steps */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div className="relative">
              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-burgundy to-gold"
                  animate={{ width: `${((activeStep + 1) / service.steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Steps grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {service.steps.map((step, stepIndex) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={stepIndex}
                    isActive={stepIndex === activeStep}
                    onActivate={() => setActiveStep(stepIndex)}
                  />
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <Link href={service.link}>
                  <motion.button
                    className="bg-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-burgundy-700 transition-colors inline-flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Your Journey
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ServiceJourneyVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity, scale }}
      className="space-y-6"
    >
      {services.map((service, index) => (
        <ServiceJourney key={service.title} service={service} index={index} />
      ))}
    </motion.div>
  );
}