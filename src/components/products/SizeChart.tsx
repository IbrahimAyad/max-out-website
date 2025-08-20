'use client'

import { useState } from 'react'
import { X, Ruler, Info, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/Modal'

interface SizeChartProps {
  category: 'suits' | 'shirts' | 'shoes' | 'accessories'
  isOpen: boolean
  onClose: () => void
}

const sizeCharts = {
  suits: {
    title: 'Suit Size Chart',
    description: 'All measurements are in inches. For the best fit, we recommend professional measurements.',
    measurements: [
      'Chest: Measure around the fullest part of your chest, keeping the tape horizontal',
      'Waist: Measure around your natural waistline',
      'Inseam: Measure from crotch to desired pant length',
      'Sleeve: Measure from center back neck, across shoulder, down to wrist'
    ],
    chart: [
      { size: '36R', chest: '36', waist: '30', inseam: '30', sleeve: '32' },
      { size: '38R', chest: '38', waist: '32', inseam: '30', sleeve: '32.5' },
      { size: '40R', chest: '40', waist: '34', inseam: '30', sleeve: '33' },
      { size: '42R', chest: '42', waist: '36', inseam: '30', sleeve: '33.5' },
      { size: '44R', chest: '44', waist: '38', inseam: '30', sleeve: '34' },
      { size: '46R', chest: '46', waist: '40', inseam: '30', sleeve: '34.5' },
      { size: '48R', chest: '48', waist: '42', inseam: '30', sleeve: '35' },
      { size: '50R', chest: '50', waist: '44', inseam: '30', sleeve: '35.5' },
    ],
    headers: ['Size', 'Chest', 'Waist', 'Inseam', 'Sleeve'],
    fitTypes: [
      { name: 'Slim Fit', description: 'Closer to the body with a tapered waist' },
      { name: 'Classic Fit', description: 'Traditional cut with room for comfort' },
      { name: 'Modern Fit', description: 'Between slim and classic, slightly tapered' }
    ]
  },
  shirts: {
    title: 'Dress Shirt Size Chart',
    description: 'Collar sizes are in inches. Sleeve length measured from center back.',
    measurements: [
      'Neck: Measure around the base of your neck where collar sits',
      'Chest: Measure around the fullest part of your chest',
      'Sleeve: Measure from center back neck to wrist with arm slightly bent'
    ],
    chart: [
      { size: 'S', neck: '14-14.5', chest: '34-36', sleeve: '32-33' },
      { size: 'M', neck: '15-15.5', chest: '38-40', sleeve: '33-34' },
      { size: 'L', neck: '16-16.5', chest: '42-44', sleeve: '34-35' },
      { size: 'XL', neck: '17-17.5', chest: '46-48', sleeve: '35-36' },
      { size: 'XXL', neck: '18-18.5', chest: '50-52', sleeve: '36-37' },
    ],
    headers: ['Size', 'Neck', 'Chest', 'Sleeve'],
    fitTypes: [
      { name: 'Slim Fit', description: 'Tailored through the chest and waist' },
      { name: 'Regular Fit', description: 'Classic comfortable fit' },
      { name: 'Athletic Fit', description: 'Roomier in chest, tapered at waist' }
    ]
  },
  shoes: {
    title: 'Shoe Size Chart',
    description: 'Sizes shown are US standard. For best fit, measure your foot length.',
    measurements: [
      'Length: Stand on paper, mark heel and longest toe, measure distance',
      'Width: Measure across the widest part of your foot',
      'Try on shoes in the afternoon when feet are slightly swollen'
    ],
    chart: [
      { size: '7', us: '7', eu: '40', uk: '6', length: '9.6"' },
      { size: '8', us: '8', eu: '41', uk: '7', length: '9.9"' },
      { size: '9', us: '9', eu: '42', uk: '8', length: '10.3"' },
      { size: '10', us: '10', eu: '43', uk: '9', length: '10.6"' },
      { size: '11', us: '11', eu: '44', uk: '10', length: '10.9"' },
      { size: '12', us: '12', eu: '45', uk: '11', length: '11.3"' },
      { size: '13', us: '13', eu: '46', uk: '12', length: '11.6"' },
    ],
    headers: ['US', 'EU', 'UK', 'Length'],
    fitTypes: [
      { name: 'Standard Width (D)', description: 'Regular width for most feet' },
      { name: 'Wide (EE)', description: 'Extra room in toe box and width' },
      { name: 'Narrow (B)', description: 'Slimmer fit for narrow feet' }
    ]
  },
  accessories: {
    title: 'Accessories Size Guide',
    description: 'Most accessories are one-size or adjustable. See specific guidelines below.',
    measurements: [
      'Belts: Measure your waist where you wear your pants',
      'Ties: Standard length is 57-58 inches',
      'Pocket Squares: Standard 12x12 inches'
    ],
    chart: [
      { item: 'Belt', sizing: 'Order 2 inches larger than waist size' },
      { item: 'Tie', sizing: 'Standard length fits most, Extra Long for 6\'2" and taller' },
      { item: 'Bow Tie', sizing: 'Adjustable neck sizes 14-18 inches' },
      { item: 'Suspenders', sizing: 'Adjustable, fits most heights 5\'6" - 6\'4"' },
      { item: 'Cufflinks', sizing: 'One size fits all dress shirts' },
    ],
    headers: ['Item', 'Sizing Guide'],
    fitTypes: []
  }
}

export function SizeChart({ category, isOpen, onClose }: SizeChartProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'guide'>('chart')
  const chartData = sizeCharts[category]

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
              <Ruler className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-2xl font-serif font-semibold">{chartData.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'chart' 
                ? 'bg-white shadow-sm text-black' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Size Chart
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'guide' 
                ? 'bg-white shadow-sm text-black' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Measuring Guide
          </button>
        </div>

        {activeTab === 'chart' ? (
          <div>
            {/* Description */}
            <p className="text-gray-600 mb-6">{chartData.description}</p>

            {/* Size Chart Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {chartData.headers.map((header) => (
                      <th key={header} className="text-left py-3 px-4 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chartData.chart.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="py-3 px-4">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fit Types */}
            {chartData.fitTypes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gold" />
                  Fit Types Available
                </h3>
                <div className="grid gap-3">
                  {chartData.fitTypes.map((fit) => (
                    <div key={fit.name} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium">{fit.name}</h4>
                      <p className="text-sm text-gray-600">{fit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Measuring Guide */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold" />
                How to Measure
              </h3>
              <div className="space-y-3">
                {chartData.measurements.map((measurement, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold text-gold">{idx + 1}</span>
                    </div>
                    <p className="text-gray-700">{measurement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Pro Tips</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Have someone else take your measurements for accuracy</li>
                <li>• Wear fitted clothing or underwear when measuring</li>
                <li>• Keep measuring tape snug but not tight</li>
                <li>• Round up to the nearest half inch</li>
                <li>• When between sizes, order the larger size</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-6 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Need help? Contact our fit specialists at (313) 555-0100
          </p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}