// Extended Response Variations - Demonstrating contextual diversity
// Shows how the same question gets completely different responses based on context

import type { ResponseContext, ContextualResponse, ResponseVariation } from './response-variations'

// Continue generating variations for more scenarios (6-100)
export const EXTENDED_RESPONSE_VARIATIONS: ResponseVariation[] = [
  // Scenario 6: "just got promoted need executive wardrobe"
  {
    scenarioId: 'career_promotion_1',
    originalMessage: "just got promoted need executive wardrobe",
    variations: [
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'greeting',
          userMood: 'excited',
          previousInteractions: 0,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "Congratulations on the promotion! Time to dress the part. Executive presence starts with impeccable suiting.",
        tone: 'friendly',
        followUp: "C-suite or senior management? Different levels, different looks."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'discovery',
          userMood: 'neutral',
          previousInteractions: 1,
          urgencyLevel: 'low',
          channelType: 'email'
        },
        response: "Executive wardrobe consultation available. Building a complete professional collection that commands respect.",
        tone: 'professional',
        followUp: "I recommend starting with 5 core suits and building from there."
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'recommendation',
          userMood: 'stressed',
          previousInteractions: 3,
          urgencyLevel: 'high',
          channelType: 'phone'
        },
        response: "New role pressure? Let me take wardrobe off your plate. Complete exec package: $3500 for everything you need.",
        tone: 'empathetic',
        followUp: "We can split it into phases if that helps with budget."
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'greeting',
          userMood: 'excited',
          previousInteractions: 0,
          urgencyLevel: 'low',
          channelType: 'chat'
        },
        response: "Big promotion energy! Let's build you a power wardrobe. Think CEO even if you're not there yet.",
        tone: 'casual',
        followUp: "What industry? Tech exec is different from finance exec."
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'closing',
          userMood: 'happy',
          previousInteractions: 8,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "You look like you already run the company! This wardrobe says 'leadership' in every stitch.",
        tone: 'friendly',
        followUp: "Remember: dry clean rotation. Never wear the same suit two days straight."
      }
    ]
  },

  // Scenario 7: "girlfriend says I dress terrible need help"
  {
    scenarioId: 'relationship_pressure_1',
    originalMessage: "girlfriend says I dress terrible need help",
    variations: [
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'greeting',
          userMood: 'frustrated',
          previousInteractions: 0,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "She cares enough to be honest - that's good! Let's level up your style game together.",
        tone: 'casual',
        followUp: "What specifically does she not like? Colors, fit, or just everything?"
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'discovery',
          userMood: 'neutral',
          previousInteractions: 1,
          urgencyLevel: 'low',
          channelType: 'email'
        },
        response: "Style transformation service available. We'll rebuild your wardrobe from foundation to impressive.",
        tone: 'professional',
        followUp: "Would she like to be involved in the selection process?"
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'recommendation',
          userMood: 'happy',
          previousInteractions: 2,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "Relationship saver package: complete style overhaul that'll make her proud to be seen with you.",
        tone: 'friendly',
        followUp: "Start with date night outfits - immediate impact where it matters."
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'greeting',
          userMood: 'stressed',
          previousInteractions: 0,
          urgencyLevel: 'high',
          channelType: 'chat'
        },
        response: "Tough feedback but fixable! Many guys need style help. You're actually ahead by asking for it.",
        tone: 'empathetic',
        followUp: "Anniversary or birthday coming up? Perfect time to surprise her."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'closing',
          userMood: 'excited',
          previousInteractions: 5,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "She's going to be shocked - in the best way! You clean up incredibly well.",
        tone: 'friendly',
        followUp: "Take a selfie in this outfit and send it to her now. Watch her reaction!"
      }
    ]
  },

  // Scenario 8: "50th birthday party want to look younger"
  {
    scenarioId: 'age_concern_1',
    originalMessage: "50th birthday party want to look younger",
    variations: [
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'greeting',
          userMood: 'nervous',
          previousInteractions: 0,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "50 is the new 35! Modern cuts and fresh colors will take years off instantly.",
        tone: 'friendly',
        followUp: "Casual party or formal event? Different strategies for each."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'discovery',
          userMood: 'neutral',
          previousInteractions: 2,
          urgencyLevel: 'low',
          channelType: 'phone'
        },
        response: "Age-defying style consultation. Contemporary fits without trying too hard to be young.",
        tone: 'expert',
        followUp: "The key is modern classic - youthful energy, mature sophistication."
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'recommendation',
          userMood: 'excited',
          previousInteractions: 3,
          urgencyLevel: 'high',
          channelType: 'chat'
        },
        response: "Three looks that say 'experienced but energetic': slim fit navy, soft grey with texture, burgundy accent blazer.",
        tone: 'professional',
        followUp: "Add premium sneakers for casual events - instant youth boost."
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'greeting',
          userMood: 'frustrated',
          previousInteractions: 0,
          urgencyLevel: 'low',
          channelType: 'chat'
        },
        response: "Age is just a number, style is forever. Let's find your sweet spot between distinguished and dynamic.",
        tone: 'empathetic',
        followUp: "What makes you feel most confident? Let's start there and modernize."
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'closing',
          userMood: 'happy',
          previousInteractions: 6,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "You look fantastic! This outfit says 'successful, vital, and nowhere near done yet.' Perfect for 50.",
        tone: 'friendly',
        followUp: "The fit is everything - you look fit, energetic, and contemporary."
      }
    ]
  },

  // Scenario 9: "lost weight nothing fits anymore"
  {
    scenarioId: 'body_change_1',
    originalMessage: "lost weight nothing fits anymore",
    variations: [
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'greeting',
          userMood: 'excited',
          previousInteractions: 0,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "Congratulations on the weight loss! Best problem to have. Time for a complete wardrobe victory lap.",
        tone: 'friendly',
        followUp: "How much weight? Might be able to alter some pieces."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'discovery',
          userMood: 'happy',
          previousInteractions: 1,
          urgencyLevel: 'low',
          channelType: 'email'
        },
        response: "Transformation celebration wardrobe available. Show off that hard work with perfectly fitted clothing.",
        tone: 'professional',
        followUp: "We offer alteration assessment - some pieces might be salvageable."
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'recommendation',
          userMood: 'neutral',
          previousInteractions: 3,
          urgencyLevel: 'high',
          channelType: 'phone'
        },
        response: "New body, new wardrobe. Start with essentials: 2 suits, 5 shirts, 3 pants. Build from there.",
        tone: 'expert',
        followUp: "Still losing or maintaining? Affects our approach."
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'greeting',
          userMood: 'stressed',
          previousInteractions: 0,
          urgencyLevel: 'high',
          channelType: 'chat'
        },
        response: "Weight loss success but wardrobe crisis? Common problem. Let's get you fitted properly ASAP.",
        tone: 'empathetic',
        followUp: "Need something for tomorrow? Let's focus on one perfect outfit first."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'closing',
          userMood: 'excited',
          previousInteractions: 7,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "You look incredible! The weight loss shows, and these fits highlight all your hard work perfectly.",
        tone: 'friendly',
        followUp: "Keep your largest old suit - great reminder of your journey."
      }
    ]
  },

  // Scenario 10: "company holiday party never know what to wear"
  {
    scenarioId: 'holiday_party_1',
    originalMessage: "company holiday party never know what to wear",
    variations: [
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'greeting',
          userMood: 'confused',
          previousInteractions: 0,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "Holiday party decoded: festive but professional. I'll help you hit that perfect balance.",
        tone: 'friendly',
        followUp: "Formal venue or office party? Big difference in approach."
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'discovery',
          userMood: 'neutral',
          previousInteractions: 1,
          urgencyLevel: 'high',
          channelType: 'email'
        },
        response: "Corporate holiday attire guidance: elevated without overdressing, festive without costume.",
        tone: 'professional',
        followUp: "Is there a stated dress code? 'Festive attire' means different things."
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'recommendation',
          userMood: 'stressed',
          previousInteractions: 2,
          urgencyLevel: 'high',
          channelType: 'phone'
        },
        response: "Safe bet: dark suit, subtle festive accent (burgundy tie or pocket square). Professional but participatory.",
        tone: 'expert',
        followUp: "Avoid: ugly sweaters unless explicitly requested, too much sparkle."
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'greeting',
          userMood: 'nervous',
          previousInteractions: 0,
          urgencyLevel: 'emergency',
          channelType: 'chat'
        },
        response: "Party tomorrow? Navy suit, white shirt, festive tie. Can't go wrong. Add personality with accessories.",
        tone: 'urgent',
        followUp: "Boss going to be there? Err on the formal side."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'closing',
          userMood: 'happy',
          previousInteractions: 4,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "Perfect holiday party look! Festive enough to show spirit, professional enough for Monday's memories.",
        tone: 'friendly',
        followUp: "This velvet blazer option works great if it's a fancier venue."
      }
    ]
  },

  // Demonstrating pattern variations for "I need a suit" - same request, 20 different contexts
  {
    scenarioId: 'generic_suit_request',
    originalMessage: "I need a suit",
    variations: [
      // Morning variations
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'greeting',
          userMood: 'neutral',
          previousInteractions: 0,
          urgencyLevel: 'low',
          channelType: 'chat'
        },
        response: "Good morning! Let's find you the perfect suit. What's the occasion?",
        tone: 'friendly',
        followUp: "Business, wedding, or general wardrobe addition?"
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'discovery',
          userMood: 'excited',
          previousInteractions: 2,
          urgencyLevel: 'medium',
          channelType: 'phone'
        },
        response: "Based on what you've told me, I'm thinking navy or charcoal. Both incredibly versatile.",
        tone: 'expert',
        followUp: "How often will you wear it?"
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'recommendation',
          userMood: 'stressed',
          previousInteractions: 5,
          urgencyLevel: 'high',
          channelType: 'email'
        },
        response: "I've selected three suits that match your requirements. All available for immediate delivery.",
        tone: 'professional',
        followUp: "Shall I arrange express alterations?"
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'closing',
          userMood: 'happy',
          previousInteractions: 10,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "Excellent choice! This suit will serve you well for years. The fit is absolutely perfect.",
        tone: 'friendly',
        followUp: "Let me show you the matching accessories."
      },
      
      // Afternoon variations
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'greeting',
          userMood: 'frustrated',
          previousInteractions: 0,
          urgencyLevel: 'emergency',
          channelType: 'chat'
        },
        response: "Suit emergency? I'm on it. What do you need it for and when?",
        tone: 'urgent',
        followUp: "We have same-day options available."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'discovery',
          userMood: 'confused',
          previousInteractions: 1,
          urgencyLevel: 'low',
          channelType: 'chat'
        },
        response: "No problem! Choosing a suit is easier than it seems. Let's start with when you'll wear it most.",
        tone: 'empathetic',
        followUp: "Work, special events, or both?"
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'recommendation',
          userMood: 'neutral',
          previousInteractions: 3,
          urgencyLevel: 'medium',
          channelType: 'email'
        },
        response: "Recommended: Our Essential Navy Suit - $395. Perfect first suit or wardrobe foundation.",
        tone: 'professional',
        followUp: "View our complete suit guide attached."
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'closing',
          userMood: 'excited',
          previousInteractions: 8,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "You're all set! This suit transforms you completely. You look sharp and confident.",
        tone: 'friendly',
        followUp: "Free pressing for life with this purchase."
      },
      
      // Evening variations
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'greeting',
          userMood: 'stressed',
          previousInteractions: 0,
          urgencyLevel: 'high',
          channelType: 'chat'
        },
        response: "Evening! Suit shopping stress? Let me simplify this for you right now.",
        tone: 'empathetic',
        followUp: "What's your most urgent need?"
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'discovery',
          userMood: 'happy',
          previousInteractions: 2,
          urgencyLevel: 'low',
          channelType: 'phone'
        },
        response: "Great timing! Our evening consultation can cover everything. What's your style preference?",
        tone: 'friendly',
        followUp: "Classic, modern, or trendy?"
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'recommendation',
          userMood: 'neutral',
          previousInteractions: 4,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "Based on our chat, here are three options: Classic Navy ($395), Modern Charcoal ($495), Italian Wool ($795).",
        tone: 'expert',
        followUp: "All include free alterations."
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'closing',
          userMood: 'happy',
          previousInteractions: 12,
          urgencyLevel: 'low',
          channelType: 'email'
        },
        response: "Order confirmed! Your new suit will arrive Thursday. You're going to love how you look in it.",
        tone: 'friendly',
        followUp: "Tracking details coming shortly."
      },
      
      // Night variations
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'greeting',
          userMood: 'neutral',
          previousInteractions: 0,
          urgencyLevel: 'low',
          channelType: 'chat'
        },
        response: "Late night suit shopping? I'm here! What's got you thinking about suits at this hour?",
        tone: 'casual',
        followUp: "Big event coming up?"
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'discovery',
          userMood: 'excited',
          previousInteractions: 1,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        response: "Awesome! New suit energy. Tell me about where you'll wear it most.",
        tone: 'casual',
        followUp: "Job interview? Date? Wedding?"
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'recommendation',
          userMood: 'stressed',
          previousInteractions: 3,
          urgencyLevel: 'emergency',
          channelType: 'chat'
        },
        response: "Don't stress! Order tonight, receive tomorrow. Our rapid delivery has saved many last-minute situations.",
        tone: 'empathetic',
        followUp: "Need it altered too? We can make that happen."
      },
      {
        context: {
          timeOfDay: 'night',
          conversationStage: 'closing',
          userMood: 'happy',
          previousInteractions: 6,
          urgencyLevel: 'low',
          channelType: 'chat'
        },
        response: "Perfect! Order placed. Get some sleep - you'll wake up knowing your suit situation is handled.",
        tone: 'casual',
        followUp: "Check your email for confirmation and styling tips."
      },
      
      // Different channel variations
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'greeting',
          userMood: 'neutral',
          previousInteractions: 0,
          urgencyLevel: 'low',
          channelType: 'email'
        },
        response: "Thank you for your inquiry about suits. We offer a comprehensive selection for every occasion and budget.",
        tone: 'professional',
        followUp: "Please find our catalog attached, or schedule a consultation."
      },
      {
        context: {
          timeOfDay: 'morning',
          conversationStage: 'greeting',
          userMood: 'excited',
          previousInteractions: 0,
          urgencyLevel: 'medium',
          channelType: 'phone'
        },
        response: "Great to hear from you! Yes, we have fantastic suits. Let me help you find exactly what you need.",
        tone: 'friendly',
        followUp: "Are you able to visit our showroom, or shall we handle this remotely?"
      },
      {
        context: {
          timeOfDay: 'afternoon',
          conversationStage: 'greeting',
          userMood: 'neutral',
          previousInteractions: 0,
          urgencyLevel: 'low',
          channelType: 'in-store'
        },
        response: "Welcome! Looking for a suit? You've come to the right place. Let me show you our collection.",
        tone: 'friendly',
        followUp: "First suit or adding to your wardrobe?"
      },
      {
        context: {
          timeOfDay: 'evening',
          conversationStage: 'discovery',
          userMood: 'confused',
          previousInteractions: 15,
          urgencyLevel: 'low',
          channelType: 'chat'
        },
        response: "I know we've looked at a lot of options. Let me narrow it down to my top two recommendations for you.",
        tone: 'empathetic',
        followUp: "Sometimes too many choices makes it harder. Trust me on these two."
      }
    ]
  }
]

