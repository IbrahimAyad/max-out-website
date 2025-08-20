import { suitImages } from '@/lib/data/suitImages';
import { dressShirtProducts } from '@/lib/products/dressShirtProducts';
import { tieProducts } from '@/lib/products/tieProducts';
import { TOP_COMBINATIONS } from '@/lib/data/knowledgeBank/topCombinations';
import { COLOR_RELATIONSHIPS, getColorHarmonyScore } from '@/lib/data/knowledgeBank/colorRelationships';

export interface BundleProduct {
  type: 'suit' | 'shirt' | 'tie';
  name: string;
  color: string;
  colorId: string;
  price: number;
  imageUrl: string;
  fit?: string;
  style?: string;
}

export interface Bundle {
  id: string;
  name: string;
  suit: BundleProduct;
  shirt: BundleProduct;
  tie: BundleProduct;
  totalPrice: number;
  bundlePrice: number;
  discount: number;
  discountPercentage: number;
  reasoning: string;
  targetCustomer: string;
  occasion: string[];
  colorHarmonyScore: number;
  aiConfidenceScore: number;
  trending?: boolean;
  seasonality: string[];
}

class TopBundleGenerator {
  private suitPrices = {
    black: 699,
    navy: 599,
    charcoalGrey: 649,
    lightGrey: 579,
    tan: 549,
    sand: 529,
    beige: 529,
    brown: 569,
    darkBrown: 589,
    burgundy: 679,
    emerald: 699,
    hunterGreen: 659,
    midnightBlue: 629,
    indigo: 639
  };

  /**
   * Generate the top 15 bundles based on AI analysis and Knowledge Bank data
   */
  async generateTop15Bundles(): Promise<Bundle[]> {
    const bundles: Bundle[] = [];

    // 1. Top performers from Knowledge Bank (first 5)
    bundles.push(this.createNavyBurgundyClassic());
    bundles.push(this.createCharcoalSilverProfessional());
    bundles.push(this.createBurgundyMustardFall());
    bundles.push(this.createNavyPinkModern());
    bundles.push(this.createBlackTuxedoFormal());

    // 2. Trending combinations (next 3)
    bundles.push(this.createSageBlushSpring());
    bundles.push(this.createEmeraldGoldLuxury());
    bundles.push(this.createIndigoCoralSummer());

    // 3. Seasonal favorites (next 3)
    bundles.push(this.createLightGreySummerCasual());
    bundles.push(this.createHunterGreenFallWedding());
    bundles.push(this.createTanSageDestination());

    // 4. Value combinations (next 2)
    bundles.push(this.createCharcoalValueBundle());
    bundles.push(this.createNavyEssentialsBundle());

    // 5. Bold & trendy (last 2)
    bundles.push(this.createBurgundyBoldStatement());
    bundles.push(this.createMidnightBlueEvening());

    return bundles;
  }

  private createNavyBurgundyClassic(): Bundle {
    const suit = this.getSuitProduct('navy', 'Navy Business Suit');
    const shirt = this.getShirtProduct('white', 'Classic White Dress Shirt', 'classic');
    const tie = this.getTieProduct('burgundy', 'Burgundy Silk Tie', 'classic');

    return {
      id: 'bundle-navy-burgundy-classic',
      name: 'The Executive Classic Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.9,
      discount: (suit.price + shirt.price + tie.price) * 0.1,
      discountPercentage: 10,
      reasoning: 'Our #1 best-selling combination. The navy suit with burgundy tie creates a powerful yet approachable look perfect for any business setting. The burgundy adds just the right amount of color without being too bold.',
      targetCustomer: 'Professionals, executives, wedding guests',
      occasion: ['business', 'wedding', 'formal', 'interview'],
      colorHarmonyScore: 95,
      aiConfidenceScore: 100,
      trending: false,
      seasonality: ['year-round']
    };
  }

