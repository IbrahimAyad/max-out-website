"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ruler, 
  User, 
  Calendar,
  MapPin,
  TrendingUp,
  Info,
  CheckCircle,
  AlertTriangle,
  Camera,
  BookOpen,
  Target,
  Zap,
  Eye,
  RotateCcw,
  Save,
  Smartphone,
  Monitor,
  Shirt,
  Settings
} from 'lucide-react';

import { enhancedUserProfileService, type EnhancedSizeProfile } from '@/lib/services/enhancedUserProfileService';

interface InteractiveSizeProfileProps {
  onSave?: (profile: Partial<EnhancedSizeProfile>) => void;
  initialData?: EnhancedSizeProfile;
}

export default function InteractiveSizeProfile({ onSave, initialData }: InteractiveSizeProfileProps) {
  const [sizeProfile, setSizeProfile] = useState<Partial<EnhancedSizeProfile>>(initialData || {});
  const [activeStep, setActiveStep] = useState(0);
  const [view3D, setView3D] = useState(false);
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [confidence, setConfidence] = useState(75);
  const [isSaving, setIsSaving] = useState(false);

  const measurementSteps = [
    { id: 'body-basics', name: 'Body Basics', icon: User },
    { id: 'measurements', name: 'Measurements', icon: Ruler },
    { id: 'fit-preferences', name: 'Fit Preferences', icon: Shirt },
    { id: 'review', name: 'Review & Save', icon: CheckCircle }
  ];

  const bodyMeasurements = [
    {
      key: 'chest',
      label: 'Chest',
      description: 'Around the fullest part of your chest',
      placeholder: '42',
      unit: 'inches',
      required: true,
      guide: 'Measure around the fullest part of your chest, keeping the tape level and parallel to the floor.'
    },
    {
      key: 'waist',
      label: 'Waist',
      description: 'Natural waistline',
      placeholder: '34',
      unit: 'inches',
      required: true,
      guide: 'Find your natural waistline (the narrowest part of your torso) and measure around it.'
    },
    {
      key: 'neck',
      label: 'Neck',
      description: 'Around the base of your neck',
      placeholder: '16',
      unit: 'inches',
      required: true,
      guide: 'Wrap the tape around your neck at the base, where a shirt collar would sit.'
    },
    {
      key: 'sleeve',
      label: 'Sleeve',
      description: 'Shoulder to wrist',
      placeholder: '35',
      unit: 'inches',
      required: true,
      guide: 'With your arm relaxed at your side, measure from the center of your shoulder to your wrist.'
    },
    {
      key: 'inseam',
      label: 'Inseam',
      description: 'Inside leg measurement',
      placeholder: '32',
      unit: 'inches',
      required: true,
      guide: 'Measure from your crotch down to where you want your pants to end.'
    },
    {
      key: 'shoulder_width',
      label: 'Shoulder Width',
      description: 'Across the shoulders',
      placeholder: '18',
      unit: 'inches',
      required: false,
      guide: 'Measure across your back from shoulder point to shoulder point.'
    }
  ];

  const fitOptions = {
    jackets: [
      { value: 'extra_slim', label: 'Extra Slim', description: 'Very fitted through chest and waist' },
      { value: 'slim', label: 'Slim', description: 'Fitted with minimal excess fabric' },
      { value: 'tailored', label: 'Tailored', description: 'Modern cut with clean lines' },
      { value: 'regular', label: 'Regular', description: 'Classic comfortable fit' },
      { value: 'relaxed', label: 'Relaxed', description: 'Roomier for comfort' }
    ],
    pants: [
      { value: 'skinny', label: 'Skinny', description: 'Very tight through legs' },
      { value: 'slim', label: 'Slim', description: 'Fitted through thigh and leg' },
      { value: 'straight', label: 'Straight', description: 'Straight cut from hip to ankle' },
      { value: 'regular', label: 'Regular', description: 'Classic comfortable fit' },
      { value: 'relaxed', label: 'Relaxed', description: 'Roomier through thigh and leg' }
    ],
    shirts: [
      { value: 'extra_slim', label: 'Extra Slim', description: 'Very fitted through torso' },
      { value: 'slim', label: 'Slim', description: 'Fitted with minimal excess' },
      { value: 'fitted', label: 'Fitted', description: 'Tailored fit through body' },
      { value: 'regular', label: 'Regular', description: 'Classic comfortable fit' },
      { value: 'relaxed', label: 'Relaxed', description: 'Roomier for comfort' }
    ]
  };

  const bodyTypes = [
    { value: 'athletic', label: 'Athletic', description: 'Broad shoulders, narrow waist' },
    { value: 'slim', label: 'Slim', description: 'Lean build, narrow frame' },
    { value: 'regular', label: 'Regular', description: 'Average proportions' },
    { value: 'muscular', label: 'Muscular', description: 'Well-developed muscle mass' },
    { value: 'fuller', label: 'Fuller', description: 'Larger build, broader frame' }
  ];

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave({
        ...sizeProfile,
        confidence_level: confidence,
        measurement_date: new Date().toISOString(),
        measured_by: 'self'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateCompletionScore = () => {
    const requiredFields = ['chest', 'waist', 'neck', 'sleeve', 'inseam'];
    const completed = requiredFields.filter(field => 
      sizeProfile[field as keyof EnhancedSizeProfile] !== undefined
    );
    return Math.round((completed.length / requiredFields.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <SizeProfileHeader 
        completionScore={calculateCompletionScore()}
        confidence={confidence}
        view3D={view3D}
        onToggle3D={() => setView3D(!view3D)}
      />

      {/* Progress Steps */}
      <StepProgress 
        steps={measurementSteps}
        activeStep={activeStep}
        onStepClick={setActiveStep}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <BodyBasicsStep
                sizeProfile={sizeProfile}
                setSizeProfile={setSizeProfile}
                bodyTypes={bodyTypes}
              />
            )}
            
            {activeStep === 1 && (
              <MeasurementsStep
                sizeProfile={sizeProfile}
                setSizeProfile={setSizeProfile}
                measurements={bodyMeasurements}
                showGuide={showMeasurementGuide}
                onToggleGuide={() => setShowMeasurementGuide(!showMeasurementGuide)}
              />
            )}
            
            {activeStep === 2 && (
              <FitPreferencesStep
                sizeProfile={sizeProfile}
                setSizeProfile={setSizeProfile}
                fitOptions={fitOptions}
              />
            )}
            
            {activeStep === 3 && (
              <ReviewStep
                sizeProfile={sizeProfile}
                confidence={confidence}
                onConfidenceChange={setConfidence}
                onSave={handleSave}
                isSaving={isSaving}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* 3D Visualization */}
          <Interactive3DVisualization 
            sizeProfile={sizeProfile}
            active={view3D}
          />
          
          {/* Confidence Meter */}
          <ConfidenceMeter 
            confidence={confidence}
            onConfidenceChange={setConfidence}
          />
          
          {/* KCT Booking CTA */}
          <KCTMeasurementBooking />
          
          {/* Size Recommendations */}
          <SizeRecommendations sizeProfile={sizeProfile} />
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        activeStep={activeStep}
        totalSteps={measurementSteps.length}
        onPrevious={() => setActiveStep(Math.max(0, activeStep - 1))}
        onNext={() => setActiveStep(Math.min(measurementSteps.length - 1, activeStep + 1))}
        canProceed={activeStep < 3 || calculateCompletionScore() > 60}
      />
    </div>
  );
}

// Size Profile Header Component
function SizeProfileHeader({ completionScore, confidence, view3D, onToggle3D }: {
  completionScore: number;
  confidence: number;
  view3D: boolean;
  onToggle3D: () => void;
}) {
  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Size Profile</h1>
          <p className="text-gray-600">Create your personalized fit profile for perfect recommendations</p>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Progress Circle */}
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="4"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#8B2635"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionScore / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - completionScore / 100) }}
                transition={{ duration: 1 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{completionScore}%</span>
            </div>
          </div>
          
          {/* 3D Toggle */}
          <motion.button
            className={`p-3 rounded-xl transition-colors ${
              view3D 
                ? 'bg-[#8B2635] text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={onToggle3D}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Monitor className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Step Progress Component
function StepProgress({ steps, activeStep, onStepClick }: {
  steps: any[];
  activeStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.button
              className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                index === activeStep
                  ? 'bg-[#8B2635] text-white'
                  : index < activeStep
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
              onClick={() => onStepClick(index)}
              whileHover={{ scale: 1.05 }}
              disabled={index > activeStep + 1}
            >
              <step.icon className="w-5 h-5" />
              <span className="hidden sm:block font-medium">{step.name}</span>
              {index < activeStep && <CheckCircle className="w-4 h-4" />}
            </motion.button>
            
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-4 rounded ${
                index < activeStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Body Basics Step Component
function BodyBasicsStep({ sizeProfile, setSizeProfile, bodyTypes }: {
  sizeProfile: Partial<EnhancedSizeProfile>;
  setSizeProfile: (profile: Partial<EnhancedSizeProfile>) => void;
  bodyTypes: any[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Body Type & Build</h2>
      
      <div className="space-y-8">
        {/* Body Type Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Body Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bodyTypes.map((type) => (
              <motion.label
                key={type.value}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  sizeProfile.body_type === type.value
                    ? 'border-[#8B2635] bg-[#8B2635]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="radio"
                  name="body_type"
                  value={type.value}
                  checked={sizeProfile.body_type === type.value}
                  onChange={(e) => setSizeProfile({ ...sizeProfile, body_type: e.target.value as any })}
                  className="sr-only"
                />
                <div>
                  <p className="font-semibold text-gray-900">{type.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Shoe Size */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shoe Size</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">US Size</label>
              <input
                type="number"
                step="0.5"
                min="6"
                max="15"
                value={sizeProfile.shoe_size?.us || ''}
                onChange={(e) => setSizeProfile({
                  ...sizeProfile,
                  shoe_size: {
                    ...sizeProfile.shoe_size,
                    us: parseFloat(e.target.value) || undefined,
                    width: sizeProfile.shoe_size?.width || 'medium'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                placeholder="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
              <select
                value={sizeProfile.shoe_size?.width || 'medium'}
                onChange={(e) => setSizeProfile({
                  ...sizeProfile,
                  shoe_size: {
                    ...sizeProfile.shoe_size,
                    us: sizeProfile.shoe_size?.us,
                    width: e.target.value as any
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
              >
                <option value="narrow">Narrow</option>
                <option value="medium">Medium</option>
                <option value="wide">Wide</option>
                <option value="extra_wide">Extra Wide</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Measurements Step Component
function MeasurementsStep({ sizeProfile, setSizeProfile, measurements, showGuide, onToggleGuide }: {
  sizeProfile: Partial<EnhancedSizeProfile>;
  setSizeProfile: (profile: Partial<EnhancedSizeProfile>) => void;
  measurements: any[];
  showGuide: boolean;
  onToggleGuide: () => void;
}) {
  const [activeMeasurement, setActiveMeasurement] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Guide Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Body Measurements</h2>
          <motion.button
            onClick={onToggleGuide}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showGuide 
                ? 'bg-[#8B2635] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <BookOpen className="w-4 h-4" />
            <span>Measurement Guide</span>
          </motion.button>
        </div>
        
        {showGuide && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
          >
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">How to Measure Accurately:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Use a flexible measuring tape</li>
                  <li>Measure over light clothing or underwear</li>
                  <li>Keep the tape level and snug but not tight</li>
                  <li>Have someone help for better accuracy</li>
                  <li>Stand naturally with good posture</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Measurement Fields */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {measurements.map((measurement) => (
            <motion.div
              key={measurement.key}
              className={`relative ${
                activeMeasurement === measurement.key ? 'ring-2 ring-[#8B2635] rounded-xl p-4' : 'p-4'
              }`}
              onFocus={() => setActiveMeasurement(measurement.key)}
              onBlur={() => setActiveMeasurement(null)}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {measurement.label}
                {measurement.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <p className="text-xs text-gray-500 mb-3">{measurement.description}</p>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={sizeProfile[measurement.key as keyof EnhancedSizeProfile] as number || ''}
                  onChange={(e) => setSizeProfile({
                    ...sizeProfile,
                    [measurement.key]: parseFloat(e.target.value) || undefined
                  })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#8B2635] focus:border-[#8B2635]"
                  placeholder={measurement.placeholder}
                />
                <span className="text-sm text-gray-500 font-medium">{measurement.unit}</span>
              </div>
              
              {activeMeasurement === measurement.key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
                >
                  {measurement.guide}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Fit Preferences Step Component
function FitPreferencesStep({ sizeProfile, setSizeProfile, fitOptions }: {
  sizeProfile: Partial<EnhancedSizeProfile>;
  setSizeProfile: (profile: Partial<EnhancedSizeProfile>) => void;
  fitOptions: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fit Preferences</h2>
      
      <div className="space-y-8">
        {Object.entries(fitOptions).map(([category, options]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
              {category} Fit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(options as any[]).map((option) => (
                <motion.label
                  key={option.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    sizeProfile.preferred_fit?.[category as keyof typeof sizeProfile.preferred_fit] === option.value
                      ? 'border-[#8B2635] bg-[#8B2635]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="radio"
                    name={category}
                    value={option.value}
                    checked={sizeProfile.preferred_fit?.[category as keyof typeof sizeProfile.preferred_fit] === option.value}
                    onChange={(e) => setSizeProfile({
                      ...sizeProfile,
                      preferred_fit: {
                        ...sizeProfile.preferred_fit,
                        [category]: e.target.value
                      }
                    })}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Review Step Component
function ReviewStep({ sizeProfile, confidence, onConfidenceChange, onSave, isSaving }: {
  sizeProfile: Partial<EnhancedSizeProfile>;
  confidence: number;
  onConfidenceChange: (confidence: number) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Save</h2>
      
      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Measurement Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Chest:</span>
              <span className="font-medium ml-2">{sizeProfile.chest || '--'}"</span>
            </div>
            <div>
              <span className="text-gray-600">Waist:</span>
              <span className="font-medium ml-2">{sizeProfile.waist || '--'}"</span>
            </div>
            <div>
              <span className="text-gray-600">Neck:</span>
              <span className="font-medium ml-2">{sizeProfile.neck || '--'}"</span>
            </div>
            <div>
              <span className="text-gray-600">Sleeve:</span>
              <span className="font-medium ml-2">{sizeProfile.sleeve || '--'}"</span>
            </div>
            <div>
              <span className="text-gray-600">Inseam:</span>
              <span className="font-medium ml-2">{sizeProfile.inseam || '--'}"</span>
            </div>
            <div>
              <span className="text-gray-600">Body Type:</span>
              <span className="font-medium ml-2 capitalize">{sizeProfile.body_type || '--'}</span>
            </div>
          </div>
        </div>

        {/* Confidence Slider */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Measurement Confidence</h3>
            <span className="text-2xl font-bold text-[#8B2635]">{confidence}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => onConfidenceChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Not Confident</span>
            <span>Very Confident</span>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          onClick={onSave}
          disabled={isSaving}
          className="w-full bg-[#8B2635] hover:bg-[#6B1C28] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Size Profile</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// 3D Visualization Component
function Interactive3DVisualization({ sizeProfile, active }: {
  sizeProfile: Partial<EnhancedSizeProfile>;
  active: boolean;
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      animate={{ height: active ? 400 : 200 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Body Visualization</h3>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
      
      <div className="relative bg-gray-50 rounded-xl h-full flex items-center justify-center overflow-hidden">
        {/* Placeholder for 3D visualization */}
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            {active ? '3D Body Model' : 'Click to view 3D model'}
          </p>
          {active && sizeProfile.chest && (
            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <p>Chest: {sizeProfile.chest}"</p>
              <p>Waist: {sizeProfile.waist}"</p>
              <p>Height estimation: 6'0"</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Confidence Meter Component
function ConfidenceMeter({ confidence, onConfidenceChange }: {
  confidence: number;
  onConfidenceChange: (confidence: number) => void;
}) {
  const getConfidenceColor = () => {
    if (confidence >= 80) return 'from-green-500 to-green-600';
    if (confidence >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getConfidenceLabel = () => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Measurement Confidence</h3>
        <Target className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full bg-gradient-to-r ${getConfidenceColor()}`}
              style={{ width: `${confidence}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="absolute -top-8 left-0 right-0 flex justify-center">
            <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getConfidenceColor()}`}>
              {confidence}% - {getConfidenceLabel()}
            </div>
          </div>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => onConfidenceChange(parseInt(e.target.value))}
          className="w-full cursor-pointer"
        />
        
        <p className="text-xs text-gray-500">
          How confident are you in these measurements?
        </p>
      </div>
    </motion.div>
  );
}

// KCT Measurement Booking Component
function KCTMeasurementBooking() {
  return (
    <motion.div 
      className="bg-gradient-to-br from-[#8B2635] to-[#6B1C28] rounded-2xl p-6 text-white"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Get Measured by KCT</h3>
          <p className="text-white/90 text-sm mb-4">
            Book a professional measurement session with our style experts for the most accurate fit.
          </p>
          <motion.button
            className="w-full bg-white text-[#8B2635] py-3 px-4 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Appointment
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Size Recommendations Component
function SizeRecommendations({ sizeProfile }: {
  sizeProfile: Partial<EnhancedSizeProfile>;
}) {
  const getSuitSize = () => {
    if (!sizeProfile.chest) return '--';
    if (sizeProfile.chest >= 50) return '52R';
    if (sizeProfile.chest >= 48) return '50R';
    if (sizeProfile.chest >= 46) return '48R';
    if (sizeProfile.chest >= 44) return '46R';
    if (sizeProfile.chest >= 42) return '44R';
    if (sizeProfile.chest >= 40) return '42R';
    return '40R';
  };

  const getShirtSize = () => {
    if (!sizeProfile.neck || !sizeProfile.sleeve) return '--';
    return `${sizeProfile.neck}"/${sizeProfile.sleeve}"`;
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <Zap className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="font-semibold text-gray-900">Size Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Suit Size</span>
          <span className="font-semibold text-gray-900">{getSuitSize()}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Shirt Size</span>
          <span className="font-semibold text-gray-900">{getShirtSize()}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Pant Waist</span>
          <span className="font-semibold text-gray-900">{sizeProfile.waist || '--'}"</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Inseam</span>
          <span className="font-semibold text-gray-900">{sizeProfile.inseam || '--'}"</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> These are estimated sizes based on your measurements. Professional fitting is recommended for the best results.
        </p>
      </div>
    </motion.div>
  );
}

// Step Navigation Component
function StepNavigation({ activeStep, totalSteps, onPrevious, onNext, canProceed }: {
  activeStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <motion.button
        onClick={onPrevious}
        disabled={activeStep === 0}
        className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-4 h-4" />
        <span>Previous</span>
      </motion.button>
      
      <div className="text-sm text-gray-500">
        Step {activeStep + 1} of {totalSteps}
      </div>
      
      <motion.button
        onClick={onNext}
        disabled={activeStep === totalSteps - 1 || !canProceed}
        className="flex items-center space-x-2 bg-[#8B2635] hover:bg-[#6B1C28] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{activeStep === totalSteps - 1 ? 'Finish' : 'Next'}</span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}