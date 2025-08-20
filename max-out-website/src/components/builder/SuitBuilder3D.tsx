'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Palette, Shirt, Scissors, ShoppingBag } from 'lucide-react';
import { EnhancedSuitModel } from './EnhancedSuitModel';
import { BuilderControls } from './BuilderControls';

export interface SuitConfiguration {
  fabric: {
    type: 'wool' | 'cotton' | 'linen' | 'cashmere';
    color: string;
    pattern: 'solid' | 'pinstripe' | 'plaid' | 'herringbone';
  };
  jacket: {
    style: 'single-breasted' | 'double-breasted';
    lapel: 'notch' | 'peak' | 'shawl';
    buttons: 1 | 2 | 3;
    vents: 'none' | 'center' | 'side';
    lining: string;
  };
  trouser: {
    fit: 'slim' | 'classic' | 'relaxed';
    pleats: 'flat' | 'single' | 'double';
    cuffs: boolean;
    rise: 'low' | 'medium' | 'high';
  };
  details: {
    monogram: string;
    buttonColor: string;
    threadColor: string;
  };
}

interface SuitBuilder3DProps {
  onSave: (config: SuitConfiguration) => void;
  onAddToCart: (config: SuitConfiguration) => void;
  initialConfig?: Partial<SuitConfiguration>;
}

export function SuitBuilder3D({ onSave, onAddToCart, initialConfig }: SuitBuilder3DProps) {
  const defaultConfig: SuitConfiguration = {
    fabric: {
      type: 'wool',
      color: '#1a1a1a',
      pattern: 'solid',
    },
    jacket: {
      style: 'single-breasted',
      lapel: 'notch',
      buttons: 2,
      vents: 'side',
      lining: '#8b0000',
    },
    trouser: {
      fit: 'slim',
      pleats: 'flat',
      cuffs: true,
      rise: 'medium',
    },
    details: {
      monogram: '',
      buttonColor: '#1a1a1a',
      threadColor: '#1a1a1a',
    },
  };

  const [config, setConfig] = useState<SuitConfiguration>({
    ...defaultConfig,
    ...initialConfig,
    fabric: { ...defaultConfig.fabric, ...initialConfig?.fabric },
    jacket: { ...defaultConfig.jacket, ...initialConfig?.jacket },
    trouser: { ...defaultConfig.trouser, ...initialConfig?.trouser },
    details: { ...defaultConfig.details, ...initialConfig?.details },
  });

  const [activeTab, setActiveTab] = useState<'fabric' | 'jacket' | 'trouser' | 'details'>('fabric');
  const [isRotating, setIsRotating] = useState(true);

  const updateConfig = (section: keyof SuitConfiguration, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  };

  const calculatePrice = () => {
    let basePrice = 89900; // $899 base
    
    // Fabric upcharges
    if (config.fabric.type === 'cashmere') basePrice += 50000;
    else if (config.fabric.type === 'linen') basePrice += 10000;
    
    // Pattern upcharges
    if (config.fabric.pattern !== 'solid') basePrice += 5000;
    
    // Style upcharges
    if (config.jacket.style === 'double-breasted') basePrice += 10000;
    if (config.jacket.lapel === 'peak') basePrice += 5000;
    
    // Details upcharges
    if (config.details.monogram) basePrice += 2500;
    
    return basePrice;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif mb-4">Custom Suit Builder</h2>
        <p className="text-gray-600">Design your perfect suit with our 3D configurator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-lg p-4 h-[600px]">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-gray-600">Loading 3D model...</p>
              </div>
            </div>
          }>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <spotLight position={[-10, -10, -5]} intensity={0.5} />
              
              <EnhancedSuitModel configuration={config} />
              
              <OrbitControls
                enablePan={false}
                autoRotate={isRotating}
                autoRotateSpeed={1}
                minDistance={3}
                maxDistance={8}
              />
              
              <Environment preset="studio" />
              <ContactShadows
                position={[0, -2, 0]}
                opacity={0.5}
                scale={10}
                blur={1}
              />
            </Canvas>
          </Suspense>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              {isRotating ? 'Stop' : 'Start'} Rotation
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2 border-b">
            {(['fabric', 'jacket', 'trouser', 'details'] as const).map((tab) => {
              const icons = {
                fabric: Palette,
                jacket: Shirt,
                trouser: Scissors,
                details: '✨',
              };
              const Icon = icons[tab];
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-gold text-black'
                      : 'border-transparent text-gray-600 hover:text-black'
                  }`}
                >
                  {typeof Icon === 'string' ? (
                    <span>{Icon}</span>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>

          <BuilderControls
            activeTab={activeTab}
            configuration={config}
            onUpdate={updateConfig}
          />

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total Price</span>
              <span className="text-3xl font-bold">${(calculatePrice() / 100).toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddToCart(config)}
                className="w-full bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </motion.button>
              
              <button
                onClick={() => onSave(config)}
                className="w-full px-6 py-3 border-2 border-black hover:bg-black hover:text-white rounded-sm font-semibold transition-colors"
              >
                Save Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}