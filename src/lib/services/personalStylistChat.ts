'use client';

import { fashionClipService } from './fashionClipService';
import { socialStyleMatching } from './socialStyleMatching';
import { smartBundles } from './smartBundles';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'product' | 'bundle';
    data: any;
  }[];
  suggestions?: string[];
  fashionClipAnalysis?: {
    categories: string[];
    colors: string[];
    styles: string[];
    confidence: number;
  };
}

export interface StylistContext {
  customerId: string;
  customerName?: string;
  styleProfile?: {
    preferredColors: string[];
    preferredStyles: string[];
    bodyType?: string;
    lifestyle?: string;
    budget?: [number, number];
    occasions: string[];
  };
  conversationHistory: ChatMessage[];
  currentIntent?: 'browse' | 'outfit-planning' | 'style-advice' | 'shopping';
}

export interface StylistResponse {
  message: string;
  suggestions?: string[];
  recommendedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    reasoning: string;
  }>;
  outfitBundles?: Array<{
    id: string;
    name: string;
    items: string[];
    totalPrice: number;
    reasoning: string;
  }>;
  followUpQuestions?: string[];
  actionButtons?: Array<{
    label: string;
    action: string;
    data?: any;
  }>;
}

class PersonalStylistChatService {
  private contexts: Map<string, StylistContext> = new Map();
  private readonly FASHION_CLIP_ENDPOINT = 'https://fashion-clip-kct-production.up.railway.app';

  /**
   * Initialize a conversation with the personal stylist
   */
  initializeConversation(customerId: string, customerName?: string): StylistContext {
    const context: StylistContext = {
      customerId,
      customerName,
      conversationHistory: [{
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `Hello${customerName ? ` ${customerName}` : ''}! I'm your personal stylist powered by AI. I can help you find the perfect outfit, analyze your style preferences, and create complete looks tailored just for you.

What would you like to work on today?`,
        timestamp: new Date(),
        suggestions: [
          "Help me find an outfit for a business meeting",
          "I need a complete wedding guest look",
          "Analyze my style from a photo",
          "Show me what's trending in men's fashion",
          "I'm looking for a casual weekend outfit"
        ]
      }],
      currentIntent: 'browse'
    };

    this.contexts.set(customerId, context);
    return context;
  }

  /**
   * Process a user message and generate a stylist response
   */
  async processMessage(
    customerId: string,
    message: string,
    attachments?: File[]
  ): Promise<StylistResponse> {
    const context = this.contexts.get(customerId);
    if (!context) {
      throw new Error('Conversation not initialized');
    }

    // Add user message to history
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments?.map(file => ({ type: 'image' as const, data: file }))
    };

    context.conversationHistory.push(userMessage);

    // Analyze images if provided
    let fashionClipAnalysis;
    if (attachments?.length) {
      fashionClipAnalysis = await this.analyzeImageAttachments(attachments);
      userMessage.fashionClipAnalysis = fashionClipAnalysis;
    }

    // Determine user intent
    const intent = this.determineIntent(message, context);
    context.currentIntent = intent;

    // Generate response based on intent
    const response = await this.generateResponse(message, context, fashionClipAnalysis);

