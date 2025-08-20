'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface FitOption {
  id: string;
  name: string;
  description: string;
}

interface DressShirtFitSelectorProps {
  selectedFit: string;
  onFitChange: (fit: string) => void;
  fits: Record<string, any>;
}

export default function DressShirtFitSelector({ 
  selectedFit, 
  onFitChange, 
  fits 
}: DressShirtFitSelectorProps) {
  const fitOptions: FitOption[] = [
    {
      id: 'slim',
      name: fits.slim.name,
      description: fits.slim.description
    },
    {
      id: 'classic',
      name: fits.classic.name,
      description: fits.classic.description
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fitOptions.map((fit) => (
          <button
            key={fit.id}
            onClick={() => onFitChange(fit.id)}
            className={`relative p-6 rounded-lg border-2 transition-all ${
              selectedFit === fit.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {selectedFit === fit.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">{fit.name}</h3>
              <p className="text-sm text-gray-600">{fit.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}