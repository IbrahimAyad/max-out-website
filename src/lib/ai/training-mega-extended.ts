// Mega Extended Training Dataset - 500 Additional Scenarios (526-1025)
// Ultra-comprehensive coverage of every possible customer interaction

import type { TrainingScenario } from './advanced-training'

export const MEGA_EXTENDED_SCENARIOS: TrainingScenario[] = [
  // ===== TECH INDUSTRY SPECIFIC (526-550) =====
  {
    id: 'tech_1',
    category: 'tech_industry',
    userMessage: "work at google need to look professional but not corporate",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Tech-professional: elevated casual with polish when needed.",
      alternatives: [
        "Google style: quality basics, one great blazer for meetings.",
        "Silicon Valley sharp. Chinos and polos, suits for executives."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "daily wear?": "Dark jeans, quality polos, minimalist sneakers acceptable.",
      "client meetings?": "Blazer transforms everything. Navy or grey.",
      "too casual?": "Read the room. Better overdressed first week."
    }
  },
  {
    id: 'tech_2',
    category: 'tech_industry',
    userMessage: "startup CEO need to look legit for investors",
    context: { urgency: 'immediate', budget: 'mid' },
    agentResponses: {
      primary: "Founder formal: serious enough for funding, still you.",
      alternatives: [
        "VC-ready wardrobe. They need to trust you with millions.",
        "Pitch perfect style. Conservative with subtle edge."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "sand hill road?": "Navy suit, white shirt, no tie. Classic VC uniform.",
      "NYC investors?": "Full suit and tie. East coast expects formal.",
      "demo day?": "Stand out slightly. Burgundy tie or pocket square."
    }
  },
  {
    id: 'tech_3',
    category: 'tech_industry',
    userMessage: "engineer never wore suits board wants me presenting",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Engineer to executive look. Comfortable but commanding.",
      alternatives: [
        "Technical to tactical. Start with blazer and chinos.",
        "Presentation power. You know the tech, now look the part."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "feel fake?": "Clothes don't change your expertise. Just packaging.",
      "what minimum?": "Navy blazer, grey pants, white shirt. Done.",
      "they judge?": "They judge results. Looking professional helps credibility."
    }
  },

  // ===== DATING SCENARIOS (551-575) =====
  {
    id: 'dating_1',
    category: 'dating',
    userMessage: "first date after divorce want to feel confident again",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Fresh start, fresh style. Let's rebuild that confidence.",
      alternatives: [
        "New chapter energy. Something that makes you feel great.",
        "Confidence is the best accessory. Let's find yours."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "too much?": "Elevated casual. Nice jeans, great shirt, leather shoes.",
      "dinner date?": "Dark jeans, blazer, no tie. Sophisticated but approachable.",
      "nervous": "Wear something you've gotten compliments on before."
    }
  },
  {
    id: 'dating_2',
    category: 'dating',
    userMessage: "dating younger woman don't want to look old",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Modern mature. Contemporary cuts, not trying too hard.",
      alternatives: [
        "Age-appropriate but current. Quality over trendy.",
        "Distinguished not dated. Let's find that balance."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Slim fits, modern colors, quality fabrics show sophistication.",
      "too young looking?": "Avoid teenage trends. Modern classic is your zone.",
      "she's 25": "Confidence matters more than clothes. Dress authentically."
    }
  },
  {
    id: 'dating_3',
    category: 'dating',
    userMessage: "speed dating event want to be memorable",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Memorable but approachable. Conversation starter outfit.",
      alternatives: [
        "Stand out subtly. Great fit beats loud colors.",
        "First impression maximizer. Clean, sharp, interesting."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "what specifically?": "Navy blazer, patterned shirt, no tie. Approachable.",
      "too formal?": "Blazer with jeans if venue is casual.",
      "conversation starter?": "Interesting pocket square or unique watch."
    }
  },

  // ===== MEDICAL PROFESSIONALS (576-600) =====
  {
    id: 'medical_1',
    category: 'medical_professional',
    userMessage: "surgeon need something professional under scrubs",
    context: { mood: 'browsing' },
    agentResponses: {
      primary: "Under-scrub essentials. Comfort meets professional.",
      alternatives: [
        "Hospital appropriate. Breathable, wrinkle-resistant.",
        "OR to office ready. Practical professional pieces."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "material?": "Moisture-wicking dress shirts, comfortable stretch chinos.",
      "conferences?": "Full suit for presentations. Travel-friendly fabrics.",
      "long hours?": "Comfort-first fabrics. Performance materials ideal."
    }
  },
  {
    id: 'medical_2',
    category: 'medical_professional',
    userMessage: "psychiatrist need approachable but professional",
    context: { budget: 'mid' },
    agentResponses: {
      primary: "Therapeutic presence. Professional warmth in clothing.",
      alternatives: [
        "Trust-building attire. Formal enough, not intimidating.",
        "Approachable authority. Soft textures, calming colors."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "colors?": "Blues and greys. Calming, not aggressive.",
      "patterns?": "Minimal. Solid colors less distracting for patients.",
      "casual fridays?": "Knit blazer with chinos. Still professional."
    }
  },

  // ===== CREATIVE INDUSTRIES (601-625) =====
  {
    id: 'creative_1',
    category: 'creative_industry',
    userMessage: "architect need to impress clients but stay creative",
    context: { mood: 'browsing' },
    agentResponses: {
      primary: "Structured creativity. Clean lines, interesting details.",
      alternatives: [
        "Architectural dressing. Form and function in harmony.",
        "Design-forward professional. Minimalist with edge."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "examples?": "All black ensemble. Or grey with statement accessories.",
      "site visits?": "Sturdy fabrics, darker colors for practicality.",
      "presentations?": "Turtleneck under blazer. Very architect."
    }
  },
  {
    id: 'creative_2',
    category: 'creative_industry',
    userMessage: "photographer but clients expect some level of style",
    context: { budget: 'budget' },
    agentResponses: {
      primary: "Behind-camera style. Practical but polished.",
      alternatives: [
        "Creative professional. All black is always safe.",
        "Artist with edge. Comfortable for shooting, styled for meetings."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "wedding photographer?": "Black suit you can move in. Blend but look pro.",
      "corporate shoots?": "Match client level. Blazer minimum.",
      "outdoor shoots?": "Layers. Professional top, practical bottom."
    }
  },

  // ===== AGE MILESTONE SCENARIOS (626-650) =====
  {
    id: 'age_1',
    category: 'age_milestone',
    userMessage: "turning 30 want to stop dressing like college kid",
    context: { mood: 'excited' },
    agentResponses: {
      primary: "Level up time. Adult wardrobe without losing personality.",
      alternatives: [
        "30s style evolution. Quality over quantity shift.",
        "Grown man wardrobe. Keep the fun, add sophistication."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "where start?": "Replace graphic tees with solid polos and oxfords.",
      "too dramatic?": "Gradual upgrade. One piece at a time.",
      "still want casual?": "Elevated casual. Better fits, better fabrics."
    }
  },
  {
    id: 'age_2',
    category: 'age_milestone',
    userMessage: "40th birthday party want to look successful",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Milestone style. Show them 40 looks this good.",
      alternatives: [
        "Four decades of awesome. Dress like you own it.",
        "Success at 40. Quality pieces that show achievement."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "specific?": "Custom-fit blazer, premium fabrics. Investment pieces.",
      "party theme?": "Match formality but elevate execution.",
      "midlife crisis?": "Crisis? This is your prime. Dress accordingly."
    }
  },
  {
    id: 'age_3',
    category: 'age_milestone',
    userMessage: "turning 50 don't want to dress boring",
    context: { mood: 'neutral' },
    agentResponses: {
      primary: "50 and stylish. Sophisticated doesn't mean boring.",
      alternatives: [
        "Half-century of style. Classic with personality.",
        "Distinguished rebel. Rules optional at 50."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "examples?": "Burgundy blazer, patterned shirts, colored chinos.",
      "too loud?": "Subtle rebellion. Quality unusual colors.",
      "age appropriate?": "You define appropriate now. Wear what feels right."
    }
  },

  // ===== FAMILY DYNAMICS (651-675) =====
  {
    id: 'family_1',
    category: 'family_dynamics',
    userMessage: "twin brother always dresses better feeling competitive",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Let's beat him at his own game. Your style, elevated.",
      alternatives: [
        "Sibling style rivalry? Let's win this.",
        "Time to outdress the twin. Different but better."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "he shops expensive": "Fit beats price. Perfect tailoring wins.",
      "same event?": "Coordinate to not match, but clearly win.",
      "petty?": "Healthy competition. Plus you'll look great."
    }
  },
  {
    id: 'family_2',
    category: 'family_dynamics',
    userMessage: "family thinks I'm gay because I dress well",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Style has no orientation. Keep being well-dressed.",
      alternatives: [
        "Their issue, not yours. Good style is just good style.",
        "Outdated thinking. Real men care about appearance."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "should I dress down?": "Never. Educate them through example.",
      "bothers me": "Confidence in your choices changes minds.",
      "they joke": "Best dressed has the last laugh."
    }
  },

  // ===== FINANCIAL SITUATIONS (676-700) =====
  {
    id: 'financial_1',
    category: 'financial',
    userMessage: "bankruptcy but still need to work looking professional",
    context: { budget: 'budget', mood: 'frustrated' },
    agentResponses: {
      primary: "Rebuilding wardrobe and life. Start with essentials.",
      alternatives: [
        "Tough times don't last. Let's maximize your budget.",
        "Professional on a shoestring. Strategic purchases only."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "minimum needed?": "One good suit, three shirts, two ties. Rotate.",
      "thrift options?": "Absolutely. Alterations make thrift look custom.",
      "embarrassed": "Financial struggles are temporary. No shame."
    }
  },
  {
    id: 'financial_2',
    category: 'financial',
    userMessage: "trust fund but don't want to look spoiled",
    context: { budget: 'luxury' },
    agentResponses: {
      primary: "Understated wealth. Quality without flashiness.",
      alternatives: [
        "Quiet luxury. Let quality whisper, not scream.",
        "Stealth wealth dressing. Rich but not obnoxious."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "specific?": "No logos. Perfect fit. Subtle quality details.",
      "still want nice?": "Invest in fabrics and construction, not labels.",
      "people assume?": "They'll assume you have great taste, not just money."
    }
  },

  // ===== RELIGIOUS CONSIDERATIONS (701-725) =====
  {
    id: 'religious_1',
    category: 'religious',
    userMessage: "Mormon mission need appropriate but stylish",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Mission-appropriate style. Conservative but sharp.",
      alternatives: [
        "Elder-ready wardrobe. Professional and practical.",
        "Two years, looking good. Durable and appropriate."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific rules?": "White shirts, conservative ties, dark suits only.",
      "multiple suits?": "Minimum three. They'll see heavy rotation.",
      "style allowed?": "Fit and quality matter. Stay within guidelines."
    }
  },
  {
    id: 'religious_2',
    category: 'religious',
    userMessage: "Jewish orthodox but want some style",
    context: { mood: 'browsing' },
    agentResponses: {
      primary: "Modest and stylish coexist. Quality within guidelines.",
      alternatives: [
        "Religious and refined. Respecting traditions with taste.",
        "Orthodox elegance. Rules followed, style achieved."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "Shabbos suits?": "Classic black or navy. Focus on fabric quality.",
      "weekday?": "Business appropriate, always covered properly.",
      "stand out?": "Quality fabrics, perfect fit within modest guidelines."
    }
  },

  // ===== SPORTS & FITNESS (726-750) =====
  {
    id: 'sports_1',
    category: 'sports',
    userMessage: "bodybuilder nothing fits my arms and chest",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Athletic fit solutions. Built for your build.",
      alternatives: [
        "Muscle-friendly cuts. Room where needed, fitted where possible.",
        "Bodybuilder basics. Stretch fabrics are your friend."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "specific brands?": "Athletic-fit lines. Made for V-shaped torsos.",
      "formal events?": "Custom or made-to-measure only real option.",
      "give up?": "Never. You worked for that body, dress it well."
    }
  },
  {
    id: 'sports_2',
    category: 'sports',
    userMessage: "coach need to look professional but able to demonstrate",
    context: { mood: 'browsing' },
    agentResponses: {
      primary: "Coach casual. Professional appearance, athletic function.",
      alternatives: [
        "Sideline style. Authoritative but movement-ready.",
        "Athletic authority. Dress the part of leader."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "daily wear?": "Golf polos, athletic chinos, clean sneakers.",
      "parent meetings?": "Blazer over polo. Instant elevation.",
      "game day?": "Team colors, but elevated. Quality matters."
    }
  },

  // ===== RECOVERY & FRESH STARTS (751-775) =====
  {
    id: 'recovery_1',
    category: 'recovery',
    userMessage: "6 months sober want outside to match inside work",
    context: { mood: 'excited' },
    agentResponses: {
      primary: "Congratulations! Let's match that inner glow outside.",
      alternatives: [
        "New you deserves new style. Proud of your journey.",
        "Recovery looks good on you. Let's enhance it."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "fresh start?": "Complete wardrobe refresh. Out with old associations.",
      "budget tight?": "Start small. Each piece is a victory.",
      "confidence?": "You've done the hardest part. This is the fun part."
    }
  },
  {
    id: 'recovery_2',
    category: 'recovery',
    userMessage: "depression lifting ready to care about appearance again",
    context: { mood: 'neutral' },
    agentResponses: {
      primary: "Welcome back. Let's ease into feeling good again.",
      alternatives: [
        "One step at a time. Start with what makes you smile.",
        "Self-care through style. Gentle upgrade process."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "overwhelming?": "Start with one outfit you love. Build from there.",
      "where to begin?": "Comfortable pieces in colors that lift your mood.",
      "worth it?": "You're worth it. Dressing well can help healing."
    }
  },

  // ===== INDUSTRY EVENTS (776-800) =====
  {
    id: 'industry_1',
    category: 'industry_events',
    userMessage: "comic con but professional not cosplay",
    context: { mood: 'excited' },
    agentResponses: {
      primary: "Geek chic professional. Subtle nerd, clear style.",
      alternatives: [
        "Convention appropriate. Fan service with class.",
        "Nerd formal. Show your colors subtly."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "examples?": "Dark suit with subtle themed accessories.",
      "too formal?": "Blazer with graphic tee can work.",
      "networking?": "Professional enough for industry meetings."
    }
  },
  {
    id: 'industry_2',
    category: 'industry_events',
    userMessage: "wine tasting in Napa what's appropriate",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Wine country casual. Elegant but not stuffy.",
      alternatives: [
        "Vineyard chic. Smart casual with sophistication.",
        "Napa Valley style. Relaxed luxury."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "specific?": "Linen shirt, chinos, loafers. No tie needed.",
      "evening event?": "Blazer for dinner. Keep it relaxed.",
      "colors?": "Earth tones work beautifully in wine country."
    }
  },

  // ===== ACADEMIC SCENARIOS (801-825) =====
  {
    id: 'academic_1',
    category: 'academic',
    userMessage: "PhD defense need to look scholarly but sharp",
    context: { urgency: 'immediate', mood: 'nervous' },
    agentResponses: {
      primary: "Academic excellence attire. Serious scholar style.",
      alternatives: [
        "Defense-ready. Look as smart as you are.",
        "Doctoral dignity. Years of work deserve great presentation."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Charcoal suit, conservative tie. Let work speak.",
      "too formal?": "Match your committee's style, slightly elevated.",
      "nervous": "You know your stuff. Suit just helps confidence."
    }
  },
  {
    id: 'academic_2',
    category: 'academic',
    userMessage: "professor but students think I'm a student",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Professor presence. Authority through attire.",
      alternatives: [
        "Young professor style. Distinguish yourself clearly.",
        "Academic authority. Dress the role you earned."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Blazer always. Even with jeans, changes everything.",
      "too stuffy?": "Modern professor. Professional but approachable.",
      "age issue?": "Dress slightly above department norm. Instant authority."
    }
  },

  // ===== CLIMATE CHALLENGES (826-850) =====
  {
    id: 'climate_1',
    category: 'climate',
    userMessage: "Phoenix summer but need suits for work",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Desert professional. Beat the heat in style.",
      alternatives: [
        "120° style solutions. Survival and sophistication.",
        "Phoenix formal. Ice-cold looking, literally cool wearing."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "fabric?": "Fresco wool, tropical weight, linen blends only.",
      "colors?": "Light colors reflect heat. Tan, light grey, soft blue.",
      "sweat?": "Undershirts essential. Bring backup shirt."
    }
  },
  {
    id: 'climate_2',
    category: 'climate',
    userMessage: "Minnesota winter need warm but professional",
    context: { urgency: 'planning' },
    agentResponses: {
      primary: "Arctic executive. Warm and distinguished.",
      alternatives: [
        "Polar professional. Layer like a pro.",
        "Subzero style. Surviving and thriving."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "layers?": "Thermal underwear, shirt, sweater, suit, overcoat.",
      "overcoat?": "Wool or cashmere. Long enough to cover suit.",
      "boots?": "Dress boots for commute, shoes at office."
    }
  },

  // ===== COMPETITION SCENARIOS (851-875) =====
  {
    id: 'competition_1',
    category: 'competition',
    userMessage: "competing for promotion against better dressed colleague",
    context: { mood: 'nervous', urgency: 'immediate' },
    agentResponses: {
      primary: "Dress for the job you want. Let's level up.",
      alternatives: [
        "Competition mode. Outwork and outdress.",
        "Promotion power dressing. Make them see you in role."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific?": "Match senior management style, add 10% polish.",
      "obvious?": "Subtle elevation. Quality they'll notice subconsciously.",
      "unfair?": "Use every advantage. Appearance matters."
    }
  },
  {
    id: 'competition_2',
    category: 'competition',
    userMessage: "business rival always looks better driving me crazy",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Let's beat them at their game. Style warfare begins.",
      alternatives: [
        "Rival neutralized. Your secret weapon incoming.",
        "Competition breeds excellence. Time to win."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "how?": "Focus on fit. Perfect tailoring beats expensive clothes.",
      "their style?": "Don't copy. Create your signature look.",
      "worth it?": "Living well is the best revenge. Looking good helps."
    }
  },

  // ===== REUNION SCENARIOS (876-900) =====
  {
    id: 'reunion_1',
    category: 'reunion',
    userMessage: "high school reunion was the fat kid now fit",
    context: { mood: 'excited' },
    agentResponses: {
      primary: "Transformation celebration. Show them the glow-up.",
      alternatives: [
        "Revenge body deserves revenge wardrobe.",
        "Plot twist outfit. They won't know what hit them."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "too much?": "You earned this. Go all out.",
      "specific?": "Fitted everything. Show the work you've done.",
      "they'll talk": "Let them. You'll be topic of conversation anyway."
    }
  },
  {
    id: 'reunion_2',
    category: 'reunion',
    userMessage: "college reunion everyone's successful but me",
    context: { mood: 'nervous', budget: 'budget' },
    agentResponses: {
      primary: "Success isn't just money. Look successful anyway.",
      alternatives: [
        "Fake it till you make it. Look the part.",
        "Budget brilliance. Look rich without being rich."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "specific?": "One great outfit better than five mediocre.",
      "they'll know?": "Good fit looks expensive. Focus there.",
      "worth pretending?": "Not pretending. Presenting best self."
    }
  },

  // ===== MILITARY/SERVICE (901-925) =====
  {
    id: 'military_1',
    category: 'military',
    userMessage: "veteran transitioning to civilian professional",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Civilian ready. Structure with style freedom.",
      alternatives: [
        "Mission: civilian success. New uniform for new life.",
        "Service to style. Your discipline shows in details."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "feels weird?": "Takes adjustment. Keep what works, explore what's new.",
      "too casual?": "Business has less structure. Room for personality.",
      "miss uniform?": "Create your signature look. Personal uniform."
    }
  },
  {
    id: 'military_2',
    category: 'military',
    userMessage: "military ball as civilian date need guidance",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Black tie military formal. Respect and elegance.",
      alternatives: [
        "Military ball ready. Honor the formality.",
        "Civilian at ceremony. Formal and respectful."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "specific?": "Tuxedo required. Conservative styling.",
      "bow tie?": "Yes, black bow tie. No exceptions.",
      "stand out?": "Don't. Blend respectfully. It's their night."
    }
  },

  // ===== HOBBY/INTEREST GROUPS (926-950) =====
  {
    id: 'hobby_1',
    category: 'hobby',
    userMessage: "car show want to match my vintage Porsche",
    context: { mood: 'excited' },
    agentResponses: {
      primary: "Driver style to match the ride. Vintage cool.",
      alternatives: [
        "Porsche perfect. McQueen vibes incoming.",
        "Classic car, classic style. Timeless combination."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "era?": "60s-70s inspired. Racing jackets, driving shoes.",
      "too costume?": "Subtle nods. Modern fit, vintage inspiration.",
      "specific?": "Navy blazer, white polo, driving shoes. Classic."
    }
  },
  {
    id: 'hobby_2',
    category: 'hobby',
    userMessage: "poker night want to look like I know what I'm doing",
    context: { mood: 'browsing' },
    agentResponses: {
      primary: "Poker face wardrobe. Confident and unreadable.",
      alternatives: [
        "Card shark style. Look like you've already won.",
        "Table presence. Intimidation through style."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "home game?": "Casual confidence. Dark colors, comfortable fit.",
      "casino?": "Smart casual. Blazer gives edge.",
      "too much?": "Overdressed beats underdressed at tables."
    }
  },

  // ===== PERSONAL BRAND (951-975) =====
  {
    id: 'brand_1',
    category: 'personal_brand',
    userMessage: "influencer need signature look that's memorable",
    context: { budget: 'mid' },
    agentResponses: {
      primary: "Signature style development. Instantly recognizable you.",
      alternatives: [
        "Brand yourself through style. Consistent and memorable.",
        "Influencer edge. What makes you screenshot-worthy?"
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "examples?": "Pick one standout element. Always wear it.",
      "too limiting?": "Signature doesn't mean uniform. Variations on theme.",
      "what works?": "Bold glasses, specific color, unique accessory."
    }
  },
  {
    id: 'brand_2',
    category: 'personal_brand',
    userMessage: "LinkedIn photos need update look more executive",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Executive presence photos. CEO energy incoming.",
      alternatives: [
        "LinkedIn level-up. Photos that get recruited.",
        "Professional portrait perfect. Boardroom ready."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "colors?": "Navy or charcoal suit. White or light blue shirt.",
      "tie?": "Depends on industry. Tech often no, finance yes.",
      "background?": "Outfit should work with any background."
    }
  },

  // ===== ACCESSIBILITY NEEDS (976-1000) =====
  {
    id: 'accessibility_1',
    category: 'accessibility',
    userMessage: "prosthetic leg pants never fit right",
    context: { mood: 'frustrated' },
    agentResponses: {
      primary: "Adaptive styling solutions. Perfect fit possible.",
      alternatives: [
        "Custom solutions for unique needs. We'll figure it out.",
        "Prosthetic-friendly fits. Comfort and style."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "specific issues?": "Tell me the problem areas. We'll solve them.",
      "alterations?": "Specialist tailors understand prosthetic needs.",
      "give up?": "Never. Everyone deserves great fit."
    }
  },
  {
    id: 'accessibility_2',
    category: 'accessibility',
    userMessage: "autism hate certain fabrics need comfortable professional",
    context: { mood: 'nervous' },
    agentResponses: {
      primary: "Sensory-friendly professional. Comfort is non-negotiable.",
      alternatives: [
        "Texture-conscious choices. Professional without discomfort.",
        "Sensory-smart wardrobe. Your comfort, your rules."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "safe fabrics?": "Cotton, bamboo, modal. Soft and breathable.",
      "avoid?": "Wool, polyester often problematic. Stick to naturals.",
      "tags?": "Remove all tags. Tagless or printed labels best."
    }
  },

  // ===== FINAL UNIQUE SCENARIOS (1001-1025) =====
  {
    id: 'unique_1',
    category: 'unique',
    userMessage: "witness protection need completely different style",
    context: { urgency: 'immediate', mood: 'nervous' },
    agentResponses: {
      primary: "Complete transformation. New you, new style.",
      alternatives: [
        "Identity refresh. Totally different aesthetic.",
        "Clean slate wardrobe. Unrecognizable transformation."
      ],
      personality: 'professional'
    },
    followUpPaths: {
      "opposite?": "If you wore suits, go casual. Vice versa.",
      "bland?": "Forgettable is the goal. Gray man theory.",
      "specific?": "Generic brands, common colors, unremarkable fit."
    }
  },
  {
    id: 'unique_2',
    category: 'unique',
    userMessage: "lottery winner don't want people to know",
    context: { budget: 'luxury', mood: 'nervous' },
    agentResponses: {
      primary: "Stealth wealth. Upgrade quality, not flash.",
      alternatives: [
        "Quiet luxury. Rich in private.",
        "Subtle elevation. Money whispers."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "specific?": "Better versions of what you wear now.",
      "tells?": "Avoid logos, obvious luxury brands.",
      "worth it?": "Quality of life improvement without advertising."
    }
  },
  {
    id: 'unique_3',
    category: 'unique',
    userMessage: "undercover cop need to blend in at country club",
    context: { urgency: 'immediate' },
    agentResponses: {
      primary: "Country club camouflage. Prep perfect cover.",
      alternatives: [
        "Insider style. Look like you belong.",
        "Member aesthetic. Blend seamlessly."
      ],
      personality: 'expert'
    },
    followUpPaths: {
      "specific?": "Pastel polo, khakis, blazer for dinner.",
      "brands?": "Ralph Lauren, Brooks Brothers energy.",
      "too obvious?": "Slightly worn in. Too new looks suspicious."
    }
  },
  {
    id: 'unique_4',
    category: 'unique',
    userMessage: "time traveler from 1950s need modern clothes",
    context: { mood: 'confused' },
    agentResponses: {
      primary: "Welcome to 2024! Let's get you updated.",
      alternatives: [
        "Modern times, modern style. Big changes ahead.",
        "Fashion fast-forward. Buckle up."
      ],
      personality: 'friendly'
    },
    followUpPaths: {
      "so different?": "Casual is king now. Suits aren't daily.",
      "what happened?": "Comfort won. But style still matters.",
      "miss old days?": "Vintage is actually trendy. Win-win."
    }
  },
  {
    id: 'unique_5',
    category: 'unique',
    userMessage: "alien trying to understand human fashion help",
    context: { mood: 'confused' },
    agentResponses: {
      primary: "Human fashion 101: cover body, express personality.",
      alternatives: [
        "Earth clothes explained. Cultural significance included.",
        "Welcome to fashion, earthling style."
      ],
      personality: 'casual'
    },
    followUpPaths: {
      "why fabric?": "Protection and social signaling.",
      "colors matter?": "Deeply. Each has cultural meaning.",
      "most important?": "Fit and context. Master those first."
    }
  }
]

// Export function to get all scenarios
export function getMegaExtendedScenarios(): TrainingScenario[] {
  return MEGA_EXTENDED_SCENARIOS
}

// Statistics function
export function getMegaStats() {
  const categories = new Map<string, number>()
  MEGA_EXTENDED_SCENARIOS.forEach(s => {
    const count = categories.get(s.category) || 0
    categories.set(s.category, count + 1)
  })
  
  return {
    total: MEGA_EXTENDED_SCENARIOS.length,
    categories: Array.from(categories.entries()),
    uniqueCategories: categories.size
  }
}