import { OpenAI } from 'openai';
import { config } from '../config';
import { ProcessedProduct } from '../data/processor';
import { VectorPoint, vectorStore } from './vector-store';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export class EmbeddingsGenerator {
  private openai: OpenAI;
  private embeddingCache: Map<string, number[]> = new Map();
  private hashCachePath: string;
  private productHashCache: Record<string, string> = {};

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.hashCachePath = path.join(process.cwd(), 'src/ai-training/.cache/product_hashes.json');
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Check cache first
    if (this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text)!;
    }

    try {
      const response = await this.openai.embeddings.create({
        model: config.openai.embeddingModel,
        input: text,
      });

      const embedding = response.data[0].embedding;
      
      // Cache the embedding
      this.embeddingCache.set(text, embedding);
      
      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async generateProductEmbeddings(
    products: ProcessedProduct[]
  ): Promise<VectorPoint[]> {
    const vectors: VectorPoint[] = [];
    const batchSize = 20; // OpenAI batch limit

    await this.loadHashCache();

    // Compute content hashes and filter unchanged products (delta training)
    const productsToEmbed: Array<{ product: ProcessedProduct; hash: string }> = [];
    for (const product of products) {
      const hash = this.computeProductHash(product);
      if (this.productHashCache[product.id] !== hash) {
        productsToEmbed.push({ product, hash });
      }
    }

    if (productsToEmbed.length === 0) {

    for (let i = 0; i < productsToEmbed.length; i += batchSize) {
      const batch = productsToEmbed.slice(i, i + batchSize);
      
      try {
        // Prepare texts for batch embedding
        const texts = batch.map(({ product }) => this.createEmbeddingText(product));
        
        // Generate embeddings in batch
        const response = await this.openai.embeddings.create({
          model: config.openai.embeddingModel,
          input: texts,
        });

        // Process each embedding
        for (let j = 0; j < batch.length; j++) {
          const { product, hash } = batch[j];
          const embedding = response.data[j].embedding;
          
          vectors.push({
            id: product.id || `product_${i + j}`,
            vector: embedding,
            payload: this.createPayload(product),
          });

          // Update hash cache for this product
          this.productHashCache[product.id] = hash;
        }

      } catch (error) {
        console.error(`Error processing batch starting at index ${i}:`, error);
        // Continue with next batch
      }
    }

    return vectors;
  }

  private createEmbeddingText(product: ProcessedProduct): string {
    // Create rich text representation for embedding
    const parts = [
      // Basic information
      `Product: ${product.title}`,
      product.vendor ? `Brand: ${product.vendor}` : '',
      product.product_type ? `Type: ${product.product_type}` : '',
      
      // Description and details
      product.description || '',
      product.meta_description || '',
      
      // Features
      product.material ? `Material: ${product.material}` : '',
      product.color ? `Color: ${product.color}` : '',
      product.fit ? `Fit: ${product.fit}` : '',
      
      // Categories and tags
      product.occasion ? `Occasions: ${product.occasion.join(', ')}` : '',
      product.season ? `Seasons: ${product.season.join(', ')}` : '',
      product.style ? `Styles: ${product.style.join(', ')}` : '',
      product.tags ? `Tags: ${product.tags.join(', ')}` : '',
      
      // Extracted features
      `Price Range: ${product.features.priceRange}`,
      `Formality: ${product.features.formality}`,
      `Color Family: ${product.features.colorFamily}`,
      
      // Care instructions
      product.care_instructions || '',
      
      // Recommendations
      product.features.recommendations.join('. '),
    ].filter(Boolean);

    return parts.join('. ').replace(/\s+/g, ' ').trim();
  }

  private createPayload(product: ProcessedProduct): VectorPoint['payload'] {
    // Extract price from variants
    let price = 0;
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .map(v => parseFloat(v.price || '0'))
        .filter(p => p > 0);
      if (prices.length > 0) {
        price = Math.min(...prices);
      }
    }

    return {
      product_id: product.id,
      title: product.title,
      description: product.description || '',
      price,
      category: product.product_type || 'general',
      color: product.color || '',
      material: product.material || '',
      occasion: product.occasion || [],
      style: product.style || [],
      searchableText: product.searchableText,
      features: product.features,
    };
  }

  async generateQueryEmbedding(query: string): Promise<number[]> {
    // Enhance query with context for better matching
    const enhancedQuery = this.enhanceQuery(query);
    return this.generateEmbedding(enhancedQuery);
  }

  private enhanceQuery(query: string): string {
    const queryLower = query.toLowerCase();
    const enhancements: string[] = [query];

    // Add context based on common patterns
    if (queryLower.includes('wedding')) {
      enhancements.push('formal occasion elegant ceremony');
    }
    if (queryLower.includes('prom')) {
      enhancements.push('formal dance young stylish');
    }
    if (queryLower.includes('business')) {
      enhancements.push('professional office work formal');
    }
    if (queryLower.includes('casual')) {
      enhancements.push('relaxed comfortable everyday');
    }
    
    // Add color context
    const colors = ['black', 'navy', 'grey', 'blue', 'white', 'burgundy'];
    colors.forEach(color => {
      if (queryLower.includes(color)) {
        enhancements.push(`${color} colored`);
      }
    });

    // Add material context
    const materials = ['wool', 'cotton', 'silk', 'linen', 'polyester'];
    materials.forEach(material => {
      if (queryLower.includes(material)) {
        enhancements.push(`${material} fabric material`);
      }
    });

    return enhancements.join(' ');
  }

  async storeEmbeddings(vectors: VectorPoint[]): Promise<void> {
    try {
      await vectorStore.initialize();
      await vectorStore.upsertVectors(vectors);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache(): void {
    this.embeddingCache.clear();
    return crypto.createHash('sha256').update(toHash).digest('hex');
  }

  private async loadHashCache(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.hashCachePath), { recursive: true });
      const raw = await fs.readFile(this.hashCachePath, 'utf-8');
      this.productHashCache = JSON.parse(raw);
    } catch {
      this.productHashCache = {};
    }
  }

  private async saveHashCache(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.hashCachePath), { recursive: true });
      await fs.writeFile(this.hashCachePath, JSON.stringify(this.productHashCache, null, 2));
    } catch (err) {
      console.warn('Could not persist product hash cache:', err);
    }
  }
}

// Export singleton instance
export const embeddingsGenerator = new EmbeddingsGenerator();