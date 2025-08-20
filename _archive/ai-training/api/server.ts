#!/usr/bin/env tsx

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { conversationalAI, ConversationContext } from '../models/conversational-ai';
import { vectorStore } from '../embeddings/vector-store';
import { embeddingsGenerator } from '../embeddings/generator';
import { dataProcessor } from '../data/processor';
import { config } from '../config';

const app = express();
const PORT = config.api.port;

// Middleware
app.use(cors({ origin: config.api.corsOrigin }));
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting middleware
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + config.api.rateLimit.windowMs });
    return next();
  }
  
  const record = requestCounts.get(ip)!;
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + config.api.rateLimit.windowMs;
    return next();
  }
  
  if (record.count >= config.api.rateLimit.max) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
    });
  }
  
  record.count++;
  next();
};

app.use(rateLimiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KCT AI Training API',
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { query, sessionId, userId, preferences } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Missing query',
        message: 'Query is required',
      });
    }

    const context: ConversationContext = {
      sessionId: sessionId || `session_${Date.now()}`,
      userId,
      preferences,
    };

    const response = await conversationalAI.processQuery(query, context);

    res.json({
      success: true,
      data: response,
      sessionId: context.sessionId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process chat query',
    });
  }
});

// Product search endpoint
app.post('/api/search', async (req: Request, res: Response) => {
  try {
    const { query, filters, limit = 10 } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Missing query',
        message: 'Query is required',
      });
    }

    const embedding = await embeddingsGenerator.generateQueryEmbedding(query);
    const results = await vectorStore.search(embedding, limit, filters);

    res.json({
      success: true,
      data: {
        query,
        results: results.map(r => ({
          ...r.payload,
          score: r.score,
        })),
        total: results.length,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to search products',
    });
  }
});

// Product recommendations endpoint
app.get('/api/recommendations/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;

    const recommendations = await conversationalAI.getRecommendations(
      productId,
      Number(limit)
    );

    res.json({
      success: true,
      data: {
        productId,
        recommendations,
        total: recommendations.length,
      },
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get recommendations',
    });
  }
});

// Outfit generator endpoint
app.post('/api/outfit', async (req: Request, res: Response) => {
  try {
    const { mainPiece, occasion, budget } = req.body;

    if (!mainPiece || !occasion) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'mainPiece and occasion are required',
      });
    }

    const outfit = await conversationalAI.generateOutfit(
      mainPiece,
      occasion,
      budget
    );

    res.json({
      success: true,
      data: outfit,
    });
  } catch (error) {
    console.error('Outfit generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate outfit',
    });
  }
});

// Products by category endpoint
app.get('/api/products/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    await dataProcessor.loadProductData();
    await dataProcessor.processProducts();
    
    const products = dataProcessor.getProductsByCategory(category);
    const paginatedProducts = products.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    res.json({
      success: true,
      data: {
        category,
        products: paginatedProducts,
        total: products.length,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error('Category products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get products by category',
    });
  }
});

// Products by price range endpoint
app.get('/api/products/price', async (req: Request, res: Response) => {
  try {
    const { min = 0, max = 10000, limit = 20, offset = 0 } = req.query;

    await dataProcessor.loadProductData();
    await dataProcessor.processProducts();
    
    const products = dataProcessor.getProductsByPriceRange(
      Number(min),
      Number(max)
    );
    const paginatedProducts = products.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    res.json({
      success: true,
      data: {
        priceRange: { min: Number(min), max: Number(max) },
        products: paginatedProducts,
        total: products.length,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error('Price range products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get products by price range',
    });
  }
});

// Clear session memory endpoint
app.delete('/api/session/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    conversationalAI.clearMemory(sessionId);

    res.json({
      success: true,
      message: 'Session memory cleared',
    });
  } catch (error) {
    console.error('Clear session error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to clear session',
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    name: 'KCT AI Training API',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/chat',
        method: 'POST',
        description: 'Chat with AI assistant',
        body: {
          query: 'string (required)',
          sessionId: 'string (optional)',
          userId: 'string (optional)',
          preferences: 'object (optional)',
        },
      },
      {
        path: '/api/search',
        method: 'POST',
        description: 'Search products using semantic search',
        body: {
          query: 'string (required)',
          filters: 'object (optional)',
          limit: 'number (optional, default: 10)',
        },
      },
      {
        path: '/api/recommendations/:productId',
        method: 'GET',
        description: 'Get product recommendations',
        params: {
          productId: 'string (required)',
        },
        query: {
          limit: 'number (optional, default: 5)',
        },
      },
      {
        path: '/api/outfit',
        method: 'POST',
        description: 'Generate complete outfit suggestions',
        body: {
          mainPiece: 'string (required)',
          occasion: 'string (required)',
          budget: 'number (optional)',
        },
      },
      {
        path: '/api/products/category/:category',
        method: 'GET',
        description: 'Get products by category',
        params: {
          category: 'string (required)',
        },
        query: {
          limit: 'number (optional, default: 20)',
          offset: 'number (optional, default: 0)',
        },
      },
      {
        path: '/api/products/price',
        method: 'GET',
        description: 'Get products by price range',
        query: {
          min: 'number (optional, default: 0)',
          max: 'number (optional, default: 10000)',
          limit: 'number (optional, default: 20)',
          offset: 'number (optional, default: 0)',
        },
      },
      {
        path: '/api/session/:sessionId',
        method: 'DELETE',
        description: 'Clear session memory',
        params: {
          sessionId: 'string (required)',
        },
      },
    ],
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
  });
});

// Start server
async function startServer() {
  try {
    // Initialize components
    await dataProcessor.processProducts();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
});

process.on('SIGTERM', () => {
});

// Start the server
if (require.main === module) {
  startServer();
}

export { app, startServer };