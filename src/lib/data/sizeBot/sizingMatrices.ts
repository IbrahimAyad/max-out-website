// Size Bot Sizing Matrices
// Core sizing data for offline calculations

export interface SizeMapping {
  height_range: [string, string];
  weight_range: [number, number];
  chest_range: [number, number];
  waist_range: [number, number];
  shoulder_range: [number, number];
  confidence: number;
}

export interface LengthAdjustment {
  height_range: [string, string];
  sleeve_adjustment: number;
  jacket_adjustment: number;
  confidence: number;
}

// Standard size mappings for all body types
export const SIZE_MATRICES: Record<string, Record<string, SizeMapping>> = {
  // Athletic Build Sizes
  athletic: {
    "34R": {
      height_range: ["5'4\"", "5'8\""],
      weight_range: [130, 150],
      chest_range: [34, 36],
      waist_range: [28, 30],
      shoulder_range: [16.5, 17.5],
      confidence: 0.92
    },
    "36R": {
      height_range: ["5'5\"", "5'9\""],
      weight_range: [145, 165],
      chest_range: [36, 38],
      waist_range: [30, 32],
      shoulder_range: [17.0, 18.0],
      confidence: 0.94
    },
    "38R": {
      height_range: ["5'6\"", "6'0\""],
      weight_range: [160, 180],
      chest_range: [38, 40],
      waist_range: [32, 34],
      shoulder_range: [17.5, 18.5],
      confidence: 0.95
    },
    "40R": {
      height_range: ["5'7\"", "6'1\""],
      weight_range: [175, 195],
      chest_range: [40, 42],
      waist_range: [34, 36],
      shoulder_range: [18.0, 19.0],
      confidence: 0.93
    },
    "42R": {
      height_range: ["5'8\"", "6'2\""],
      weight_range: [190, 210],
      chest_range: [42, 44],
      waist_range: [36, 38],
      shoulder_range: [18.5, 19.5],
      confidence: 0.91
    },
    "44R": {
      height_range: ["5'9\"", "6'3\""],
      weight_range: [205, 225],
      chest_range: [44, 46],
      waist_range: [38, 40],
      shoulder_range: [19.0, 20.0],
      confidence: 0.89
    },
    "46R": {
      height_range: ["5'10\"", "6'4\""],
      weight_range: [220, 240],
      chest_range: [46, 48],
      waist_range: [40, 42],
      shoulder_range: [19.5, 20.5],
      confidence: 0.87
    },
    "48R": {
      height_range: ["5'11\"", "6'4\""],
      weight_range: [235, 255],
      chest_range: [48, 50],
      waist_range: [42, 44],
      shoulder_range: [20.0, 21.0],
      confidence: 0.85
    }
  },
  
  // Slim Build Sizes (typically size down)
  slim: {
    "32R": {
      height_range: ["5'4\"", "5'8\""],
      weight_range: [110, 130],
      chest_range: [32, 34],
      waist_range: [26, 28],
      shoulder_range: [15.5, 16.5],
      confidence: 0.90
    },
    "34R": {
      height_range: ["5'5\"", "5'9\""],
      weight_range: [125, 145],
      chest_range: [34, 36],
      waist_range: [28, 30],
      shoulder_range: [16.0, 17.0],
      confidence: 0.92
    },
    "36R": {
      height_range: ["5'6\"", "6'0\""],
      weight_range: [140, 160],
      chest_range: [36, 38],
      waist_range: [30, 32],
      shoulder_range: [16.5, 17.5],
      confidence: 0.94
    },
    "38R": {
      height_range: ["5'7\"", "6'1\""],
      weight_range: [155, 175],
      chest_range: [38, 40],
      waist_range: [32, 34],
      shoulder_range: [17.0, 18.0],
      confidence: 0.93
    },
    "40R": {
      height_range: ["5'8\"", "6'2\""],
      weight_range: [170, 190],
      chest_range: [40, 42],
      waist_range: [34, 36],
      shoulder_range: [17.5, 18.5],
      confidence: 0.91
    },
    "42R": {
      height_range: ["5'9\"", "6'3\""],
      weight_range: [185, 205],
      chest_range: [42, 44],
      waist_range: [36, 38],
      shoulder_range: [18.0, 19.0],
      confidence: 0.89
    }
  },
  
  // Regular Build Sizes (standard)
  regular: {
    "34R": {
      height_range: ["5'4\"", "5'8\""],
      weight_range: [135, 155],
      chest_range: [34, 36],
      waist_range: [28, 30],
      shoulder_range: [16.5, 17.5],
      confidence: 0.93
    },
    "36R": {
      height_range: ["5'5\"", "5'9\""],
      weight_range: [150, 170],
      chest_range: [36, 38],
      waist_range: [30, 32],
      shoulder_range: [17.0, 18.0],
      confidence: 0.95
    },
    "38R": {
      height_range: ["5'6\"", "6'0\""],
      weight_range: [165, 185],
      chest_range: [38, 40],
      waist_range: [32, 34],
      shoulder_range: [17.5, 18.5],
      confidence: 0.96
    },
    "40R": {
      height_range: ["5'7\"", "6'1\""],
      weight_range: [180, 200],
      chest_range: [40, 42],
      waist_range: [34, 36],
      shoulder_range: [18.0, 19.0],
      confidence: 0.94
    },
    "42R": {
      height_range: ["5'8\"", "6'2\""],
      weight_range: [195, 215],
      chest_range: [42, 44],
      waist_range: [36, 38],
      shoulder_range: [18.5, 19.5],
      confidence: 0.92
    },
    "44R": {
      height_range: ["5'9\"", "6'3\""],
      weight_range: [210, 230],
      chest_range: [44, 46],
      waist_range: [38, 40],
      shoulder_range: [19.0, 20.0],
      confidence: 0.90
    },
    "46R": {
      height_range: ["5'10\"", "6'4\""],
      weight_range: [225, 245],
      chest_range: [46, 48],
      waist_range: [40, 42],
      shoulder_range: [19.5, 20.5],
      confidence: 0.88
    },
    "48R": {
      height_range: ["5'11\"", "6'4\""],
      weight_range: [240, 260],
      chest_range: [48, 50],
      waist_range: [42, 44],
      shoulder_range: [20.0, 21.0],
      confidence: 0.86
    },
    "50R": {
      height_range: ["6'0\"", "6'5\""],
      weight_range: [255, 275],
      chest_range: [50, 52],
      waist_range: [44, 46],
      shoulder_range: [20.5, 21.5],
      confidence: 0.84
    }
  },
  
  // Broad Build Sizes (size up for comfort)
  broad: {
    "36R": {
      height_range: ["5'4\"", "5'8\""],
      weight_range: [155, 175],
      chest_range: [36, 38],
      waist_range: [32, 34],
      shoulder_range: [17.5, 18.5],
      confidence: 0.90
    },
    "38R": {
      height_range: ["5'5\"", "5'9\""],
      weight_range: [170, 190],
      chest_range: [38, 40],
      waist_range: [34, 36],
      shoulder_range: [18.0, 19.0],
      confidence: 0.92
    },
    "40R": {
      height_range: ["5'6\"", "6'0\""],
      weight_range: [185, 205],
      chest_range: [40, 42],
      waist_range: [36, 38],
      shoulder_range: [18.5, 19.5],
      confidence: 0.93
    },
    "42R": {
      height_range: ["5'7\"", "6'1\""],
      weight_range: [200, 220],
      chest_range: [42, 44],
      waist_range: [38, 40],
      shoulder_range: [19.0, 20.0],
      confidence: 0.91
    },
    "44R": {
      height_range: ["5'8\"", "6'2\""],
      weight_range: [215, 235],
      chest_range: [44, 46],
      waist_range: [40, 42],
      shoulder_range: [19.5, 20.5],
      confidence: 0.89
    },
    "46R": {
      height_range: ["5'9\"", "6'3\""],
      weight_range: [230, 250],
      chest_range: [46, 48],
      waist_range: [42, 44],
      shoulder_range: [20.0, 21.0],
      confidence: 0.87
    },
    "48R": {
      height_range: ["5'10\"", "6'4\""],
      weight_range: [245, 265],
      chest_range: [48, 50],
      waist_range: [44, 46],
      shoulder_range: [20.5, 21.5],
      confidence: 0.85
    },
    "50R": {
      height_range: ["5'11\"", "6'5\""],
      weight_range: [260, 280],
      chest_range: [50, 52],
      waist_range: [46, 48],
      shoulder_range: [21.0, 22.0],
      confidence: 0.83
    }
  }
};