  private createCharcoalSilverProfessional(): Bundle {
    const suit = this.getSuitProduct('charcoalGrey', 'Charcoal Professional Suit');
    const shirt = this.getShirtProduct('white', 'Classic White Dress Shirt', 'slim');
    const tie = this.getTieProduct('silver', 'Silver Pattern Tie', 'classic');

    return {
      id: 'bundle-charcoal-silver-pro',
      name: 'The Power Professional Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.9,
      discount: (suit.price + shirt.price + tie.price) * 0.1,
      discountPercentage: 10,
      reasoning: 'Sophisticated and commanding presence. The charcoal suit with silver accents projects authority and professionalism. Perfect for high-stakes meetings, presentations, and formal evening events.',
      targetCustomer: 'C-suite executives, lawyers, formal event attendees',
      occasion: ['business', 'formal', 'evening', 'conference'],
      colorHarmonyScore: 92,
      aiConfidenceScore: 98,
      trending: false,
      seasonality: ['year-round']
    };
  }

  private createBurgundyMustardFall(): Bundle {
    const suit = this.getSuitProduct('burgundy', 'Burgundy Fall Suit');
    const shirt = this.getShirtProduct('white', 'Classic White Dress Shirt', 'classic');
    const tie = this.getTieProduct('medium-orange', 'Mustard Gold Tie', 'classic');

    return {
      id: 'bundle-burgundy-fall-wedding',
      name: 'The Autumn Romance Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.88,
      discount: (suit.price + shirt.price + tie.price) * 0.12,
      discountPercentage: 12,
      reasoning: 'Fall\'s most requested combination. The rich burgundy suit paired with warm mustard accents creates a sophisticated seasonal look. Perfect for fall weddings and harvest celebrations.',
      targetCustomer: 'Fall wedding attendees, fashion-forward professionals',
      occasion: ['fall_wedding', 'special_events', 'cocktail'],
      colorHarmonyScore: 95,
      aiConfidenceScore: 97,
      trending: true,
      seasonality: ['fall', 'winter']
    };
  }

  private createNavyPinkModern(): Bundle {
    const suit = this.getSuitProduct('navy', 'Navy Modern Fit Suit');
    const shirt = this.getShirtProduct('light-pink', 'Light Pink Dress Shirt', 'slim');
    const tie = this.getTieProduct('navy', 'Navy Pattern Tie', 'skinny');

    return {
      id: 'bundle-navy-pink-modern',
      name: 'The Modern Professional Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.9,
      discount: (suit.price + shirt.price + tie.price) * 0.1,
      discountPercentage: 10,
      reasoning: 'Contemporary style with confidence. The pink shirt adds personality to the classic navy suit, while the patterned tie ties it all together. Perfect for creative professionals and social business events.',
      targetCustomer: 'Modern professionals, creative industry, millennials',
      occasion: ['business', 'social', 'date_night', 'cocktail'],
      colorHarmonyScore: 87,
      aiConfidenceScore: 94,
      trending: false,
      seasonality: ['spring', 'summer']
    };
  }

  private createBlackTuxedoFormal(): Bundle {
    const suit = this.getSuitProduct('black', 'Black Tuxedo Suit');
    const shirt = this.getShirtProduct('white', 'Formal White Dress Shirt', 'classic');
    const tie = this.getTieProduct('black', 'Black Silk Bow Tie', 'bowtie');

    return {
      id: 'bundle-black-tuxedo-formal',
      name: 'The Black Tie Excellence Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.85,
      discount: (suit.price + shirt.price + tie.price) * 0.15,
      discountPercentage: 15,
      reasoning: 'The ultimate in formal elegance. This classic black tuxedo combination is perfect for black-tie events, galas, and the most formal occasions. Timeless sophistication guaranteed.',
      targetCustomer: 'Gala attendees, grooms, formal event hosts',
      occasion: ['black_tie', 'gala', 'wedding', 'formal_evening'],
      colorHarmonyScore: 90,
      aiConfidenceScore: 100,
      trending: false,
      seasonality: ['year-round']
    };
  }

