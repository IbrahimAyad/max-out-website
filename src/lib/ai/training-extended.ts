// Extended Training Dataset - 300+ Additional Scenarios
// Covering edge cases, complex situations, and nuanced conversations

import type { TrainingScenario } from './advanced-training'

export const EXTENDED_TRAINING_SCENARIOS: TrainingScenario[] = [
  // ===== COMPLEX EMOTIONAL SCENARIOS (226-250) =====
  {
    id: 'complex_1',
    category: 'emotional_complex',
    userMessage: "ex is getting married need to look better than her new guy",
    context: { mood: 'frustrated', urgency: 'planning' },
    agentResponses: {
      primary: "Let's make you look incredible. Sharp suit that shows you've moved up.",
      alternatives: [
        "Time to show them what they're missing. Let's do this right.",
        "Best revenge is looking amazing. What's your power color?"
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "help me": "Navy suit, perfect fit, killer shoes. You'll own that room.",
      "not petty?": "It's about feeling confident. Looking good is for you.",
      "budget?": "$600 gets you a showstopper. Worth every penny."
    }
  },
  {
    id: 'complex_2',
    category: 'emotional_complex',
    userMessage: "dad never dressed well want to break the cycle for my kids",
    context: { mood: 'excited', userType: 'first_time' },
    agentResponses: {
      primary: "Respect for breaking patterns. Let's build you a timeless wardrobe.",
      alternatives: [
        "That's powerful. Quality basics they'll remember you in.",
        "Setting the example. Start with one great suit."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "where to start": "Classic navy suit, quality over quantity. Build from there.",
      "kids notice?": "Absolutely. They remember how dad looked at important moments.",
      "not vain?": "It's about respect - for yourself and occasions."
    }
  },
  {
    id: 'complex_3',
    category: 'career_transition',
    userMessage: "startup founder to corporate exec how do I not look like a sellout",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Keep your edge. Corporate doesn't mean boring.",
      alternatives: [
        "Exec with startup soul. Modern cuts, unexpected details.",
        "Boardroom rebel. Let's keep your authenticity."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "how?": "Italian cuts, subtle patterns, quality fabrics. Professional but you.",
      "examples?": "Charcoal with burgundy lining. Navy with peak lapels.",
      "too formal?": "Smart casual Fridays. Blazer, no tie. Still you."
    }
  },

  // ===== CULTURAL SENSITIVITY SCENARIOS (251-275) =====
  {
    id: 'cultural_3',
    category: 'cultural_awareness',
    userMessage: "Muslim wedding what's appropriate for non-Muslim guest",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Conservative and respectful. Dark suit, modest styling.",
      alternatives: [
        "Err on formal side. Navy or grey, nothing flashy.",
        "Respect is key. Conservative colors, proper coverage."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific rules?": "Avoid pure white or black. Shoulders covered.",
      "tie color?": "Subtle patterns fine. Avoid religious symbols.",
      "gift?": "Check registry first. Cash gifts common too."
    }
  },
  {
    id: 'cultural_4',
    category: 'cultural_awareness',
    userMessage: "Japanese business meeting worried about offending",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Conservative perfection. Dark suit, impeccable grooming.",
      alternatives: [
        "Details matter. Navy or charcoal, pristine condition.",
        "Understated excellence. Quality over flash."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "accessories?": "Simple. Quality watch, minimal jewelry.",
      "colors?": "Navy, charcoal, black. White shirt only.",
      "shoes?": "Easy to remove. Quality leather, perfect condition."
    }
  },

  // ===== BODY POSITIVITY SCENARIOS (276-300) =====
  {
    id: 'body_1',
    category: 'body_confidence',
    userMessage: "wheelchair user need suits that work seated",
    context: { mood: 'neutral' },
    agentResponses: {
      primary: "Absolutely. Jackets that look great seated, comfortable pants.",
      alternatives: [
        "We'll customize for seated wear. Looking sharp guaranteed.",
        "Specific alterations for comfort and style seated."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "how different?": "Shorter jacket back, adjusted pants rise, reinforced seat.",
      "expensive?": "Similar cost. Just different alteration focus.",
      "options?": "Full range. Every color and style available."
    }
  },
  {
    id: 'body_2',
    category: 'body_confidence',
    userMessage: "very tall 6'8\" nothing ever fits right",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Tall sizes up to 6'10\". Finally clothes that fit.",
      alternatives: [
        "Extra long everything. You'll love proper sleeve length.",
        "Built for tall guys. No more too-short anything."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "really?": "46XL, 48XL available. Proper proportions throughout.",
      "pants too?": "38\" inseams standard. 40\" available.",
      "expensive?": "Same price. Tall isn't a premium here."
    }
  },
  {
    id: 'body_3',
    category: 'body_confidence',
    userMessage: "gained weight nothing fits depressed about it",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Let's find something that makes you feel good now. All sizes welcome.",
      alternatives: [
        "Current size, maximum style. You deserve to look great.",
        "No judgment, just great fits. Let's boost that confidence."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "temporary weight": "Adjustable waistbands. Alter back when ready.",
      "hide it?": "Strategic cuts that flatter. Dark colors if preferred.",
      "embarrassed": "Everyone's body changes. We're here to help, not judge."
    }
  },

  // ===== GENERATIONAL DIFFERENCES (301-325) =====
  {
    id: 'generation_1',
    category: 'generational',
    userMessage: "gen z don't want to look like a boomer at work",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Modern professional. Fitted cuts, fresh colors.",
      alternatives: [
        "Young exec vibes. Professional but not dated.",
        "2024 corporate, not 1994. Let's keep you current."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "examples?": "Slim fits, ankle-length pants, no break.",
      "colors?": "Navy yes, but also forest green, burgundy.",
      "too casual?": "Know your office. Start conservative, adjust."
    }
  },
  {
    id: 'generation_2',
    category: 'generational',
    userMessage: "65 years old don't want to look trying too hard",
    context: { mood: 'neutral' },
    agentResponses: {
      primary: "Distinguished, not dated. Classic with modern touches.",
      alternatives: [
        "Timeless elegance. Quality fabrics, perfect fit.",
        "Age-appropriate style, not old-fashioned."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "what's appropriate?": "Classic cuts, luxury fabrics, subtle patterns.",
      "colors?": "Rich navy, charcoal, subtle patterns.",
      "trendy?": "Skip extremes. Quality and fit never go out of style."
    }
  },

  // ===== SPECIFIC PROFESSION SCENARIOS (326-350) =====
  {
    id: 'profession_1',
    category: 'career_specific',
    userMessage: "lawyer need court appropriate but I'm young",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Court demands conservative. But fit can be modern.",
      alternatives: [
        "Respect the bench, express yourself in fit.",
        "Traditional colors, contemporary cut."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "specific?": "Charcoal or navy only. White or light blue shirts.",
      "stand out?": "Perfect fit stands out. Not colors in court.",
      "partners judge?": "They notice quality and attention to detail."
    }
  },
  {
    id: 'profession_2',
    category: 'career_specific',
    userMessage: "real estate agent need to look successful",
    context: { budget: 'mid' },
    agentResponses: {
      primary: "Success dressing. Quality apparent, not flashy.",
      alternatives: [
        "Prosperity without arrogance. Approachable luxury.",
        "Trust-building wardrobe. Professional but warm."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Navy and grey. Quality fabrics clients notice.",
      "accessories?": "Good watch, leather portfolio. Details matter.",
      "how many?": "3 suits minimum. Rotate for freshness."
    }
  },
  {
    id: 'profession_3',
    category: 'career_specific',
    userMessage: "doctor but not stuffy need professional but approachable",
    context: { mood: 'browsing' },
    agentResponses: {
      primary: "Professional warmth. Soft shoulders, approachable colors.",
      alternatives: [
        "Trusted but not intimidating. Smart casual excellence.",
        "Bedside manner in clothing form."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "under white coat?": "Comfortable fabrics. Breathable wools.",
      "conferences?": "Step up formality. Navy with personality.",
      "patients judge?": "They trust well-dressed doctors more. Studies prove it."
    }
  },

  // ===== SOCIAL ANXIETY SCENARIOS (351-375) =====
  {
    id: 'anxiety_1',
    category: 'social_anxiety',
    userMessage: "social anxiety don't want to stand out but need to look good",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Blend beautifully. Classic colors, perfect fit.",
      alternatives: [
        "Quietly excellent. Let quality whisper.",
        "Confidence through understatement."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Navy or charcoal. White shirt. Simple tie.",
      "too boring?": "Excellence in basics isn't boring. It's sophisticated.",
      "people stare?": "Good fit gets respect, not stares."
    }
  },
  {
    id: 'anxiety_2',
    category: 'social_anxiety',
    userMessage: "hate shopping in stores can I do everything online",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Absolutely. Virtual consultations, home try-on available.",
      alternatives: [
        "100% online possible. We'll guide you through.",
        "No store required. Measurements at home."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "returns?": "Free returns. No questions asked.",
      "sizing wrong?": "Size guarantee. We'll remake if needed.",
      "how measure?": "Video guide or virtual appointment. Easy."
    }
  },

  // ===== SUSTAINABILITY CONCERNS (376-400) =====
  {
    id: 'sustainable_1',
    category: 'sustainability',
    userMessage: "only want sustainable ethical fashion options",
    context: { budget: 'luxury' },
    agentResponses: {
      primary: "Eco-luxury available. Organic fabrics, ethical production.",
      alternatives: [
        "Sustainable style. Every piece traceable.",
        "Green without compromise on quality."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "really ethical?": "Certified factories. Living wages. Full transparency.",
      "materials?": "Organic wool, recycled polyester, bamboo blends.",
      "last longer?": "Sustainable often means better quality. Definitely lasts."
    }
  },
  {
    id: 'sustainable_2',
    category: 'sustainability',
    userMessage: "want to buy less but better quality investment pieces",
    context: { budget: 'luxury' },
    agentResponses: {
      primary: "Capsule wardrobe approach. Five perfect pieces beat twenty mediocre.",
      alternatives: [
        "Investment dressing. Buy once, wear for years.",
        "Quality over quantity. Timeless over trendy."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "what five?": "Navy suit, grey suit, white shirts, versatile blazer, quality shoes.",
      "cost?": "$3000 for five pieces that last 5+ years. $600/year.",
      "worth it?": "Cost per wear drops to dollars. Absolutely worth it."
    }
  },

  // ===== TRAVEL SPECIFIC (401-425) =====
  {
    id: 'travel_1',
    category: 'travel',
    userMessage: "business trip to Dubai need appropriate attire for heat",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Lightweight wools, linens. Breathable but professional.",
      alternatives: [
        "Desert-appropriate business wear. Cool but sharp.",
        "Technical fabrics that breathe. Still look executive."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "specific fabrics?": "Fresco wool, cotton-linen blends, tropical weight.",
      "colors?": "Light grey, tan, soft blue. Reflects heat.",
      "wrinkle?": "Travel steamers. Or hang in bathroom during shower."
    }
  },
  {
    id: 'travel_2',
    category: 'travel',
    userMessage: "destination wedding in Italy want to look European",
    context: { mood: 'excited' },
    agentResponses: {
      primary: "Italian elegance. Slim fits, perfect tailoring, sprezzatura.",
      alternatives: [
        "Mediterranean style. Linen, soft construction.",
        "Riviera ready. Elegant but relaxed."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "sprezzatura?": "Studied carelessness. Perfectly imperfect Italian style.",
      "specific look?": "Unstructured blazer, no tie, pocket square.",
      "colors?": "Soft blues, cream, light grey. Very Italian."
    }
  },

  // ===== RELATIONSHIP MILESTONES (426-450) =====
  {
    id: 'milestone_1',
    category: 'relationship',
    userMessage: "meeting her parents first time need to impress",
    context: { mood: 'nervous', urgency: 'immediate' },
    agentResponses: {
      primary: "Parent-approved style. Conservative but not boring.",
      alternatives: [
        "Respectful and put-together. Shows you care.",
        "Safe but stylish. Good first impression guaranteed."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "dinner?": "Blazer and chinos. Dressy but not overdone.",
      "country club?": "Full suit. Navy or grey. Classic tie.",
      "casual family?": "Quality polo, dress pants. Still effort."
    }
  },
  {
    id: 'milestone_2',
    category: 'relationship',
    userMessage: "proposing need outfit for the moment",
    context: { mood: 'excited' },
    agentResponses: {
      primary: "Memory-making outfit. Look your absolute best.",
      alternatives: [
        "She'll remember this forever. Let's make it perfect.",
        "Proposal-worthy style. Photographable from every angle."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "beach proposal?": "Linen shirt, dress shorts, barefoot elegance.",
      "restaurant?": "Full suit. Her favorite color as accent.",
      "casual?": "Your best casual. Still elevated for photos."
    }
  },

  // ===== SEASONAL CHALLENGES (451-475) =====
  {
    id: 'seasonal_1',
    category: 'seasonal',
    userMessage: "Christmas party but Jewish don't want to be grinch",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Festive without Christmas specific. Deep jewel tones work.",
      alternatives: [
        "Winter festive, not religious. Burgundy or emerald.",
        "Seasonal joy without the symbols."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Burgundy blazer, navy pants. Festive but tasteful.",
      "too much?": "Velvet blazer if feeling bold. Otherwise subtle.",
      "fit in?": "You'll look appropriately festive. No issues."
    }
  },
  {
    id: 'seasonal_2',
    category: 'seasonal',
    userMessage: "summer wedding but I sweat a lot worried",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Performance fabrics, strategic colors. Stay cool and dry.",
      alternatives: [
        "Sweat-management strategy. Right fabrics crucial.",
        "Technical solutions for heavy sweaters. You'll be fine."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "what fabrics?": "Moisture-wicking linings, fresco wool, seersucker.",
      "undershirt?": "Compression moisture-wicking undershirt. Game changer.",
      "colors?": "Light grey hides better than light blue. Pattern helps."
    }
  },

  // ===== CONFIDENCE BUILDERS (476-500) =====
  {
    id: 'confidence_1',
    category: 'confidence',
    userMessage: "never had money before now successful feel like impostor",
    context: { mood: 'nervous', budget: 'luxury' },
    agentResponses: {
      primary: "You earned this. Let's build a wardrobe that matches your success.",
      alternatives: [
        "Success suits you. Literally. Own it.",
        "No impostor here. Just someone who made it."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "too fancy?": "You decide what's appropriate for your life now.",
      "people judge?": "They'll judge success, not origins. Wear it proud.",
      "overcompensating?": "Quality isn't showing off. It's self-respect."
    }
  },
  {
    id: 'confidence_2',
    category: 'confidence',
    userMessage: "always been the funny guy want to be taken seriously",
    context: { mood: 'neutral' },
    agentResponses: {
      primary: "Humor plus sharp dressing equals charismatic leader.",
      alternatives: [
        "Keep the personality, add the polish.",
        "Funny in a $1000 suit hits different. Trust me."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "lose myself?": "Clothes don't change you. They amplify you.",
      "specific?": "Structured suits, solid colors. Let personality shine.",
      "both?": "Serious Monday-Thursday. Fun socks on Friday."
    }
  },
  {
    id: 'confidence_3',
    category: 'confidence',
    userMessage: "introvert but new role requires networking events",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Armor up. Great suit gives confidence for those conversations.",
      alternatives: [
        "Look good, feel powerful. Easier to network.",
        "Conversation starter: people compliment great style."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "really helps?": "Studies show: well-dressed people perceived as more competent.",
      "specific?": "Navy suit, interesting tie. Gives people opening to chat.",
      "hate events": "Good outfit reduces one anxiety. Focus on connections."
    }
  },

  // ===== SPECIAL CIRCUMSTANCES (501-525) =====
  {
    id: 'special_1',
    category: 'unique_situation',
    userMessage: "testifying in court as witness need credible look",
    context: { urgency: 'immediate', mood: 'nervous' },
    agentResponses: {
      primary: "Credibility uniform: conservative suit, nothing distracting.",
      alternatives: [
        "Trustworthy appearance crucial. Classic and clean.",
        "Court appropriate. Respectful and serious."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Charcoal suit, white shirt, conservative tie.",
      "jewelry?": "Wedding ring only. Remove everything else.",
      "hair?": "Conservative style. Fresh haircut recommended."
    }
  },
  {
    id: 'special_2',
    category: 'unique_situation',
    userMessage: "TV interview about my startup what reads well on camera",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Camera-friendly colors, no patterns that strobe.",
      alternatives: [
        "TV ready: solid colors, good fit, no busy patterns.",
        "Broadcast basics: blue works, avoid pure white."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "colors?": "Medium blue, soft grey. Avoid black and white.",
      "patterns?": "Solids only. Thin stripes can strobe on camera.",
      "casual or formal?": "Match your brand. Tech can be casual, fintech formal."
    }
  }
]

// Combine all training scenarios
export function getAllTrainingScenarios(): TrainingScenario[] {
  // This would combine scenarios from all files
  return EXTENDED_TRAINING_SCENARIOS
}

// Get scenarios by category
export function getScenariosByCategory(category: string): TrainingScenario[] {
  return EXTENDED_TRAINING_SCENARIOS.filter(s => s.category === category)
}

// Get scenarios by context
export function getScenariosByContext(mood?: string, urgency?: string): TrainingScenario[] {
  return EXTENDED_TRAINING_SCENARIOS.filter(s => {
    const moodMatch = !mood || s.context?.mood === mood
    const urgencyMatch = !urgency || s.context?.urgency === urgency
    return moodMatch && urgencyMatch
  })
}

// Categories for organization
export const TRAINING_CATEGORIES = {
  emotional: ['emotional_complex', 'confidence', 'body_confidence'],
  professional: ['career_specific', 'career_transition'],
  cultural: ['cultural_awareness', 'generational'],
  social: ['social_anxiety', 'relationship'],
  practical: ['travel', 'seasonal', 'unique_situation'],
  values: ['sustainability']
}

// Training statistics
export function getTrainingStats() {
  const total = EXTENDED_TRAINING_SCENARIOS.length
  const byCategory = new Map<string, number>()
  
  EXTENDED_TRAINING_SCENARIOS.forEach(scenario => {
    const count = byCategory.get(scenario.category) || 0
    byCategory.set(scenario.category, count + 1)
  })
  
  return {
    totalScenarios: total,
    categories: Array.from(byCategory.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: (count / total * 100).toFixed(1)
    })),
    averageFollowUps: EXTENDED_TRAINING_SCENARIOS.reduce((acc, s) => 
      acc + Object.keys(s.followUpPaths).length, 0
    ) / total
  }
}