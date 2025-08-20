'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OutfitConfig {
  tieColor: string;
  tieStyle: 'bowtie' | 'classic' | 'skinny' | 'slim';
  suitColor: string;
  shirtColor: string;
  occasion: 'wedding' | 'business' | 'prom' | 'casual' | 'formal' | 'cocktail';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

// Popular color options based on your inventory
const tieColors = [
  { value: 'navy', label: 'Navy', hex: '#000080' },
  { value: 'burgundy', label: 'Burgundy', hex: '#800020' },
  { value: 'emerald green', label: 'Emerald Green', hex: '#50C878' },
  { value: 'royal blue', label: 'Royal Blue', hex: '#4169E1' },
  { value: 'black', label: 'Black', hex: '#000000' },
  { value: 'silver', label: 'Silver', hex: '#C0C0C0' },
  { value: 'gold', label: 'Gold', hex: '#FFD700' },
  { value: 'dusty rose', label: 'Dusty Rose', hex: '#DCAE96' },
  { value: 'champagne', label: 'Champagne', hex: '#F7E7CE' },
  { value: 'red', label: 'Red', hex: '#DC143C' },
  { value: 'purple', label: 'Purple', hex: '#800080' },
  { value: 'teal', label: 'Teal', hex: '#008080' }
];

const suitColors = [
  { value: 'charcoal grey', label: 'Charcoal Grey', hex: '#36454F' },
  { value: 'navy blue', label: 'Navy Blue', hex: '#000080' },
  { value: 'black', label: 'Black', hex: '#000000' },
  { value: 'light grey', label: 'Light Grey', hex: '#D3D3D3' },
  { value: 'tan', label: 'Tan', hex: '#D2B48C' },
  { value: 'burgundy', label: 'Burgundy', hex: '#800020' },
  { value: 'midnight blue', label: 'Midnight Blue', hex: '#191970' },
  { value: 'brown', label: 'Brown', hex: '#964B00' }
];

const shirtColors = [
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'light blue', label: 'Light Blue', hex: '#ADD8E6' },
  { value: 'pink', label: 'Pink', hex: '#FFC0CB' },
  { value: 'lavender', label: 'Lavender', hex: '#E6E6FA' },
  { value: 'cream', label: 'Cream', hex: '#FFFDD0' },
  { value: 'grey', label: 'Grey', hex: '#808080' },
  { value: 'black', label: 'Black', hex: '#000000' }
];

