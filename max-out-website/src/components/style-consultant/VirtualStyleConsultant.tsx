'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StyleQuiz, { StyleProfile } from './StyleQuiz';
import StyleRecommendations from './StyleRecommendations';

interface VirtualStyleConsultantProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function VirtualStyleConsultant({ isOpen = false, onClose }: VirtualStyleConsultantProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);

  const handleQuizComplete = (profile: StyleProfile) => {
    setStyleProfile(profile);
    setShowQuiz(false);
    setShowRecommendations(true);
  };

  const handleStartOver = () => {
    setShowRecommendations(false);
    setShowQuiz(true);
    setStyleProfile(null);
  };

  const handleClose = () => {
    setShowQuiz(false);
    setShowRecommendations(false);
    setStyleProfile(null);
    onClose?.();
  };

  if (!isOpen && !showQuiz && !showRecommendations) {
    return null;
  }

  return (
    <AnimatePresence>
      {showQuiz && (
        <StyleQuiz 
          onComplete={handleQuizComplete}
          onClose={handleClose}
        />
      )}
      
      {showRecommendations && styleProfile && (
        <StyleRecommendations
          profile={styleProfile}
          onClose={handleClose}
          onStartOver={handleStartOver}
        />
      )}
      
      {isOpen && !showQuiz && !showRecommendations && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-burgundy to-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-serif mb-4">Virtual Style Consultant</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Let our AI-powered style expert help you find the perfect outfit for any occasion. 
                Answer a few quick questions and get personalized recommendations in seconds.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-burgundy font-bold">1</span>
                  </div>
                  <h4 className="font-semibold">Quick Quiz</h4>
                  <p className="text-sm text-gray-600">30-second style assessment</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-burgundy font-bold">2</span>
                  </div>
                  <h4 className="font-semibold">AI Analysis</h4>
                  <p className="text-sm text-gray-600">Personalized curation</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-burgundy font-bold">3</span>
                  </div>
                  <h4 className="font-semibold">Perfect Matches</h4>
                  <p className="text-sm text-gray-600">Complete outfit recommendations</p>
                </div>
              </div>

              <Button
                onClick={() => setShowQuiz(true)}
                size="lg"
                className="bg-burgundy hover:bg-burgundy-700 text-white gap-2"
              >
                Start Style Consultation
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                Powered by Atelier AI • Takes less than 1 minute
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export a floating button component to trigger the consultant
export function StyleConsultantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-burgundy to-burgundy-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
            Style Consultant
          </span>
        </div>
        
        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-burgundy"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>

      <VirtualStyleConsultant isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}