// Enhanced conversational patterns for style discovery
export interface ConversationalPattern {
  keywords: string[]
  response: string
  followUpQuestion: string
  contextualResponses: {
    [context: string]: {
      response: string
      styleDiscoveryQuestion: string
    }
  }
}

// Import comprehensive training questions
import { TRAINING_QUESTIONS, mergeTrainingQuestions } from './training-questions'

// Merge training questions with existing patterns
export const CONVERSATIONAL_PATTERNS: Record<string, ConversationalPattern> = mergeTrainingQuestions({
  // Product & Inventory
  'suits_availability': {
    keywords: ['do you have suits', 'suits available', 'suit inventory'],
    response: "Yes! Full collection from casual to black tie.",
    followUpQuestion: "What's the occasion?",
    contextualResponses: {
      'wedding': {
        response: "Perfect for weddings! We have groom and guest options.",
        styleDiscoveryQuestion: "Are you the groom or a guest? That changes everything about color and formality level."
      },
      'business': {
        response: "Business suits are our specialty.",
        styleDiscoveryQuestion: "Daily wear or special presentations? Let's find your power suit."
      },
      'formal': {
        response: "Our formal collection ranges from cocktail to black tie.",
        styleDiscoveryQuestion: "Traditional elegance or modern sophistication - which speaks to you?"
      }
    }
  },

  'pricing_range': {
    keywords: ['price range', 'how much', 'cost', 'pricing'],
    response: "Starting $395 to luxury at $1,295.",
    followUpQuestion: "What's your budget?",
    contextualResponses: {
      'budget': {
        response: "Our $495 suits punch above their weight in quality and style.",
        styleDiscoveryQuestion: "Quality basics or looking for something special to make a statement?"
      },
      'investment': {
        response: "Premium fabrics at $800+ last decades with proper care.",
        styleDiscoveryQuestion: "Classic investment piece or ready to try something fashion-forward?"
      },
      'luxury': {
        response: "Our luxury collection features the finest Italian wools and expert craftsmanship.",
        styleDiscoveryQuestion: "Understated elegance or pieces that command attention?"
      }
    }
  },

  // Sizing Questions
  'first_suit_advice': {
    keywords: ['navy or charcoal', 'first suit', 'which suit first'],
    response: "Navy - most versatile starter suit.",
    followUpQuestion: "What occasions will you wear it for?",
    contextualResponses: {
      'business': {
        response: "Navy with crisp white shirt projects confident professionalism.",
        styleDiscoveryQuestion: "Do you prefer understated authority or want to stand out slightly in meetings?"
      },
      'social': {
        response: "Navy lets you play with tie colors and accessories beautifully.",
        styleDiscoveryQuestion: "Are you more classic burgundy type or adventurous with patterns and colors?"
      },
      'versatile': {
        response: "Smart choice - navy works from boardroom to wedding.",
        styleDiscoveryQuestion: "Conservative styling for maximum versatility or subtle modern touches?"
      }
    }
  },

  'fit_preference': {
    keywords: ['slim fit', 'regular fit', 'fit types', 'how should it fit'],
    response: "We offer slim, modern, and classic fits.",
    followUpQuestion: "What's your build like?",
    contextualResponses: {
      'athletic': {
        response: "Slim fit shows off your build without being restrictive.",
        styleDiscoveryQuestion: "Do you like clothes fitted to show your physique or prefer room to breathe comfortably?"
      },
      'comfort': {
        response: "Classic fit gives timeless elegance with comfortable movement.",
        styleDiscoveryQuestion: "Are you more traditional gentleman or lean toward modern styling?"
      },
      'modern': {
        response: "Modern fit bridges contemporary and classic beautifully.",
        styleDiscoveryQuestion: "Subtle modern touches or ready to embrace current trends?"
      }
    }
  },

  // Event-Specific
  'wedding_attire': {
    keywords: ['wedding suit', 'wedding guest', 'summer wedding'],
    response: "Wedding attire depends on season, venue, and your role.",
    followUpQuestion: "Are you the groom or a guest?",
    contextualResponses: {
      'groom': {
        response: "As the groom, you set the style tone for the entire wedding party.",
        styleDiscoveryQuestion: "Classic elegance that photographs timelessly or modern style that reflects your personality?"
      },
      'guest': {
        response: "As a guest, you want to look great while respecting the couple's spotlight.",
        styleDiscoveryQuestion: "Blend elegantly with the crowd or confident enough to stand out appropriately?"
      },
      'summer': {
        response: "Summer weddings call for lighter fabrics and often more relaxed colors.",
        styleDiscoveryQuestion: "Beach or garden setting? That influences whether we go coastal casual or refined outdoor elegance."
      }
    }
  },

  'job_interview': {
    keywords: ['job interview', 'interview suit', 'professional attire'],
    response: "Conservative colors project competence and reliability.",
    followUpQuestion: "What industry?",
    contextualResponses: {
      'finance': {
        response: "Finance values traditional authority and attention to detail.",
        styleDiscoveryQuestion: "Charcoal projects power, navy shows approachability - which energy represents you better?"
      },
      'creative': {
        response: "Creative fields appreciate personality within professional boundaries.",
        styleDiscoveryQuestion: "Play it safe with navy or show creative confidence with subtle unique touches?"
      },
      'tech': {
        response: "Tech interviews often value competence over strict formality.",
        styleDiscoveryQuestion: "Traditional suit or modern business casual with blazer and quality chinos?"
      }
    }
  },

  // Accessories
  'pocket_square': {
    keywords: ['pocket square', 'handkerchief', 'pocket square necessary'],
    response: "Not required, but adds elegant finishing touch.",
    followUpQuestion: "Formal or casual event?",
    contextualResponses: {
      'casual': {
        response: "For casual events, skip the tie and add a pocket square for effortless elevation.",
        styleDiscoveryQuestion: "Are you drawn to subtle solid colors or ready for interesting patterns that show personality?"
      },
      'formal': {
        response: "Formal events are perfect for pocket squares to bring colors together beautifully.",
        styleDiscoveryQuestion: "Since our ties come with matching squares, do you prefer coordinated elegance or subtle contrast for sophistication?"
      }
    }
  },

  'shoe_recommendations': {
    keywords: ['shoe recommendations', 'what shoes', 'shoes to wear'],
    response: "Oxford or derby styles in quality leather.",
    followUpQuestion: "What color suit?",
    contextualResponses: {
      'black': {
        response: "Black oxfords create the most formal, powerful combination.",
        styleDiscoveryQuestion: "Do you prefer sleek, minimalist elegance or more substantial, commanding presence?"
      },
      'brown': {
        response: "Brown shoes with brown suit shows sophisticated, approachable style.",
        styleDiscoveryQuestion: "Lighter brown for casual confidence or darker brown for serious sophistication?"
      },
      'navy': {
        response: "Brown shoes with navy suit is a classic, versatile pairing.",
        styleDiscoveryQuestion: "Cognac brown for modern style or darker brown for timeless elegance?"
      }
    }
  },

  // Quick Decision
  'urgent_need': {
    keywords: ['need suit tomorrow', 'last minute', 'urgent', 'rush'],
    response: "In-stock suits with same-day alterations possible.",
    followUpQuestion: "What's your typical size?",
    contextualResponses: {
      'emergency': {
        response: "We specialize in emergency formal wear - you'll look great!",
        styleDiscoveryQuestion: "Pressure situation calls for classic safe choice or chance to try something bold that boosts confidence?"
      },
      'procrastination': {
        response: "Last-minute shopping sometimes leads to the best discoveries.",
        styleDiscoveryQuestion: "Do you know exactly what you want or open to expert suggestions that might surprise you?"
      }
    }
  },

  'best_value': {
    keywords: ['best value', 'worth the investment', 'good deal'],
    response: "Quality suits last years with proper care.",
    followUpQuestion: "How often will you wear it?",
    contextualResponses: {
      'daily': {
        response: "Daily wear makes premium investment worthwhile - cost per wear drops significantly.",
        styleDiscoveryQuestion: "Conservative styling for longevity or time to refresh your professional image?"
      },
      'occasional': {
        response: "Occasional wear calls for smart spending on versatile pieces.",
        styleDiscoveryQuestion: "Timeless pieces that never go out of style or current trends that make you feel contemporary?"
      }
    }
  },

  // Style Discovery
  'color_advice': {
    keywords: ['what colors', 'color matching', 'tie color', 'shirt color'],
    response: "Color choices depend on occasion, season, and your personal style.",
    followUpQuestion: "What's the event and your comfort level with color?",
    contextualResponses: {
      'conservative': {
        response: "Classic combinations never fail and always look sophisticated.",
        styleDiscoveryQuestion: "Prefer invisible elegance where quality speaks quietly or subtle details that show you care about style?"
      },
      'adventurous': {
        response: "Color can be a powerful tool for self-expression and confidence.",
        styleDiscoveryQuestion: "Bold statements that show personality or sophisticated combinations that hint at your creative side?"
      }
    }
  },

  // Fit & Alterations
  'alteration_timeline': {
    keywords: ['how long alterations', 'alteration time', 'when ready'],
    response: "Standard alterations take 5-7 days, rush available.",
    followUpQuestion: "When's your event?",
    contextualResponses: {
      'wedding': {
        response: "Wedding alterations get priority - we understand the importance.",
        styleDiscoveryQuestion: "Traditional fit that photographs timelessly or modern tailored look that shows your style evolution?"
      },
      'flexible': {
        response: "With flexible timing, we can perfect every detail.",
        styleDiscoveryQuestion: "Minor tweaks to improve fit or complete style transformation to refresh your look?"
      }
    }
  }
});

