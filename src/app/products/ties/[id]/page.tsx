'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Check, Plus, Minus, X } from 'lucide-react';
import { tieProducts, getTieColorById } from '@/lib/products/tieProducts';
import { useCart } from '@/hooks/useCart';

// Helper function to generate style-specific image URLs
function getStyleSpecificImage(colorData: any, styleId: string): string {

  // Convert color directory name format (e.g., "3000-TT (Mermaid Green)")
  const colorDirMap: { [key: string]: string } = {
    // Whites & Neutrals
    'white': '3000-A (White)',
    'ivory': '3000-S (Ivory)',
    'beige': '3000-MMM (Beige)',
    'champagne': '3000-H (Champagne)',
    'peach': '3000-ii (Peach)',

    // Blacks & Greys
    'black': '3000-B (Black)',
    'charcoal': '3000-NN (Charcoal)',
    'dark-grey': '3000-L (Dark Grey)',
    'silver': '3000-E (Silver)',
    'dark-silver': '3000-ZZ (Dark Silver)',

    // Blues
    'navy': '3000-G (Navy Blue)',
    'dark-navy': '3000-BBB (Dark Navy)',
    'royal-blue': '3000-EE (Royal Blue)',
    'baby-blue': '3000-R (Baby Blue)',
    'powder-blue': '3000-OO (Powder Blue)',
    'tiffany-blue': '3000-CCC (Tiffany Blue)',
    'turquoise': '3000-U (Turquoise)',
    'teal': '3000-AAA (Teal)',
    'aqua': '3000-QQ (Aqua)',
    'french-blue': '3000-I (French Blue)',
    'carolina-blue': '3000-JJJ (Carolina Blue)',
    'cobalt': '3000-HHH (Cobalt)',
    'sapphire-blue': '3000-KK (Sapphire Blue)',
    'denim-blue': '3000-RRR (Denim Blue)',

    // Reds
    'red': '3000-O (Bright Red)',
    'true-red': '3000-GGG (True Red)',
    'apple-red': '3000-W (Apple Red)',
    'dark-red': '3000-C (Dark Red)',
    'burgundy': '3000-MM (Burgundy)',
    'chianti': '3000-NNN (Chianti)',
    'rust': '3000-YY (Rust)',

    // Pinks & Roses
    'blush-pink': 'blush-pink',
    'light-blush': '3000-III (Light Blush)',
    'pink': '3000-X (Pink)',
    'light-pink': '3000-UU (Light Pink)',
    'dusty-rose': 'Dusty Rose',
    'french-rose': '3000-SSS (French Rose)',
    'rose-gold': '3000-LLL (Rose Gold)',
    'coral': '3000-FF (Coral)',
    'fushia': '3000-K (Fuchsia)',
    'magenta': '3000-PP (Magenta)',

    // Oranges
    'burnt-orange': '3000-Z (Burnt Orange)',
    'orange': '3000-SS (Orange)',
    'salmon-orange': '3000-GG (Salmon Orange)',

    // Yellows
    'yellow': '3000-J (Yellow)',
    'banana-yellow': '3000-M (Banana Yellow)',
    'canary': '3000-D (Canary)',
    'gold': '3000-JJ (Gold)',

    // Greens
    'emerald-green': '3000-Z (Emerald Green)',
    'hunter-green': 'Hunter Green + Bow + Tie',
    'olive-green': '3000-Q (Olive Green)',
    'dark-olive': '3000-DD (Dark Olive)',
    'mint-green': '3000-V (Mint)',
    'mermaid-green': '3000-TT (Mermaid Green)',
    'pastel-green': '3000-DDD (Pastel Green)',
    'lettuce-green': '3000-WW (Lettuce Green)',
    'lime': '3000-F (Lime)',
    'dusty-sage': '3000-PPP (Dusty Sage)',

    // Purples
    'light-lilac': '3000-VV (Light Lilac)',
    'lilac': '3000-XX (Lilac)',
    'lavender': '3000-AA (Lavender)',
    'medium-purple': '3000-HH (Medium Purple)',
    'plum': '3000-LL (Plum)',
    'deep-purple': '3000-P (Deep Purple)',
    'pastel-purple': '3000-EEE (Pastel Purple)',
    'mauve': '3000-KKK (Mauve)',

    // Browns
    'moca': '3000-CC (Moca)',
    'chocolate-brown': '3000-N (Chocolate Brown)',
    'medium-brown': '3000-OOO (Medium Brown)',
    'nutmeg': '3000-QQQ (Nutmeg)',
    'taupe': '3000-T (Taupe)',
  };

  const baseUrl = 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts';
  const colorDir = colorDirMap[colorData.id] || colorData.displayName;

  // Generate filename based on style
  let filename = '';
  const colorNameForFile = colorData.name.toLowerCase().replace(/ /g, '-');

  // Special handling for certain colors
  const specialPrefixes: { [key: string]: string } = {
    // Whites & Neutrals
    'white': 'a',
    'ivory': 's',
    'beige': 'mmm',
    'champagne': 'h',
    'peach': 'ii',

    // Blacks & Greys
    'black': 'b',
    'charcoal': 'nn',
    'dark-grey': 'l',
    'silver': 'e',
    'dark-silver': 'zz',

    // Blues
    'navy': 'g',
    'dark-navy': 'bbb',
    'royal-blue': 'ee',
    'baby-blue': 'r',
    'powder-blue': 'oo',
    'tiffany-blue': 'ccc',
    'turquoise': 'u',
    'teal': 'aaa',
    'aqua': 'qq',
    'french-blue': 'i',
    'carolina-blue': 'jjj',
    'cobalt': 'hhh',
    'sapphire-blue': 'kk',
    'denim-blue': 'rrr',

    // Reds
    'red': 'o',
    'true-red': 'ggg',
    'apple-red': 'w',
    'dark-red': 'c',
    'burgundy': 'mm',
    'chianti': 'nnn',
    'rust': 'yy',

    // Pinks & Roses
    'light-blush': 'iii',
    'pink': 'x',
    'light-pink': 'uu',
    'french-rose': 'sss',
    'rose-gold': 'lll',
    'coral': 'ff',
    'fushia': 'k',
    'magenta': 'pp',

    // Oranges
    'burnt-orange': 'z',
    'orange': 'ss',
    'salmon-orange': 'gg',

    // Yellows
    'yellow': 'j',
    'banana-yellow': 'm',
    'canary': 'd',
    'gold': 'jj',

    // Greens
    'emerald-green': 'z',
    'olive-green': 'q',
    'dark-olive': 'dd',
    'mint-green': 'v',
    'mermaid-green': 'tt',
    'pastel-green': 'ddd',
    'lettuce-green': 'ww',
    'lime': 'f',
    'dusty-sage': 'ppp',

    // Purples
    'light-lilac': 'vv',
    'lilac': 'xx',
    'lavender': 'aa',
    'medium-purple': 'hh',
    'plum': 'll',
    'deep-purple': 'p',
    'pastel-purple': 'eee',
    'mauve': 'kkk',

    // Browns
    'moca': 'cc',
    'chocolate-brown': 'n',
    'medium-brown': 'ooo',
    'nutmeg': 'qqq',
    'taupe': 't'
  };

  const prefix = specialPrefixes[colorData.id];

  switch(styleId) {
    case 'bowtie':
      // Bowtie uses different naming pattern
      if (prefix) {
        filename = `${prefix}-${colorNameForFile}-bowtie.jpg`;
      } else {
        filename = `${colorNameForFile}-bowtie.jpg`;
      }
      break;
    case 'classic':
      filename = `${colorNameForFile}-classic-width-tie-3.25-inch.webp`;
      break;
    case 'skinny':
      filename = `${colorNameForFile}-skinny-tie-2.75-inch.webp`;
      break;
    case 'slim':
      filename = `${colorNameForFile}-ultra-skinny-tie-2.25-inch.webp`;
      break;
    default:
      // Fallback to original image
      return colorData.imageUrl;
  }

  // Construct the full URL - Don't encode the directory if it has spaces in parentheses
  const fullUrl = `${baseUrl}/${colorDir}/${filename}`;

   // Debug log

  // Return the new URL, with fallback to original if something goes wrong
  return fullUrl;
}

