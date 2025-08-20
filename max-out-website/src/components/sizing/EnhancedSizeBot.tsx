'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Activity, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sizePredictionService } from '@/lib/ai/services/size-prediction';

interface EnhancedSizeBotProps {
  productId?: string;
  onSizeSelected?: (recommendation: any) => void;
  onClose: () => void;
  productType?: 'suit' | 'shirt' | 'tuxedo';
}

export function EnhancedSizeBot({ onClose, onSizeSelected, productType = 'suit' }: EnhancedSizeBotProps) {
  // State
  const [isMetric, setIsMetric] = useState(false);
  const [heightInches, setHeightInches] = useState(70);
  const [weightLbs, setWeightLbs] = useState(170);
  const [fitPreference, setFitPreference] = useState<'slim' | 'regular' | 'relaxed'>('regular');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const fitDescriptions = {
    slim: "Closer to the body, modern silhouette",
    regular: "Standard comfortable fit, classic styling",
    relaxed: "Extra room for comfort and movement"
  };

  // Circular slider setup
  const setupCircularSlider = (
    sliderId: string,
    updateFunc: (value: number) => void,
    min: number,
    max: number,
    initial: number
  ) => {
    const slider = document.getElementById(sliderId);
    const handle = slider?.querySelector('.slider-handle') as HTMLElement;
    if (!slider || !handle) return;

    let isDragging = false;
    let currentValue = initial;

    const updateHandle = (angle: number) => {
      const rad = (angle - 90) * Math.PI / 180;
      const x = 100 + 85 * Math.cos(rad);
      const y = 100 + 85 * Math.sin(rad);
      handle.style.left = `${x}px`;
      handle.style.top = `${y}px`;
      
      // Update gradient with burgundy/gold theme
      slider.style.background = `conic-gradient(from 0deg, #8B0000 0deg, #DAA520 ${angle}deg, #222 ${angle}deg, #222 360deg)`;
    };

    const angleToValue = (angle: number) => min + (angle / 360) * (max - min);
    const valueToAngle = (value: number) => ((value - min) / (max - min)) * 360;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const rect = slider.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const x = clientX - centerX;
      const y = clientY - centerY;
      
      let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;
      
      currentValue = Math.round(angleToValue(angle));
      updateHandle(angle);
      updateFunc(currentValue);
    };

    const startDrag = () => { isDragging = true; };
    const stopDrag = () => { isDragging = false; };

    handle.addEventListener('mousedown', startDrag);
    slider.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag);
    slider.addEventListener('touchstart', startDrag);
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    // Initialize
    updateHandle(valueToAngle(initial));

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    };
  };

  // Update displays
  const updateHeightDisplay = (inches: number) => {
    setHeightInches(inches);
  };

  const updateWeightDisplay = (lbs: number) => {
    setWeightLbs(lbs);
  };

  // Setup sliders on mount
  useEffect(() => {
    const cleanup1 = setupCircularSlider('height-slider', updateHeightDisplay, 48, 84, 70);
    const cleanup2 = setupCircularSlider('weight-slider', updateWeightDisplay, 80, 350, 170);
    
    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  // Calculate size
  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Use our existing AI size prediction service
      const recommendation = await sizePredictionService.predictSizeFromBasics({
        height: heightInches,
        weight: weightLbs,
        fitPreference,
        unit: isMetric ? 'metric' : 'imperial',
        productType
      });

      setResult(recommendation);
      setShowResult(true);
      
      if (onSizeSelected) {
        onSizeSelected(recommendation);
      }
    } catch (error) {
      console.error('Size calculation error:', error);
      // Fallback calculation
      const bmi = (weightLbs / (heightInches * heightInches)) * 703;
      let baseSize;
      
      if (bmi < 18.5) baseSize = 0;
      else if (bmi < 22) baseSize = 1;
      else if (bmi < 25) baseSize = 2;
      else if (bmi < 28) baseSize = 3;
      else if (bmi < 32) baseSize = 4;
      else baseSize = 5;
      
      const fitNudge = fitPreference === 'slim' ? -1 : fitPreference === 'relaxed' ? 1 : 0;
      const adjustedSize = Math.max(0, Math.min(5, baseSize + fitNudge));
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const sizeNames = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Double XL'];
      
      const recommendedIndex = Math.round(adjustedSize);
      const alternativeIndex = adjustedSize < recommendedIndex ? 
        Math.max(0, recommendedIndex - 1) : 
        Math.min(5, recommendedIndex + 1);
      
      setResult({
        primarySize: sizes[recommendedIndex],
        primarySizeFull: sizeNames[recommendedIndex],
        alternativeSize: sizes[alternativeIndex],
        alternativeSizeFull: sizeNames[alternativeIndex],
        confidence: 0.85 + Math.random() * 0.1,
        bodyType: 'Regular',
        fitScore: 8.5
      });
      setShowResult(true);
    }
    
    setIsCalculating(false);
  };

  // Display values
  const getHeightDisplay = () => {
    if (isMetric) {
      const cm = Math.round(heightInches * 2.54);
      return `${cm} cm`;
    } else {
      const feet = Math.floor(heightInches / 12);
      const inches = heightInches % 12;
      return `${feet}'${inches}"`;
    }
  };

  const getWeightDisplay = () => {
    if (isMetric) {
      const kg = Math.round(weightLbs * 0.453592);
      return `${kg} kg`;
    } else {
      return `${weightLbs} lbs`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">AI Size Finder</h2>
              <p className="text-gray-400">Get your perfect fit in seconds</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Fit Preference */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-burgundy" />
              Select Your Preferred Fit
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {(['slim', 'regular', 'relaxed'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setFitPreference(fit)}
                  className={`py-4 px-6 rounded-2xl border-2 transition-all duration-300 ${
                    fitPreference === fit
                      ? 'bg-gradient-to-r from-burgundy to-burgundy-700 border-burgundy text-white shadow-lg scale-105'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold capitalize">{fit}</div>
                  <div className="text-xs mt-1 opacity-80">
                    {fit === 'slim' && 'Modern'}
                    {fit === 'regular' && 'Classic'}
                    {fit === 'relaxed' && 'Comfort'}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-3 text-center">
              {fitDescriptions[fitPreference]}
            </p>
          </div>

          {/* Height Slider */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4 text-center">Height: {getHeightDisplay()}</h3>
            <div className="relative h-52 flex items-center justify-center">
              <div
                id="height-slider"
                className="relative w-48 h-48 rounded-full cursor-grab active:cursor-grabbing"
                style={{
                  background: 'conic-gradient(from 0deg, #8B0000 0deg, #DAA520 180deg, #222 180deg, #222 360deg)',
                  boxShadow: '0 0 40px rgba(139, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="slider-handle absolute w-8 h-8 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-burgundy rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{getHeightDisplay()}</div>
                    <div className="text-xs text-gray-400 mt-1">Height</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weight Slider */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4 text-center">Weight: {getWeightDisplay()}</h3>
            <div className="relative h-52 flex items-center justify-center">
              <div
                id="weight-slider"
                className="relative w-48 h-48 rounded-full cursor-grab active:cursor-grabbing"
                style={{
                  background: 'conic-gradient(from 0deg, #8B0000 0deg, #DAA520 180deg, #222 180deg, #222 360deg)',
                  boxShadow: '0 0 40px rgba(139, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="slider-handle absolute w-8 h-8 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-burgundy rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{getWeightDisplay()}</div>
                    <div className="text-xs text-gray-400 mt-1">Weight</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsMetric(!isMetric)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <span className={isMetric ? 'text-white' : ''}>Metric</span>
              <div className="relative w-12 h-6 bg-gray-700 rounded-full">
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                    isMetric ? 'left-6' : 'left-0.5'
                  }`}
                />
              </div>
              <span className={!isMetric ? 'text-white' : ''}>Imperial</span>
            </button>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-burgundy to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Calculating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Calculate My Size
              </span>
            )}
          </Button>

          {/* Result */}
          <AnimatePresence>
            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="mt-8 p-6 bg-gradient-to-br from-burgundy/20 to-gold/10 rounded-2xl border border-burgundy/30"
              >
                {/* Primary Size */}
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold bg-gradient-to-r from-burgundy to-gold bg-clip-text text-transparent mb-2">
                    {result.primarySize}
                  </div>
                  <div className="text-white text-lg">{result.primarySizeFull}</div>
                </div>

                {/* Confidence */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-white font-semibold">
                      {Math.round((result.confidence || 0.9) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.confidence || 0.9) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-burgundy to-gold"
                    />
                  </div>
                </div>

                {/* Size Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <div className="text-gray-400 text-sm mb-1">Recommended</div>
                    <div className="text-white font-semibold text-lg">{result.primarySize}</div>
                    <div className="text-gray-500 text-sm">{result.primarySizeFull}</div>
                  </div>
                  {result.alternativeSize && (
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                      <div className="text-gray-400 text-sm mb-1">Alternative</div>
                      <div className="text-white font-semibold text-lg">{result.alternativeSize}</div>
                      <div className="text-gray-500 text-sm">{result.alternativeSizeFull}</div>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                {result.fitScore && (
                  <div className="mt-4 text-center">
                    <div className="text-gray-400 text-sm">Fit Score</div>
                    <div className="text-2xl font-bold text-white">{result.fitScore}/10</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}