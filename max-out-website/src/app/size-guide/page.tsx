'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModernSizeBot } from '@/components/sizing/ModernSizeBot';
import { InteractiveMeasurementGuide } from '@/components/sizing/InteractiveMeasurementGuide';
import { Ruler, TrendingUp, Calculator, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SizeGuidePage() {
  const [showSizeBot, setShowSizeBot] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('suits');

  // Generate comprehensive size data
  const suitSizes = {
    short: Array.from({ length: 9 }, (_, i) => 34 + i * 2).filter(size => size <= 50), // 34S-50S
    regular: Array.from({ length: 11 }, (_, i) => 34 + i * 2).filter(size => size <= 54), // 34R-54R
    long: Array.from({ length: 9 }, (_, i) => 38 + i * 2).filter(size => size <= 54), // 38L-54L
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-burgundy rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-6">
              Size Guide & Measurement Tools
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find your perfect fit with our comprehensive sizing guide and measurement tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowSizeBot(true)}
                className="bg-burgundy hover:bg-burgundy-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Calculator className="mr-2 h-5 w-5" />
                AI Size Calculator
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('measurement-guide')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg font-semibold"
              >
                <Ruler className="mr-2 h-5 w-5" />
                How to Measure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Measurement Guide - Moved to top */}
      <section id="measurement-guide" className="py-16 bg-white">
        <div className="container-main">
          <InteractiveMeasurementGuide />
        </div>
      </section>

      {/* Size Charts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-serif text-center mb-12">Complete Size Charts</h2>
          
          {/* Suits & Jackets - Expandable */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection('suits')}
              className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-semibold">Suits & Jackets</h3>
              <ChevronDown
                className={`h-6 w-6 transition-transform ${
                  expandedSection === 'suits' ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedSection === 'suits' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-6"
              >
                {/* Regular Sizes */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Regular (R) - Height 5'8" to 6'0"</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left font-semibold text-sm">Size</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Chest</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Waist</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Sleeve</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suitSizes.regular.map((size) => (
                          <tr key={`${size}R`} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{size}R</td>
                            <td className="px-4 py-3 text-center">{size}</td>
                            <td className="px-4 py-3 text-center">{size - 6}</td>
                            <td className="px-4 py-3 text-center">{32 + (size - 36) * 0.25}</td>
                            <td className="px-4 py-3 text-center">{17 + (size - 36) * 0.25}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Short Sizes */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Short (S) - Height Under 5'8"</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left font-semibold text-sm">Size</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Chest</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Waist</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Sleeve</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suitSizes.short.map((size) => (
                          <tr key={`${size}S`} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{size}S</td>
                            <td className="px-4 py-3 text-center">{size}</td>
                            <td className="px-4 py-3 text-center">{size - 6}</td>
                            <td className="px-4 py-3 text-center">{31 + (size - 36) * 0.25}</td>
                            <td className="px-4 py-3 text-center">{17 + (size - 36) * 0.25}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Long Sizes */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Long (L) - Height Over 6'0"</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left font-semibold text-sm">Size</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Chest</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Waist</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Sleeve</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suitSizes.long.map((size) => (
                          <tr key={`${size}L`} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{size}L</td>
                            <td className="px-4 py-3 text-center">{size}</td>
                            <td className="px-4 py-3 text-center">{size - 6}</td>
                            <td className="px-4 py-3 text-center">{33.5 + (size - 38) * 0.25}</td>
                            <td className="px-4 py-3 text-center">{17.5 + (size - 38) * 0.25}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Dress Shirts - Expandable */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection('shirts')}
              className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-semibold">Dress Shirts</h3>
              <ChevronDown
                className={`h-6 w-6 transition-transform ${
                  expandedSection === 'shirts' ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedSection === 'shirts' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-6"
              >
                {/* Modern Fit */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Modern Fit - Tailored Silhouette</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left font-semibold text-sm">Size</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Neck</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Sleeve</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Chest</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Waist</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">S</td>
                          <td className="px-4 py-3 text-center">14-14.5</td>
                          <td className="px-4 py-3 text-center">32-33</td>
                          <td className="px-4 py-3 text-center">34-36</td>
                          <td className="px-4 py-3 text-center">28-30</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">M</td>
                          <td className="px-4 py-3 text-center">15-15.5</td>
                          <td className="px-4 py-3 text-center">33-34</td>
                          <td className="px-4 py-3 text-center">38-40</td>
                          <td className="px-4 py-3 text-center">32-34</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">L</td>
                          <td className="px-4 py-3 text-center">16-16.5</td>
                          <td className="px-4 py-3 text-center">34-35</td>
                          <td className="px-4 py-3 text-center">42-44</td>
                          <td className="px-4 py-3 text-center">36-38</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">XL</td>
                          <td className="px-4 py-3 text-center">17-17.5</td>
                          <td className="px-4 py-3 text-center">35-36</td>
                          <td className="px-4 py-3 text-center">46-48</td>
                          <td className="px-4 py-3 text-center">40-42</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">XXL</td>
                          <td className="px-4 py-3 text-center">18-18.5</td>
                          <td className="px-4 py-3 text-center">36-37</td>
                          <td className="px-4 py-3 text-center">50-52</td>
                          <td className="px-4 py-3 text-center">44-46</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">3XL</td>
                          <td className="px-4 py-3 text-center">19-19.5</td>
                          <td className="px-4 py-3 text-center">37-38</td>
                          <td className="px-4 py-3 text-center">54-56</td>
                          <td className="px-4 py-3 text-center">48-50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Classic Fit */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Classic Fit - Traditional Cut</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left font-semibold text-sm">Size</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Neck</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Sleeve</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Chest</th>
                          <th className="px-4 py-3 text-center font-semibold text-sm">Waist</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">S</td>
                          <td className="px-4 py-3 text-center">14-14.5</td>
                          <td className="px-4 py-3 text-center">32-33</td>
                          <td className="px-4 py-3 text-center">36-38</td>
                          <td className="px-4 py-3 text-center">32-34</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">M</td>
                          <td className="px-4 py-3 text-center">15-15.5</td>
                          <td className="px-4 py-3 text-center">33-34</td>
                          <td className="px-4 py-3 text-center">40-42</td>
                          <td className="px-4 py-3 text-center">36-38</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">L</td>
                          <td className="px-4 py-3 text-center">16-16.5</td>
                          <td className="px-4 py-3 text-center">34-35</td>
                          <td className="px-4 py-3 text-center">44-46</td>
                          <td className="px-4 py-3 text-center">40-42</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">XL</td>
                          <td className="px-4 py-3 text-center">17-17.5</td>
                          <td className="px-4 py-3 text-center">35-36</td>
                          <td className="px-4 py-3 text-center">48-50</td>
                          <td className="px-4 py-3 text-center">44-46</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">XXL</td>
                          <td className="px-4 py-3 text-center">18-18.5</td>
                          <td className="px-4 py-3 text-center">36-37</td>
                          <td className="px-4 py-3 text-center">52-54</td>
                          <td className="px-4 py-3 text-center">48-50</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">3XL</td>
                          <td className="px-4 py-3 text-center">19-19.5</td>
                          <td className="px-4 py-3 text-center">37-38</td>
                          <td className="px-4 py-3 text-center">56-58</td>
                          <td className="px-4 py-3 text-center">52-54</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Helpful Tips */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Size Guide Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>All measurements are in inches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>If you're between sizes, we recommend ordering the larger size</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Our suits come with a 2" let-out in the waist and seat for alterations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Professional tailoring services are available in all our stores</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container-main text-center">
          <h2 className="text-3xl font-serif mb-6">Need Help Finding Your Size?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our AI Size Calculator uses advanced algorithms to recommend the perfect size based on your measurements.
          </p>
          <Button
            size="lg"
            onClick={() => setShowSizeBot(true)}
            className="bg-gold hover:bg-gold/90 text-black px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Try AI Size Calculator
            <TrendingUp className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Modern Size Bot Modal */}
      {showSizeBot && (
        <ModernSizeBot
          onClose={() => setShowSizeBot(false)}
          onSizeSelected={(recommendation) => {
            setShowSizeBot(false);
            // Handle size recommendation
          }}
        />
      )}
    </div>
  );
}