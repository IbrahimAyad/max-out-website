'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductHotspotProps {
  product: Product;
  x: number;
  y: number;
  isVisible: boolean;
  onClick: (product: Product) => void;
}

export function ProductHotspot({
  product,
  x,
  y,
  isVisible,
  onClick
}: ProductHotspotProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute z-30 cursor-pointer"
        style={{ 
          left: `${x}%`, 
          top: `${y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => onClick(product)}
      >
        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 w-12 h-12 border-2 border-gold rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        {/* Main Hotspot */}
        <motion.div
          className="relative w-12 h-12 bg-white/10 backdrop-blur-sm border border-gold/50 rounded-full flex items-center justify-center group hover:bg-gold/20 hover:border-gold transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-5 h-5 text-gold group-hover:text-white transition-colors" />
          
          {/* Hover Card */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileHover={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-black/90 backdrop-blur-sm rounded-lg p-3 text-white shadow-xl border border-gold/20 pointer-events-none group-hover:pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm leading-tight">{product.name}</h4>
                <p className="text-gold text-lg font-bold">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            </div>
            
            <button className="w-full mt-3 px-3 py-2 bg-gold text-black rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            
            {/* Arrow */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-black/90" />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}