    // Add assistant response to history
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      suggestions: response.suggestions
    };

    context.conversationHistory.push(assistantMessage);

    return response;
  }

  /**
   * Get conversation history for a customer
   */
  getConversationHistory(customerId: string): ChatMessage[] {
    const context = this.contexts.get(customerId);
    return context?.conversationHistory || [];
  }

  /**
   * Update customer style profile based on conversation
   */
  async updateStyleProfile(
    customerId: string,
    preferences: Partial<StylistContext['styleProfile']>
  ): Promise<void> {
    const context = this.contexts.get(customerId);
    if (!context) return;

    context.styleProfile = {
      ...context.styleProfile,
      ...preferences,
      // Ensure required fields are always arrays
      preferredColors: preferences?.preferredColors || context.styleProfile?.preferredColors || [],
      preferredStyles: preferences?.preferredStyles || context.styleProfile?.preferredStyles || [],
      occasions: preferences?.occasions || context.styleProfile?.occasions || []
    };

    // Update the social style matching profile
    await socialStyleMatching.updateCustomerStyleProfile(customerId, {
      explicitPreferences: {
        colors: preferences?.preferredColors,
        styles: preferences?.preferredStyles
      }
    });
  }

  /**
   * Get personalized style recommendations
   */
  async getPersonalizedRecommendations(customerId: string): Promise<{
    outfits: any[];
    products: any[];
    trends: any[];
  }> {
    const context = this.contexts.get(customerId);
    if (!context?.styleProfile) {
      return { outfits: [], products: [], trends: [] };
    }

    // Get outfit bundles
    const outfits = await smartBundles.getPersonalizedBundles(customerId, {
      style: context.styleProfile.preferredStyles,
      colors: context.styleProfile.preferredColors,
      priceRange: context.styleProfile.budget,
      occasions: context.styleProfile.occasions
    });

    // Get similar customer recommendations
    const socialRecommendations = await socialStyleMatching.getStyleBasedRecommendations(customerId);

    return {
      outfits: outfits.slice(0, 5),
      products: socialRecommendations.slice(0, 8),
      trends: [] // Would be populated with trend analysis
    };
  }

  // Private methods
  private async analyzeImageAttachments(attachments: File[]) {
    try {
      const analysis = await fashionClipService.analyzeImage(attachments[0]);
      return analysis ? {
        categories: analysis.predictions?.map((p: any) => p.label) || [],
        colors: [], // Fashion CLIP doesn't return colors directly
        styles: analysis.similar_items || [],
        confidence: analysis.confidence || 0.8
      } : undefined;
    } catch (error) {

      return undefined;
    }
  }

  private determineIntent(
    message: string,
    context: StylistContext
  ): StylistContext['currentIntent'] {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('outfit') || lowerMessage.includes('look') || lowerMessage.includes('complete')) {
      return 'outfit-planning';
    }

    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('cart')) {
      return 'shopping';
    }

    if (lowerMessage.includes('style') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
      return 'style-advice';
    }

    return 'browse';
  }

  private async generateResponse(
    message: string,
    context: StylistContext,
    fashionClipAnalysis?: any
  ): Promise<StylistResponse> {
    const lowerMessage = message.toLowerCase();

    // Handle image analysis
    if (fashionClipAnalysis) {
      return this.generateImageAnalysisResponse(fashionClipAnalysis, context);
    }

    // Handle specific intents
    if (context.currentIntent === 'outfit-planning') {
      return this.generateOutfitPlanningResponse(message, context);
    }

    if (context.currentIntent === 'shopping') {
      return this.generateShoppingResponse(message, context);
    }

    if (context.currentIntent === 'style-advice') {
      return this.generateStyleAdviceResponse(message, context);
    }

    // Handle specific queries
    if (lowerMessage.includes('business') || lowerMessage.includes('work') || lowerMessage.includes('office')) {
      return this.generateBusinessOutfitResponse(context);
    }

    if (lowerMessage.includes('wedding') || lowerMessage.includes('formal event')) {
      return this.generateFormalEventResponse(context);
    }

    if (lowerMessage.includes('casual') || lowerMessage.includes('weekend')) {
      return this.generateCasualOutfitResponse(context);
    }

    if (lowerMessage.includes('trend') || lowerMessage.includes('fashion')) {
      return this.generateTrendResponse(context);
    }

    // Default response
    return {
      message: "I'd love to help you with that! Could you tell me more about what you're looking for? For example:",
      suggestions: [
        "I need an outfit for a specific occasion",
        "Help me understand my style better",
        "Show me what's trending",
        "I want to build a complete wardrobe",
        "Analyze my current style from a photo"
      ],
      followUpQuestions: [
        "What's the occasion you're dressing for?",
        "What's your budget range?",
        "Do you have any color preferences?",
        "What's your lifestyle like?"
      ]
    };
  }

  private generateImageAnalysisResponse(
    analysis: any,
    context: StylistContext
  ): StylistResponse {
    const { categories, colors, styles, confidence } = analysis;

    return {
      message: `Great photo! I can see this is a ${categories.join(' and ')} with ${colors.join(', ')} colors. The style appears to be ${styles.join(' and ')}.

Based on this analysis, I can help you find similar items or create complete outfits that complement this piece.`,
      recommendedProducts: [
        {
          id: 'similar-1',
          name: 'Similar Style Recommendation',
          price: 199,
          imageUrl: '/mock/similar-product.jpg',
          reasoning: `Matches the ${styles[0]} style and ${colors[0]} color palette`
        }
      ],
      suggestions: [
        "Find similar items",
        "Build an outfit around this piece",
        "Show me complementary colors",
        "What occasions would this work for?"
      ],
      actionButtons: [
        {
          label: "Find Similar Items",
          action: "find_similar",
          data: { categories, colors, styles }
        },
        {
          label: "Build Complete Outfit",
          action: "build_outfit",
          data: { coreItem: { categories, colors, styles } }
        }
      ]
    };
  }

  private async generateOutfitPlanningResponse(
    message: string,
    context: StylistContext
  ): Promise<StylistResponse> {
    // Extract occasion from message
    const occasion = this.extractOccasion(message);

    try {
      // Generate outfit bundles
      const recommendations = await this.getPersonalizedRecommendations(context.customerId);

      return {
        message: `Perfect! I've curated some ${occasion ? `${occasion} ` : ''}outfit options for you. Each outfit is carefully selected to work together harmoniously.`,
        outfitBundles: recommendations.outfits.slice(0, 3).map(bundle => ({
          id: bundle.id,
          name: bundle.name,
          items: bundle.items.map((item: any) => item.product.name),
          totalPrice: bundle.bundlePrice,
          reasoning: bundle.description
        })),
        suggestions: [
          "Show me more outfit options",
          "Customize this outfit",
          "What accessories would work?",
          "Find similar outfits in different colors"
        ],
        actionButtons: [
          {
            label: "View Complete Outfit",
            action: "view_outfit",
            data: { bundleId: recommendations.outfits[0]?.id }
          },
          {
            label: "Customize This Look",
            action: "customize_outfit"
          }
        ]
      };
    } catch (error) {
      return {
        message: "I'd love to help you plan the perfect outfit! Could you tell me more about the occasion and your preferences?",
        followUpQuestions: [
          "What's the occasion?",
          "What's your budget?",
          "Any color preferences?",
          "Formal or casual?"
        ]
      };
    }
  }

  private generateBusinessOutfitResponse(context: StylistContext): StylistResponse {
    return {
      message: "Excellent choice! A sharp business look is essential for making the right impression. Here are some professional outfit combinations:",
      outfitBundles: [
        {
          id: 'business-1',
          name: 'Classic Business Professional',
          items: ['Navy Three-Piece Suit', 'White Dress Shirt', 'Silk Tie', 'Brown Oxford Shoes'],
          totalPrice: 899,
          reasoning: 'Timeless combination that works for client meetings, presentations, and formal business settings'
        },
        {
          id: 'business-2',
          name: 'Modern Business Casual',
          items: ['Charcoal Blazer', 'Light Blue Shirt', 'Dark Chinos', 'Leather Loafers'],
          totalPrice: 649,
          reasoning: 'Perfect balance of professional and approachable for modern workplace environments'
        }
      ],
      suggestions: [
        "Show me formal business attire",
        "I prefer business casual",
        "What about seasonal variations?",
        "Help me choose the right colors"
      ],
      actionButtons: [
        {
          label: "Shop Business Collection",
          action: "browse_category",
          data: { category: 'business' }
        },
        {
          label: "Schedule Virtual Fitting",
          action: "schedule_fitting"
        }
      ]
    };
  }

  private generateFormalEventResponse(context: StylistContext): StylistResponse {
    return {
      message: "Formal events require special attention to detail! Let me help you look absolutely perfect for this occasion:",
      outfitBundles: [
        {
          id: 'formal-1',
          name: 'Wedding Guest Elegance',
          items: ['Charcoal Suit', 'Light Pink Shirt', 'Patterned Tie', 'Black Dress Shoes'],
          totalPrice: 799,
          reasoning: 'Sophisticated and wedding-appropriate without upstaging the groom'
        },
        {
          id: 'formal-2',
          name: 'Black Tie Ready',
          items: ['Black Tuxedo', 'White Wing Collar Shirt', 'Black Bow Tie', 'Patent Leather Shoes'],
          totalPrice: 1299,
          reasoning: 'Classic black tie elegance for the most formal occasions'
        }
      ],
      followUpQuestions: [
        "What type of formal event is it?",
        "What time of day?",
        "Indoor or outdoor venue?",
        "What season?"
      ],
      actionButtons: [
        {
          label: "Browse Formal Wear",
          action: "browse_category",
          data: { category: 'formal' }
        }
      ]
    };
  }

  private generateCasualOutfitResponse(context: StylistContext): StylistResponse {
    return {
      message: "Casual doesn't mean compromising on style! Here are some relaxed yet refined options:",
      outfitBundles: [
        {
          id: 'casual-1',
          name: 'Weekend Comfort',
          items: ['Cotton Henley', 'Dark Jeans', 'Casual Sneakers', 'Lightweight Jacket'],
          totalPrice: 349,
          reasoning: 'Comfortable and stylish for weekend activities and casual meetups'
        },
        {
          id: 'casual-2',
          name: 'Smart Casual',
          items: ['Polo Shirt', 'Chinos', 'Loafers', 'Casual Blazer'],
          totalPrice: 499,
          reasoning: 'Elevated casual look perfect for brunch, casual dates, or social events'
        }
      ],
      suggestions: [
        "Show me weekend wear",
        "I need vacation outfits",
        "Help with casual Friday looks",
        "Seasonal casual options"
      ]
    };
  }

  private generateShoppingResponse(message: string, context: StylistContext): StylistResponse {
    return {
      message: "I'd be happy to help you shop! Based on our conversation, here are some personalized recommendations:",
      recommendedProducts: [
        {
          id: 'rec-1',
          name: 'Recommended Item 1',
          price: 199,
          imageUrl: '/mock/product1.jpg',
          reasoning: 'Perfect match for your style preferences'
        },
        {
          id: 'rec-2',
          name: 'Recommended Item 2',
          price: 299,
          imageUrl: '/mock/product2.jpg',
          reasoning: 'Complements your existing wardrobe'
        }
      ],
      actionButtons: [
        {
          label: "Add to Cart",
          action: "add_to_cart"
        },
        {
          label: "Save to Wishlist",
          action: "save_wishlist"
        },
        {
          label: "See More Like This",
          action: "find_similar"
        }
      ]
    };
  }

  private generateStyleAdviceResponse(message: string, context: StylistContext): StylistResponse {
    return {
      message: "I'd love to help you develop your personal style! Style is all about expressing your personality while feeling confident and comfortable.",
      suggestions: [
        "Help me identify my style type",
        "What colors work best for me?",
        "How to dress for my body type",
        "Building a capsule wardrobe",
        "Mixing patterns and textures"
      ],
      followUpQuestions: [
        "What's your lifestyle like?",
        "Do you prefer classic or trendy styles?",
        "What makes you feel most confident?",
        "Any style icons you admire?"
      ],
      actionButtons: [
        {
          label: "Take Style Quiz",
          action: "style_quiz"
        },
        {
          label: "Book Style Consultation",
          action: "book_consultation"
        }
      ]
    };
  }

  private generateTrendResponse(context: StylistContext): StylistResponse {
    const trendList = [
      "Oversized blazers with structured shoulders",
      "Earth tones and warm neutrals",
      "Textured fabrics like corduroy and tweed",
      "Statement accessories",
      "Sustainable and ethical fashion choices"
    ];

    return {
      message: `Fashion trends are constantly evolving! Here's what's trending in men's fashion right now:\n\n${trendList.map((trend, i) => `${i + 1}. ${trend}`).join('\n')}`,
      suggestions: [
        "Show me trending pieces",
        "How to incorporate trends into my style",
        "What trends should I avoid?",
        "Seasonal trend updates"
      ],
      actionButtons: [
        {
          label: "Shop Trending Items",
          action: "browse_trending"
        },
        {
          label: "Get Trend Alerts",
          action: "subscribe_trends"
        }
      ]
    };
  }

  private extractOccasion(message: string): string | null {
    const occasions = [
      'business', 'work', 'office', 'meeting',
      'wedding', 'formal', 'black tie',
      'casual', 'weekend', 'vacation',
      'date', 'dinner', 'party'
    ];

    const lowerMessage = message.toLowerCase();
    for (const occasion of occasions) {
      if (lowerMessage.includes(occasion)) {
        return occasion;
      }
    }

    return null;
  }
}

export const personalStylistChat = new PersonalStylistChatService();