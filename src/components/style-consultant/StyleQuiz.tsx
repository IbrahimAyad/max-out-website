'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Calendar, Briefcase, Heart, PartyPopper, Users, Palette, Ruler, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Style Quiz Questions with visual options
const quizQuestions = [
  {
    id: 'occasion',
    question: "What's the occasion?",
    subtitle: "We'll help you look your best",
    icon: Calendar,
    options: [
      {
        id: 'wedding',
        label: 'Wedding',
        description: 'Guest or Groomsman',
        icon: Heart,
        image: 'https://cdn.kctmenswear.com/collections/wedding/thumbnail.jpg',
        tags: ['formal', 'elegant', 'sophisticated']
      },
      {
        id: 'business',
        label: 'Business',
        description: 'Meetings & Office',
        icon: Briefcase,
        image: 'https://cdn.kctmenswear.com/collections/business/thumbnail.jpg',
        tags: ['professional', 'sharp', 'confident']
      },
      {
        id: 'prom',
        label: 'Prom/Formal',
        description: 'Dance & Celebrations',
        icon: PartyPopper,
        image: 'https://cdn.kctmenswear.com/collections/prom/thumbnail.jpg',
        tags: ['trendy', 'bold', 'youthful']
      },
      {
        id: 'special',
        label: 'Special Event',
        description: 'Galas & Parties',
        icon: Users,
        image: 'https://cdn.kctmenswear.com/collections/formal/thumbnail.jpg',
        tags: ['luxury', 'statement', 'refined']
      }
    ]
  },
  {
    id: 'style',
    question: "What's your style personality?",
    subtitle: "This helps us match your vibe",
    icon: Palette,
    options: [
      {
        id: 'classic',
        label: 'Classic & Timeless',
        description: 'Traditional elegance',
        image: 'https://cdn.kctmenswear.com/styles/classic.jpg',
        colors: ['navy', 'charcoal', 'black']
      },
      {
        id: 'modern',
        label: 'Modern & Sharp',
        description: 'Contemporary edge',
        image: 'https://cdn.kctmenswear.com/styles/modern.jpg',
        colors: ['midnight', 'steel', 'burgundy']
      },
      {
        id: 'bold',
        label: 'Bold & Adventurous',
        description: 'Stand out from the crowd',
        image: 'https://cdn.kctmenswear.com/styles/bold.jpg',
        colors: ['emerald', 'royal', 'crimson']
      },
      {
        id: 'minimal',
        label: 'Minimal & Refined',
        description: 'Less is more',
        image: 'https://cdn.kctmenswear.com/styles/minimal.jpg',
        colors: ['grey', 'white', 'beige']
      }
    ]
  },
  {
    id: 'fit',
    question: "How do you like your fit?",
    subtitle: "We'll recommend the perfect cut",
    icon: Ruler,
    options: [
      {
        id: 'slim',
        label: 'Slim Fit',
        description: 'Tailored & fitted',
        visual: 'close to body'
      },
      {
        id: 'modern',
        label: 'Modern Fit',
        description: 'Contemporary comfort',
        visual: 'slightly relaxed'
      },
      {
        id: 'classic',
        label: 'Classic Fit',
        description: 'Traditional room',
        visual: 'comfortable space'
      },
      {
        id: 'athletic',
        label: 'Athletic Fit',
        description: 'Built for your build',
        visual: 'shaped for muscle'
      }
    ]
  },
  {
    id: 'budget',
    question: "What's your budget range?",
    subtitle: "Quality options at every price",
    icon: Palette,
    options: [
      {
        id: 'value',
        label: 'Value Conscious',
        description: '$200-$400',
        range: [200, 400]
      },
      {
        id: 'mid',
        label: 'Mid-Range',
        description: '$400-$700',
        range: [400, 700]
      },
      {
        id: 'premium',
        label: 'Premium',
        description: '$700-$1200',
        range: [700, 1200]
      },
      {
        id: 'luxury',
        label: 'Luxury',
        description: '$1200+',
        range: [1200, 9999]
      }
    ]
  }
];

interface StyleQuizProps {
  onComplete: (profile: StyleProfile) => void;
  onClose?: () => void;
}

export interface StyleProfile {
  occasion: string;
  style: string;
  fit: string;
  budget: string;
  tags: string[];
  colors: string[];
}

export default function StyleQuiz({ onComplete, onClose }: StyleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (answer: any) => {
    const question = quizQuestions[currentQuestion];
    const newAnswers = {
      ...answers,
      [question.id]: answer
    };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Quiz complete - analyze results
      setIsAnalyzing(true);
      setTimeout(() => {
        const profile: StyleProfile = {
          occasion: newAnswers.occasion.id,
          style: newAnswers.style.id,
          fit: newAnswers.fit.id,
          budget: newAnswers.budget.id,
          tags: [
            ...(newAnswers.occasion.tags || []),
            ...(newAnswers.style.tags || [])
          ],
          colors: newAnswers.style.colors || []
        };
        onComplete(profile);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy to-burgundy-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-serif">Virtual Style Consultant</h2>
                <p className="text-white/80 text-sm">Powered by Atelier AI</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-white/80 mt-2">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!isAnalyzing ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <question.icon className="w-12 h-12 text-burgundy mx-auto mb-4" />
                  <h3 className="text-3xl font-serif mb-2">{question.question}</h3>
                  <p className="text-gray-600">{question.subtitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {question.options.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option)}
                      className="relative group border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-burgundy transition-all duration-300 overflow-hidden"
                    >
                      {option.image && (
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${option.image})` }}
                          />
                        </div>
                      )}
                      
                      <div className="relative">
                        {option.icon && (
                          <option.icon className="w-8 h-8 text-burgundy mb-3" />
                        )}
                        <h4 className="text-lg font-semibold mb-1">{option.label}</h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                        
                        {option.colors && (
                          <div className="flex gap-2 mt-3">
                            {option.colors.map((color) => (
                              <div
                                key={color}
                                className="w-6 h-6 rounded-full border border-gray-300"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        )}
                        
                        {option.visual && (
                          <p className="text-xs text-gray-500 mt-2 italic">{option.visual}</p>
                        )}
                        
                        {option.range && (
                          <p className="text-burgundy font-semibold mt-2">
                            ${option.range[0]} - ${option.range[1] === 9999 ? '+' : option.range[1]}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    Press any option to continue
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-burgundy/20 border-t-burgundy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-burgundy" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-serif mb-2">Analyzing Your Style Profile...</h3>
                <p className="text-gray-600">Our AI is creating personalized recommendations just for you</p>
                
                <div className="flex justify-center gap-2 mt-6">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-burgundy rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                    className="w-2 h-2 bg-burgundy rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                    className="w-2 h-2 bg-burgundy rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}