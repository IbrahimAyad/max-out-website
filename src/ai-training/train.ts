#!/usr/bin/env tsx

import { dataProcessor } from './data/processor';
import { embeddingsGenerator } from './embeddings/generator';
import { vectorStore } from './embeddings/vector-store';
import fs from 'fs/promises';
import path from 'path';

interface TrainingStats {
  totalProducts: number;
  processedProducts: number;
  embeddingsGenerated: number;
  vectorsStored: number;
  trainingTime: number;
  errors: string[];
}

class TrainingPipeline {
  private stats: TrainingStats = {
    totalProducts: 0,
    processedProducts: 0,
    embeddingsGenerated: 0,
    vectorsStored: 0,
    trainingTime: 0,
    errors: [],
  };

  async run(): Promise<void> {
    const startTime = Date.now();
    
    try {
      await dataProcessor.loadProductData();
      const products = dataProcessor.getProducts();
      this.stats.totalProducts = products.length;
      const processedProducts = await dataProcessor.processProducts();
      this.stats.processedProducts = processedProducts.length;
      await dataProcessor.saveProcessedData(processedDataPath);

      // Step 3: Generate embeddings (delta-aware)
      this.stats.embeddingsGenerated = vectors.length;
      await vectorStore.initialize();
      if (vectors.length > 0) {
        await vectorStore.upsertVectors(vectors);
        this.stats.vectorsStored = vectors.length;
      }

      // Step 6: Generate training knowledge base
      await this.createTrainingPrompts();

      // Save training stats
      await this.saveStats();

    } catch (error) {
      console.error('❌ Training pipeline failed:', error);
      this.stats.errors.push(String(error));
      throw error;
    }
  }

  private async generateKnowledgeBase(products: any[]): Promise<void> {
    const knowledgeBase = {
      totalProducts: products.length,
      categories: this.extractCategories(products),
      priceRanges: this.extractPriceRanges(products),
      colors: this.extractColors(products),
      materials: this.extractMaterials(products),
      occasions: this.extractOccasions(products),
      styles: this.extractStyles(products),
      sizingGuide: this.createSizingGuide(products),
      careInstructions: this.extractCareInstructions(products),
      outfitRules: this.createOutfitRules(),
      colorHarmonyRules: this.createColorHarmonyRules(),
    };

    const knowledgePath = path.join(
      process.cwd(),
      'src/ai-training/models/knowledge_base.json'
    );

    await fs.writeFile(knowledgePath, JSON.stringify(knowledgeBase, null, 2));
  }

  private extractCategories(products: any[]): Record<string, number> {
    const categories: Record<string, number> = {};
    products.forEach(product => {
      const type = product.product_type || 'Other';
      categories[type] = (categories[type] || 0) + 1;
    });
    return categories;
  }

