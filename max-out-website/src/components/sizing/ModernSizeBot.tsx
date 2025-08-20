'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Ruler, Activity, TrendingUp, ChevronLeft, ChevronRight, 
  Info, Check, AlertCircle, Zap, Target, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sizePredictionService } from '@/lib/ai/services/size-prediction';

interface ModernSizeBotProps {
  productId?: string;
  onSizeSelected?: (recommendation: any) => void;
  onClose?: () => void;
  productType?: 'suit' | 'shirt' | 'tuxedo';
  isModal?: boolean;
  compact?: boolean;
}

export function ModernSizeBot({ 
  onClose, 
  onSizeSelected, 
  productType = 'suit',
  isModal = true,
  compact = false
}: ModernSizeBotProps) {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [isMetric, setIsMetric] = useState(false);
  const [heightInches, setHeightInches] = useState(70);
  const [weightLbs, setWeightLbs] = useState(170);
  const [fitPreference, setFitPreference] = useState<'slim' | 'regular' | 'relaxed'>('regular');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showTips, setShowTips] = useState(false);

  const steps = ['Fit Style', 'Height', 'Weight', 'Results'];

  const fitDescriptions = {
    slim: {
      title: "Slim Fit",
      subtitle: "Modern & Tailored",
      description: "Closer to the body with a contemporary silhouette",
      icon: "✨"
    },
    regular: {
      title: "Regular Fit", 
      subtitle: "Classic & Versatile",
      description: "Traditional fit with comfortable room through chest and waist",
      icon: "👔"
    },
    relaxed: {
      title: "Relaxed Fit",
      subtitle: "Comfort First",
      description: "Extra room for maximum comfort and ease of movement",
      icon: "🛋️"
    }
  };

  // Height selection helpers
  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      const totalInches = ft * 12 + inch;
      if (totalInches >= 48 && totalInches <= 84) {
        heightOptions.push({
          value: totalInches,
          label: `${ft}'${inch}"`,
          cm: Math.round(totalInches * 2.54)
        });
      }
    }
  }

  // Weight selection helpers
  const getWeightOptions = () => {
    const options = [];
    const start = isMetric ? 35 : 80;
    const end = isMetric ? 160 : 350;
    const step = isMetric ? 5 : 10;
    
    for (let i = start; i <= end; i += step) {
      options.push(i);
    }
    return options;
  };

  // Calculate size
  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Convert weight to pounds if in metric
      const weightInPounds = isMetric ? weightLbs * 2.20462 : weightLbs;
      
      console.log('Size calculation inputs:', {
        heightInches,
        weightLbs,
        weightInPounds,
        isMetric,
        fitPreference,
        productType
      });
      
      const recommendation = await sizePredictionService.predictSizeFromBasics({
        height: heightInches,
        weight: weightInPounds,
        fitPreference,
        unit: 'imperial',
        productType
      });

      console.log('Size recommendation:', recommendation);

      setResult({
        ...recommendation,
        perfectMatch: recommendation.confidence > 0.85,
        needsAlteration: recommendation.alterations && recommendation.alterations.length > 0
      });
      
      if (onSizeSelected) {
        onSizeSelected(recommendation);
      }
    } catch (error) {
      console.error('Size calculation error:', error);
      // Fallback
      setResult({
        primarySize: '40R',
        primarySizeFull: '40 Regular',
        confidence: 0.85,
        bodyType: 'Regular',
        fitScore: 8.5,
        perfectMatch: false
      });
    }
    
    setIsCalculating(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(steps.length - 1);
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 2) {
        handleCalculate();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Display values
  const getHeightDisplay = () => {
    const feet = Math.floor(heightInches / 12);
    const inches = heightInches % 12;
    const cm = Math.round(heightInches * 2.54);
    return isMetric ? `${cm} cm` : `${feet}'${inches}"`;
  };

  const getWeightDisplay = () => {
    if (isMetric) {
      return `${weightLbs} kg`;
    } else {
      return `${weightLbs} lbs`;
    }
  };

  // Render content
  const renderContent = () => {
    return (
      <div className={`${compact ? 'p-4' : 'p-6 md:p-8'} ${isModal ? '' : 'bg-white rounded-2xl shadow-xl'}`}>
        {/* Header */}
        {!compact && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-1">
                AI Size Finder
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Get your perfect {productType} size in 30 seconds
              </p>
            </div>
            {isModal && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 ${index < steps.length - 1 ? 'mr-2' : ''}`}
              >
                <div className="relative">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-burgundy to-gold'
                        : 'bg-gray-200'
                    }`}
                  />
                  {index <= currentStep && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-burgundy via-burgundy-600 to-gold"
                    />
                  )}
                </div>
                <p className={`text-xs mt-1 ${
                  index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-burgundy" />
                How do you like your {productType}s to fit?
              </h3>
              
              <div className="grid gap-3">
                {(['slim', 'regular', 'relaxed'] as const).map((fit) => (
                  <motion.button
                    key={fit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFitPreference(fit)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      fitPreference === fit
                        ? 'border-burgundy bg-gradient-to-r from-burgundy/5 to-gold/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{fitDescriptions[fit].icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {fitDescriptions[fit].title}
                          </span>
                          <span className="text-sm text-gray-500">
                            {fitDescriptions[fit].subtitle}
                          </span>
                          {fitPreference === fit && (
                            <Check className="h-4 w-4 text-burgundy ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {fitDescriptions[fit].description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2 text-sm text-burgundy hover:text-burgundy-700 mt-4"
              >
                <Info className="h-4 w-4" />
                Not sure which to choose?
              </button>

              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700"
                  >
                    <p className="font-medium mb-2">Quick Guide:</p>
                    <ul className="space-y-1">
                      <li>• <strong>Slim:</strong> Best for lean builds, gym-goers who want to show physique</li>
                      <li>• <strong>Regular:</strong> Most versatile, works for 80% of body types</li>
                      <li>• <strong>Relaxed:</strong> Great for comfort, broader builds, or layering</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="height"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Ruler className="h-5 w-5 text-burgundy" />
                What's your height?
              </h3>

              {/* Unit Toggle */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setIsMetric(false)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !isMetric
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ft/in
                  </button>
                  <button
                    onClick={() => setIsMetric(true)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isMetric
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    cm
                  </button>
                </div>
              </div>

              {/* Height Display */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {getHeightDisplay()}
                </div>
                <p className="text-gray-500">
                  {isMetric ? 
                    `${Math.floor(heightInches / 12)}'${heightInches % 12}"` : 
                    `${Math.round(heightInches * 2.54)} cm`
                  }
                </p>
              </div>

              {/* Height Slider */}
              <div className="px-4">
                <input
                  type="range"
                  min="48"
                  max="84"
                  value={heightInches}
                  onChange={(e) => setHeightInches(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8B0000 0%, #DAA520 ${((heightInches - 48) / 36) * 100}%, #e5e7eb ${((heightInches - 48) / 36) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>4'0"</span>
                  <span>5'6"</span>
                  <span>7'0"</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {[60, 66, 68, 70, 72, 74, 76].map((h) => {
                  const ft = Math.floor(h / 12);
                  const inch = h % 12;
                  return (
                    <button
                      key={h}
                      onClick={() => setHeightInches(h)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        heightInches === h
                          ? 'bg-burgundy text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {ft}'{inch}"
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="weight"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-burgundy" />
                What's your weight?
              </h3>

              {/* Weight Display */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {getWeightDisplay()}
                </div>
                <p className="text-gray-500">
                  {isMetric ? 
                    `${Math.round(weightLbs * 2.20462)} lbs` : 
                    `${Math.round(weightLbs * 0.453592)} kg`
                  }
                </p>
              </div>

              {/* Weight Slider */}
              <div className="px-4">
                <input
                  type="range"
                  min={isMetric ? 35 : 80}
                  max={isMetric ? 160 : 350}
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8B0000 0%, #DAA520 ${
                      isMetric 
                        ? ((weightLbs - 35) / 125) * 100 
                        : ((weightLbs - 80) / 270) * 100
                    }%, #e5e7eb ${
                      isMetric 
                        ? ((weightLbs - 35) / 125) * 100 
                        : ((weightLbs - 80) / 270) * 100
                    }%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{isMetric ? '35 kg' : '80 lbs'}</span>
                  <span>{isMetric ? '95 kg' : '215 lbs'}</span>
                  <span>{isMetric ? '160 kg' : '350 lbs'}</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {(isMetric ? [50, 60, 70, 80, 90, 100, 110] : [120, 140, 160, 180, 200, 220, 240]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeightLbs(w)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      weightLbs === w
                        ? 'bg-burgundy text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {w} {isMetric ? 'kg' : 'lbs'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {isCalculating ? (
                <div className="text-center py-12">
                  <div className="relative inline-flex">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-burgundy rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                  </div>
                  <p className="text-gray-600 mt-4">Analyzing your measurements...</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Primary Recommendation */}
                  <div className="text-center">
                    {result.perfectMatch && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3"
                      >
                        <Sparkles className="h-4 w-4" />
                        Perfect Match Found!
                      </motion.div>
                    )}
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="inline-block"
                    >
                      <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-burgundy to-gold bg-clip-text text-transparent">
                        {result.primarySize}
                      </div>
                    </motion.div>
                    
                    <p className="text-xl text-gray-700 mt-2">{result.primarySizeFull}</p>
                    
                    {result.bodyType && (
                      <p className="text-sm text-gray-500 mt-1">
                        {result.bodyType} Build Detected
                      </p>
                    )}
                  </div>

                  {/* Confidence Meter */}
                  <div className="max-w-xs mx-auto">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Confidence</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round((result.confidence || 0.9) * 100)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(result.confidence || 0.9) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-burgundy to-gold relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Alternative Size */}
                  {result.alternativeSize && (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Also Consider</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">
                          {result.alternativeSize}
                        </span>
                        <span className="text-gray-600">
                          {result.alternativeSizeFull}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Alterations */}
                  {result.alterations && result.alterations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">
                            Recommended Alterations
                          </p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {result.alterations.map((alt: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">•</span>
                                <span>{alt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        if (onSizeSelected) {
                          onSizeSelected(result);
                        }
                        if (isModal && onClose) {
                          onClose();
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-burgundy to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Use This Size
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(0)}
                      variant="outline"
                      className="flex-1 border-gray-300"
                    >
                      Start Over
                    </Button>
                  </div>

                  {/* Rationale */}
                  {result.rationale && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <button
                        onClick={() => setShowTips(!showTips)}
                        className="text-sm text-burgundy hover:text-burgundy-700 inline-flex items-center gap-1"
                      >
                        <Info className="h-4 w-4" />
                        Why this size?
                      </button>
                      
                      <AnimatePresence>
                        {showTips && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 text-left"
                          >
                            {result.rationale}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={nextStep}
              className="flex-1 bg-gradient-to-r from-burgundy to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white"
            >
              {currentStep === 2 ? (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  Get My Size
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render based on modal or embedded
  if (isModal) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return renderContent();
}