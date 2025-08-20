import { Crown } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-gold via-yellow-500 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Crown className="h-10 w-10 text-black" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-white mb-4">
            We'll Be Back Shortly
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            We're currently updating our site to serve you better. 
            Our team is working hard to bring you an enhanced shopping experience.
          </p>
          
          <div className="space-y-4 text-gray-400">
            <p className="text-sm">
              Expected to be back online soon
            </p>
            <p className="text-sm">
              For urgent inquiries, please call us at{' '}
              <a href="tel:313-555-0100" className="text-gold hover:text-gold/80 transition-colors">
                313-555-0100
              </a>
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-xs text-gray-500">
              KCT Menswear • Luxury is a mindset
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}