import React from 'react';
import { Check } from 'lucide-react';

interface TieStyle {
  name: string;
  width: string;
  price: number;
  description: string;
}

interface TieStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  styles: Record<string, TieStyle>;
}

export default function TieStyleSelector({ 
  selectedStyle, 
  onStyleChange, 
  styles 
}: TieStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(styles).map(([styleKey, style]) => (
        <button
          key={styleKey}
          onClick={() => onStyleChange(styleKey)}
          className={`relative p-4 rounded-lg border-2 transition-all ${
            selectedStyle === styleKey
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-400 bg-white'
          }`}
        >
          {selectedStyle === styleKey && (
            <div className="absolute top-2 right-2">
              <Check className="w-5 h-5 text-blue-600" />
            </div>
          )}
          
          <div className="text-left">
            <h3 className="font-medium text-gray-900">
              {style.name.split(' ')[0]}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Width: {style.width}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ${style.price}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}