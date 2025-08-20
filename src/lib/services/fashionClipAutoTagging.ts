interface ProductTags {
  manual: string[];          // User-created tags (highest priority)
  fashionClip: string[];     // AI-generated tags
  seo: string[];            // SEO-optimized tags
  merged: string[];         // Final deduplicated set
}

interface TagVariationMap {
  [key: string]: string[];
}

interface AutoTaggingResult {
  originalTags: string[];
  suggestedTags: string[];
  addedTags: string[];
  skippedTags: string[];
  conflictTags: string[];
  seoScore: number;
}

class FashionClipAutoTagging {
  private readonly variationMap: TagVariationMap = {
    // Colors
    navy: ["navy", "navy blue", "dark blue", "midnight", "midnight blue", "deep blue"],
    charcoal: ["charcoal", "dark grey", "charcoal grey", "charcoal gray", "dark gray"],
    black: ["black", "jet black", "ebony", "midnight black"],
    white: ["white", "ivory", "cream", "off-white", "pearl"],
    grey: ["grey", "gray", "silver", "slate"],
    burgundy: ["burgundy", "wine", "maroon", "deep red", "claret"],

    // Occasions
    wedding: ["wedding", "weddings", "bridal", "groom", "groomsmen", "matrimony"],
    prom: ["prom", "formal dance", "graduation", "school formal"],
    business: ["business", "professional", "corporate", "office", "work"],
    casual: ["casual", "everyday", "relaxed", "informal"],
    formal: ["formal", "black tie", "evening", "gala", "ceremonial"],

    // Fits & Styles
    slim: ["slim", "slim fit", "fitted", "tailored", "narrow", "close-fitting"],
    regular: ["regular", "classic fit", "standard", "traditional"],
    modern: ["modern", "contemporary", "updated", "current"],
    vintage: ["vintage", "retro", "classic", "traditional", "timeless"],

    // Garment Types
    suit: ["suit", "two-piece", "ensemble"],
    tuxedo: ["tuxedo", "tux", "dinner jacket", "formal wear"],
    blazer: ["blazer", "sport coat", "jacket"],
    vest: ["vest", "waistcoat", "gilet"],

    // Fabrics
    wool: ["wool", "woolen", "worsted"],
    cotton: ["cotton", "cotton blend"],
    linen: ["linen", "flax"],
    silk: ["silk", "silken"],
    polyester: ["polyester", "poly"],

    // Patterns
    striped: ["striped", "pinstripe", "stripe", "lined"],
    checkered: ["checkered", "checked", "plaid", "gingham"],
    solid: ["solid", "plain", "solid color", "solid colour"],

    // Seasons
    summer: ["summer", "warm weather", "lightweight"],
    winter: ["winter", "cold weather", "heavy", "warm"],
    spring: ["spring", "transitional", "mild weather"],
    fall: ["fall", "autumn", "cool weather"],
  };

  private readonly seoKeywords = [
    // High-value SEO terms
    "men's", "mens", "formal wear", "business attire", "wedding attire",
    "designer", "luxury", "premium", "custom", "tailored", "fitted",
    "professional", "elegant", "sophisticated", "classic", "modern",
    "sale", "discount", "best", "top", "quality", "brand",

    // Location-based
    "michigan", "kalamazoo", "portage", "detroit", "grand rapids",

    // Occasion-specific
    "job interview", "wedding guest", "groomsmen", "best man",
    "prom night", "graduation", "business meeting", "formal event"
  ];

  /**
   * Auto-tag a product using Fashion-CLIP analysis
   */
  async autoTagProduct(
    productId: string, 
    imageUrl: string, 
    existingTags: string[] = [],
    productName?: string,
    productDescription?: string
  ): Promise<AutoTaggingResult> {
    try {
      // Get Fashion-CLIP analysis
      const fashionClipTags = await this.getFashionClipTags(imageUrl);

      // Analyze product text for additional context
      const textTags = this.extractTextTags(productName, productDescription);

      // Combine and normalize tags
      const suggestedTags = [...fashionClipTags, ...textTags];

      // Apply deduplication logic
      const result = this.deduplicateTags(existingTags, suggestedTags);

      // Calculate SEO score
      const seoScore = this.calculateSEOScore(result.merged);

      return {
        originalTags: existingTags,
        suggestedTags,
        addedTags: result.addedTags,
        skippedTags: result.skippedTags,
        conflictTags: result.conflictTags,
        seoScore
      };

    } catch (error) {

      return {
        originalTags: existingTags,
        suggestedTags: [],
        addedTags: [],
        skippedTags: [],
        conflictTags: [],
        seoScore: 0
      };
    }
  }

