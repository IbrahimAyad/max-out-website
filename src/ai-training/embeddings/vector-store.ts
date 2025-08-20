import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config';
import { ProcessedProduct } from '../data/processor';

export interface VectorPoint {
  id: string;
  vector: number[];
  payload: {
    product_id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    color: string;
    material: string;
    occasion: string[];
    style: string[];
    searchableText: string;
    features: any;
  };
}

export class VectorStore {
  private client: QdrantClient;
  private collectionName: string;

  constructor() {
    this.client = new QdrantClient({
      url: config.qdrant.url,
      apiKey: config.qdrant.apiKey,
    });
    this.collectionName = config.qdrant.collectionName;
  }

  async initialize(): Promise<void> {
    try {
      // Check if collection exists
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(
        c => c.name === this.collectionName
      );

      if (exists) {
        }
      } else {
        await this.createCollection();
      }
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw error;
    }
  }

  private async createCollection(): Promise<void> {
    try {
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: config.qdrant.vectorSize,
          distance: 'Cosine',
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 2,
      });

      // Create indexes for faster filtering
      await this.client.createPayloadIndex(this.collectionName, {
        field_name: 'category',
        field_schema: 'keyword',
      });

      await this.client.createPayloadIndex(this.collectionName, {
        field_name: 'price',
        field_schema: 'float',
      });

      await this.client.createPayloadIndex(this.collectionName, {
        field_name: 'color',
        field_schema: 'keyword',
      });

      throw error;
    }
  }

  async upsertVectors(vectors: VectorPoint[]): Promise<void> {
    try {
      const points = vectors.map((vector, index) => ({
        id: vector.id || index,
        vector: vector.vector,
        payload: vector.payload,
      }));

      // Batch upsert for better performance
      const batchSize = config.training.batchSize;
      for (let i = 0; i < points.length; i += batchSize) {
        const batch = points.slice(i, i + batchSize);
        
        await this.client.upsert(this.collectionName, {
          wait: true,
          points: batch,
        });

    } catch (error) {
      console.error('Error upserting vectors:', error);
      throw error;
    }
  }

  async search(
    queryVector: number[],
    limit: number = 5,
    filter?: any
  ): Promise<any[]> {
    try {
      const searchResult = await this.client.search(this.collectionName, {
        vector: queryVector,
        limit,
        filter,
        with_payload: true,
        with_vector: false,
      });

      return searchResult;
    } catch (error) {
      console.error('Error searching vectors:', error);
      throw error;
    }
  }

  async searchByCategory(
    queryVector: number[],
    category: string,
    limit: number = 5
  ): Promise<any[]> {
    const filter = {
      must: [
        {
          key: 'category',
          match: { value: category },
        },
      ],
    };

    return this.search(queryVector, limit, filter);
  }

  async searchByPriceRange(
    queryVector: number[],
    minPrice: number,
    maxPrice: number,
    limit: number = 5
  ): Promise<any[]> {
    const filter = {
      must: [
        {
          key: 'price',
          range: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      ],
    };

    return this.search(queryVector, limit, filter);
  }

  async searchByOccasion(
    queryVector: number[],
    occasion: string,
    limit: number = 5
  ): Promise<any[]> {
    const filter = {
      must: [
        {
          key: 'occasion',
          match: { any: [occasion] },
        },
      ],
    };

    return this.search(queryVector, limit, filter);
  }

  async getRecommendations(
    productId: string,
    limit: number = 5
  ): Promise<any[]> {
    try {
      // First, get the product's vector
      const result = await this.client.retrieve(this.collectionName, {
        ids: [productId],
        with_vector: true,
      });

      if (result.length === 0) {
        throw new Error(`Product ${productId} not found`);
      }

      const productVector = result[0].vector;

      // Search for similar products, excluding the original
      const recommendations = await this.client.search(this.collectionName, {
        vector: productVector as number[],
        limit: limit + 1, // Get one extra to account for the original
        with_payload: true,
      });

      // Filter out the original product
      return recommendations.filter(r => r.payload?.product_id !== productId).slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  async getCollectionInfo(): Promise<any> {
    try {
      return await this.client.getCollection(this.collectionName);
    } catch (error) {
      console.error('Error getting collection info:', error);
      throw error;
    }
  }

  async deleteCollection(): Promise<void> {
    try {
      await this.client.deleteCollection(this.collectionName);
      throw error;
    }
  }
}

// Export singleton instance
export const vectorStore = new VectorStore();