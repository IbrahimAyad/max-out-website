// Dress shirt products configuration with Stripe IDs
export const dressShirtProducts = {
  // Fit types with their Stripe IDs
  fits: {
    slim: {
      name: 'Slim Cut',
      productId: 'prod_SlSRMPGpXou00R',
      priceId: 'price_1RpvWnCHc12x7sCzzioA64qD',
      price: 39.99,
      description: 'Modern tailored fit that follows the natural lines of the body. Perfect for a contemporary, streamlined look.',
      sizes: [
        { id: 'slim-s', label: 'S', neck: '15"' },
        { id: 'slim-m', label: 'M', neck: '15.5"' },
        { id: 'slim-l', label: 'L', neck: '16"' },
        { id: 'slim-xl', label: 'XL', neck: '16.5"' },
        { id: 'slim-xxl', label: 'XXL', neck: '17"' }
      ]
    },
    classic: {
      name: 'Classic Fit',
      productId: 'prod_SlSRbnQ86MqArC',
      priceId: 'price_1RpvXACHc12x7sCz2Ngkmp64',
      price: 39.99,
      description: 'Traditional relaxed fit with generous room through the body and arms. Ideal for all-day comfort.',
      neckSizes: [
        '15"', '15.5"', '16"', '16.5"', '17"', 
        '17.5"', '18"', '18.5"', '19"', '19.5"', '20"', '22"'
      ],
      sleeveLengths: [
        { id: '32-33', label: '32-33', availableForNeck: ['15"', '15.5"', '16"', '16.5"', '17"', '17.5"', '18"', '18.5"'] },
        { id: '34-35', label: '34-35', availableForNeck: ['15"', '15.5"', '16"', '16.5"', '17"', '17.5"', '18"', '18.5"', '19"', '19.5"', '20"', '22"'] },
        { id: '36-37', label: '36-37', availableForNeck: ['16"', '16.5"', '17"', '17.5"', '18"', '18.5"', '19"', '19.5"', '20"', '22"'] }
      ]
    }
  },

  // Available colors
  colors: [
    {
      id: 'black',
      name: 'Black',
      hex: '#000000',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Black-Dress-Shirt.jpg'
    },
    {
      id: 'brown',
      name: 'Brown',
      hex: '#8B4513',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Brown-Dress-Shirt.jpg'
    },
    {
      id: 'burgundy',
      name: 'Burgundy',
      hex: '#800020',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Burgundy-Dress-Shirt.jpg'
    },
    {
      id: 'burnt-orange',
      name: 'Burnt Orange',
      hex: '#CC5500',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Burnt%20Orange-Dress-Shirt.jpg'
    },
    {
      id: 'fuchsia',
      name: 'Fuchsia',
      hex: '#FF00FF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Fuchsia-Dress-Shirt.jpg'
    },
    {
      id: 'light-grey',
      name: 'Light Grey',
      hex: '#D3D3D3',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Grey-Dress-Shirt.jpg'
    },
    {
      id: 'light-pink',
      name: 'Light Pink',
      hex: '#FFB6C1',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Pink-Dress-Shirt.jpg'
    },
    {
      id: 'light-blue',
      name: 'Light Blue',
      hex: '#ADD8E6',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg'
    },
    {
      id: 'lilac',
      name: 'Lilac',
      hex: '#C8A2C8',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Lilac-Dress-Shirt.jpg'
    },
    {
      id: 'navy',
      name: 'Navy',
      hex: '#000080',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Navy-Dress-Shirt.jpg'
    },
    {
      id: 'peach',
      name: 'Peach',
      hex: '#FFDAB9',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Peach-Dress-Shirt.jpg'
    },
    {
      id: 'purple',
      name: 'Purple',
      hex: '#800080',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Purple-Dress-Shirt.jpg'
    },
    {
      id: 'red',
      name: 'Red',
      hex: '#FF0000',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Red-Dress-Shirt.jpg'
    },
    {
      id: 'royal-blue',
      name: 'Royal Blue',
      hex: '#4169E1',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Royal%20Blue-Dress-Shirt.jpg'
    },
    {
      id: 'sage',
      name: 'Sage',
      hex: '#87AB66',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Sage-Dress-Shirt.jpg'
    },
    {
      id: 'tan',
      name: 'Tan',
      hex: '#D2B48C',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Tan-Dress-Shirt.jpg'
    },
    {
      id: 'white',
      name: 'White',
      hex: '#FFFFFF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg'
    }
  ]
};

// Helper function to get color by ID
export function getDressShirtColorById(colorId: string) {
  return dressShirtProducts.colors.find(color => color.id === colorId);
}

// Helper function to get fit by ID
export function getDressShirtFitById(fitId: string) {
  return dressShirtProducts.fits[fitId as keyof typeof dressShirtProducts.fits];
}

// Helper function to check if a sleeve length is available for a neck size
export function isSleeveLengthAvailable(neckSize: string, sleeveLength: string): boolean {
  const sleeve = dressShirtProducts.fits.classic.sleeveLengths.find(s => s.id === sleeveLength);
  return sleeve ? sleeve.availableForNeck.includes(neckSize) : false;
}