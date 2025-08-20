'use client';

import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Check, Heart, ShoppingCart, Star, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

// Satisfying Button with Micro-Interactions
interface SatisfyingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SatisfyingButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  type
}: SatisfyingButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = async () => {
    setIsPressed(true);
    setIsLoading(true);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    try {
      await onClick?.();
      setIsSuccess(true);
      
      // Success haptic
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }

      setTimeout(() => {
        setIsSuccess(false);
        setIsLoading(false);
        setIsPressed(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setIsPressed(false);
    }
  };

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
    secondary: 'bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black',
    ghost: 'bg-transparent border-2 border-gray-300 hover:border-gold hover:bg-gold/10 text-gray-700'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-lg font-semibold transition-all duration-300
        ${variants[variant]} ${sizes[size]} ${className}
        ${isPressed ? 'scale-95' : 'scale-100'}
        focus:outline-none focus:ring-4 focus:ring-purple-300/50
      `}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={disabled || isLoading || isSuccess}
      type={type}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />

      {/* Ripple Effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Loading...
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Success!
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

// Floating Heart Animation
export function FloatingHeart({ onComplete }: { onComplete?: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
        top: typeof window !== 'undefined' ? window.innerHeight - 100 : 0,
      }}
      initial={{ y: 0, opacity: 1, scale: 0 }}
      animate={{ 
        y: -200, 
        opacity: 0, 
        scale: [0, 1.2, 1, 0],
        rotate: [0, 10, -10, 0]
      }}
      transition={{ duration: 3, ease: "easeOut" }}
    >
      <Heart className="w-8 h-8 text-red-500 fill-current" />
    </motion.div>
  );
}

// Success Celebration
export function SuccessCelebration({ trigger }: { trigger: boolean }) {
  useEffect(() => {
    if (trigger) {
      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#3b82f6', '#f59e0b', '#ef4444']
      });

      // Multiple smaller bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
      }, 250);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <span className="text-xl font-bold">Item Added to Cart!</span>
              <ShoppingCart className="w-6 h-6" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Smooth Page Transition
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// Loading State with Skeleton
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg h-full" />
    </div>
  );
}

// Interactive Card Hover
interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function InteractiveCard({ 
  children, 
  className = '', 
  onClick,
  ...props 
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl bg-white border border-gray-200 cursor-pointer
        ${className}
      `}
      whileHover={{ 
        y: -8,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Hover Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Sparkle Effect */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  rotate: 360
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.2,
                  repeat: Infinity 
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Magnetic Button Effect
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ 
  children, 
  className = '',
  strength = 0.3,
  onClick,
  disabled,
  type
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}

// Star Rating with Animation
export function AnimatedStarRating({ 
  rating, 
  onRatingChange,
  size = 'md' 
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleClick = (value: number) => {
    setIsAnimating(true);
    onRatingChange?.(value);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <motion.button
          key={value}
          className={`${sizes[size]} transition-colors`}
          onMouseEnter={() => setHoverRating(value)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(value)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={isAnimating && value <= rating ? {
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          } : {}}
          transition={{ duration: 0.6, delay: (value - 1) * 0.1 }}
        >
          <Star
            className={`w-full h-full ${
              value <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}

// Floating Action Button
export function FloatingActionButton({ 
  icon: Icon, 
  label, 
  onClick,
  position = 'bottom-right' 
}: {
  icon: any;
  label: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <motion.div
      className={`fixed ${positions[position]} z-40`}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
    >
      <motion.button
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        layout
      >
        <div className="p-4">
          <Icon className="w-6 h-6" />
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              className="pr-4 font-semibold whitespace-nowrap"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

// Pulse Effect for Important Elements
export function PulseEffect({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(147, 51, 234, 0.4)',
          '0 0 0 10px rgba(147, 51, 234, 0)',
          '0 0 0 0 rgba(147, 51, 234, 0)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated Counter
export function AnimatedCounter({ 
  value, 
  duration = 2,
  className = ''
}: { 
  value: number; 
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { 
    stiffness: 50,
    damping: 15
  });
  
  useEffect(() => {
    spring.set(value);
    
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    
    return unsubscribe;
  }, [value, spring]);
  
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}