export const STYLE_DISCOVERY_QUESTIONS = {
  'conservative_vs_modern': [
    "Are you more traditional gentleman or do you lean toward modern styling?",
    "Do you prefer classic elegance or contemporary edge?",
    "Safe, time-tested choices or ready to try something current?"
  ],
  
  'subtle_vs_statement': [
    "Do you prefer understated elegance or pieces that make a statement?",
    "Blend sophisticatedly or confident enough to stand out?",
    "Invisible quality or style that gets noticed?"
  ],
  
  'comfort_vs_fashion': [
    "Do you prioritize comfortable fit or fashion-forward silhouette?",
    "Classic comfort or willing to adjust for style?",
    "Room to breathe or fitted to show your build?"
  ]
}

export function getConversationalResponse(message: string, context?: any): {
  response: string
  followUp: string
  suggestions: string[]
} {
  const lowerMessage = message.toLowerCase()
  
  // Find matching pattern
  for (const [key, pattern] of Object.entries(CONVERSATIONAL_PATTERNS)) {
    if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
      let response = pattern.response
      let followUp = pattern.followUpQuestion
      let suggestions = Object.keys(pattern.contextualResponses)
      
      // Check if we have context for more specific response
      if (context && pattern.contextualResponses[context]) {
        const contextualResponse = pattern.contextualResponses[context]
        response = contextualResponse.response
        followUp = contextualResponse.styleDiscoveryQuestion
        suggestions = ['Tell me more', 'Show me options', 'What else?']
      }
      
      return { response, followUp, suggestions }
    }
  }
  
  // Default response for unmatched queries
  return {
    response: "I'm here to help you find the perfect style solution.",
    followUp: "What specific aspect of menswear can I help you with today?",
    suggestions: ['Suit recommendations', 'Style advice', 'Fit questions', 'Color guidance']
  }
}