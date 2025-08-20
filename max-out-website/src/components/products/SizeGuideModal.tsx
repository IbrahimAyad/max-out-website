import React, { useState } from 'react';
import { X, Ruler, User, Calculator, Phone, MessageCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: 'suit' | 'shirt' | 'ties' | 'general';
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, productType = 'suit' }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'calculator' | 'video'>('chart');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    height: '',
    weight: '',
  });
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  
  const calculateSize = () => {
    const chest = parseFloat(measurements.chest);
    const height = parseFloat(measurements.height);
    
    if (!chest || !height) return;
    
    // Simple size calculation logic
    let baseSize = '';
    if (chest <= 36) baseSize = '36';
    else if (chest <= 38) baseSize = '38';
    else if (chest <= 40) baseSize = '40';
    else if (chest <= 42) baseSize = '42';
    else if (chest <= 44) baseSize = '44';
    else if (chest <= 46) baseSize = '46';
    else if (chest <= 48) baseSize = '48';
    else if (chest <= 50) baseSize = '50';
    else baseSize = '52';
    
    // Determine length
    let length = '';
    if (height <= 67) length = 'S'; // 5ft7in and under
    else if (height <= 73) length = 'R'; // 5ft8in to 6ft1in
    else length = 'L'; // 6ft2in and over
    
    setRecommendedSize(`${baseSize}${length}`);
  };

  const modalContentStyle = {
    maxHeight: 'calc(90vh - 200px)'
  };
  
  const modalStyle = {
    maxHeight: '90vh'
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full overflow-hidden" style={modalStyle}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Find Your Perfect Size</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('chart')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'chart'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Ruler className="inline-block w-4 h-4 mr-2" />
              Size Chart
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'calculator'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="inline-block w-4 h-4 mr-2" />
              Size Calculator
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'video'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="inline-block w-4 h-4 mr-2" />
              How to Measure
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto" style={modalContentStyle}>
          {activeTab === 'chart' && (
            <div className="space-y-8">
              {productType === 'shirt' ? (
                // Dress Shirt Measurements
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dress Shirt Size Guide</h3>
                  
                  {/* Fit Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Slim Cut</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Modern tailored fit that follows the natural lines of the body.
                      </p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Size</th>
                            <th className="text-left py-2">Neck</th>
                            <th className="text-left py-2">Chest</th>
                            <th className="text-left py-2">Waist</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">S</td>
                            <td>15"</td>
                            <td>36-38"</td>
                            <td>30-32"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">M</td>
                            <td>15.5"</td>
                            <td>38-40"</td>
                            <td>32-34"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">L</td>
                            <td>16"</td>
                            <td>42-44"</td>
                            <td>36-38"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">XL</td>
                            <td>16.5"</td>
                            <td>46-48"</td>
                            <td>40-42"</td>
                          </tr>
                          <tr>
                            <td className="py-2">XXL</td>
                            <td>17"</td>
                            <td>50-52"</td>
                            <td>44-46"</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Classic Fit</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Traditional relaxed fit with generous room through the body.
                      </p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Neck</th>
                            <th className="text-left py-2">Sleeve Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">15" - 18.5"</td>
                            <td>32-33, 34-35, 36-37</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">19" - 20"</td>
                            <td>34-35, 36-37</td>
                          </tr>
                          <tr>
                            <td className="py-2">22"</td>
                            <td>34-35, 36-37</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-500 mt-3">
                        * Sleeve length availability varies by neck size
                      </p>
                    </div>
                  </div>
                  
                  {/* How to Measure */}
                  <div>
                    <h4 className="font-medium mb-3">How to Measure</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Neck</h5>
                        <p className="text-sm text-gray-600">
                          Measure around the base of your neck where the collar sits. 
                          Add 1/2 inch for comfort.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Sleeve</h5>
                        <p className="text-sm text-gray-600">
                          Measure from the center back of neck, over the shoulder, 
                          down to the wrist with arm slightly bent.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Chest</h5>
                        <p className="text-sm text-gray-600">
                          Measure around the fullest part of your chest, 
                          keeping the tape level and parallel to the floor.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Waist</h5>
                        <p className="text-sm text-gray-600">
                          Measure around your natural waistline, 
                          keeping the tape comfortably loose.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : productType === 'ties' ? (
                // Tie Measurements
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tie Style Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-medium mb-3">Visual Comparison</h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-32 bg-gray-200 rounded" style={{ width: '3.5rem' }} />
                          <div>
                            <p className="font-medium">Classic (3.5")</p>
                            <p className="text-sm text-gray-600">Traditional width</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-32 bg-gray-200 rounded" style={{ width: '2.75rem' }} />
                          <div>
                            <p className="font-medium">Skinny (2.75")</p>
                            <p className="text-sm text-gray-600">Modern width</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-32 bg-gray-200 rounded" style={{ width: '2.25rem' }} />
                          <div>
                            <p className="font-medium">Slim (2.25")</p>
                            <p className="text-sm text-gray-600">Fashion-forward</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-16 bg-gray-200 rounded-full" />
                          <div>
                            <p className="font-medium">Bowtie</p>
                            <p className="text-sm text-gray-600">Adjustable size</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Detailed Measurements</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Style</th>
                            <th className="text-left py-2">Width</th>
                            <th className="text-left py-2">Length</th>
                            <th className="text-left py-2">Best For</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3">Classic Tie</td>
                            <td>3.5 inches</td>
                            <td>57 inches</td>
                            <td>Traditional formal occasions</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">Skinny Tie</td>
                            <td>2.75 inches</td>
                            <td>57 inches</td>
                            <td>Modern professional settings</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">Slim Tie</td>
                            <td>2.25 inches</td>
                            <td>57 inches</td>
                            <td>Fashion-forward events</td>
                          </tr>
                          <tr>
                            <td className="py-3">Bowtie</td>
                            <td>2.5 inches (height)</td>
                            <td>Adjustable neck size</td>
                            <td>Formal black-tie events</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Style Recommendations</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Classic Tie (3.5")</h5>
                        <p className="text-sm text-gray-600">
                          Timeless and versatile, the classic width is appropriate for most formal occasions 
                          and business settings. Ideal for traditional wedding attire and conservative 
                          professional environments.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Skinny Tie (2.75")</h5>
                        <p className="text-sm text-gray-600">
                          A modern alternative that bridges classic and contemporary styles. Perfect for 
                          business-casual settings, creative workplaces, and semi-formal events where 
                          you want to appear stylish yet professional.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Slim Tie (2.25")</h5>
                        <p className="text-sm text-gray-600">
                          Fashion-forward and sleek, the slim tie makes a bold contemporary statement. 
                          Best for creative industries, modern weddings, and fashion-conscious individuals 
                          wanting to stand out.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Bowtie</h5>
                        <p className="text-sm text-gray-600">
                          Sophisticated and distinctive, our self-tie bowties are perfect for black-tie 
                          events, formal dinners, and special occasions where you want to make a refined 
                          impression.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Body Type Considerations</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Select a tie width that complements your body type for the most flattering look:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Broader build:</strong> Choose wider ties (Classic 3.5") to maintain visual proportion</li>
                      <li>• <strong>Slender build:</strong> Slimmer ties (2.25"-2.75") create a balanced silhouette</li>
                      <li>• <strong>Average build:</strong> All widths work well, choose based on the occasion and personal style</li>
                    </ul>
                  </div>
                </div>
              ) : (
                // Original Suit Measurements
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Suit Jacket Measurements</h3>
                    <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-medium">US Size</th>
                        <th className="text-left p-3 font-medium">EU Size</th>
                        <th className="text-left p-3 font-medium">UK Size</th>
                        <th className="text-left p-3 font-medium">Chest (in)</th>
                        <th className="text-left p-3 font-medium">Waist (in)</th>
                        <th className="text-left p-3 font-medium">Shoulder (in)</th>
                        <th className="text-left p-3 font-medium">Sleeve (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { us: '34', eu: '44', uk: '34', chest: '34', waist: '28', shoulder: '16.5', sleeve: '31' },
                        { us: '36', eu: '46', uk: '36', chest: '36', waist: '30', shoulder: '17', sleeve: '32' },
                        { us: '38', eu: '48', uk: '38', chest: '38', waist: '32', shoulder: '17.5', sleeve: '33' },
                        { us: '40', eu: '50', uk: '40', chest: '40', waist: '34', shoulder: '18', sleeve: '34' },
                        { us: '42', eu: '52', uk: '42', chest: '42', waist: '36', shoulder: '18.5', sleeve: '35' },
                        { us: '44', eu: '54', uk: '44', chest: '44', waist: '38', shoulder: '19', sleeve: '36' },
                        { us: '46', eu: '56', uk: '46', chest: '46', waist: '40', shoulder: '19.5', sleeve: '37' },
                        { us: '48', eu: '58', uk: '48', chest: '48', waist: '42', shoulder: '20', sleeve: '38' },
                        { us: '50', eu: '60', uk: '50', chest: '50', waist: '44', shoulder: '20.5', sleeve: '39' },
                        { us: '52', eu: '62', uk: '52', chest: '52', waist: '46', shoulder: '21', sleeve: '40' },
                      ].map((size) => (
                        <tr key={size.us} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{size.us}</td>
                          <td className="p-3">{size.eu}</td>
                          <td className="p-3">{size.uk}</td>
                          <td className="p-3">{size.chest}</td>
                          <td className="p-3">{size.waist}</td>
                          <td className="p-3">{size.shoulder}</td>
                          <td className="p-3">{size.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Length Guide */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Suit Length Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Short (S)</h4>
                    <p className="text-sm text-gray-600">Height: 5ft4in - 5ft7in</p>
                    <p className="text-sm text-gray-600">Jacket Length: -2 inches</p>
                    <p className="text-sm text-gray-600">Sleeve Length: -1 inch</p>
                  </div>
                  <div className="border rounded-lg p-4 border-black">
                    <h4 className="font-medium mb-2">Regular (R)</h4>
                    <p className="text-sm text-gray-600">Height: 5ft8in - 6ft1in</p>
                    <p className="text-sm text-gray-600">Jacket Length: Standard</p>
                    <p className="text-sm text-gray-600">Sleeve Length: Standard</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Long (L)</h4>
                    <p className="text-sm text-gray-600">Height: 6ft2in and above</p>
                    <p className="text-sm text-gray-600">Jacket Length: +2 inches</p>
                    <p className="text-sm text-gray-600">Sleeve Length: +1 inch</p>
                  </div>
                </div>
              </div>
              
              {/* Fit Guide */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Fit Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Modern Fit</h4>
                    <p className="text-sm text-gray-600 mb-2">Our signature fit - tailored but not tight</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Slightly tapered through the body</li>
                      <li>• Natural shoulder construction</li>
                      <li>• Moderate lapel width</li>
                      <li>• Comfortable mobility</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Classic Fit</h4>
                    <p className="text-sm text-gray-600 mb-2">Traditional cut with more room</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Relaxed through chest and waist</li>
                      <li>• Fuller cut in the body</li>
                      <li>• Traditional lapel width</li>
                      <li>• Maximum comfort</li>
                    </ul>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
          )}
          
          {activeTab === 'calculator' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-6">Enter Your Measurements</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chest (inches)</label>
                    <input
                      type="number"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Waist (inches)</label>
                    <input
                      type="number"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 34"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (inches)</label>
                    <input
                      type="number"
                      value={measurements.height}
                      onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 70 (5ft10in)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
                    <input
                      type="number"
                      value={measurements.weight}
                      onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 180"
                    />
                  </div>
                </div>
                
                <button
                  onClick={calculateSize}
                  className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Calculate My Size
                </button>
                
                {recommendedSize && (
                  <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Your Recommended Size</h4>
                    <p className="text-2xl font-bold text-green-900 mb-2">{recommendedSize}</p>
                    <p className="text-sm text-green-700">
                      Based on your measurements, we recommend size {recommendedSize}. 
                      This size should provide a comfortable modern fit.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Pro Tip:</strong> If you're between sizes, we recommend sizing up for comfort. 
                  Remember, we offer free alterations to ensure your perfect fit!
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'video' && (
            <div className="space-y-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Video: How to Take Your Measurements</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">How to Measure Chest</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Stand up straight with arms relaxed at your sides</li>
                    <li>2. Wrap the measuring tape around the fullest part of your chest</li>
                    <li>3. Keep the tape level and parallel to the floor</li>
                    <li>4. Don't pull too tight - you should be able to fit a finger under the tape</li>
                    <li>5. Record the measurement in inches</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">How to Measure Waist</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Find your natural waistline (usually at belly button level)</li>
                    <li>2. Stand relaxed, don't suck in your stomach</li>
                    <li>3. Wrap the tape around your waist</li>
                    <li>4. Keep the tape snug but not tight</li>
                    <li>5. Record the measurement in inches</li>
                  </ol>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Need Personal Assistance?</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Style Expert
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;