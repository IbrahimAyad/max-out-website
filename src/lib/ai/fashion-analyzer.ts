import { enhancedKnowledgeAPI } from '@/lib/services/enhancedKnowledgeAdapter';

export interface FashionAnalysis {
  category: string;
  style: string[];
  colors: {
    primary: string;
    secondary: string[];
    accent?: string;
  };
  pattern?: string;
  formality: 'casual' | 'business-casual' | 'formal' | 'black-tie';
  season: string[];
  occasions: string[];
  matchingCategories: string[];
  styleScore: number;
  recommendations: {
    complementaryItems: Array<{
      category: string;
      style: string;
      color: string;
      reason: string;
    }>;
    avoidCombinations: string[];
    stylingTips: string[];
  };
}

export class FashionAnalyzer {
  /**
   * Analyze fashion image using AI
   */
  static async analyzeImage(imageUrl: string): Promise<FashionAnalysis> {
    try {
      // Use the enhanced Knowledge API for visual analysis
      const visualAnalysis = await enhancedKnowledgeAPI.analyzeImage(imageUrl);
      
      // Extract fashion-specific attributes
      const fashionData = this.extractFashionAttributes(visualAnalysis);
      
      // Get style recommendations based on the analysis
      const recommendations = await this.getStyleRecommendations(fashionData);
      
      return {
        ...fashionData,
        recommendations
      };
    } catch (error) {
      console.error('Fashion analysis error:', error);
      
      // Fallback to basic analysis
      return this.performBasicAnalysis(imageUrl);
    }
  }

  /**
   * Extract fashion attributes from visual analysis
   */
  private static extractFashionAttributes(analysis: any): Omit<FashionAnalysis, 'recommendations'> {
    const { category, attributes, colors, confidence } = analysis;
    
    // Map visual attributes to fashion terms
    const styleMapping: Record<string, string[]> = {
      'formal': ['classic', 'elegant', 'sophisticated'],
      'casual': ['relaxed', 'comfortable', 'everyday'],
      'business': ['professional', 'polished', 'executive'],
      'trendy': ['modern', 'fashion-forward', 'contemporary']
    };
    
    // Determine formality level
    const formality = this.determineFormality(category, attributes);
    
    // Extract patterns if detected
    const pattern = attributes.find((attr: string) => 
      ['striped', 'plaid', 'checkered', 'solid', 'paisley', 'herringbone'].includes(attr.toLowerCase())
    );
    
    return {
      category: category || 'general',
      style: attributes.style || ['classic'],
      colors: {
        primary: colors.dominant || '#000000',
        secondary: colors.palette || [],
        accent: colors.accent
      },
      pattern,
      formality,
      season: this.determineSeason(colors, attributes),
      occasions: this.determineOccasions(formality, category),
      matchingCategories: this.getMatchingCategories(category),
      styleScore: confidence || 0.8
    };
  }

  /**
   * Determine formality level from category and attributes
   */
  private static determineFormality(
    category: string, 
    attributes: string[]
  ): FashionAnalysis['formality'] {
    const categoryFormality: Record<string, FashionAnalysis['formality']> = {
      'tuxedo': 'black-tie',
      'suit': 'formal',
      'blazer': 'business-casual',
      'shirt': 'business-casual',
      'polo': 'casual',
      't-shirt': 'casual'
    };
    
    // Check attributes for formality indicators
    const hasFormaAttributes = attributes.some(attr => 
      ['formal', 'elegant', 'dressy', 'black-tie'].includes(attr.toLowerCase())
    );
    
    if (hasFormaAttributes) return 'formal';
    
    return categoryFormality[category.toLowerCase()] || 'business-casual';
  }

  /**
   * Determine suitable seasons based on colors and materials
   */
  private static determineSeason(colors: any, attributes: string[]): string[] {
    const seasons: string[] = [];
    
    // Color-based season detection
    const colorHex = colors.dominant?.toLowerCase() || '';
    const isDark = this.isColorDark(colorHex);
    const isWarm = this.isColorWarm(colorHex);
    
    // Material-based season detection
    const summerMaterials = ['linen', 'cotton', 'lightweight'];
    const winterMaterials = ['wool', 'tweed', 'velvet', 'cashmere'];
    
    const hasSummerMaterial = attributes.some(attr => 
      summerMaterials.some(mat => attr.toLowerCase().includes(mat))
    );
    
    const hasWinterMaterial = attributes.some(attr => 
      winterMaterials.some(mat => attr.toLowerCase().includes(mat))
    );
    
    if (hasSummerMaterial || (!isDark && isWarm)) {
      seasons.push('spring', 'summer');
    }
    
    if (hasWinterMaterial || isDark) {
      seasons.push('fall', 'winter');
    }
    
    // Default to all seasons if unclear
    return seasons.length > 0 ? seasons : ['spring', 'summer', 'fall', 'winter'];
  }