export default function BundleGenerator() {
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<Array<{url: string, config: OutfitConfig, timestamp: Date}>>([]);
  const [saveToStyleSwipe, setSaveToStyleSwipe] = useState(false);

  const [config, setConfig] = useState<OutfitConfig>({
    tieColor: 'navy',
    tieStyle: 'classic',
    suitColor: 'charcoal grey',
    shirtColor: 'white',
    occasion: 'business',
    season: 'fall'
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (saveToStyleSwipe) {
        headers['x-save-to-style-swipe'] = 'true';
      }

      const response = await fetch('/api/bundle-generator', {
        method: 'POST',
        headers,
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate outfit');
      }

      setImageUrl(data.imageUrl);

      // Save to history
      setSavedImages(prev => [{
        url: data.imageUrl,
        config: {...config},
        timestamp: new Date()
      }, ...prev].slice(0, 10)); // Keep last 10

      // Show R2 save status
      if (saveToStyleSwipe) {
        if (data.r2Url) {
          alert(`✅ Saved to Style Swipe Library!\n\nCategory: ${config.occasion}\nR2 URL: ${data.r2Url}`);
        } else {

        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Bundle Outfit Generator</h2>

      {/* Quick Presets */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3">Quick Presets:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Classic Business', config: { tieColor: 'navy', tieStyle: 'classic', suitColor: 'charcoal grey', shirtColor: 'white', occasion: 'business' }},
            { name: 'Summer Wedding', config: { tieColor: 'dusty rose', tieStyle: 'classic', suitColor: 'light grey', shirtColor: 'white', occasion: 'wedding', season: 'summer' }},
            { name: 'Prom Night', config: { tieColor: 'royal blue', tieStyle: 'bowtie', suitColor: 'black', shirtColor: 'white', occasion: 'prom' }},
            { name: 'Fall Formal', config: { tieColor: 'burgundy', tieStyle: 'classic', suitColor: 'navy blue', shirtColor: 'cream', occasion: 'formal', season: 'fall' }},
            { name: 'Cocktail Hour', config: { tieColor: 'black', tieStyle: 'slim', suitColor: 'midnight blue', shirtColor: 'light blue', occasion: 'cocktail' }}
          ].map(preset => (
            <button
              key={preset.name}
              onClick={() => setConfig({...preset.config} as OutfitConfig)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tie Color</label>
            <div className="grid grid-cols-4 gap-2">
              {tieColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => setConfig({...config, tieColor: color.value})}
                  className={`group relative p-2 rounded border-2 transition-all ${
                    config.tieColor === color.value 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={color.label}
                >
                  <div 
                    className="w-full h-8 rounded shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs mt-1 block text-center truncate">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tie Style</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'bowtie', label: 'Bowtie', icon: '🎀' },
                { value: 'classic', label: 'Classic (3.25")', icon: '👔' },
                { value: 'skinny', label: 'Skinny (2.75")', icon: '🪢' },
                { value: 'slim', label: 'Slim (2.25")', icon: '👔' }
              ].map(style => (
                <button
                  key={style.value}
                  onClick={() => setConfig({...config, tieStyle: style.value as any})}
                  className={`p-3 rounded border-2 transition-all text-left ${
                    config.tieStyle === style.value 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-lg mr-2">{style.icon}</span>
                  <span className="text-sm font-medium">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Suit Color</label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {suitColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => setConfig({...config, suitColor: color.value})}
                  className={`group relative p-2 rounded border-2 transition-all ${
                    config.suitColor === color.value 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={color.label}
                >
                  <div 
                    className="w-full h-8 rounded shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs mt-1 block text-center truncate">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Shirt Color</label>
            <div className="grid grid-cols-3 gap-2">
              {shirtColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => setConfig({...config, shirtColor: color.value})}
                  className={`group relative p-2 rounded border-2 transition-all ${
                    config.shirtColor === color.value 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={color.label}
                >
                  <div 
                    className="w-full h-8 rounded shadow-inner border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs mt-1 block text-center truncate">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Occasion</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'wedding', label: 'Wedding', icon: '💒' },
                { value: 'business', label: 'Business', icon: '💼' },
                { value: 'formal', label: 'Formal', icon: '🎩' },
                { value: 'cocktail', label: 'Cocktail', icon: '🍸' },
                { value: 'prom', label: 'Prom', icon: '🎊' },
                { value: 'casual', label: 'Casual', icon: '👕' }
              ].map(occ => (
                <button
                  key={occ.value}
                  onClick={() => setConfig({...config, occasion: occ.value as any})}
                  className={`p-3 rounded border-2 transition-all ${
                    config.occasion === occ.value 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl block mb-1">{occ.icon}</span>
                    <span className="text-sm font-medium">{occ.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Season (Optional)</label>
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => setConfig({...config, season: undefined})}
                className={`p-3 rounded border-2 transition-all ${
                  !config.season 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">🌐</span>
                  <span className="text-xs font-medium">Any</span>
                </div>
              </button>
              {[
                { value: 'spring', label: 'Spring', icon: '🌸', color: '#FFB6C1' },
                { value: 'summer', label: 'Summer', icon: '☀️', color: '#FFD700' },
                { value: 'fall', label: 'Fall', icon: '🍂', color: '#FF8C00' },
                { value: 'winter', label: 'Winter', icon: '❄️', color: '#87CEEB' }
              ].map(season => (
                <button
                  key={season.value}
                  onClick={() => setConfig({...config, season: season.value as any})}
                  className={`p-3 rounded border-2 transition-all ${
                    config.season === season.value 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: config.season === season.value ? season.color + '30' : 'white'
                  }}
                >
                  <div className="text-center">
                    <span className="text-xl block mb-1">{season.icon}</span>
                    <span className="text-xs font-medium">{season.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveToStyleSwipe}
              onChange={(e) => setSaveToStyleSwipe(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">
              Save to Style Swipe Library
            </span>
          </label>

          {saveToStyleSwipe && (
            <span className="text-xs text-blue-600">
              Will be saved to {config.occasion} category
            </span>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Generating Outfit...
            </>
          ) : (
            'Generate Bundle Outfit'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Generated Image */}
      {imageUrl && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generated Outfit</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = imageUrl;
                  link.download = `outfit-${config.tieColor}-${config.suitColor}-${Date.now()}.png`;
                  link.click();
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(imageUrl);
                  alert('Image URL copied to clipboard!');
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy URL
              </button>
            </div>
          </div>
          <div className="relative aspect-[3/4] max-w-md mx-auto">
            <img
              src={imageUrl}
              alt="Generated outfit"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {

              }}
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Configuration:</strong></p>
            <ul className="mt-2 space-y-1">
              <li>Tie: {config.tieColor} {config.tieStyle}</li>
              <li>Suit: {config.suitColor}</li>
              <li>Shirt: {config.shirtColor}</li>
              <li>Occasion: {config.occasion}</li>
              {config.season && <li>Season: {config.season}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Generation History */}
      {savedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {savedImages.map((saved, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setImageUrl(saved.url);
                  setConfig(saved.config);
                }}
              >
                <img
                  src={saved.url}
                  alt={`${saved.config.tieColor} tie with ${saved.config.suitColor} suit`}
                  className="w-full aspect-[3/4] object-cover rounded mb-2"
                />
                <div className="text-xs text-gray-600">
                  <p className="font-medium">{saved.config.tieColor} / {saved.config.suitColor}</p>
                  <p>{saved.config.occasion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}