interface BundleItem {
  color: string;
  style: string;
  quantity: number;
}

export default function TieProductPage() {
  const pathname = usePathname();
  const id = pathname.split('/').pop() as string;
  const { addItem } = useCart();

  // Parse id (e.g., "baby-blue-bowtie" -> color: baby-blue, style: bowtie)
  const parts = id.split('-');
  let colorId = '';
  let styleId = '';

  // Handle multi-word colors (e.g., baby-blue, burnt-orange)
  if (parts.length === 3) {
    colorId = `${parts[0]}-${parts[1]}`;
    styleId = parts[2];
  } else if (parts.length === 2) {
    colorId = parts[0];
    styleId = parts[1];
  } else {
    // Handle edge cases
    const possibleStyles = ['bowtie', 'classic', 'skinny', 'slim'];
    const lastPart = parts[parts.length - 1];
    if (possibleStyles.includes(lastPart)) {
      styleId = lastPart;
      colorId = parts.slice(0, -1).join('-');
    }
  }

  const colorData = getTieColorById(colorId);
  const styleData = tieProducts.styles[styleId as keyof typeof tieProducts.styles];

  const [purchaseMode, setPurchaseMode] = useState<'single' | 'bundle'>('bundle');
  const [selectedBundle, setSelectedBundle] = useState<'five' | 'eight' | 'eleven'>('five');
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([
    { color: colorId, style: styleId, quantity: 1 }
  ]);
  const [showBundleBuilder, setShowBundleBuilder] = useState(false);

  if (!colorData || !styleData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const currentBundle = tieProducts.bundles[selectedBundle];
  const remainingItems = currentBundle.quantity - bundleItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddBundleItem = (color: string, style: string) => {
    const existingItem = bundleItems.find(item => item.color === color && item.style === style);

    if (existingItem) {
      setBundleItems(bundleItems.map(item => 
        item.color === color && item.style === style 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setBundleItems([...bundleItems, { color, style, quantity: 1 }]);
    }
  };

  const handleRemoveBundleItem = (index: number) => {
    if (bundleItems.length > 1) {
      setBundleItems(bundleItems.filter((_, i) => i !== index));
    }
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setBundleItems(bundleItems.map((item, i) => 
      i === index 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const handleAddToCart = () => {
    if (purchaseMode === 'single') {
      // Add single item
      addItem({
        id: `${colorId}-${styleId}`,
        name: `${colorData.name} ${styleData.name}`,
        price: styleData.price,
        image: colorData.imageUrl,
        quantity: 1,
        stripePriceId: styleData.priceId,
        stripeProductId: styleData.productId,
        selectedColor: colorData.name,
        selectedSize: styleData.width,
        category: 'ties',
        metadata: {
          color: colorData.name,
          style: styleData.name,
          width: styleData.width
        }
      });

    } else {
      // Add bundle as a single item
      const bundleId = `tie-bundle-${selectedBundle}-${Date.now()}`;

      // Create a summary of bundle items for display
      const bundleItemsSummary = bundleItems.map(item => {
        const itemColor = getTieColorById(item.color);
        const itemStyle = tieProducts.styles[item.style as keyof typeof tieProducts.styles];
        return `${item.quantity}x ${itemColor?.name} ${itemStyle?.name.split(' ')[0]}`;
      }).join(', ');

      // Use the first item's image as the bundle image
      const firstItem = bundleItems[0];
      const firstItemColor = getTieColorById(firstItem.color);

      addItem({
        id: bundleId,
        name: `${currentBundle.name} - ${bundleItemsSummary}`,
        price: currentBundle.price,
        image: firstItemColor?.imageUrl || colorData.imageUrl,
        quantity: 1,
        stripePriceId: currentBundle.priceId,
        stripeProductId: currentBundle.productId,
        selectedColor: 'Mixed',
        selectedSize: 'Bundle',
        category: 'tie-bundle',
        bundleId: bundleId,
        metadata: {
          bundleType: selectedBundle,
          bundleItems: bundleItems,
          itemsDescription: bundleItemsSummary,
          stripePriceId: currentBundle.priceId
        }
      });

    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/collections/ties" className="text-gray-500 hover:text-gray-700">
              Ties
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/collections/ties/${colorId}-collection`} className="text-gray-500 hover:text-gray-700">
              {colorData.name} Collection
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{styleData.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={getStyleSpecificImage(colorData, styleId)}
                alt={`${colorData.name} ${styleData.name}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                onError={(e) => {
                  // Fallback to original image if style-specific image fails
                  (e.target as HTMLImageElement).src = colorData.imageUrl;
                }}
              />
            </motion.div>

            {/* Style Options Preview */}
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(tieProducts.styles).map(([key, style]) => {
                const isActive = key === styleId;
                return (
                  <Link
                    key={key}
                    href={`/products/ties/${colorId}-${key}`}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isActive ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={getStyleSpecificImage(colorData, key)}
                      alt={`${colorData.name} ${style.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                      unoptimized
                      onError={(e) => {
                        // Fallback to original image if style-specific image fails
                        (e.target as HTMLImageElement).src = colorData.imageUrl;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white font-medium">{style.name.split(' ')[0]}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {colorData.name} {styleData.name}
              </h1>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                ${styleData.price}
              </p>
              <p className="text-gray-600">
                {styleData.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Color:</span>
                  <span className="ml-2">{colorData.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Width:</span>
                  <span className="ml-2">{styleData.width}</span>
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div>
              <p className="font-medium text-gray-900 mb-4">Purchase Options:</p>
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setPurchaseMode('single')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    purchaseMode === 'single'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Single Item
                </button>
                <button
                  onClick={() => setPurchaseMode('bundle')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    purchaseMode === 'bundle'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Bundle & Save
                </button>
              </div>

              {purchaseMode === 'single' ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Add to Cart - ${styleData.price}
                </button>
              ) : (
                <div className="space-y-6">
                  {/* Bundle Selection */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Select Bundle Size</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {Object.entries(tieProducts.bundles).map(([key, bundle]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedBundle(key as 'five' | 'eight' | 'eleven')}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            selectedBundle === key
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-sm">{bundle.description}</div>
                          <div className="text-xs mt-1">${bundle.price}</div>
                        </button>
                      ))}
                    </div>

                    {/* Bundle Summary */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium mb-3">Bundle Summary</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Total: {bundleItems.reduce((sum, item) => sum + item.quantity, 0)} items
                        {remainingItems > 0 && ` (${remainingItems} more needed)`}
                      </p>

                      {/* Bundle Items List */}
                      <div className="space-y-2 mb-4">
                        {bundleItems.map((item, index) => {
                          const itemColor = getTieColorById(item.color);
                          const itemStyle = tieProducts.styles[item.style as keyof typeof tieProducts.styles];

                          return (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                                  style={{ backgroundColor: itemColor?.hex }}
                                />
                                <span className="text-sm">
                                  {itemColor?.name} {itemStyle?.name.split(' ')[0]}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateQuantity(index, -1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(index, 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                  disabled={remainingItems === 0}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                {bundleItems.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveBundleItem(index)}
                                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center ml-2"
                                  >
                                    <X className="w-3 h-3 text-red-600" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {remainingItems > 0 ? (
                        <button
                          onClick={() => setShowBundleBuilder(true)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Add More Items
                        </button>
                      ) : (
                        <button
                          onClick={handleAddToCart}
                          className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                          Add Bundle to Cart - ${currentBundle.price}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">30-day easy returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Quality guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Builder Modal */}
      {showBundleBuilder && (
        <BundleBuilderModal
          onClose={() => setShowBundleBuilder(false)}
          onAddItem={handleAddBundleItem}
          remainingItems={remainingItems}
        />
      )}
    </div>
  );
}

// Bundle Builder Modal Component
function BundleBuilderModal({ 
  onClose, 
  onAddItem, 
  remainingItems 
}: { 
  onClose: () => void;
  onAddItem: (color: string, style: string) => void;
  remainingItems: number;
}) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleAdd = () => {
    if (selectedColor && selectedStyle) {
      onAddItem(selectedColor, selectedStyle);
      setSelectedColor(null);
      setSelectedStyle(null);
      if (remainingItems <= 1) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Mix & Match Your Bundle</h2>
            <p className="text-gray-600 mt-1">
              {remainingItems} {remainingItems === 1 ? 'item' : 'items'} remaining
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Selected Combination Preview */}
          {selectedColor && selectedStyle && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={getStyleSpecificImage(getTieColorById(selectedColor), selectedStyle)}
                    alt="Selected combination"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-medium text-lg">
                    {getTieColorById(selectedColor)?.name} {tieProducts.styles[selectedStyle as keyof typeof tieProducts.styles]?.name}
                  </p>
                  <p className="text-sm text-gray-600">Ready to add to bundle</p>
                </div>
              </div>
            </div>
          )}

          {/* Style Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">1. Select Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(tieProducts.styles).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStyle(key)}
                  className={`relative rounded-lg border-2 transition-all overflow-hidden ${
                    selectedStyle === key
                      ? 'border-blue-600 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {/* Style Preview Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {selectedColor && (
                      <Image
                        src={getStyleSpecificImage(getTieColorById(selectedColor), key)}
                        alt={`${style.name} preview`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized
                        onError={(e) => {
                          // Fallback to a default style image or placeholder
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {!selectedColor && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <p className="text-3xl mb-2">{key === 'bowtie' ? '🎀' : '👔'}</p>
                          <p className="text-xs text-gray-500">Select a color first</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 ${selectedStyle === key ? 'bg-blue-50' : 'bg-white'}`}>
                    <p className="font-medium">{style.name.split(' ')[0]}</p>
                    <p className="text-sm text-gray-600">{style.width}</p>
                  </div>
                  {selectedStyle === key && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">2. Select Color</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {tieProducts.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedColor === color.id
                      ? 'border-blue-600 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  title={color.name}
                >
                  <Image
                    src={selectedStyle ? getStyleSpecificImage(color, selectedStyle) : color.imageUrl}
                    alt={color.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                    unoptimized
                    onError={(e) => {
                      // Fallback to original image if style-specific image fails
                      (e.target as HTMLImageElement).src = color.imageUrl;
                    }}
                  />
                  {selectedColor === color.id && (
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  )}
                  {/* Color name tooltip on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1 opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white text-center truncate">{color.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <button
            onClick={handleAdd}
            disabled={!selectedColor || !selectedStyle}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              selectedColor && selectedStyle
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Add to Bundle
          </button>
        </div>
      </div>
    </div>
  );
}