import axios from 'axios';
import { fashionClipService } from '@/lib/services/fashionClipService';
import { getConversationalResponse, STYLE_DISCOVERY_QUESTIONS } from '@/lib/ai/knowledge-base';

interface ChatMessage {
  message: string;
  suggestions?: string[];
  products?: any[];
  layerLevel?: 1 | 2 | 3;
  recommendations?: any;
  colors?: any;
  venues?: any;
  styles?: any;
  shouldSpeak?: boolean;
  voicePersona?: 'professional' | 'enthusiastic' | 'empathetic';
}

export class KnowledgeChatService {
  private apiUrl: string;
  private apiKey: string;
  private conversationHistory: any[] = [];
  private userProfile: any = {};

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_KCT_API_URL || 'https://kct-knowledge-api-2-production.up.railway.app';
    this.apiKey = process.env.NEXT_PUBLIC_KCT_API_KEY || '';
  }

  async processMessage(message: string, imageFile?: File, context?: any): Promise<ChatMessage> {
    // First check if we have a trained conversational pattern
    const conversationalResponse = getConversationalResponse(message, context);
    
    // If we found a pattern, use the enhanced conversational approach
    if (conversationalResponse.response !== "I'm here to help you find the perfect style solution.") {
      return {
        message: `${conversationalResponse.response} ${conversationalResponse.followUp}`,
        suggestions: conversationalResponse.suggestions,
        layerLevel: 1,
        shouldSpeak: true,
        voicePersona: 'professional'
      };
    }
    
    const intent = this.analyzeIntent(message);
    
    // If an image is provided, analyze it with Fashion CLIP first
    if (imageFile) {
      return await this.handleImageBasedQuery(message, imageFile, intent);
    }
    
    try {
      switch (intent.type) {
        case 'color_advice':
          return await this.handleColorAdvice(message, intent);
        
        case 'style_recommendation':
          return await this.handleStyleRecommendation(message, intent);
        
        case 'venue_advice':
          return await this.handleVenueAdvice(message, intent);
        
        case 'outfit_validation':
          return await this.handleOutfitValidation(message, intent);
        
        case 'trending':
          return await this.handleTrendingQuery(message, intent);
        
        case 'wedding':
          return await this.handleWeddingQuery(message, intent);
        
        default:
          return await this.handleGeneralQuery(message, intent);
      }
    } catch (error) {
      console.error('Knowledge API error:', error);
      return this.generateFallbackResponse(message);
    }
  }

  private async handleImageBasedQuery(message: string, imageFile: File, intent: any): Promise<ChatMessage> {
    try {
      // Analyze image with Fashion CLIP
      const fashionClipAnalysis = await fashionClipService.analyzeImage(imageFile);
      
      if (!fashionClipAnalysis) {
        return {
          message: "I'm having trouble analyzing the image. Let me help you based on your description instead. What style or outfit are you looking for?",
          suggestions: ["Describe the style", "Tell me the occasion", "Color preferences", "Budget range"],
          layerLevel: 1
        };
      }
      
      // Get product recommendations based on the image
      const recommendations = await fashionClipService.getImageBasedRecommendations(imageFile);
      
      // Analyze colors from Fashion CLIP
      const colorAnalysis = await fashionClipService.analyzeColors(imageFile);
      
      return {
        message: `Based on my Fashion CLIP analysis, I can see you're looking for ${fashionClipAnalysis.classification || 'sophisticated menswear'}. ${this.generateImageBasedAdvice(fashionClipAnalysis, colorAnalysis)} I've found ${recommendations.length} similar items in our collection that match this aesthetic.`,
        suggestions: [
          "Show matching products",
          "Complete the outfit",
          "Alternative styles",
          "Color variations"
        ],
        products: recommendations,
        colors: colorAnalysis,
        layerLevel: 2,
        shouldSpeak: true,
        voicePersona: 'enthusiastic'
      };
    } catch (error) {
      console.error('Fashion CLIP analysis error:', error);
      return this.generateFallbackResponse(message);
    }
  }
  
  private generateImageBasedAdvice(analysis: any, colorData: any): string {
    const dominantColors = colorData?.dominantColors?.join(', ') || 'classic colors';
    const seasonalPalette = colorData?.seasonalPalette || 'versatile';
    
    return `The style features ${dominantColors} which creates a ${seasonalPalette} palette. This look embodies the Sterling Crown philosophy - timeless elegance with modern sophistication.`;
  }

  private analyzeIntent(message: string): any {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('color') || lowerMessage.includes('match')) {
      return { type: 'color_advice', entities: this.extractColors(lowerMessage) };
    }
    
    if (lowerMessage.includes('style') || lowerMessage.includes('personality')) {
      return { type: 'style_recommendation', style: this.extractStyle(lowerMessage) };
    }
    
    if (lowerMessage.includes('wedding') || lowerMessage.includes('groom')) {
      return { type: 'wedding', occasion: 'wedding' };
    }
    
    if (lowerMessage.includes('venue') || lowerMessage.includes('event') || lowerMessage.includes('where')) {
      return { type: 'venue_advice', venue: this.extractVenue(lowerMessage) };
    }
    
    if (lowerMessage.includes('outfit') || lowerMessage.includes('wear')) {
      return { type: 'outfit_validation' };
    }
    
    if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
      return { type: 'trending' };
    }
    
    return { type: 'general' };
  }

  private async handleColorAdvice(message: string, intent: any): Promise<ChatMessage> {
    const colorData = await this.fetchColors();
    const recommendations = await this.fetchColorRecommendations(intent.entities);
    
    return {
      message: `Based on the Sterling Crown philosophy and color theory, I recommend these sophisticated combinations that will elevate your style. ${this.generateColorAdvice(colorData, intent.entities)}`,
      suggestions: [
        "Show me navy combinations",
        "What goes with charcoal?",
        "Best tie colors for black suit",
        "Seasonal color guide"
      ],
      colors: colorData,
      layerLevel: 1,
      shouldSpeak: true,
      voicePersona: 'professional'
    };
  }

  private async handleStyleRecommendation(message: string, intent: any): Promise<ChatMessage> {
    const profile = intent.style || 'classic';
    const styleData = await this.fetchStyleProfile(profile);
    
    // Use Fashion CLIP to search for products matching this style description
    const fashionClipProducts = await fashionClipService.searchByDescription(`${profile} menswear formal elegant`);
    
    return {
      message: `Let me curate a wardrobe that reflects your ${profile} style personality. At KCT, we believe your attire should amplify your personal narrative. ${this.generateStyleAdvice(styleData)}`,
      suggestions: [
        "Show me essential pieces",
        "Build a capsule wardrobe",
        "Occasion-specific looks",
        "Investment pieces"
      ],
      styles: styleData,
      products: fashionClipProducts,
      layerLevel: 2,
      shouldSpeak: true,
      voicePersona: 'professional'
    };
  }

  private async handleVenueAdvice(message: string, intent: any): Promise<ChatMessage> {
    const venueType = intent.venue || 'business';
    const venueData = await this.fetchVenueRecommendations(venueType);
    
    return {
      message: `For ${venueType} settings, I recommend attire that commands respect while maintaining comfort. ${this.generateVenueAdvice(venueData)}`,
      suggestions: [
        "Business formal guide",
        "Cocktail attire essentials",
        "Black tie requirements",
        "Smart casual decoded"
      ],
      venues: venueData,
      layerLevel: 1
    };
  }

  private async handleWeddingQuery(message: string, intent: any): Promise<ChatMessage> {
    const weddingData = await this.fetchWeddingRecommendations();
    
    return {
      message: `Congratulations on your special day! As your style consultant, I'll ensure you look absolutely distinguished. Whether you prefer classic elegance or modern sophistication, we have the perfect ensemble. Let's explore options that reflect your personal style while honoring this momentous occasion.`,
      suggestions: [
        "Classic black tuxedo options",
        "Navy suit alternatives",
        "Three-piece wedding suits",
        "Groomsmen coordination"
      ],
      recommendations: weddingData,
      layerLevel: 2
    };
  }

  private async handleTrendingQuery(message: string, intent: any): Promise<ChatMessage> {
    const trendingData = await this.fetchTrending();
    
    return {
      message: `Here are the latest trends that align with timeless elegance. At KCT, we curate pieces that transcend seasons while keeping you at the forefront of style. ${this.generateTrendingAdvice(trendingData)}`,
      suggestions: [
        "Investment pieces",
        "Seasonal must-haves",
        "Modern classics",
        "Style innovations"
      ],
      layerLevel: 1
    };
  }

  private async handleOutfitValidation(message: string, intent: any): Promise<ChatMessage> {
    // Extract outfit components from message
    const outfit = this.extractOutfitComponents(message);
    const validation = await this.validateCombination(outfit);
    
    return {
      message: validation.isValid 
        ? `Excellent choice! This combination exemplifies sophisticated style. ${validation.feedback}`
        : `Let me suggest some refinements to perfect this look. ${validation.feedback}`,
      suggestions: validation.suggestions || [
        "Alternative combinations",
        "Accessory options",
        "Color variations",
        "Occasion suitability"
      ],
      layerLevel: 1
    };
  }

  private async handleGeneralQuery(message: string, intent: any): Promise<ChatMessage> {
    const recommendations = await this.fetchGeneralRecommendations();
    
    return {
      message: `I'm here to elevate your style journey. Whether you're building a wardrobe, preparing for an event, or exploring new looks, I'll provide personalized guidance rooted in the Sterling Crown philosophy - where luxury is a mindset, not just a price tag.`,
      suggestions: [
        "Help me find my style",
        "Build a capsule wardrobe",
        "Upcoming event styling",
        "Wardrobe essentials"
      ],
      recommendations,
      layerLevel: 1
    };
  }

  // API Calls
  private async fetchColors() {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v2/colors`, {
        headers: { 
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000,
        withCredentials: false
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch colors:', error);
      // Return fallback color data
      return this.getFallbackColorData();
    }
  }

  private async fetchColorRecommendations(colors: string[]) {
    // Use the colors data to generate recommendations
    const colorData = await this.fetchColors();
    return this.generateColorCombinations(colorData, colors);
  }

  private async fetchStyleProfile(profile: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v2/styles/${profile}`, {
        headers: { 
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000,
        withCredentials: false
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch style profile:', error);
      return {
        characteristics: ['classic', 'versatile', 'timeless'],
        wardrobe_essentials: ['navy suit', 'white dress shirt', 'silk tie']
      };
    }
  }

  private async fetchVenueRecommendations(venueType: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v2/venues/${venueType}/recommendations`, {
        headers: { 
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000,
        withCredentials: false
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch venue recommendations:', error);
      return {
        dress_code: 'business professional',
        essential_items: ['tailored suit', 'dress shirt', 'leather shoes']
      };
    }
  }

  private async fetchTrending() {
    const response = await axios.get(`${this.apiUrl}/api/v2/intelligence/trending`, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.data.data;
  }

  private async fetchWeddingRecommendations() {
    const response = await axios.post(`${this.apiUrl}/api/v2/recommendations`, {
      occasion: 'wedding',
      style_preference: 'elegant',
      formality_level: 'formal'
    }, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.data.data;
  }

  private async fetchGeneralRecommendations() {
    const response = await axios.post(`${this.apiUrl}/api/v2/recommendations`, {
      customer_info: this.userProfile,
      preferences: {
        style: 'versatile',
        occasions: ['business', 'casual', 'formal']
      }
    }, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.data.data;
  }

  private async validateCombination(outfit: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/v2/combinations/validate`, outfit, {
        headers: { 'X-API-Key': this.apiKey }
      });
      return response.data.data;
    } catch (error) {
      return {
        isValid: true,
        feedback: "This combination follows classic style principles.",
        suggestions: ["Try different tie patterns", "Consider seasonal colors"]
      };
    }
  }

  // Helper methods
  private extractColors(message: string): string[] {
    const colors = ['navy', 'black', 'grey', 'charcoal', 'blue', 'brown', 'burgundy', 'white'];
    return colors.filter(color => message.includes(color));
  }

  private extractStyle(message: string): string {
    if (message.includes('classic')) return 'classic';
    if (message.includes('modern')) return 'modern';
    if (message.includes('trendy') || message.includes('fashion')) return 'trendy';
    if (message.includes('casual')) return 'casual_professional';
    return 'classic';
  }

  private extractVenue(message: string): string {
    if (message.includes('business') || message.includes('work')) return 'business';
    if (message.includes('wedding')) return 'wedding';
    if (message.includes('cocktail') || message.includes('party')) return 'cocktail';
    if (message.includes('black tie') || message.includes('gala')) return 'black_tie';
    return 'business';
  }

  private extractOutfitComponents(message: string): any {
    // Simple extraction logic - can be enhanced
    return {
      suit_color: this.extractColors(message)[0] || 'navy',
      shirt_color: 'white',
      tie_color: this.extractColors(message)[1] || 'burgundy'
    };
  }

  private generateColorAdvice(colorData: any, colors: string[]): string {
    const primaryColor = colors[0] || 'navy';
    const family = this.findColorFamily(colorData, primaryColor);
    
    if (family) {
      return `${primaryColor} pairs beautifully with ${family.complement_with}. For ties, consider ${family.tie_suggestions.join(', ')}.`;
    }
    
    return "Classic combinations never fail - navy with burgundy, charcoal with silver, or black with deep jewel tones.";
  }

  private generateStyleAdvice(styleData: any): string {
    if (styleData && styleData.characteristics) {
      return `Your style emphasizes ${styleData.characteristics.join(', ')}. Essential pieces include ${styleData.wardrobe_essentials?.slice(0, 3).join(', ')}.`;
    }
    return "Focus on quality fundamentals that can be mixed and matched for various occasions.";
  }

  private generateVenueAdvice(venueData: any): string {
    if (venueData && venueData.dress_code) {
      return `The dress code calls for ${venueData.dress_code}. Key pieces include ${venueData.essential_items?.slice(0, 3).join(', ')}.`;
    }
    return "Dress appropriately for the venue while maintaining your personal style signature.";
  }

  private generateTrendingAdvice(trendingData: any): string {
    if (trendingData && trendingData.current_trends) {
      const trends = (trendingData.current_trends || []).slice(0, 3).map((t: any) => t.name);
      return `Current standouts include ${trends.join(', ')}. These pieces offer both style and versatility.`;
    }
    return "Focus on timeless pieces with modern updates for maximum style impact.";
  }

  private findColorFamily(colorData: any, color: string): any {
    for (const [familyName, family] of Object.entries(colorData.color_families)) {
      if ((family as any).colors.includes(color)) {
        return family;
      }
    }
    return null;
  }

  private generateColorCombinations(colorData: any, colors: string[]): any {
    // Generate smart color combinations based on color theory
    return {
      recommended: (colors || []).map(color => ({
        base: color,
        complements: this.findColorFamily(colorData, color)?.tie_suggestions || []
      }))
    };
  }

  private generateFallbackResponse(message: string): ChatMessage {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('wedding')) {
      return {
        message: "For your wedding, I recommend exploring our curated collection of tuxedos and formal suits. The Sterling Crown philosophy ensures you'll look distinguished on your special day. Would you prefer classic black tie elegance or a modern twist?",
        suggestions: ["Show me tuxedos", "Navy suit options", "Three-piece suits", "Accessories guide"],
        layerLevel: 1
      };
    }
    
    return {
      message: "I'm here to help you discover your signature style. At KCT, we believe in the transformative power of well-tailored menswear. Let me guide you through our collections to find pieces that resonate with your personal narrative.",
      suggestions: ["Help me find my style", "Occasion recommendations", "Color matching guide", "Trending now"],
      layerLevel: 1
    };
  }

  private getFallbackColorData() {
    return {
      color_families: {
        neutrals: {
          colors: ['navy', 'charcoal', 'black', 'grey'],
          complement_with: 'white, light blue, burgundy',
          tie_suggestions: ['burgundy', 'gold', 'forest green']
        },
        earth_tones: {
          colors: ['brown', 'tan', 'olive'], 
          complement_with: 'cream, gold, deep red',
          tie_suggestions: ['burnt orange', 'deep green', 'gold']
        }
      }
    };
  }
}

// Singleton instance
export const knowledgeChatService = new KnowledgeChatService();