# KCT Menswear AI Training Pipeline

## Overview

This comprehensive AI training pipeline processes 411+ KCT menswear products to create an intelligent conversational AI system capable of:
- Product recommendations
- Outfit coordination
- Style advice
- Sizing guidance
- Care instructions
- Price-based suggestions

## Features

### 1. Data Processing
- Loads and merges product data from multiple sources
- Validates and normalizes product information
- Extracts features for AI understanding

### 2. Vector Database
- Generates embeddings for semantic search
- Stores vectors in Qdrant for fast retrieval
- Supports filtered searches by category, price, occasion

### 3. Conversational AI
- Natural language understanding
- Context-aware responses
- Multi-turn conversations
- Intent detection and entity extraction

### 4. API Endpoints
- RESTful API for integration
- Chat interface
- Product search
- Recommendations
- Outfit generation

## Installation

```bash
# Navigate to the AI training directory
cd src/ai-training

# Install dependencies
npm install

# Install Commander globally for CLI
npm install -g commander
```

## Configuration

Create a `.env.local` file in the project root with:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Qdrant Configuration (optional, defaults to local)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key

# API Configuration
AI_API_PORT=3001
CORS_ORIGIN=*
```

## Usage

### Quick Start

Run the complete pipeline (training + evaluation + server):

```bash
npm run full
```

### Individual Commands

#### 1. Train the AI System

```bash
npm run train
# or with recreation of vector database
npm run train -- --recreate
```

This will:
- Load 411+ products from the database
- Process and enhance product data
- Generate embeddings for each product
- Store vectors in Qdrant
- Create knowledge base and training prompts

#### 2. Evaluate the System

```bash
npm run evaluate
```

This runs comprehensive tests on:
- Intent detection accuracy
- Product search relevance
- Response quality
- Performance metrics

#### 3. Start the API Server

```bash
npm run serve
# or on a different port
npm run serve -- --port 4000
```

#### 4. Individual Scripts

```bash
# Prepare data only
npm run prepare-data

# Generate embeddings only
npm run generate-embeddings

# Start API server
npm run start-api
```

## API Endpoints

### Chat with AI
```bash
POST /api/chat
{
  "query": "I need a navy suit for a wedding",
  "sessionId": "user123",
  "preferences": {
    "budget": { "min": 200, "max": 500 },
    "occasion": "wedding"
  }
}
```

### Search Products
```bash
POST /api/search
{
  "query": "black tuxedo",
  "limit": 10,
  "filters": {
    "must": [
      { "key": "category", "match": { "value": "suits" } }
    ]
  }
}
```

### Get Recommendations
```bash
GET /api/recommendations/product123?limit=5
```

### Generate Outfit
```bash
POST /api/outfit
{
  "mainPiece": "navy suit",
  "occasion": "business meeting",
  "budget": 500
}
```

### Get Products by Category
```bash
GET /api/products/category/suits?limit=20&offset=0
```

### Get Products by Price Range
```bash
GET /api/products/price?min=100&max=300&limit=20
```

## Testing

### Example Test Queries

```javascript
// Product Search
"Show me black tuxedos for a wedding"
"I need a navy blue suit under $300"

// Recommendations
"What should I wear to a summer wedding?"
"Recommend a complete outfit for prom"

// Sizing
"How does the slim fit suit run?"
"What size shirt for a 16 inch neck?"

// Styling
"What color tie goes with a charcoal grey suit?"
"How do I coordinate a pocket square?"

// Care Instructions
"How do I care for a wool suit?"
"Can I machine wash a cotton dress shirt?"
```

## Architecture

```
src/ai-training/
├── data/
│   ├── processor.ts       # Data loading and processing
│   └── processed_products.json
├── embeddings/
│   ├── generator.ts       # Embedding generation
│   └── vector-store.ts    # Qdrant integration
├── models/
│   ├── conversational-ai.ts  # LangChain AI implementation
│   ├── knowledge_base.json   # Product knowledge
│   └── training_prompts.json # AI prompts
├── evaluation/
│   ├── evaluate.ts        # System evaluation
│   └── results.json       # Test results
├── api/
│   └── server.ts          # Express API server
├── config.ts              # Configuration
├── train.ts               # Training pipeline
├── index.ts               # CLI entry point
└── package.json           # Dependencies
```

## Performance Metrics

After training on 411+ products:
- Embedding generation: ~1-2 minutes
- Vector storage: < 30 seconds
- Query response time: < 500ms
- Intent accuracy: > 85%
- Product relevance: > 80%

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   - Ensure `OPENAI_API_KEY` is set in `.env.local`

2. **Qdrant Connection Error**
   - Start Qdrant locally: `docker run -p 6333:6333 qdrant/qdrant`

3. **Memory Issues**
   - Reduce batch size in `config.ts`

4. **Rate Limiting**
   - Add delays between API calls
   - Use smaller batch sizes

## Advanced Usage

### Custom Training Data

Add new products to the training data:

```javascript
// In data/custom_products.json
[
  {
    "id": "custom_1",
    "title": "Custom Product",
    "description": "Product description",
    "variants": [{ "price": "199.99" }],
    // ... other fields
  }
]
```

### Extend Conversation Capabilities

Edit `models/training_prompts.json` to add new conversation examples and capabilities.

### Custom Filters

Add new search filters in `embeddings/vector-store.ts`:

```typescript
async searchByCustomFilter(
  queryVector: number[],
  customField: string,
  customValue: any
): Promise<any[]> {
  const filter = {
    must: [{
      key: customField,
      match: { value: customValue }
    }]
  };
  return this.search(queryVector, 5, filter);
}
```

## Production Deployment

1. Use environment variables for all sensitive data
2. Set up Qdrant cloud instance for production
3. Implement caching for frequent queries
4. Add monitoring and logging
5. Set up rate limiting and authentication

## Support

For issues or questions:
1. Check the evaluation results in `evaluation/results.json`
2. Review API logs for errors
3. Ensure all dependencies are installed
4. Verify data files exist and are valid JSON

## License

© 2024 KCT Menswear. All rights reserved.