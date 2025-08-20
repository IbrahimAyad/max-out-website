import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Product schema validation
const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  vendor: z.string().optional(),
  product_type: z.string().optional(),
  handle: z.string().optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    price: z.string().optional(),
    sku: z.string().optional(),
    available: z.boolean().optional(),
    inventory_quantity: z.number().optional(),
    option1: z.string().optional(),
    option2: z.string().optional(),
    option3: z.string().optional(),
  })).optional(),
  images: z.array(z.object({
    src: z.string().optional(),
    alt: z.string().optional(),
  })).optional(),
  description: z.string().optional(),
  body_html: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  care_instructions: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  fit: z.string().optional(),
  occasion: z.array(z.string()).optional(),
  season: z.array(z.string()).optional(),
  style: z.array(z.string()).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export interface ProcessedProduct extends Product {
  embedding?: number[];
  searchableText: string;
  features: {
    priceRange: 'budget' | 'mid' | 'luxury';
    formality: 'casual' | 'business' | 'formal';
    colorFamily: string;
    sizingInfo: string;
    recommendations: string[];
  };
}

export class DataProcessor {
  private products: Product[] = [];
  private processedProducts: ProcessedProduct[] = [];

  async loadProductData(): Promise<void> {
    try {
      // Load main product database
      const mainDbPath = path.join(process.cwd(), 'kct_complete_products_database.json');
      const mainData = await fs.readFile(mainDbPath, 'utf-8');
      const mainProducts = JSON.parse(mainData);

      // Load AI training dataset
      const aiDataPath = path.join(process.cwd(), 'ai_training_dataset.json');
      const aiData = await fs.readFile(aiDataPath, 'utf-8');
      const aiProducts = JSON.parse(aiData);

      // Merge and validate products
      const allProducts = [...mainProducts, ...aiProducts];
      const uniqueProducts = this.deduplicateProducts(allProducts);
      
      this.products = uniqueProducts.map(p => {
        try {
          return ProductSchema.parse(p);
        } catch (error) {
          console.warn(`Skipping invalid product: ${p.id || 'unknown'}`);
          return null;
        }
      }).filter(Boolean) as Product[];

      throw error;
    }
  }

