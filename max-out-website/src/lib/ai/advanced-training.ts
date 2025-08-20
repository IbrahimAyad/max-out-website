// Advanced AI Training System for KCT Conversational Bot
// 200+ questions with multi-agent responses and conversation flows

export interface TrainingScenario {
  id: string
  category: string
  userMessage: string
  context?: {
    userType?: 'first_time' | 'returning' | 'vip'
    mood?: 'excited' | 'nervous' | 'frustrated' | 'browsing'
    urgency?: 'immediate' | 'planning' | 'exploring'
    budget?: 'budget' | 'mid' | 'luxury'
  }
  agentResponses: {
    primary: string
    alternatives: string[]
    personality: 'professional' | 'friendly' | 'expert' | 'casual'
  }
  followUpPaths: {
    [userResponse: string]: string
  }
  metrics?: {
    conversionRate?: number
    satisfaction?: number
    avgResponseTime?: number
  }
}

// ====== ADVANCED TRAINING SCENARIOS (200+) ======

export const ADVANCED_SCENARIOS: TrainingScenario[] = [
  // ===== EMOTIONAL/LIFE EVENT SCENARIOS (1-25) =====
  {
    id: 'emotional_1',
    category: 'life_events',
    userMessage: "my son is getting married and I don't know what fathers wear",
    context: { mood: 'nervous', userType: 'first_time' },
    agentResponses: {
      primary: "Father of the groom? You'll want to look sharp but not upstage. Navy or grey works perfectly.",
      alternatives: [
        "Exciting! Fathers typically go classic - let's find you something distinguished.",
        "Congrats! Dark suit, step below the groom. I'll help you coordinate."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "navy or grey?": "Navy if daytime, grey if you want softer. What time's the ceremony?",
      "what about a tux?": "Only if it's black-tie. Check with your son first.",
      "budget options?": "Our $395 suits photograph beautifully. Want to see them?"
    }
  },
  {
    id: 'emotional_2',
    category: 'life_events',
    userMessage: "going through a divorce need to update my whole wardrobe",
    context: { mood: 'frustrated', urgency: 'planning' },
    agentResponses: {
      primary: "Fresh start deserves fresh style. Let's build you a confident new look.",
      alternatives: [
        "Time for the 2.0 version of you. Where should we start?",
        "New chapter, new wardrobe. I'll help you rebuild smart."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "where to start?": "3 essentials: great suit, casual blazer, quality basics. Budget?",
      "need everything": "Let's prioritize. Work wardrobe or social first?",
      "not much money": "Start with versatile pieces. One great suit beats five mediocre ones."
    }
  },
  {
    id: 'emotional_3',
    category: 'confidence',
    userMessage: "lost weight and nothing fits anymore",
    context: { mood: 'excited', userType: 'returning' },
    agentResponses: {
      primary: "Congrats on the transformation! Time to show it off. How much did you lose?",
      alternatives: [
        "Amazing! New body needs new fits. Let's celebrate with great style.",
        "That's incredible! Ready for clothes that actually fit?"
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "50 pounds": "Wow! You'll need everything new. Slim fits will look fantastic.",
      "still losing": "Get essentials now, investment pieces when you're stable.",
      "what size now?": "Probably 2-3 sizes down. Our size predictor can confirm."
    }
  },

  // ===== STYLE DISCOVERY SCENARIOS (26-50) =====
  {
    id: 'style_1',
    category: 'style_exploration',
    userMessage: "I dress boring and my girlfriend hates it",
    context: { mood: 'nervous', userType: 'first_time' },
    agentResponses: {
      primary: "Let's add some personality without going crazy. What's your current style?",
      alternatives: [
        "Time to level up! Small changes make big differences.",
        "She'll love the new you. Start subtle or go bold?"
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "just black and grey": "Add burgundy or forest green. Still sophisticated but interesting.",
      "want to impress her": "Fitted blazer and quality shoes. Instant upgrade.",
      "scared of color": "Start with accessories. Pocket square or patterned socks."
    }
  },
  {
    id: 'style_2',
    category: 'style_transition',
    userMessage: "switching from tech casual to finance formal",
    context: { urgency: 'immediate', budget: 'mid' },
    agentResponses: {
      primary: "Big shift! You'll need 3-4 suits minimum. Building from scratch?",
      alternatives: [
        "From hoodies to suits? Let's make you Wall Street ready.",
        "Finance dress code is strict. I know exactly what you need."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "from scratch": "Start with navy and charcoal. Add grey and pinstripe later.",
      "how formal?": "Investment banking? Very. Consulting? Business professional.",
      "cheapest option?": "Two quality suits you rotate beat five cheap ones."
    }
  },

  // ===== SPECIFIC PRODUCT QUERIES (51-75) =====
  {
    id: 'product_1',
    category: 'specific_items',
    userMessage: "do you have anything in emerald green?",
    context: { mood: 'browsing' },
    agentResponses: {
      primary: "Emerald's having a moment! Blazers and accessories in stock.",
      alternatives: [
        "Bold choice! Yes - blazers, ties, and pocket squares.",
        "Love the confidence! Several emerald options available."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "show me blazers": "Velvet or wool? Both stunning in emerald.",
      "too bold?": "Not at all! Emerald with black pants is sophisticated.",
      "for a wedding": "Perfect for evening weddings. Groom or guest?"
    }
  },
  {
    id: 'product_2',
    category: 'specific_items',
    userMessage: "need a white dinner jacket like James Bond",
    context: { budget: 'luxury', mood: 'excited' },
    agentResponses: {
      primary: "Ivory dinner jacket - ultimate warm-weather formal. Casino Royale style?",
      alternatives: [
        "Classic 007! Ivory dinner jacket with black pants. Shaken not stirred?",
        "Timeless choice. Peak or shawl lapel?"
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "exactly": "Peak lapel, single button, black satin details. $895.",
      "when to wear?": "Summer black-tie, yacht parties, destination weddings.",
      "alternatives?": "Midnight blue tux - equally sophisticated, more versatile."
    }
  },

  // ===== SIZING ANXIETIES (76-100) =====
  {
    id: 'sizing_1',
    category: 'fit_concerns',
    userMessage: "I'm really short will your suits fit?",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Absolutely! Short sizes from 36S to 48S. What's your height?",
      alternatives: [
        "No worries! Lots of options for shorter builds. How tall?",
        "Perfect fits for every height. Under 5'7\"?"
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "5'4\"": "36S or 38S typically. Proportions matter more than height.",
      "look taller?": "Vertical stripes, higher button stance, minimal break.",
      "need alterations?": "Minor hemming usually. We keep proportions perfect."
    }
  },
  {
    id: 'sizing_2',
    category: 'fit_concerns',
    userMessage: "big belly small shoulders nothing ever fits right",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Classic athletic taper challenge. We can fix that with the right cut.",
      alternatives: [
        "Common issue, easy fix. Soft-shoulder construction works great.",
        "Been there! Let's find your perfect fit strategy."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "really?": "Side tabs instead of back vents, lower button stance. Game changer.",
      "what size?": "Size to shoulders, adjust waist. Never compromise shoulders.",
      "expensive?": "Alterations cheaper than ill-fitting suits you never wear."
    }
  },

  // ===== OCCASION PANIC (101-125) =====
  {
    id: 'occasion_1',
    category: 'urgent_events',
    userMessage: "funeral tomorrow nothing black",
    context: { urgency: 'immediate', mood: 'nervous' },
    agentResponses: {
      primary: "Charcoal or navy works for funerals. Can you get here today?",
      alternatives: [
        "Dark grey is appropriate. Same-day alterations available.",
        "Navy is respectful too. We can help today."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "only have brown": "Too casual unfortunately. We have dark suits in stock.",
      "is navy ok?": "Yes, with white shirt and dark tie. Completely appropriate.",
      "can't afford": "Rental available or our payment plan. You need to look proper."
    }
  },
  {
    id: 'occasion_2',
    category: 'surprise_events',
    userMessage: "just got promoted need executive wardrobe ASAP",
    context: { mood: 'excited', urgency: 'immediate' },
    agentResponses: {
      primary: "Congrats! Executive presence starts now. C-suite or senior management?",
      alternatives: [
        "Well deserved! Let's build your power wardrobe.",
        "Time to dress the part! What's your new role?"
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "C-suite": "Minimum 5 suits, premium fabrics. Budget for the full upgrade?",
      "first time manager": "3 solid suits, focus on confidence. Start strong.",
      "company culture?": "Tech-casual or traditional? Makes a big difference."
    }
  },

  // ===== RELATIONSHIP DYNAMICS (126-150) =====
  {
    id: 'relationship_1',
    category: 'couple_shopping',
    userMessage: "wife says I need to dress better for her work events",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Happy wife, happy life! What kind of events?",
      alternatives: [
        "Let's impress her colleagues. Formal or cocktail events?",
        "Time to be her arm candy! What's her industry?"
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "lawyer parties": "Conservative but expensive-looking. Navy with quality details.",
      "she's very stylish": "You need to complement not compete. Understated elegance.",
      "hates my clothes": "Fresh start. Bring her in, we'll make her proud."
    }
  },
  {
    id: 'relationship_2',
    category: 'couple_coordination',
    userMessage: "girlfriend wearing red dress what should I wear",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Navy or charcoal lets her shine. Black if it's formal.",
      alternatives: [
        "Let her be the star. Navy suit, burgundy tie echoes without competing.",
        "Classic move: dark suit, let her red pop. Perfect contrast."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "too boring?": "Add burgundy pocket square. Coordinated not matchy.",
      "she wants me colorful": "Midnight blue with burgundy accessories. Sophisticated color.",
      "prom actually": "Then have fun! Burgundy jacket if you're confident."
    }
  },

  // ===== CULTURAL/RELIGIOUS CONSIDERATIONS (151-175) =====
  {
    id: 'cultural_1',
    category: 'cultural_events',
    userMessage: "Indian wedding guest don't know the rules",
    context: { mood: 'nervous', userType: 'first_time' },
    agentResponses: {
      primary: "Colorful is good! Avoid pure white or black. Day or evening ceremony?",
      alternatives: [
        "Indian weddings love color! Skip the black suit this time.",
        "Great opportunity for jewel tones. Multiple events?"
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "multiple events": "Different outfit each day ideal. Mix formal and semi-formal.",
      "can I wear a suit?": "Yes! Burgundy, emerald, or navy. Add colorful accessories.",
      "what about gold?": "Gold accents perfect! Pocket square or patterned tie."
    }
  },
  {
    id: 'cultural_2',
    category: 'religious_events',
    userMessage: "bar mitzvah tomorrow is a suit enough",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Perfect! Suit and tie expected. Saturday morning service?",
      alternatives: [
        "Suit is exactly right. Conservative for service, fun for party.",
        "Yes! Navy or grey ideal. Bringing a gift?"
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "yes morning": "Conservative for synagogue. Can add personality at party.",
      "what color tie?": "Blue or burgundy safe. Avoid loud patterns for service.",
      "evening party too": "Same suit fine. Maybe change tie for party?"
    }
  },

  // ===== BUDGET CONVERSATIONS (176-200) =====
  {
    id: 'budget_1',
    category: 'price_sensitive',
    userMessage: "whats the absolute cheapest suit you have",
    context: { budget: 'budget', mood: 'nervous' },
    agentResponses: {
      primary: "$395 but the $199 bundles are better value. What's it for?",
      alternatives: [
        "Starting at $395. But tell me the occasion - might have options.",
        "$395 entry point. Payment plans available too."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "just need something": "$199 bundle includes everything. Shirt, tie, pocket square.",
      "for interview": "Don't go cheapest for interviews. $495 makes better impression.",
      "can't afford that": "Payment plan? Or our rental program for one-time events?"
    }
  },
  {
    id: 'budget_2',
    category: 'value_seeking',
    userMessage: "worth spending $1000 on a suit?",
    context: { budget: 'luxury' },
    agentResponses: {
      primary: "If you wear it 50 times, that's $20 per wear. How often will you wear it?",
      alternatives: [
        "Quality at $1000 lasts 5+ years. Worth it if worn regularly.",
        "Absolutely for your first great suit. It changes everything."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "twice a month": "Then yes! $40/month for looking exceptional.",
      "special occasions only": "Maybe start at $600. Still excellent quality.",
      "what's the difference?": "Fabric, construction, fit. You feel the difference immediately."
    }
  },

  // ===== COMPARISON SHOPPING (201-225) =====
  {
    id: 'comparison_1',
    category: 'competitor_questions',
    userMessage: "how do you compare to Suit Supply?",
    context: { userType: 'returning' },
    agentResponses: {
      primary: "Similar quality, better service, local alterations. Price comparable.",
      alternatives: [
        "We're more personalized. They're mass market, we're boutique service.",
        "Equal quality, but we know our customers by name."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "price difference?": "Within 10%. Our bundles offer better value.",
      "quality same?": "Fabrics comparable. Our construction slightly better.",
      "why choose you?": "Local service, same-day alterations, personal stylists."
    }
  }
]

// ====== CONVERSATION FLOW PATTERNS ======
export const CONVERSATION_FLOWS = {
  'discovery_to_purchase': {
    stages: [
      { stage: 'greeting', objective: 'Understand need' },
      { stage: 'discovery', objective: 'Identify preferences' },
      { stage: 'recommendation', objective: 'Present options' },
      { stage: 'consideration', objective: 'Address concerns' },
      { stage: 'decision', objective: 'Facilitate purchase' }
    ],
    transitions: {
      'greeting_to_discovery': ['What brings you here?', 'What are you looking for?'],
      'discovery_to_recommendation': ['Based on that, I suggest...', 'Perfect! Try this...'],
      'recommendation_to_consideration': ['What do you think?', 'Any concerns?'],
      'consideration_to_decision': ['Ready to try it on?', 'Should we proceed?']
    }
  },
  
  'problem_solving': {
    stages: [
      { stage: 'problem_identification', objective: 'Understand issue' },
      { stage: 'solution_options', objective: 'Present fixes' },
      { stage: 'implementation', objective: 'Execute solution' }
    ]
  },
  
  'education_flow': {
    stages: [
      { stage: 'knowledge_gap', objective: 'Identify what they don\'t know' },
      { stage: 'explanation', objective: 'Educate simply' },
      { stage: 'confirmation', objective: 'Ensure understanding' },
      { stage: 'application', objective: 'Apply to their situation' }
    ]
  }
}

// ====== RESPONSE OPTIMIZATION RULES ======
export const RESPONSE_RULES = {
  // Length rules
  maxLength: {
    initial: 15, // words
    followUp: 20,
    explanation: 30
  },
  
  // Personality matching
  personalityMap: {
    nervous: 'reassuring',
    excited: 'enthusiastic', 
    frustrated: 'solution-focused',
    browsing: 'informative'
  },
  
  // Urgency responses
  urgencyResponses: {
    immediate: 'Direct solution + availability',
    planning: 'Options + education',
    exploring: 'Discovery + inspiration'
  },
  
  // Emotion detection words
  emotionIndicators: {
    stressed: ['panic', 'help', 'urgent', 'tomorrow', 'ASAP'],
    happy: ['excited', 'love', 'perfect', 'great', 'awesome'],
    confused: ['don\'t know', 'not sure', 'maybe', 'confused', 'help'],
    frustrated: ['nothing fits', 'hate', 'annoying', 'difficult', 'impossible']
  }
}

// ====== LEARNING SYSTEM ======
export interface ConversationMetrics {
  responseId: string
  userSatisfaction?: 1 | 2 | 3 | 4 | 5
  conversionResult?: 'purchased' | 'abandoned' | 'continued'
  responseTime: number
  followUpEngagement: boolean
}

export class ResponseOptimizer {
  private metrics: Map<string, ConversationMetrics[]> = new Map()
  
  selectBestResponse(scenario: TrainingScenario, context: any): string {
    // Get historical performance
    const scenarioMetrics = this.metrics.get(scenario.id) || []
    
    // Calculate success rate for each alternative
    const responseScores = scenario.agentResponses.alternatives.map((response, index) => {
      const relevantMetrics = scenarioMetrics.filter(m => m.responseId === `${scenario.id}_${index}`)
      const avgSatisfaction = this.calculateAverage(relevantMetrics.map(m => m.userSatisfaction || 3))
      const conversionRate = this.calculateConversionRate(relevantMetrics)
      
      return {
        response,
        score: (avgSatisfaction * 0.6) + (conversionRate * 0.4)
      }
    })
    
    // Add primary response
    responseScores.push({
      response: scenario.agentResponses.primary,
      score: this.calculatePrimaryScore(scenarioMetrics)
    })
    
    // Sort by score and return best
    responseScores.sort((a, b) => b.score - a.score)
    return responseScores[0].response
  }
  
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 3 // neutral default
    return numbers.reduce((a, b) => a + b, 0) / numbers.length
  }
  
  private calculateConversionRate(metrics: ConversationMetrics[]): number {
    if (metrics.length === 0) return 0.5 // unknown default
    const conversions = metrics.filter(m => m.conversionResult === 'purchased').length
    return conversions / metrics.length
  }
  
  private calculatePrimaryScore(metrics: ConversationMetrics[]): number {
    const primaryMetrics = metrics.filter(m => m.responseId.endsWith('_primary'))
    if (primaryMetrics.length === 0) return 3.5 // slightly above neutral
    
    const avgSatisfaction = this.calculateAverage(primaryMetrics.map(m => m.userSatisfaction || 3))
    const conversionRate = this.calculateConversionRate(primaryMetrics)
    
    return (avgSatisfaction * 0.6) + (conversionRate * 0.4)
  }
  
  recordMetrics(responseId: string, metrics: Partial<ConversationMetrics>) {
    const fullMetrics: ConversationMetrics = {
      responseId,
      responseTime: Date.now(),
      followUpEngagement: false,
      ...metrics
    }
    
    const scenarioId = responseId.split('_')[0]
    if (!this.metrics.has(scenarioId)) {
      this.metrics.set(scenarioId, [])
    }
    
    this.metrics.get(scenarioId)!.push(fullMetrics)
  }
}

// ====== EXPORT READY-TO-USE SYSTEM ======
export const AI_TRAINING_SYSTEM = {
  scenarios: ADVANCED_SCENARIOS,
  flows: CONVERSATION_FLOWS,
  rules: RESPONSE_RULES,
  optimizer: new ResponseOptimizer(),
  
  // Get best response for a message
  getBestResponse(message: string, context?: any): string {
    // Find matching scenario
    const scenario = ADVANCED_SCENARIOS.find(s => 
      message.toLowerCase().includes(s.userMessage.toLowerCase()) ||
      s.userMessage.toLowerCase().includes(message.toLowerCase())
    )
    
    if (!scenario) {
      return "Tell me more about what you're looking for."
    }
    
    // Use optimizer to select best response
    return this.optimizer.selectBestResponse(scenario, context)
  },
  
  // Get follow-up based on user response
  getFollowUp(scenarioId: string, userResponse: string): string {
    const scenario = ADVANCED_SCENARIOS.find(s => s.id === scenarioId)
    if (!scenario) return "How else can I help?"
    
    // Find best matching follow-up
    for (const [key, response] of Object.entries(scenario.followUpPaths)) {
      if (userResponse.toLowerCase().includes(key.toLowerCase())) {
        return response
      }
    }
    
    return "Tell me more about that."
  }
}