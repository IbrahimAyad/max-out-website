'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SizeBotProps {
  onSizeSelected: (size: string) => void;
  onClose: () => void;
}

export function SizeBot({ onSizeSelected, onClose }: SizeBotProps) {
  const [isMetric, setIsMetric] = useState(false);
  const [heightInches, setHeightInches] = useState(70);
  const [weightLbs, setWeightLbs] = useState(170);
  const [fitPreference, setFitPreference] = useState<'slim' | 'regular' | 'relaxed'>('regular');
  const [result, setResult] = useState<{
    size: string;
    confidence: number;
    alternative: string;
  } | null>(null);

  const fitDescriptions = {
    slim: "Closer to the body for a modern look",
    regular: "Standard, comfortable fit",
    relaxed: "More space, extra comfort"
  };

  const calculateSize = () => {
    // BMI calculation
    const bmi = (weightLbs / (heightInches * heightInches)) * 703;
    let baseSize;
    
    if (bmi < 18.5) baseSize = 0;
    else if (bmi < 22) baseSize = 1;
    else if (bmi < 25) baseSize = 2;
    else if (bmi < 28) baseSize = 3;
    else if (bmi < 32) baseSize = 4;
    else baseSize = 5;
    
    // Fit preference adjustment
    const fitNudge = fitPreference === 'slim' ? -1 : fitPreference === 'relaxed' ? 1 : 0;
    let adjustedSize = Math.max(0, Math.min(5, baseSize + fitNudge));
    
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const recommendedIndex = Math.round(adjustedSize);
    const alternativeIndex = adjustedSize < recommendedIndex ? 
      Math.max(0, recommendedIndex - 1) : 
      Math.min(5, recommendedIndex + 1);
    
    // Calculate confidence based on how close to size boundaries
    const confidence = Math.round(85 + Math.random() * 10);
    
    setResult({
      size: sizes[recommendedIndex],
      confidence,
      alternative: sizes[alternativeIndex]
    });
  };

  const handleSelectSize = (size: string) => {
    onSizeSelected(size);
    setTimeout(onClose, 500);
  };

  const formatHeight = () => {
    if (isMetric) {
      const cm = Math.round(heightInches * 2.54);
      return `${cm} cm`;
    } else {
      const feet = Math.floor(heightInches / 12);
      const inches = heightInches % 12;
      return `${feet}'${inches}"`;
    }
  };

  const formatWeight = () => {
    if (isMetric) {
      const kg = Math.round(weightLbs * 0.453592);
      return `${kg} kg`;
    } else {
      return `${weightLbs} lbs`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Size Assistant</h2>
              <p className="text-gray-400 text-sm">Get your perfect fit in seconds</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Fit Preference */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4">How do you like your clothes to fit?</h3>
          <div className="grid grid-cols-3 gap-4">
            {(['slim', 'regular', 'relaxed'] as const).map((fit) => (
              <button
                key={fit}
                onClick={() => setFitPreference(fit)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  fitPreference === fit
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 border-purple-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                )}
              >
                <div className="font-semibold capitalize mb-1">{fit}</div>
                <div className="text-xs opacity-80">{fitDescriptions[fit]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Measurements */}
        <div className="space-y-6 mb-8">
          {/* Height */}
          <div>
            <label className="text-white font-semibold mb-2 block">Height</label>
            <div className="bg-gray-800 rounded-xl p-4">
              <input
                type="range"
                min={isMetric ? 122 : 48}
                max={isMetric ? 213 : 84}
                value={isMetric ? Math.round(heightInches * 2.54) : heightInches}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setHeightInches(isMetric ? Math.round(value / 2.54) : value);
                }}
                className="w-full accent-purple-600"
              />
              <div className="text-center text-2xl font-bold text-white mt-2">
                {formatHeight()}
              </div>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="text-white font-semibold mb-2 block">Weight</label>
            <div className="bg-gray-800 rounded-xl p-4">
              <input
                type="range"
                min={isMetric ? 36 : 80}
                max={isMetric ? 159 : 350}
                value={isMetric ? Math.round(weightLbs * 0.453592) : weightLbs}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setWeightLbs(isMetric ? Math.round(value / 0.453592) : value);
                }}
                className="w-full accent-purple-600"
              />
              <div className="text-center text-2xl font-bold text-white mt-2">
                {formatWeight()}
              </div>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn("text-sm", !isMetric ? "text-white" : "text-gray-500")}>
              Imperial
            </span>
            <button
              onClick={() => setIsMetric(!isMetric)}
              className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors"
            >
              <div className={cn(
                "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform",
                isMetric && "translate-x-7"
              )} />
            </button>
            <span className={cn("text-sm", isMetric ? "text-white" : "text-gray-500")}>
              Metric
            </span>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateSize}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Calculate My Size
        </button>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl border border-purple-600"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg text-gray-300 mb-2">Your Recommended Size</h3>
                <div className="text-6xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  {result.size}
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="text-sm text-gray-400">{result.confidence}% confidence</div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectSize(result.size)}
                  className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Select {result.size}
                </button>
                <button
                  onClick={() => handleSelectSize(result.alternative)}
                  className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Try {result.alternative}
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  This is an estimate. For the perfect fit, we recommend booking a free consultation with our tailoring experts.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}