  private deduplicateProducts(products: any[]): any[] {
    const seen = new Set();
    return products.filter(product => {
      const key = (product.id || product.handle || product.title || '').toString().toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async processProducts(): Promise<ProcessedProduct[]> {
    this.processedProducts = this.products.map(product => {
      const searchableText = this.createSearchableText(product);
      const features = this.extractFeatures(product);
      
      return {
        ...product,
        searchableText,
        features,
      };
    });

    return this.processedProducts;
  }

  private createSearchableText(product: Product): string {
    const parts = [
      product.title,
      product.seo_title,
      product.description,
      product.body_html?.replace(/<[^>]*>/g, ''), // Strip HTML
      product.meta_description,
      product.seo_description,
      product.vendor,
      product.product_type,
      product.tags?.join(' '),
      product.material,
      product.color,
      product.fit,
      product.occasion?.join(' '),
      product.season?.join(' '),
      product.style?.join(' '),
      product.care_instructions,
    ].filter(Boolean);

    return parts.join(' ').replace(/\s+/g, ' ').toLowerCase().trim();
  }

  private extractFeatures(product: Product): ProcessedProduct['features'] {
    // Extract price range
    const price = this.extractPrice(product);
    const priceRange = this.categorizePriceRange(price);

    // Determine formality level
    const formality = this.determineFormality(product);

    // Extract color family
    const colorFamily = this.extractColorFamily(product);

    // Extract sizing information
    const sizingInfo = this.extractSizingInfo(product);

    // Generate recommendations
    const recommendations = this.generateRecommendations(product);

    return {
      priceRange,
      formality,
      colorFamily,
      sizingInfo,
      recommendations,
    };
  }

  private extractPrice(product: Product): number {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .map(v => parseFloat(v.price || '0'))
        .filter(p => p > 0);
      
      if (prices.length > 0) {
        return Math.min(...prices);
      }
    }
    return 0;
  }

  private categorizePriceRange(price: number): 'budget' | 'mid' | 'luxury' {
    if (price < 100) return 'budget';
    if (price < 300) return 'mid';
    return 'luxury';
  }

  private determineFormality(product: Product): 'casual' | 'business' | 'formal' {
    const text = (product.searchableText || '').toLowerCase();
    const tags = product.tags?.map(t => t.toLowerCase()) || [];
    
    if (text.includes('tuxedo') || text.includes('formal') || tags.includes('formal')) {
      return 'formal';
    }
    if (text.includes('business') || text.includes('office') || tags.includes('business')) {
      return 'business';
    }
    return 'casual';
  }

  private extractColorFamily(product: Product): string {
    const colorMap: { [key: string]: string } = {
      'black': 'black',
      'white': 'white',
      'gray': 'gray',
      'grey': 'gray',
      'navy': 'blue',
      'blue': 'blue',
      'red': 'red',
      'burgundy': 'red',
      'green': 'green',
      'brown': 'brown',
      'tan': 'brown',
      'beige': 'neutral',
      'cream': 'neutral',
      'charcoal': 'gray',
      'ivory': 'neutral',
      'wine': 'red',
      'maroon': 'red',
    };

    const text = (product.color || product.title || '').toLowerCase();
    
    for (const [color, family] of Object.entries(colorMap)) {
      if (text.includes(color)) {
        return family;
      }
    }
    
    return 'neutral';
  }

  private extractSizingInfo(product: Product): string {
    const sizes: string[] = [];
    
    if (product.variants) {
      product.variants.forEach(variant => {
        if (variant.option1 && !sizes.includes(variant.option1)) {
          sizes.push(variant.option1);
        }
      });
    }

    if (sizes.length > 0) {
      return `Available in sizes: ${sizes.join(', ')}`;
    }

    return 'Standard sizing available';
  }

  private generateRecommendations(product: Product): string[] {
    const recommendations: string[] = [];
    const type = (product.product_type || '').toLowerCase();
    
    // Generate outfit recommendations based on product type
    if (type.includes('suit') || type.includes('tuxedo')) {
      recommendations.push('Pair with a crisp white dress shirt');
      recommendations.push('Add a silk tie or bow tie');
      recommendations.push('Complete with Oxford or Derby shoes');
    } else if (type.includes('shirt')) {
      recommendations.push('Layer under a blazer for formal occasions');
      recommendations.push('Wear with chinos for smart casual');
      recommendations.push('Pair with jeans for a relaxed look');
    } else if (type.includes('tie') || type.includes('bowtie')) {
      recommendations.push('Match with a complementary pocket square');
      recommendations.push('Coordinate with your suit color');
      recommendations.push('Consider the occasion formality');
    } else if (type.includes('shoe')) {
      recommendations.push('Match belt color to shoe color');
      recommendations.push('Choose appropriate socks');
      recommendations.push('Consider the dress code');
    }

    return recommendations;
  }

  async saveProcessedData(outputPath: string): Promise<void> {
    try {
      await fs.writeFile(
        outputPath,
        JSON.stringify(this.processedProducts, null, 2)
      );
      throw error;
    }
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProcessedProducts(): ProcessedProduct[] {
    return this.processedProducts;
  }

  // Method to get products by category
  getProductsByCategory(category: string): ProcessedProduct[] {
    return this.processedProducts.filter(product => {
      const type = product.product_type?.toLowerCase() || '';
      const tags = product.tags?.map(t => t.toLowerCase()) || [];
      const categoryLower = category.toLowerCase();
      
      return type.includes(categoryLower) || tags.includes(categoryLower);
    });
  }

  // Method to get products by price range
  getProductsByPriceRange(min: number, max: number): ProcessedProduct[] {
    return this.processedProducts.filter(product => {
      const price = this.extractPrice(product);
      return price >= min && price <= max;
    });
  }

  // Method to get products by color
  getProductsByColor(color: string): ProcessedProduct[] {
    return this.processedProducts.filter(product => {
      const productColor = product.color?.toLowerCase() || '';
      const title = product.title?.toLowerCase() || '';
      const colorLower = color.toLowerCase();
      
      return productColor.includes(colorLower) || title.includes(colorLower);
    });
  }
}

// Export singleton instance
export const dataProcessor = new DataProcessor();