import { bundleProducts } from './bundleProducts';
import { casualBundles } from './casualBundles';
import { promBundles } from './promBundles';
import { weddingBundles } from './weddingBundles';
import { getSuitImage, getShirtImage, getTieImage } from './bundleImageMapping';

// Helper function to add component images to original bundles
function addComponentImages(bundle: any) {
  return {
    ...bundle,
    suit: {
      ...bundle.suit,
      image: getSuitImage(bundle.suit.color) || ''
    },
    shirt: {
      ...bundle.shirt,
      image: getShirtImage(bundle.shirt.color) || ''
    },
    tie: bundle.tie ? {
      ...bundle.tie,
      image: getTieImage(bundle.tie.color) || ''
    } : undefined,
    pocketSquare: bundle.pocketSquare // Casual bundles have pocket squares instead of ties
  };
}

// Combine ALL bundle collections
export const bundleProductsWithImages = {
  bundles: [
    // Original 30 bundles with tie
    ...bundleProducts.bundles.map(addComponentImages),
    
    // 15 Casual bundles with pocket squares ($199.99)
    ...casualBundles.bundles,
    
    // 5 Prom tuxedo bundles ($249.99)
    ...promBundles.bundles,
    
    // 16 Wedding bundles (Fall: 8, Spring: 4, Summer: 4)
    ...weddingBundles.bundles
  ]
};

// Export total count for reference
export const TOTAL_BUNDLE_COUNT = bundleProductsWithImages.bundles.length; // Should be 66 total