  /**
   * Determine suitable occasions
   */
  private static determineOccasions(
    formality: FashionAnalysis['formality'], 
    category: string
  ): string[] {
    const occasionMap: Record<FashionAnalysis['formality'], string[]> = {
      'casual': ['weekend', 'brunch', 'shopping', 'casual-friday'],
      'business-casual': ['office', 'meeting', 'networking', 'dinner'],
      'formal': ['wedding', 'gala', 'ceremony', 'formal-dinner'],
      'black-tie': ['wedding', 'gala', 'awards', 'formal-event']
    };
    
    return occasionMap[formality] || ['versatile'];
  }

  /**
   * Get categories that match well with the analyzed item
   */
  private static getMatchingCategories(category: string): string[] {
    const matchingMap: Record<string, string[]> = {
      'suit': ['shirt', 'tie', 'shoes', 'belt', 'cufflinks'],
      'blazer': ['shirt', 'pants', 'tie', 'pocket-square'],
      'shirt': ['suit', 'blazer', 'tie', 'pants', 'vest'],
      'tie': ['suit', 'shirt', 'pocket-square', 'cufflinks'],
      'shoes': ['suit', 'belt', 'socks'],
      'tuxedo': ['bow-tie', 'cummerbund', 'shirt', 'shoes']
    };
    
    return matchingMap[category.toLowerCase()] || ['accessories'];
  }

  /**
   * Get style recommendations based on analysis
   */
  private static async getStyleRecommendations(
    fashionData: Omit<FashionAnalysis, 'recommendations'>
  ): Promise<FashionAnalysis['recommendations']> {
    try {
      // Use Knowledge API to get smart recommendations
      const smartBundle = await enhancedKnowledgeAPI.generateSmartBundle({
        baseItem: {
          category: fashionData.category,
          color: fashionData.colors.primary,
          style: fashionData.style[0],
          formality: fashionData.formality
        },
        occasion: fashionData.occasions[0],
        season: fashionData.season[0],
        preferences: {
          style: fashionData.style,
          avoidColors: [],
          priceRange: { min: 0, max: 10000 }
        }
      });
      
      // Convert smart bundle to recommendations format
      const complementaryItems = smartBundle.map(item => ({
        category: item.category,
        style: item.attributes.style || 'classic',
        color: item.attributes.color || 'neutral',
        reason: item.reason || 'Complements your style'
      }));
      
      // Get styling tips
      const stylingTips = await this.generateStylingTips(fashionData);
      
      return {
        complementaryItems,
        avoidCombinations: this.getAvoidCombinations(fashionData),
        stylingTips
      };
    } catch (error) {
      // Fallback recommendations
      return {
        complementaryItems: this.getDefaultComplementaryItems(fashionData),
        avoidCombinations: this.getAvoidCombinations(fashionData),
        stylingTips: this.getDefaultStylingTips(fashionData)
      };
    }
  }

  /**
   * Generate contextual styling tips
   */
  private static async generateStylingTips(
    fashionData: Omit<FashionAnalysis, 'recommendations'>
  ): Promise<string[]> {
    const tips: string[] = [];
    
    // Color-based tips
    if (fashionData.colors.primary) {
      tips.push(`This ${fashionData.colors.primary} pairs beautifully with neutral tones`);
    }
    
    // Pattern tips
    if (fashionData.pattern) {
      tips.push(`When wearing ${fashionData.pattern}, keep other pieces solid for balance`);
    }
    
    // Formality tips
    const formalityTips: Record<FashionAnalysis['formality'], string> = {
      'casual': 'Perfect for relaxed settings - pair with comfortable footwear',
      'business-casual': 'Ideal for office wear - add a blazer to elevate the look',
      'formal': 'Classic formal attire - ensure proper fit and pressed fabrics',
      'black-tie': 'Elegant evening wear - complement with formal accessories'
    };
    
    tips.push(formalityTips[fashionData.formality]);
    
    // Season tips
    if (fashionData.season.includes('summer')) {
      tips.push('Light, breathable fabrics perfect for warm weather');
    } else if (fashionData.season.includes('winter')) {
      tips.push('Layer with complementary pieces for warmth and style');
    }
    
    return tips;
  }