// Length adjustments for all body types
export const LENGTH_ADJUSTMENTS: Record<string, LengthAdjustment> = {
  "S": {
    height_range: ["5'3\"", "5'7\""],
    sleeve_adjustment: -1.5,
    jacket_adjustment: -2.5,
    confidence: 0.90
  },
  "R": {
    height_range: ["5'7\"", "6'0\""],
    sleeve_adjustment: 0,
    jacket_adjustment: 0,
    confidence: 0.95
  },
  "L": {
    height_range: ["6'0\"", "6'4\""],
    sleeve_adjustment: 1.5,
    jacket_adjustment: 2.5,
    confidence: 0.92
  },
  "XL": {
    height_range: ["6'4\"", "6'8\""],
    sleeve_adjustment: 3.0,
    jacket_adjustment: 4.0,
    confidence: 0.88
  }
};

// Helper function to calculate size from height/weight
export function calculateSizeFromMeasurements(
  height: number, // in inches
  weight: number, // in pounds
  bodyType: string = 'regular',
  fitPreference: 'slim' | 'regular' | 'relaxed' = 'regular'
): {
  size: string;
  confidence: number;
  alternativeSize?: string;
} {
  const matrices = bodyType in SIZE_MATRICES 
    ? SIZE_MATRICES[bodyType as keyof typeof SIZE_MATRICES]
    : SIZE_MATRICES.regular;
  let bestMatch: { size: string; confidence: number } | null = null;
  let secondBestMatch: { size: string; confidence: number } | null = null;
  
  // Convert height to feet and inches for comparison
  const feet = Math.floor(height / 12);
  const inches = height % 12;
  const heightStr = `${feet}'${inches}"`;
  
  // Find best matching size
  for (const [size, mapping] of Object.entries(matrices)) {
    // Check if height and weight fall within range
    const heightInRange = compareHeight(heightStr, mapping.height_range);
    const weightInRange = weight >= mapping.weight_range[0] && weight <= mapping.weight_range[1];
    
    if (heightInRange && weightInRange) {
      // Calculate confidence based on how well it matches
      const heightMidpoint = getHeightMidpoint(mapping.height_range);
      const weightMidpoint = (mapping.weight_range[0] + mapping.weight_range[1]) / 2;
      
      const heightDiff = Math.abs(height - heightMidpoint) / 12; // normalize to feet
      const weightDiff = Math.abs(weight - weightMidpoint) / 50; // normalize to 50lb range
      
      const matchConfidence = mapping.confidence * (1 - (heightDiff + weightDiff) / 4);
      
      if (!bestMatch || matchConfidence > bestMatch.confidence) {
        secondBestMatch = bestMatch;
        bestMatch = { size, confidence: matchConfidence };
      } else if (!secondBestMatch || matchConfidence > secondBestMatch.confidence) {
        secondBestMatch = { size, confidence: matchConfidence };
      }
    }
  }
  
  // Apply fit preference adjustments
  if (bestMatch && fitPreference !== 'regular') {
    const sizeNumber = parseInt(bestMatch.size);
    if (fitPreference === 'slim' && sizeNumber > 34) {
      // Consider sizing down for slim fit
      const smallerSize = `${sizeNumber - 2}${bestMatch.size.slice(-1)}`;
      if (matrices[smallerSize]) {
        bestMatch.size = smallerSize;
        bestMatch.confidence *= 0.9; // Slightly lower confidence for adjusted size
      }
    } else if (fitPreference === 'relaxed' && sizeNumber < 50) {
      // Consider sizing up for relaxed fit
      const largerSize = `${sizeNumber + 2}${bestMatch.size.slice(-1)}`;
      if (matrices[largerSize]) {
        bestMatch.size = largerSize;
        bestMatch.confidence *= 0.9;
      }
    }
  }
  
  // Determine length
  const length = determineLength(height);
  const sizeWithLength = bestMatch ? bestMatch.size.slice(0, -1) + length : '40R';
  
  return {
    size: sizeWithLength,
    confidence: bestMatch?.confidence || 0.7,
    alternativeSize: secondBestMatch ? secondBestMatch.size.slice(0, -1) + length : undefined
  };
}

// Helper function to compare height strings
function compareHeight(height: string, range: [string, string]): boolean {
  const heightInches = parseHeightToInches(height);
  const minInches = parseHeightToInches(range[0]);
  const maxInches = parseHeightToInches(range[1]);
  
  return heightInches >= minInches && heightInches <= maxInches;
}

// Convert height string to inches
function parseHeightToInches(height: string): number {
  const match = height.match(/(\d+)'(\d+)"/);
  if (match) {
    return parseInt(match[1]) * 12 + parseInt(match[2]);
  }
  return 70; // default 5'10"
}

// Get midpoint of height range in inches
function getHeightMidpoint(range: [string, string]): number {
  const min = parseHeightToInches(range[0]);
  const max = parseHeightToInches(range[1]);
  return (min + max) / 2;
}

// Determine jacket length based on height
function determineLength(heightInches: number): string {
  if (heightInches < 67) return 'S';  // Under 5'7"
  if (heightInches <= 72) return 'R'; // 5'7" to 6'0"
  if (heightInches <= 76) return 'L'; // 6'0" to 6'4"
  return 'XL'; // Over 6'4"
}