  private createSageBlushSpring(): Bundle {
    const suit = this.getSuitProduct('hunterGreen', 'Sage Green Modern Suit');
    const shirt = this.getShirtProduct('white', 'Classic White Dress Shirt', 'slim');
    const tie = this.getTieProduct('blush-pink', 'Blush Pink Silk Tie', 'slim');

    return {
      id: 'bundle-sage-blush-spring',
      name: 'The Garden Party Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.88,
      discount: (suit.price + shirt.price + tie.price) * 0.12,
      discountPercentage: 12,
      reasoning: 'Trending nature-inspired combination. The sage green suit with blush pink accents is perfect for outdoor spring weddings and garden parties. Fresh, modern, and Instagram-worthy.',
      targetCustomer: 'Spring wedding guests, fashion-forward millennials',
      occasion: ['spring_wedding', 'garden_party', 'outdoor_event'],
      colorHarmonyScore: 92,
      aiConfidenceScore: 93,
      trending: true,
      seasonality: ['spring', 'summer']
    };
  }

  private createEmeraldGoldLuxury(): Bundle {
    const suit = this.getSuitProduct('emerald', 'Emerald Velvet Suit');
    const shirt = this.getShirtProduct('white', 'Premium White Dress Shirt', 'slim');
    const tie = this.getTieProduct('gold', 'Gold Silk Tie', 'classic');

    return {
      id: 'bundle-emerald-gold-luxury',
      name: 'The Luxury Statement Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.85,
      discount: (suit.price + shirt.price + tie.price) * 0.15,
      discountPercentage: 15,
      reasoning: 'Bold luxury with sophistication. The rich emerald suit paired with gold accents creates a regal, eye-catching look. Perfect for holiday parties, special celebrations, and making a memorable impression.',
      targetCustomer: 'Luxury event attendees, fashion enthusiasts, celebrities',
      occasion: ['holiday_party', 'gala', 'special_event', 'cocktail'],
      colorHarmonyScore: 88,
      aiConfidenceScore: 91,
      trending: true,
      seasonality: ['fall', 'winter', 'holiday']
    };
  }

  private createIndigoCoralSummer(): Bundle {
    const suit = this.getSuitProduct('indigo', 'Indigo Summer Suit');
    const shirt = this.getShirtProduct('white', 'Crisp White Dress Shirt', 'slim');
    const tie = this.getTieProduct('coral', 'Coral Silk Tie', 'skinny');

    return {
      id: 'bundle-indigo-coral-summer',
      name: 'The Coastal Wedding Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.9,
      discount: (suit.price + shirt.price + tie.price) * 0.1,
      discountPercentage: 10,
      reasoning: 'Perfect for summer celebrations. The deep indigo suit with coral accents evokes seaside elegance. Ideal for beach weddings, yacht parties, and summer evening events.',
      targetCustomer: 'Summer wedding guests, coastal event attendees',
      occasion: ['summer_wedding', 'beach_wedding', 'yacht_party'],
      colorHarmonyScore: 85,
      aiConfidenceScore: 90,
      trending: false,
      seasonality: ['summer']
    };
  }

  private createLightGreySummerCasual(): Bundle {
    const suit = this.getSuitProduct('lightGrey', 'Light Grey Linen Suit');
    const shirt = this.getShirtProduct('light-blue', 'Light Blue Oxford Shirt', 'classic');
    const tie = this.getTieProduct('navy', 'Navy Knit Tie', 'skinny');

    return {
      id: 'bundle-grey-casual-summer',
      name: 'The Smart Casual Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.92,
      discount: (suit.price + shirt.price + tie.price) * 0.08,
      discountPercentage: 8,
      reasoning: 'Relaxed sophistication for less formal occasions. The light grey suit with soft blue shirt creates an approachable yet polished look. Perfect for daytime events and business casual settings.',
      targetCustomer: 'Business casual professionals, daytime event attendees',
      occasion: ['business_casual', 'daytime_event', 'brunch', 'rehearsal_dinner'],
      colorHarmonyScore: 88,
      aiConfidenceScore: 96,
      trending: false,
      seasonality: ['spring', 'summer']
    };
  }