  /**
   * Get combinations to avoid
   */
  private static getAvoidCombinations(
    fashionData: Omit<FashionAnalysis, 'recommendations'>
  ): string[] {
    const avoid: string[] = [];
    
    // Pattern conflicts
    if (fashionData.pattern && fashionData.pattern !== 'solid') {
      avoid.push(`Avoid mixing with other ${fashionData.pattern} patterns`);
    }
    
    // Formality mismatches
    if (fashionData.formality === 'formal' || fashionData.formality === 'black-tie') {
      avoid.push('Avoid casual accessories like sports watches');
    }
    
    // Color clashes
    if (fashionData.colors.primary) {
      const clashingColors = this.getClashingColors(fashionData.colors.primary);
      if (clashingColors.length > 0) {
        avoid.push(`Be cautious with ${clashingColors.join(', ')} colors`);
      }
    }
    
    return avoid;
  }

  /**
   * Fallback recommendations when API is unavailable
   */
  private static getDefaultComplementaryItems(
    fashionData: Omit<FashionAnalysis, 'recommendations'>
  ): FashionAnalysis['recommendations']['complementaryItems'] {
    const categoryComplements: Record<string, Array<any>> = {
      'suit': [
        { category: 'shirt', style: 'classic', color: 'white', reason: 'Timeless combination' },
        { category: 'tie', style: 'silk', color: 'complementary', reason: 'Adds sophistication' },
        { category: 'shoes', style: 'oxford', color: 'black', reason: 'Classic formal footwear' }
      ],
      'shirt': [
        { category: 'tie', style: 'pattern', color: 'accent', reason: 'Adds visual interest' },
        { category: 'blazer', style: 'tailored', color: 'navy', reason: 'Versatile layering' }
      ],
      'blazer': [
        { category: 'pants', style: 'tailored', color: 'charcoal', reason: 'Professional pairing' },
        { category: 'pocket-square', style: 'silk', color: 'accent', reason: 'Refined detail' }
      ]
    };
    
    return categoryComplements[fashionData.category.toLowerCase()] || [];
  }

  /**
   * Default styling tips
   */
  private static getDefaultStylingTips(
    fashionData: Omit<FashionAnalysis, 'recommendations'>
  ): string[] {
    return [
      'Ensure proper fit - tailoring makes all the difference',
      'Coordinate metals - match watch, belt buckle, and cufflinks',
      'Keep it simple - let one piece be the statement',
      'Invest in quality basics that form your wardrobe foundation'
    ];
  }

  /**
   * Basic image analysis fallback
   */
  private static async performBasicAnalysis(imageUrl: string): Promise<FashionAnalysis> {
    // Extract basic info from image metadata or filename
    const urlParts = imageUrl.toLowerCase().split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Try to detect category from filename
    let category = 'general';
    const categories = ['suit', 'shirt', 'tie', 'blazer', 'shoes', 'tuxedo'];
    for (const cat of categories) {
      if (filename.includes(cat)) {
        category = cat;
        break;
      }
    }
    
    return {
      category,
      style: ['classic'],
      colors: {
        primary: '#000000',
        secondary: ['#FFFFFF', '#808080']
      },
      formality: 'business-casual',
      season: ['spring', 'summer', 'fall', 'winter'],
      occasions: ['versatile'],
      matchingCategories: ['accessories'],
      styleScore: 0.5,
      recommendations: {
        complementaryItems: [],
        avoidCombinations: [],
        stylingTips: this.getDefaultStylingTips({ 
          category, 
          style: ['classic'],
          colors: { primary: '#000000', secondary: [] },
          formality: 'business-casual',
          season: [],
          occasions: [],
          matchingCategories: [],
          styleScore: 0.5
        })
      }
    };
  }

  /**
   * Utility: Check if color is dark
   */
  private static isColorDark(hex: string): boolean {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
  }

  /**
   * Utility: Check if color is warm
   */
  private static isColorWarm(hex: string): boolean {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return r > b;
  }

  /**
   * Get colors that clash
   */
  private static getClashingColors(primaryColor: string): string[] {
    // Simplified color clash detection
    const colorMap: Record<string, string[]> = {
      'black': [],
      'navy': ['brown'],
      'brown': ['black', 'navy'],
      'gray': [],
      'burgundy': ['orange', 'pink']
    };
    
    const colorName = this.getColorName(primaryColor);
    return colorMap[colorName] || [];
  }

  /**
   * Convert hex to color name
   */
  private static getColorName(hex: string): string {
    // Simplified color name detection
    const colors: Record<string, string> = {
      '#000000': 'black',
      '#000080': 'navy',
      '#A52A2A': 'brown',
      '#808080': 'gray',
      '#800020': 'burgundy'
    };
    
    return colors[hex] || 'neutral';
  }
}