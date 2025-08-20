import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    embeddingModel: 'text-embedding-3-small',
    chatModel: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000,
  },

  // Qdrant Vector Database Configuration
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY || '',
    collectionName: 'kct_products',
    vectorSize: 1536, // OpenAI embedding dimension
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // Training Configuration
  training: {
    batchSize: 50,
    chunkSize: 1000,
    overlapSize: 200,
    minConfidenceScore: 0.7,
  },

  // Product Knowledge Categories
  categories: {
    occasions: ['wedding', 'prom', 'business', 'casual', 'formal', 'party', 'date night'],
    styles: ['modern', 'classic', 'slim fit', 'regular fit', 'vintage', 'contemporary'],
    materials: ['wool', 'cotton', 'polyester', 'silk', 'linen', 'velvet', 'satin'],
    colors: ['black', 'navy', 'grey', 'blue', 'burgundy', 'white', 'charcoal', 'brown'],
    seasons: ['spring', 'summer', 'fall', 'winter', 'all-season'],
  },

  // AI Response Templates
  templates: {
    productRecommendation: `
      Based on your preferences, I recommend:
      {{productName}} - {{price}}
      
      Why this works:
      {{reasoning}}
      
      Style notes:
      {{styleNotes}}
      
      Care instructions:
      {{careInstructions}}
    `,
    outfitCoordination: `
      Complete outfit suggestion:
      {{mainPiece}}
      
      Coordinating pieces:
      {{coordinatingItems}}
      
      Color harmony:
      {{colorAnalysis}}
      
      Occasion suitability:
      {{occasionFit}}
    `,
  },

  // API Configuration
  api: {
    port: process.env.AI_API_PORT || 3001,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
};