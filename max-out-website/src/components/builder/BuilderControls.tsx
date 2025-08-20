'use client';

import { SuitConfiguration } from './SuitBuilder3D';

interface BuilderControlsProps {
  activeTab: 'fabric' | 'jacket' | 'trouser' | 'details';
  configuration: SuitConfiguration;
  onUpdate: (section: keyof SuitConfiguration, updates: any) => void;
}

export function BuilderControls({ activeTab, configuration, onUpdate }: BuilderControlsProps) {
  const fabricColors = [
    { name: 'Midnight Black', value: '#1a1a1a' },
    { name: 'Charcoal', value: '#3a3a3a' },
    { name: 'Navy', value: '#1e3a5f' },
    { name: 'Burgundy', value: '#8b0000' },
    { name: 'Deep Brown', value: '#3e2723' },
    { name: 'Olive', value: '#3e4934' },
  ];

  const liningColors = [
    { name: 'Burgundy', value: '#8b0000' },
    { name: 'Gold', value: '#d4af37' },
    { name: 'Navy', value: '#1e3a5f' },
    { name: 'Silver', value: '#c0c0c0' },
    { name: 'Black', value: '#1a1a1a' },
  ];

  return (
    <div className="space-y-6">
      {activeTab === 'fabric' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Fabric Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['wool', 'cotton', 'linen', 'cashmere'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => onUpdate('fabric', { type })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all capitalize ${
                    configuration.fabric.type === type
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {type}
                  {type === 'cashmere' && <span className="text-xs ml-1">(+$500)</span>}
                  {type === 'linen' && <span className="text-xs ml-1">(+$100)</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {fabricColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onUpdate('fabric', { color: color.value })}
                  className={`relative h-12 rounded-sm border-2 transition-all ${
                    configuration.fabric.color === color.value
                      ? 'border-gold scale-105'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  <span className="absolute bottom-0 left-0 right-0 bg-white/90 text-xs py-1 text-center">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {(['solid', 'pinstripe', 'plaid', 'herringbone'] as const).map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => onUpdate('fabric', { pattern })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all capitalize ${
                    configuration.fabric.pattern === pattern
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {pattern}
                  {pattern !== 'solid' && <span className="text-xs ml-1">(+$50)</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'jacket' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {(['single-breasted', 'double-breasted'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => onUpdate('jacket', { style })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all capitalize ${
                    configuration.jacket.style === style
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {style.replace('-', ' ')}
                  {style === 'double-breasted' && <span className="text-xs ml-1">(+$100)</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lapel Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['notch', 'peak', 'shawl'] as const).map((lapel) => (
                <button
                  key={lapel}
                  onClick={() => onUpdate('jacket', { lapel })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all capitalize ${
                    configuration.jacket.lapel === lapel
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {lapel}
                  {lapel === 'peak' && <span className="text-xs ml-1">(+$50)</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Buttons</label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((buttons) => (
                <button
                  key={buttons}
                  onClick={() => onUpdate('jacket', { buttons })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all ${
                    configuration.jacket.buttons === buttons
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {buttons} Button{buttons > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lining Color</label>
            <div className="grid grid-cols-3 gap-2">
              {liningColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onUpdate('jacket', { lining: color.value })}
                  className={`relative h-12 rounded-sm border-2 transition-all ${
                    configuration.jacket.lining === color.value
                      ? 'border-gold scale-105'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  <span className="absolute bottom-0 left-0 right-0 bg-white/90 text-xs py-1 text-center">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'trouser' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Fit</label>
            <div className="grid grid-cols-3 gap-2">
              {(['slim', 'classic', 'relaxed'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => onUpdate('trouser', { fit })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all capitalize ${
                    configuration.trouser.fit === fit
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pleats</label>
            <div className="grid grid-cols-3 gap-2">
              {(['flat', 'single', 'double'] as const).map((pleats) => (
                <button
                  key={pleats}
                  onClick={() => onUpdate('trouser', { pleats })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all capitalize ${
                    configuration.trouser.pleats === pleats
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {pleats}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rise</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((rise) => (
                <button
                  key={rise}
                  onClick={() => onUpdate('trouser', { rise })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all capitalize ${
                    configuration.trouser.rise === rise
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {rise}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cuffs</label>
            <div className="grid grid-cols-2 gap-2">
              {[true, false].map((cuffs) => (
                <button
                  key={cuffs.toString()}
                  onClick={() => onUpdate('trouser', { cuffs })}
                  className={`px-4 py-2 rounded-sm border-2 transition-all ${
                    configuration.trouser.cuffs === cuffs
                      ? 'border-gold bg-gold/10'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cuffs ? 'With Cuffs' : 'No Cuffs'}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'details' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Monogram (Optional)</label>
            <input
              type="text"
              value={configuration.details.monogram}
              onChange={(e) => onUpdate('details', { monogram: e.target.value.slice(0, 3).toUpperCase() })}
              placeholder="ABC"
              maxLength={3}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-sm focus:border-gold focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Up to 3 letters (+$25)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Button Color</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Black', value: '#1a1a1a' },
                { name: 'Brown', value: '#5d4037' },
                { name: 'Navy', value: '#1e3a5f' },
              ].map((color) => (
                <button
                  key={color.value}
                  onClick={() => onUpdate('details', { buttonColor: color.value })}
                  className={`relative h-12 rounded-sm border-2 transition-all ${
                    configuration.details.buttonColor === color.value
                      ? 'border-gold scale-105'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  <span className="absolute bottom-0 left-0 right-0 bg-white/90 text-xs py-1 text-center">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thread Color</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Matching', value: configuration.fabric.color },
                { name: 'Black', value: '#1a1a1a' },
                { name: 'White', value: '#ffffff' },
              ].map((color) => (
                <button
                  key={color.name}
                  onClick={() => onUpdate('details', { threadColor: color.value })}
                  className={`relative h-12 rounded-sm border-2 transition-all ${
                    configuration.details.threadColor === color.value
                      ? 'border-gold scale-105'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  <span className={`absolute bottom-0 left-0 right-0 ${
                    color.value === '#ffffff' ? 'bg-gray-900' : 'bg-white/90'
                  } text-xs py-1 text-center ${
                    color.value === '#ffffff' ? 'text-white' : 'text-black'
                  }`}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}