'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Play, Info, Check, ArrowRight, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MeasurementType = 'chest' | 'waist' | 'sleeve' | 'inseam' | 'outseam';

interface MeasurementData {
  id: MeasurementType;
  name: string;
  icon: string;
  description: string;
  steps: string[];
  tips: string[];
  videoUrl?: string;
  diagram: {
    measurementLine: { x1: number; y1: number; x2: number; y2: number };
    label: string;
    dots: { x: number; y: number }[];
    path?: string; // Optional curved path for complex measurements
  };
}

const measurementData: Record<MeasurementType, MeasurementData> = {
  chest: {
    id: 'chest',
    name: 'Chest',
    icon: '👔',
    description: 'The chest measurement is crucial for a perfect fitting jacket. Stand relaxed with arms at your sides.',
    steps: [
      'Stand straight with arms relaxed at your sides',
      'Wrap the measuring tape around the fullest part of your chest',
      'Keep the tape parallel to the floor',
      'Take a deep breath and let it out',
      'Record the measurement at normal breathing'
    ],
    tips: [
      'Keep the measuring tape parallel to the floor',
      'Don\'t pull the tape too tight',
      'Measure over a thin shirt for accuracy',
      'Have someone help you for best results'
    ],
    diagram: {
      measurementLine: { x1: 100, y1: 120, x2: 300, y2: 120 },
      label: '40"',
      dots: [{ x: 100, y: 120 }, { x: 300, y: 120 }]
    }
  },
  waist: {
    id: 'waist',
    name: 'Waist',
    icon: '👖',
    description: 'Measure around your natural waistline, typically where your body bends side to side.',
    steps: [
      'Find your natural waistline (usually at belly button level)',
      'Stand straight and relaxed',
      'Wrap the tape around your waist',
      'Keep one finger between tape and body',
      'Record the measurement'
    ],
    tips: [
      'Don\'t suck in your stomach',
      'Measure at your natural waist, not where you wear your pants',
      'The tape should be snug but not tight',
      'Exhale normally before taking the measurement'
    ],
    diagram: {
      measurementLine: { x1: 110, y1: 180, x2: 290, y2: 180 },
      label: '32"',
      dots: [{ x: 110, y: 180 }, { x: 200, y: 180 }, { x: 290, y: 180 }],
      path: 'M 110 180 Q 200 175 290 180' // Slight curve for waist
    }
  },
  sleeve: {
    id: 'sleeve',
    name: 'Sleeve Length',
    icon: '🦾',
    description: 'Measure from the center back of your neck, over the shoulder, and down to your wrist.',
    steps: [
      'Start at the center back of your neck',
      'Measure across to your shoulder point',
      'Continue down your arm to your wrist bone',
      'Keep your arm slightly bent',
      'Record the total measurement'
    ],
    tips: [
      'Keep your arm slightly bent at the elbow',
      'Measure to where you want the sleeve to end',
      'Have someone help you for accuracy',
      'Add 1/2 inch if you prefer longer sleeves'
    ],
    diagram: {
      measurementLine: { x1: 200, y1: 65, x2: 280, y2: 180 },
      label: '33"',
      dots: [{ x: 200, y: 65 }, { x: 250, y: 80 }, { x: 280, y: 180 }],
      path: 'M 200 65 Q 230 70 250 80 Q 270 100 280 180' // Curved path for sleeve
    }
  },
  inseam: {
    id: 'inseam',
    name: 'Inseam',
    icon: '📏',
    description: 'Measure from the crotch seam to the bottom of your ankle bone.',
    steps: [
      'Stand straight with feet shoulder-width apart',
      'Measure from the crotch seam',
      'Continue down the inside of your leg',
      'Stop at your ankle bone',
      'Record the measurement'
    ],
    tips: [
      'Wear shoes similar to what you\'ll wear with the suit',
      'Stand on a flat surface',
      'Keep the tape straight, not curved',
      'Consider your preferred break (slight, medium, or full)'
    ],
    diagram: {
      measurementLine: { x1: 200, y1: 220, x2: 200, y2: 380 },
      label: '30"',
      dots: [{ x: 200, y: 220 }, { x: 200, y: 380 }]
    }
  },
  outseam: {
    id: 'outseam',
    name: 'Outseam',
    icon: '📐',
    description: 'Measure from the waist down the outside of your leg to your ankle.',
    steps: [
      'Start at your natural waistline',
      'Measure down the outside of your leg',
      'Follow the natural line of your body',
      'Stop at your ankle bone',
      'Record the full measurement'
    ],
    tips: [
      'Stand straight and relaxed',
      'Keep the tape measure straight',
      'This helps determine the rise of the pants',
      'Measure on your dominant side'
    ],
    diagram: {
      measurementLine: { x1: 150, y1: 180, x2: 150, y2: 380 },
      label: '40"',
      dots: [{ x: 150, y: 180 }, { x: 150, y: 380 }]
    }
  }
};

