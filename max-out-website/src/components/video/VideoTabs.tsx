'use client';

import { motion } from 'framer-motion';
import { Leaf, Sun, Zap, Palette } from 'lucide-react';

export type WeddingCollection = 'rustic' | 'summer' | 'modern' | 'fall';

interface VideoTabsProps {
  activeTab: WeddingCollection;
  onTabChange: (tab: WeddingCollection) => void;
}

const tabConfig = {
  rustic: {
    label: 'Rustic',
    icon: Leaf,
    color: 'from-amber-600 to-amber-700',
    hoverColor: 'hover:from-amber-700 hover:to-amber-800'
  },
  summer: {
    label: 'Summer',
    icon: Sun,
    color: 'from-sky-500 to-sky-600',
    hoverColor: 'hover:from-sky-600 hover:to-sky-700'
  },
  modern: {
    label: 'Modern',
    icon: Zap,
    color: 'from-slate-600 to-slate-700',
    hoverColor: 'hover:from-slate-700 hover:to-slate-800'
  },
  fall: {
    label: 'Fall',
    icon: Palette,
    color: 'from-orange-600 to-red-600',
    hoverColor: 'hover:from-orange-700 hover:to-red-700'
  }
};

export function VideoTabs({ activeTab, onTabChange }: VideoTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 border border-gold/20">
        <div className="flex gap-2">
          {(Object.keys(tabConfig) as WeddingCollection[]).map((tab) => {
            const config = tabConfig[tab];
            const Icon = config.icon;
            const isActive = activeTab === tab;
            
            return (
              <motion.button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                    : `text-white/70 hover:text-white hover:bg-white/10`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                {config.label}
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-gold/20 to-gold/10 rounded-full border border-gold/30"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}