// Function to demonstrate response learning over time
export class ResponseEvolutionEngine {
  private responseHistory = new Map<string, {
    responses: string[]
    contexts: ResponseContext[]
    effectiveness: number[]
  }>()
  
  // Learn from successful interactions
  learnFromInteraction(
    message: string,
    response: string,
    context: ResponseContext,
    satisfaction: number
  ) {
    const key = this.normalizeMessage(message)
    
    if (!this.responseHistory.has(key)) {
      this.responseHistory.set(key, {
        responses: [],
        contexts: [],
        effectiveness: []
      })
    }
    
    const history = this.responseHistory.get(key)!
    history.responses.push(response)
    history.contexts.push(context)
    history.effectiveness.push(satisfaction)
    
    // Evolve responses based on effectiveness
    this.evolveResponses(key)
  }
  
  // Evolve responses based on what works
  private evolveResponses(messageKey: string) {
    const history = this.responseHistory.get(messageKey)
    if (!history || history.responses.length < 10) return
    
    // Find patterns in successful responses
    const successfulResponses = history.responses.filter((_, i) => 
      history.effectiveness[i] > 4
    )
    
    // Extract successful patterns
    const patterns = this.extractPatterns(successfulResponses)
    
    // Store evolved patterns for future use
    this.storeEvolvedPatterns(messageKey, patterns)
  }
  
  private extractPatterns(responses: string[]): string[] {
    // Extract common patterns from successful responses
    return responses
  }
  
  private storeEvolvedPatterns(key: string, patterns: string[]) {
    // Store patterns for future use
    try {
      const storageKey = `evolved_patterns_${key}`;
      localStorage.setItem(storageKey, JSON.stringify({
        patterns,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Could not store evolved patterns:', error);
    }
  }
}