export function InteractiveMeasurementGuide() {
  const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementType>('chest');
  const [showVideo, setShowVideo] = useState(false);

  const measurement = measurementData[selectedMeasurement];

  // Track measurement selection
  const handleMeasurementSelect = (type: MeasurementType) => {
    setSelectedMeasurement(type);
    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'measurement_guide_interaction', {
        event_category: 'size_guide',
        event_label: type,
        value: 1
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
          How to Measure Like a Pro
        </h2>
        <p className="text-gray-600">
          Click on each measurement type to see an interactive guide
        </p>
      </div>

      {/* Measurement Type Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {Object.entries(measurementData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => handleMeasurementSelect(key as MeasurementType)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all duration-300 ${
              selectedMeasurement === key
                ? 'bg-burgundy text-white border-burgundy scale-105 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            <span className="text-xl">{data.icon}</span>
            <span className="font-medium">{data.name}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Diagram */}
        <div className="order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMeasurement}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative bg-gray-50 rounded-xl p-8 h-[400px] flex items-center justify-center"
            >
              {/* Figure SVG */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full max-w-[300px]"
                style={{ maxHeight: '350px' }}
              >
                {/* Body outline with subtle animation */}
                <motion.g 
                  className="stroke-gray-400 fill-none stroke-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Head */}
                  <circle cx="200" cy="40" r="25" />
                  
                  {/* Body */}
                  <line x1="200" y1="65" x2="200" y2="120" />
                  
                  {/* Arms - slightly curved for more natural look */}
                  <path d="M 200 80 Q 175 100 150 120" />
                  <path d="M 150 120 Q 135 150 120 180" />
                  <path d="M 200 80 Q 225 100 250 120" />
                  <path d="M 250 120 Q 265 150 280 180" />
                  
                  {/* Torso */}
                  <rect x="170" y="120" width="60" height="60" rx="5" />
                  
                  {/* Legs */}
                  <line x1="185" y1="180" x2="185" y2="300" />
                  <line x1="185" y1="300" x2="175" y2="380" />
                  <line x1="215" y1="180" x2="215" y2="300" />
                  <line x1="215" y1="300" x2="225" y2="380" />
                </motion.g>

                {/* Measurement Line */}
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Measurement line - use path for sleeve, line for others */}
                  {measurement.diagram.path ? (
                    <motion.path
                      d={measurement.diagram.path}
                      stroke="#DAA520"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  ) : (
                    <motion.line
                      x1={measurement.diagram.measurementLine.x1}
                      y1={measurement.diagram.measurementLine.y1}
                      x2={measurement.diagram.measurementLine.x2}
                      y2={measurement.diagram.measurementLine.y2}
                      stroke="#DAA520"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  )}
                  
                  {/* Measurement dots */}
                  {measurement.diagram.dots.map((dot, index) => (
                    <motion.circle
                      key={index}
                      cx={dot.x}
                      cy={dot.y}
                      r="8"
                      fill="#8B0000"
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: 8, opacity: 1 }}
                      transition={{ 
                        delay: 0.3 + (index * 0.2),
                        duration: 0.5,
                        ease: "backOut"
                      }}
                    >
                      <animate
                        attributeName="r"
                        values="8;12;8"
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${0.5 + (index * 0.2)}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;1;0.6"
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${0.5 + (index * 0.2)}s`}
                      />
                    </motion.circle>
                  ))}
                  
                  {/* Measurement label with animation */}
                  <motion.text
                    x={(measurement.diagram.measurementLine.x1 + measurement.diagram.measurementLine.x2) / 2}
                    y={(measurement.diagram.measurementLine.y1 + measurement.diagram.measurementLine.y2) / 2 - 10}
                    textAnchor="middle"
                    className="fill-burgundy font-bold text-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
                  >
                    {measurement.diagram.label}
                  </motion.text>

                  {/* Animated arrows at measurement points */}
                  {measurement.diagram.dots.length >= 2 && (
                    <>
                      <motion.g
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                      >
                        <path
                          d={`M ${measurement.diagram.dots[0].x - 20} ${measurement.diagram.dots[0].y} 
                              L ${measurement.diagram.dots[0].x - 10} ${measurement.diagram.dots[0].y - 5} 
                              L ${measurement.diagram.dots[0].x - 10} ${measurement.diagram.dots[0].y + 5} Z`}
                          fill="#DAA520"
                          opacity="0.7"
                        />
                      </motion.g>
                      <motion.g
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                      >
                        <path
                          d={`M ${measurement.diagram.dots[measurement.diagram.dots.length - 1].x + 20} ${measurement.diagram.dots[measurement.diagram.dots.length - 1].y} 
                              L ${measurement.diagram.dots[measurement.diagram.dots.length - 1].x + 10} ${measurement.diagram.dots[measurement.diagram.dots.length - 1].y - 5} 
                              L ${measurement.diagram.dots[measurement.diagram.dots.length - 1].x + 10} ${measurement.diagram.dots[measurement.diagram.dots.length - 1].y + 5} Z`}
                          fill="#DAA520"
                          opacity="0.7"
                        />
                      </motion.g>
                    </>
                  )}
                </motion.g>
              </svg>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Instructions */}
        <div className="order-1 lg:order-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMeasurement}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Title */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {measurement.name} Measurement
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-6">
                {measurement.description}
              </p>

              {/* Steps */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-burgundy" />
                  Step-by-Step Guide
                </h4>
                <ol className="space-y-2">
                  {measurement.steps.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Video Button */}
              <Button
                onClick={() => setShowVideo(!showVideo)}
                className="w-full mb-6 bg-burgundy hover:bg-burgundy-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Watch How to Measure
              </Button>

              {/* Pro Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  💡 Pro Tips
                </h4>
                <ul className="space-y-1">
                  {measurement.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-4 max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">How to Measure {measurement.name}</h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Video tutorial will be embedded here
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 mb-2">
              Need help? Our expert tailors are available for virtual consultations
            </p>
            <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
              <Info className="h-4 w-4 mr-2" />
              Book a Virtual Fitting
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print Guide
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}