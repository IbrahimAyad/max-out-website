import { Metadata } from 'next'
import { VisualSearchInterface } from '@/components/search/VisualSearchInterface'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Camera, 
  Sparkles, 
  Search, 
  Palette, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Visual Search - Find Similar Menswear | KCT Menswear',
  description: 'Upload an image to find similar menswear items using AI-powered visual search. Discover matching suits, shirts, ties, and accessories instantly.',
  keywords: 'visual search, AI search, menswear finder, image search, style matching, fashion AI',
  openGraph: {
    title: 'AI Visual Search - KCT Menswear',
    description: 'Find similar menswear items instantly with our AI-powered visual search technology',
    type: 'website'
  }
}

export default function VisualSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-burgundy via-burgundy-600 to-burgundy-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Zap className="h-4 w-4" />
              <span>Powered by Advanced AI Technology</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif">
              Visual Search
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Upload any image of menswear and discover similar items in our collection using cutting-edge AI visual recognition
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5" />
                <span>Instant Style Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5" />
                <span>Color & Pattern Matching</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5" />
                <span>Smart Recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              How Visual Search Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered visual search analyzes your uploaded image and finds matching items with remarkable accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Image</h3>
              <p className="text-gray-600">
                Take a photo or upload an image of any menswear item you'd like to find similar styles for
              </p>
            </Card>
            
            {/* Step 2 */}
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes style, colors, patterns, fabric texture, and overall aesthetic characteristics
              </p>
            </Card>
            
            {/* Step 3 */}
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Find Matches</h3>
              <p className="text-gray-600">
                Get instant results with similarity scores and explanations for why each item matches
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Visual Search Interface */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <VisualSearchInterface />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Advanced AI Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our visual search technology goes beyond simple image matching to understand style and context
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Color Analysis */}
            <Card className="p-6">
              <Palette className="h-8 w-8 text-burgundy mb-4" />
              <h3 className="font-semibold mb-2">Color Analysis</h3>
              <p className="text-sm text-gray-600">
                Detects dominant and accent colors to find perfectly coordinated pieces
              </p>
            </Card>
            
            {/* Pattern Recognition */}
            <Card className="p-6">
              <div className="w-8 h-8 bg-gradient-to-br from-burgundy to-burgundy-600 rounded mb-4" />
              <h3 className="font-semibold mb-2">Pattern Recognition</h3>
              <p className="text-sm text-gray-600">
                Identifies stripes, checks, solids, and complex patterns with high accuracy
              </p>
            </Card>
            
            {/* Style Classification */}
            <Card className="p-6">
              <div className="w-8 h-8 border-2 border-burgundy rounded mb-4" />
              <h3 className="font-semibold mb-2">Style Classification</h3>
              <p className="text-sm text-gray-600">
                Understands formal, casual, business, and occasion-specific styling
              </p>
            </Card>
            
            {/* Fabric Texture */}
            <Card className="p-6">
              <div className="w-8 h-8 bg-gray-200 rounded mb-4 shadow-inner" />
              <h3 className="font-semibold mb-2">Fabric Analysis</h3>
              <p className="text-sm text-gray-600">
                Recognizes fabric characteristics like texture, weight, and finish
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Perfect For Every Situation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're recreating a look or finding alternatives, visual search makes it effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use Case 1 */}
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">👔</span>
              </div>
              <h3 className="font-semibold mb-2">Recreate a Look</h3>
              <p className="text-gray-600 text-sm">
                Saw something you liked on social media or in person? Upload the image and find similar pieces in our collection.
              </p>
            </Card>
            
            {/* Use Case 2 */}
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Color Coordination</h3>
              <p className="text-gray-600 text-sm">
                Find pieces that perfectly complement your existing wardrobe by analyzing color harmony and contrast.
              </p>
            </Card>
            
            {/* Use Case 3 */}
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2">Style Inspiration</h3>
              <p className="text-gray-600 text-sm">
                Discover new styles and combinations by exploring items similar to pieces you already love.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-burgundy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Ready to Discover Your Perfect Style?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start with visual search or explore our curated collections
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="bg-white text-burgundy hover:bg-gray-100">
              <Camera className="h-5 w-5 mr-2" />
              Try Visual Search
            </Button>
            
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-burgundy">
              Browse Collections
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}