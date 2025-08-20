"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

// Luxury Animation Variants
export const luxuryAnimations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for luxury feel
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },

  // Stagger children animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },

  // Premium hover effects
  luxuryHover: {
    rest: { 
      scale: 1, 
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(139, 38, 53, 0.1), 0 10px 10px -5px rgba(139, 38, 53, 0.04)",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },

  // Button animations
  luxuryButton: {
    rest: { 
      scale: 1,
      backgroundImage: "linear-gradient(0deg, #8B2635, #8B2635)",
    },
    hover: { 
      scale: 1.05,
      backgroundImage: "linear-gradient(180deg, #A73D4C, #8B2635)",
      boxShadow: "0 10px 30px rgba(139, 38, 53, 0.3)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  },

  // Card reveal animations
  cardReveal: {
    initial: { 
      opacity: 0, 
      y: 60,
      rotateX: -15
    },
    animate: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },

  // Progress animations
  progressBar: {
    initial: { scaleX: 0 },
    animate: (progress: number) => ({
      scaleX: progress / 100,
      transition: {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3
      }
    })
  },

  // Floating animations
  float: {
    animate: {
      y: [-4, 4, -4],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Shimmer loading effect
  shimmer: {
    animate: {
      backgroundPosition: ["0% 0%", "100% 0%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // Pulse effect
  luxuryPulse: {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(139, 38, 53, 0.4)",
        "0 0 0 10px rgba(139, 38, 53, 0)",
        "0 0 0 0 rgba(139, 38, 53, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Slide in from sides
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },

  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },

  // Morphing animations
  morph: {
    initial: { borderRadius: "0px" },
    animate: { 
      borderRadius: ["0px", "20px", "40px", "20px", "0px"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Luxury Micro-interactions Components

// Premium Button Component
export function LuxuryButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#8B2635] to-[#6B1C28] text-white border-transparent';
      case 'secondary':
        return 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-black border-transparent';
      case 'outline':
        return 'bg-transparent text-[#8B2635] border-[#8B2635] border-2';
      case 'ghost':
        return 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100';
      default:
        return 'bg-gradient-to-r from-[#8B2635] to-[#6B1C28] text-white border-transparent';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-sm';
      case 'large':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-semibold transition-all
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      variants={luxuryAnimations.luxuryButton}
      initial="rest"
      whileHover={!disabled && !loading ? "hover" : "rest"}
      whileTap={!disabled && !loading ? "tap" : "rest"}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effect */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : icon ? (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon}
          </motion.div>
        ) : null}
        <span>{children}</span>
      </div>
    </motion.button>
  );
}

// Luxury Card Component
export function LuxuryCard({ 
  children, 
  className = '', 
  hoverable = true, 
  onClick,
  delay = 0,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  delay?: number;
  [key: string]: any;
}) {
  return (
    <motion.div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
      variants={luxuryAnimations.cardReveal}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      whileHover={hoverable ? {
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(139, 38, 53, 0.1), 0 10px 10px -5px rgba(139, 38, 53, 0.04)",
        transition: { duration: 0.3 }
      } : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Luxury Progress Ring
export function LuxuryProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = "#8B2635",
  backgroundColor = "#f3f4f6",
  children 
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ 
            duration: 1.5, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3
          }}
        />
      </svg>
      
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// Luxury Input Component
export function LuxuryInput({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}: {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          className={`
            absolute left-4 transition-all duration-300 pointer-events-none
            ${focused || hasValue 
              ? '-top-2 text-xs bg-white px-1 text-[#8B2635] font-medium' 
              : 'top-3 text-gray-500'
            }
          `}
          animate={{
            y: focused || hasValue ? -8 : 0,
            scale: focused || hasValue ? 0.85 : 1,
            color: focused ? "#8B2635" : "#6B7280"
          }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          className={`
            w-full px-4 py-3 border rounded-xl transition-all duration-300
            ${icon ? 'pl-10' : ''}
            ${focused 
              ? 'border-[#8B2635] ring-2 ring-[#8B2635]/20' 
              : error 
              ? 'border-red-300 ring-2 ring-red-100'
              : 'border-gray-300 hover:border-gray-400'
            }
            focus:outline-none
          `}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Luxury Loading Skeleton
export function LuxurySkeleton({ 
  className = '', 
  count = 1,
  height = 'h-4'
}: {
  className?: string;
  count?: number;
  height?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg`}
          variants={luxuryAnimations.shimmer}
          animate="animate"
          style={{
            backgroundSize: "200% 100%"
          }}
        />
      ))}
    </div>
  );
}

// Luxury Toast Notification
export function LuxuryToast({ 
  type = 'success', 
  title, 
  message, 
  onClose,
  autoClose = true,
  duration = 5000
}: {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`
        p-4 rounded-xl border shadow-lg backdrop-blur-sm max-w-md
        ${getTypeStyles()}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-lg hover:bg-black/10 transition-colors"
        >
          ×
        </button>
      </div>
      
      {/* Progress bar */}
      {autoClose && (
        <motion.div
          className="mt-3 h-1 bg-current opacity-30 rounded-full overflow-hidden"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

// Intersection Observer Hook for Animations
export function useInViewAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold, once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}

// Luxury Reveal Animation
export function LuxuryReveal({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}) {
  const { ref, controls } = useInViewAnimation();

  const getDirection = () => {
    switch (direction) {
      case 'up': return { y: 30 };
      case 'down': return { y: -30 };
      case 'left': return { x: 30 };
      case 'right': return { x: -30 };
      default: return { y: 30 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...getDirection()
      }}
      animate={controls}
      variants={{
        animate: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Luxury Stagger Container
export function LuxuryStagger({ 
  children, 
  stagger = 0.1, 
  className = '' 
}: {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}) {
  const { ref, controls } = useInViewAnimation();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={controls}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: stagger,
            delayChildren: 0.1
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            initial: { opacity: 0, y: 30 },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Export all luxury animations and components
export default {
  luxuryAnimations,
  LuxuryButton,
  LuxuryCard,
  LuxuryProgressRing,
  LuxuryInput,
  LuxurySkeleton,
  LuxuryToast,
  LuxuryReveal,
  LuxuryStagger,
  useInViewAnimation
};