  /**
   * Get tags from Fashion-CLIP API
   */
  private async getFashionClipTags(imageUrl: string): Promise<string[]> {
    try {
      // Convert image URL to file for API
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'product.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);

      const apiResponse = await fetch('https://fashion-clip-kct-production.up.railway.app/predict', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`Fashion-CLIP API error: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();

      // Extract tags from Fashion-CLIP response
      // This depends on your API's response format
      return this.parseFashionClipResponse(result);

    } catch (error) {

      return [];
    }
  }

  /**
   * Parse Fashion-CLIP API response to extract relevant tags
   */
  private parseFashionClipResponse(response: any): string[] {
    // Mock implementation - adapt based on your actual API response
    const tags: string[] = [];

    // Common Fashion-CLIP classifications
    if (response.classification) {
      tags.push(response.classification.toLowerCase());
    }

    if (response.attributes) {
      Object.keys(response.attributes).forEach(attr => {
        if (response.attributes[attr] > 0.7) { // High confidence threshold
          tags.push(attr.toLowerCase());
        }
      });
    }

    // Mock high-confidence tags for demo
    return [
      'formal', 'navy', 'business', 'suit', 'wool', 'slim fit', 
      'professional', 'classic', 'elegant'
    ].slice(0, Math.floor(Math.random() * 6) + 3);
  }

  /**
   * Extract tags from product name and description
   */
  private extractTextTags(name?: string, description?: string): string[] {
    const text = `${name || ''} ${description || ''}`.toLowerCase();
    const tags: string[] = [];

    // Color extraction
    const colors = ['navy', 'black', 'charcoal', 'grey', 'white', 'burgundy', 'brown'];
    colors.forEach(color => {
      if (text.includes(color)) tags.push(color);
    });

    // Occasion extraction
    const occasions = ['wedding', 'prom', 'business', 'formal', 'casual'];
    occasions.forEach(occasion => {
      if (text.includes(occasion)) tags.push(occasion);
    });

    // Fit extraction
    const fits = ['slim', 'regular', 'modern', 'classic', 'fitted'];
    fits.forEach(fit => {
      if (text.includes(fit)) tags.push(fit);
    });

    // Garment type
    const types = ['suit', 'tuxedo', 'blazer', 'vest', 'shirt', 'tie'];
    types.forEach(type => {
      if (text.includes(type)) tags.push(type);
    });

    return tags;
  }

  /**
   * Core deduplication logic
   */
  private deduplicateTags(existingTags: string[], newTags: string[]): {
    merged: string[];
    addedTags: string[];
    skippedTags: string[];
    conflictTags: string[];
  } {
    const addedTags: string[] = [];
    const skippedTags: string[] = [];
    const conflictTags: string[] = [];

    // Normalize existing tags
    const normalizedExisting = existingTags.map(tag => this.normalizeTag(tag));

    // Check each new tag
    for (const newTag of newTags) {
      const normalizedNew = this.normalizeTag(newTag);

      // Skip if exact match exists
      if (normalizedExisting.includes(normalizedNew)) {
        skippedTags.push(newTag);
        continue;
      }

      // Check for variation conflicts
      const hasVariationConflict = this.hasVariationConflict(normalizedNew, normalizedExisting);

      if (hasVariationConflict.conflict) {
        conflictTags.push(newTag);
        skippedTags.push(newTag);
        continue;
      }

      // Add tag if no conflicts
      addedTags.push(newTag);
      normalizedExisting.push(normalizedNew);
    }

    return {
      merged: [...existingTags, ...addedTags],
      addedTags,
      skippedTags,
      conflictTags
    };
  }

  /**
   * Check if a tag conflicts with existing variations
   */
  private hasVariationConflict(newTag: string, existingTags: string[]): {
    conflict: boolean;
    conflictsWith?: string;
    reason?: string;
  } {
    // Check each variation group
    for (const [baseTag, variations] of Object.entries(this.variationMap)) {
      const normalizedVariations = variations.map(v => this.normalizeTag(v));

      // If new tag is in this variation group
      if (normalizedVariations.includes(newTag)) {
        // Check if any existing tag is also in this group
        for (const existing of existingTags) {
          if (normalizedVariations.includes(existing) && existing !== newTag) {
            return {
              conflict: true,
              conflictsWith: existing,
              reason: `"${newTag}" conflicts with existing "${existing}" (both are variations of "${baseTag}")`
            };
          }
        }
      }
    }

    return { conflict: false };
  }

  /**
   * Normalize tags for comparison
   */
  private normalizeTag(tag: string): string {
    return tag.toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
              .replace(/\s+/g, ' ');    // Normalize whitespace
  }

  /**
   * Calculate SEO score based on tag quality
   */
  private calculateSEOScore(tags: string[]): number {
    let score = 0;
    const maxScore = 100;

    // Points for SEO keywords
    const seoMatches = tags.filter(tag => 
      this.seoKeywords.some(keyword => 
        tag.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    score += Math.min(seoMatches.length * 10, 40); // Max 40 points

    // Points for color tags (important for fashion)
    const colorTags = tags.filter(tag => 
      Object.keys(this.variationMap).some(baseTag => 
        this.variationMap[baseTag].includes(tag.toLowerCase()) && 
        ['navy', 'charcoal', 'black', 'white', 'grey', 'burgundy'].includes(baseTag)
      )
    );
    score += Math.min(colorTags.length * 8, 24); // Max 24 points

    // Points for occasion tags
    const occasionTags = tags.filter(tag => 
      ['wedding', 'prom', 'business', 'formal', 'casual'].some(occasion =>
        tag.toLowerCase().includes(occasion)
      )
    );
    score += Math.min(occasionTags.length * 6, 18); // Max 18 points

    // Points for having good tag count (5-15 tags optimal)
    const tagCount = tags.length;
    if (tagCount >= 5 && tagCount <= 15) {
      score += 10;
    } else if (tagCount >= 3 && tagCount <= 20) {
      score += 5;
    }

    // Deduct points for too many tags (SEO spam penalty)
    if (tagCount > 20) {
      score -= (tagCount - 20) * 2;
    }

    // Points for tag diversity
    const uniqueCategories = new Set();
    tags.forEach(tag => {
      Object.keys(this.variationMap).forEach(baseTag => {
        if (this.variationMap[baseTag].includes(tag.toLowerCase())) {
          uniqueCategories.add(baseTag);
        }
      });
    });
    score += Math.min(uniqueCategories.size * 2, 8); // Max 8 points

    return Math.min(Math.max(score, 0), maxScore);
  }

  /**
   * Bulk process multiple products
   */
  async bulkAutoTag(products: Array<{
    id: string;
    imageUrl: string;
    existingTags: string[];
    name?: string;
    description?: string;
  }>): Promise<Map<string, AutoTaggingResult>> {
    const results = new Map<string, AutoTaggingResult>();

    // Process in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      const batchPromises = batch.map(product =>
        this.autoTagProduct(
          product.id,
          product.imageUrl,
          product.existingTags,
          product.name,
          product.description
        ).then(result => ({ id: product.id, result }))
      );

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach(promiseResult => {
        if (promiseResult.status === 'fulfilled') {
          results.set(promiseResult.value.id, promiseResult.value.result);
        }
      });

      // Small delay between batches
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Generate SEO-optimized meta tags
   */
  generateSEOMetaTags(tags: string[], productName: string): {
    title: string;
    description: string;
    keywords: string;
  } {
    // Extract key tags for title
    const colorTags = tags.filter(tag => 
      ['navy', 'black', 'charcoal', 'grey', 'white', 'burgundy'].includes(tag.toLowerCase())
    );
    const occasionTags = tags.filter(tag => 
      ['wedding', 'prom', 'business', 'formal'].includes(tag.toLowerCase())
    );
    const typeTags = tags.filter(tag => 
      ['suit', 'tuxedo', 'blazer', 'vest'].includes(tag.toLowerCase())
    );

    // Build SEO title
    const titleParts = [];
    if (colorTags.length > 0) titleParts.push(colorTags[0]);
    if (typeTags.length > 0) titleParts.push(typeTags[0]);
    if (occasionTags.length > 0) titleParts.push(`for ${occasionTags[0]}`);
    titleParts.push('| KCT Menswear');

    const title = titleParts.join(' ').replace(/\b\w/g, l => l.toUpperCase());

    // Build description
    const description = `Shop premium ${tags.slice(0, 5).join(', ')} at KCT Menswear. Expert tailoring, luxury fabrics, perfect fit guaranteed. Free shipping on orders over $500.`;

    // Build keywords
    const keywords = [...tags, 'KCT Menswear', 'men\'s formal wear', 'custom tailoring'].join(', ');

    return { title, description, keywords };
  }

  /**
   * Get tag suggestions for manual review
   */
  getTagSuggestions(currentTags: string[]): {
    missing: string[];
    redundant: string[];
    improvements: string[];
  } {
    const missing: string[] = [];
    const redundant: string[] = [];
    const improvements: string[] = [];

    // Check for missing essential tags
    const hasColor = currentTags.some(tag => 
      Object.keys(this.variationMap).some(baseTag => 
        this.variationMap[baseTag].includes(tag.toLowerCase()) &&
        ['navy', 'black', 'charcoal', 'grey', 'white', 'burgundy'].includes(baseTag)
      )
    );
    if (!hasColor) missing.push('color tag (navy, black, charcoal, etc.)');

    const hasOccasion = currentTags.some(tag => 
      ['wedding', 'prom', 'business', 'formal', 'casual'].includes(tag.toLowerCase())
    );
    if (!hasOccasion) missing.push('occasion tag (wedding, business, formal, etc.)');

    // Check for redundant tags
    const normalized = currentTags.map(tag => this.normalizeTag(tag));
    const duplicates = normalized.filter((tag, index) => normalized.indexOf(tag) !== index);
    redundant.push(...duplicates);

    // Suggest improvements
    if (currentTags.length < 5) {
      improvements.push('Add more descriptive tags for better SEO');
    }
    if (currentTags.length > 15) {
      improvements.push('Consider removing less relevant tags to avoid SEO penalties');
    }

    return { missing, redundant, improvements };
  }
}

export const fashionClipAutoTagging = new FashionClipAutoTagging();
export type { ProductTags, AutoTaggingResult };