  private createHunterGreenFallWedding(): Bundle {
    const suit = this.getSuitProduct('hunterGreen', 'Hunter Green Wool Suit');
    const shirt = this.getShirtProduct('white', 'Classic White Dress Shirt', 'classic');
    const tie = this.getTieProduct('burnt-orange', 'Burnt Orange Silk Tie', 'classic');

    return {
      id: 'bundle-hunter-green-fall',
      name: 'The Forest Wedding Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.88,
      discount: (suit.price + shirt.price + tie.price) * 0.12,
      discountPercentage: 12,
      reasoning: 'Rich autumn colors for memorable occasions. The hunter green suit with burnt orange accents captures the essence of fall. Perfect for outdoor fall weddings and rustic celebrations.',
      targetCustomer: 'Fall wedding party, outdoor event enthusiasts',
      occasion: ['fall_wedding', 'outdoor_wedding', 'rustic_event'],
      colorHarmonyScore: 90,
      aiConfidenceScore: 92,
      trending: false,
      seasonality: ['fall']
    };
  }

  private createTanSageDestination(): Bundle {
    const suit = this.getSuitProduct('tan', 'Tan Lightweight Suit');
    const shirt = this.getShirtProduct('white', 'White Linen Dress Shirt', 'classic');
    const tie = this.getTieProduct('olive-green', 'Sage Green Tie', 'slim');

    return {
      id: 'bundle-tan-sage-destination',
      name: 'The Destination Wedding Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.9,
      discount: (suit.price + shirt.price + tie.price) * 0.1,
      discountPercentage: 10,
      reasoning: 'Effortless elegance for tropical settings. The tan suit with sage green accents is perfect for beach weddings, resort events, and warm-weather celebrations. Lightweight and stylish.',
      targetCustomer: 'Destination wedding guests, resort vacationers',
      occasion: ['destination_wedding', 'beach_wedding', 'resort_event'],
      colorHarmonyScore: 86,
      aiConfidenceScore: 92,
      trending: false,
      seasonality: ['summer', 'tropical']
    };
  }

  private createCharcoalValueBundle(): Bundle {
    const suit = this.getSuitProduct('charcoalGrey', 'Charcoal Essential Suit');
    const shirt = this.getShirtProduct('white', 'White Dress Shirt', 'classic');
    const tie = this.getTieProduct('dark-red', 'Classic Red Tie', 'classic');

    return {
      id: 'bundle-charcoal-value',
      name: 'The Smart Value Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.85,
      discount: (suit.price + shirt.price + tie.price) * 0.15,
      discountPercentage: 15,
      reasoning: 'Maximum versatility at great value. This charcoal suit bundle works for interviews, business meetings, and formal events. An essential foundation for any wardrobe.',
      targetCustomer: 'First-time suit buyers, budget-conscious professionals',
      occasion: ['business', 'interview', 'versatile'],
      colorHarmonyScore: 85,
      aiConfidenceScore: 95,
      trending: false,
      seasonality: ['year-round']
    };
  }

  private createNavyEssentialsBundle(): Bundle {
    const suit = this.getSuitProduct('navy', 'Navy Essential Suit');
    const shirt = this.getShirtProduct('light-blue', 'Light Blue Dress Shirt', 'classic');
    const tie = this.getTieProduct('burgundy', 'Burgundy Classic Tie', 'classic');

    return {
      id: 'bundle-navy-essentials',
      name: 'The Wardrobe Foundation Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.85,
      discount: (suit.price + shirt.price + tie.price) * 0.15,
      discountPercentage: 15,
      reasoning: 'The ultimate starter bundle. This navy suit combination provides maximum wearability for various occasions. Perfect foundation for building a professional wardrobe.',
      targetCustomer: 'Young professionals, recent graduates',
      occasion: ['business', 'wedding', 'versatile'],
      colorHarmonyScore: 90,
      aiConfidenceScore: 98,
      trending: false,
      seasonality: ['year-round']
    };
  }