  private extractPriceRanges(products: any[]): any {
    const prices = products
      .map(p => {
        if (p.variants && p.variants[0]) {
          return parseFloat(p.variants[0].price || 0);
        }
        return 0;
      })
      .filter(p => p > 0);

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length,
      ranges: {
        budget: prices.filter(p => p < 100).length,
        mid: prices.filter(p => p >= 100 && p < 300).length,
        luxury: prices.filter(p => p >= 300).length,
      },
    };
  }

  private extractColors(products: any[]): string[] {
    const colors = new Set<string>();
    products.forEach(product => {
      if (product.color) colors.add(product.color);
      if (product.title) {
        const colorWords = ['black', 'navy', 'grey', 'blue', 'white', 'burgundy', 'red', 'green', 'brown'];
        colorWords.forEach(color => {
          if (product.title.toLowerCase().includes(color)) {
            colors.add(color);
          }
        });
      }
    });
    return Array.from(colors);
  }

  private extractMaterials(products: any[]): string[] {
    const materials = new Set<string>();
    products.forEach(product => {
      if (product.material) materials.add(product.material);
      if (product.description) {
        const materialWords = ['wool', 'cotton', 'polyester', 'silk', 'linen', 'velvet', 'satin'];
        materialWords.forEach(material => {
          if (product.description.toLowerCase().includes(material)) {
            materials.add(material);
          }
        });
      }
    });
    return Array.from(materials);
  }

  private extractOccasions(products: any[]): string[] {
    const occasions = new Set<string>();
    products.forEach(product => {
      if (product.occasion) {
        product.occasion.forEach((o: string) => occasions.add(o));
      }
    });
    return Array.from(occasions);
  }

  private extractStyles(products: any[]): string[] {
    const styles = new Set<string>();
    products.forEach(product => {
      if (product.style) {
        product.style.forEach((s: string) => styles.add(s));
      }
    });
    return Array.from(styles);
  }

  private createSizingGuide(products: any[]): any {
    return {
      suits: {
        chest: ['36', '38', '40', '42', '44', '46', '48', '50', '52'],
        regular: ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R'],
        short: ['36S', '38S', '40S', '42S', '44S', '46S'],
        long: ['38L', '40L', '42L', '44L', '46L', '48L', '50L'],
      },
      shirts: {
        neck: ['14', '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18'],
        sleeve: ['32/33', '34/35', '36/37'],
      },
      pants: {
        waist: ['28', '30', '32', '34', '36', '38', '40', '42', '44'],
        inseam: ['28', '30', '32', '34', '36'],
      },
      shoes: {
        us: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
      },
    };
  }

  private extractCareInstructions(products: any[]): string[] {
    const instructions = new Set<string>();
    products.forEach(product => {
      if (product.care_instructions) {
        instructions.add(product.care_instructions);
      }
    });
    return Array.from(instructions);
  }

  private createOutfitRules(): any {
    return {
      formal: {
        required: ['suit or tuxedo', 'dress shirt', 'dress shoes', 'tie or bow tie'],
        optional: ['pocket square', 'cufflinks', 'dress socks', 'belt'],
        colorRules: ['Match belt and shoes', 'Tie should complement suit', 'White shirt is most versatile'],
      },
      business: {
        required: ['suit', 'dress shirt', 'dress shoes', 'tie'],
        optional: ['vest', 'pocket square', 'briefcase'],
        colorRules: ['Navy and grey are most versatile', 'Conservative colors preferred'],
      },
      casual: {
        required: ['shirt or polo', 'pants or jeans', 'casual shoes'],
        optional: ['blazer', 'sweater', 'casual belt'],
        colorRules: ['More flexibility in color mixing', 'Can mix patterns carefully'],
      },
    };
  }

  private createColorHarmonyRules(): any {
    return {
      complementary: {
        'navy': ['white', 'light blue', 'pink', 'grey'],
        'grey': ['white', 'black', 'blue', 'burgundy'],
        'black': ['white', 'grey', 'red', 'pink'],
        'brown': ['cream', 'beige', 'blue', 'green'],
      },
      seasonal: {
        spring: ['pastels', 'light colors', 'floral patterns'],
        summer: ['light colors', 'linen', 'breathable fabrics'],
        fall: ['earth tones', 'burgundy', 'forest green', 'brown'],
        winter: ['dark colors', 'rich textures', 'layering pieces'],
      },
      patterns: {
        rules: [
          'Mix patterns of different scales',
          'Limit to 2-3 patterns maximum',
          'Use solid colors to break up patterns',
          'Stripes and checks can work together if scaled differently',
        ],
      },
    };
  }

  private async createTrainingPrompts(): Promise<void> {
    const prompts = {
      systemPrompt: `You are a knowledgeable fashion consultant for KCT Menswear, specializing in men's formal and casual clothing. 
      You have extensive knowledge about suits, tuxedos, dress shirts, accessories, and proper styling for various occasions.
      Your responses should be helpful, professional, and tailored to the customer's needs.
      You can provide advice on sizing, color coordination, occasion-appropriate outfits, and care instructions.`,
      
      exampleConversations: [
        {
          user: "I need a suit for my wedding. What do you recommend?",
          assistant: "For your wedding, I recommend considering a few key factors:\n\n1. **Formality Level**: A classic black tuxedo or a sophisticated navy or charcoal suit\n2. **Season**: Lighter colors and fabrics for spring/summer, darker and heavier fabrics for fall/winter\n3. **Fit**: A well-tailored slim or modern fit that complements your body type\n4. **Complete Look**: Don't forget coordinating accessories like a tie or bow tie, pocket square, and dress shoes\n\nWould you like me to show you specific wedding suit options from our collection?",
        },
        {
          user: "What color tie goes with a navy suit?",
          assistant: "Navy suits are incredibly versatile! Here are excellent tie color options:\n\n**Classic Choices**:\n- Burgundy or wine red - creates elegant contrast\n- Silver or grey - sophisticated and professional\n- Navy (different shade) - monochromatic and modern\n\n**Bold Options**:\n- Pink or coral - adds personality for social events\n- Gold or yellow - perfect for summer occasions\n- Patterned ties with navy base - adds visual interest\n\n**Safe Choice**: A burgundy or silver tie works for almost any occasion with a navy suit.",
        },
        {
          user: "How should I care for my wool suit?",
          assistant: "Proper care will keep your wool suit looking sharp for years:\n\n**Daily Care**:\n- Hang on a quality wooden hanger immediately after wear\n- Let it air out for 24 hours between wears\n- Use a clothes brush to remove surface dirt\n\n**Cleaning**:\n- Dry clean only 2-3 times per year (over-cleaning damages wool)\n- Spot clean minor stains immediately\n- Steam to remove wrinkles instead of ironing directly\n\n**Storage**:\n- Store in a breathable garment bag\n- Add cedar blocks to prevent moths\n- Ensure the closet isn't too humid\n\n**Pro Tip**: Rotate between 2-3 suits if wearing frequently to extend their lifespan.",
        },
      ],
      
      capabilities: [
        "Product recommendations based on occasion, style, and budget",
        "Outfit coordination and styling advice",
        "Size guidance and fit recommendations",
        "Color matching and pattern mixing rules",
        "Care instructions for different materials",
        "Seasonal wardrobe suggestions",
        "Formal dress code explanations",
        "Accessory pairing recommendations",
      ],
    };

    const promptsPath = path.join(
      process.cwd(),
      'src/ai-training/models/training_prompts.json'
    );

    await fs.writeFile(promptsPath, JSON.stringify(prompts, null, 2));
  }

  private displaySummary(): void {
    
    if (this.stats.errors.length > 0) {
    }
    

    await fs.writeFile(
      statsPath,
      JSON.stringify({
        ...this.stats,
        timestamp: new Date().toISOString(),
      }, null, 2)
    );
  }
}

// Run training if executed directly
if (require.main === module) {
  const pipeline = new TrainingPipeline();
  pipeline.run().catch(console.error);
}

export { TrainingPipeline };