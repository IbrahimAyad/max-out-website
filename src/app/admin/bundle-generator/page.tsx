import BundleGenerator from '@/components/bundle/BundleGenerator';

export default function BundleGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bundle Outfit Generator</h1>
          <p className="mt-2 text-gray-600">
            Create AI-generated outfit images for new bundle combinations
          </p>
        </div>
        
        <BundleGenerator />
        
        <div className="mt-12 max-w-2xl mx-auto text-center text-sm text-gray-500">
          <p className="mb-2">
            <strong>Note:</strong> This requires REPLICATE_API_TOKEN to be set in your environment variables.
          </p>
          <p>
            If not configured, you'll see an error message. This is a safe implementation that won't break the site.
          </p>
        </div>
      </div>
    </div>
  );
}