  private createBurgundyBoldStatement(): Bundle {
    const suit = this.getSuitProduct('burgundy', 'Burgundy Statement Suit');
    const shirt = this.getShirtProduct('black', 'Black Dress Shirt', 'slim');
    const tie = this.getTieProduct('gold', 'Gold Pattern Tie', 'slim');

    return {
      id: 'bundle-burgundy-bold',
      name: 'The Bold Statement Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.88,
      discount: (suit.price + shirt.price + tie.price) * 0.12,
      discountPercentage: 12,
      reasoning: 'Make a memorable impression. This bold burgundy and black combination with gold accents is perfect for those who want to stand out. Ideal for creative events and fashion-forward occasions.',
      targetCustomer: 'Fashion enthusiasts, creative professionals, trendsetters',
      occasion: ['cocktail', 'creative_event', 'holiday_party'],
      colorHarmonyScore: 82,
      aiConfidenceScore: 89,
      trending: true,
      seasonality: ['fall', 'winter', 'holiday']
    };
  }

  private createMidnightBlueEvening(): Bundle {
    const suit = this.getSuitProduct('midnightBlue', 'Midnight Blue Evening Suit');
    const shirt = this.getShirtProduct('white', 'Formal White Dress Shirt', 'slim');
    const tie = this.getTieProduct('silver', 'Silver Silk Tie', 'classic');

    return {
      id: 'bundle-midnight-evening',
      name: 'The Evening Elegance Bundle',
      suit,
      shirt,
      tie,
      totalPrice: suit.price + shirt.price + tie.price,
      bundlePrice: (suit.price + shirt.price + tie.price) * 0.9,
      discount: (suit.price + shirt.price + tie.price) * 0.1,
      discountPercentage: 10,
      reasoning: 'Sophisticated alternative to black tie. The midnight blue suit appears richer under evening lights than traditional black. Perfect for formal dinners, theater, and upscale events.',
      targetCustomer: 'Evening event attendees, theater-goers, formal diners',
      occasion: ['evening', 'formal_dinner', 'theater', 'cocktail'],
      colorHarmonyScore: 91,
      aiConfidenceScore: 95,
      trending: false,
      seasonality: ['year-round']
    };
  }

  // Helper methods
  private getSuitProduct(colorKey: string, name: string): BundleProduct {
    const images = suitImages[colorKey as keyof typeof suitImages];
    const price = this.suitPrices[colorKey as keyof typeof this.suitPrices] || 599;

    return {
      type: 'suit',
      name,
      color: this.formatColorName(colorKey),
      colorId: colorKey,
      price,
      imageUrl: images?.main || '',
      style: 'two-piece'
    };
  }

  private getShirtProduct(colorId: string, name: string, fit: string): BundleProduct {
    const shirtColor = dressShirtProducts.colors.find(c => c.id === colorId);
    const fitData = dressShirtProducts.fits[fit as keyof typeof dressShirtProducts.fits];

    return {
      type: 'shirt',
      name,
      color: shirtColor?.name || colorId,
      colorId,
      price: fitData?.price || 39.99,
      imageUrl: shirtColor?.imageUrl || '',
      fit
    };
  }

  private getTieProduct(colorId: string, name: string, style: string): BundleProduct {
    const tieColor = tieProducts.colors.find(c => c.id === colorId);
    const styleData = tieProducts.styles[style as keyof typeof tieProducts.styles];

    return {
      type: 'tie',
      name,
      color: tieColor?.name || colorId,
      colorId,
      price: styleData?.price || 24.99,
      imageUrl: tieColor?.imageUrl || '',
      style
    };
  }

  private formatColorName(colorKey: string): string {
    const colorMap: Record<string, string> = {
      navy: 'Navy',
      charcoalGrey: 'Charcoal Grey',
      lightGrey: 'Light Grey',
      black: 'Black',
      burgundy: 'Burgundy',
      emerald: 'Emerald',
      hunterGreen: 'Hunter Green',
      midnightBlue: 'Midnight Blue',
      indigo: 'Indigo',
      tan: 'Tan',
      sand: 'Sand',
      beige: 'Beige',
      brown: 'Brown',
      darkBrown: 'Dark Brown'
    };

    return colorMap[colorKey] || colorKey;
  }
}

export const topBundleGenerator = new TopBundleGenerator();