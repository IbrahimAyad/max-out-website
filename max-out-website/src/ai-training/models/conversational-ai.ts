import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory, ConversationSummaryMemory } from 'langchain/memory';
import { 
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts';
import { config } from '../config';
import { vectorStore } from '../embeddings/vector-store';
import { embeddingsGenerator } from '../embeddings/generator';
import fs from 'fs/promises';
import path from 'path';

export interface ConversationContext {
  userId?: string;
  sessionId: string;
  preferences?: {
    budget?: { min: number; max: number };
    style?: string[];
    occasion?: string;
    size?: string;
    color?: string[];
  };
}

export interface AIResponse {
  message: string;
  products?: any[];
  suggestions?: string[];
  metadata?: {
    confidence: number;
    intent: string;
    entities: any;
  };
}

export class ConversationalAI {
  private model: ChatOpenAI;
  private memory: Map<string, BufferMemory> = new Map();
  private knowledgeBase: any;
  private trainingPrompts: any;

  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: config.openai.apiKey,
      modelName: config.openai.chatModel,
      temperature: config.openai.temperature,
      maxTokens: config.openai.maxTokens,
    });

    this.loadKnowledgeBase();
  }

  private async loadKnowledgeBase(): Promise<void> {
    try {
      const knowledgePath = path.join(
        process.cwd(),
        'src/ai-training/models/knowledge_base.json'
      );
      const promptsPath = path.join(
        process.cwd(),
        'src/ai-training/models/training_prompts.json'
      );

      const [knowledgeData, promptsData] = await Promise.all([
        fs.readFile(knowledgePath, 'utf-8'),
        fs.readFile(promptsPath, 'utf-8'),
      ]);

      this.knowledgeBase = JSON.parse(knowledgeData);
      this.trainingPrompts = JSON.parse(promptsData);
    } catch (error) {
      console.warn('Could not load knowledge base, using defaults');
      this.knowledgeBase = {};
      this.trainingPrompts = {
        systemPrompt: 'You are a helpful fashion consultant for KCT Menswear.',
      };
    }
  }

  async processQuery(
    query: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    try {
      // Detect intent and extract entities
      const intent = await this.detectIntent(query);
      const entities = await this.extractEntities(query);

      // Get or create memory for this session
      const memory = this.getOrCreateMemory(context.sessionId);

      // Search for relevant products if needed
      let relevantProducts: any[] = [];
      if (this.shouldSearchProducts(intent)) {
        relevantProducts = await this.searchProducts(query, context);
      }

      // Create enhanced prompt with context
      const enhancedPrompt = this.createEnhancedPrompt(
        query,
        relevantProducts,
        context,
        intent,
        entities
      );

      // Generate response using chain
      const chain = new ConversationChain({
        llm: this.model,
        memory,
        prompt: enhancedPrompt,
      });

      const response = await chain.call({ input: query });

      // Post-process response
      const processedResponse = await this.postProcessResponse(
        response.response,
        relevantProducts,
        intent,
        entities
      );

      return processedResponse;
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        message: "I apologize, but I'm having trouble processing your request. Could you please try rephrasing your question?",
        metadata: {
          confidence: 0,
          intent: 'error',
          entities: {},
        },
      };
    }
  }

  private async detectIntent(query: string): Promise<string> {
    const intents = {
      product_search: ['looking for', 'need', 'want', 'show me', 'find'],
      recommendation: ['recommend', 'suggest', 'what should', 'help me choose'],
      sizing: ['size', 'fit', 'measurement', 'how does it fit'],
      styling: ['wear', 'match', 'coordinate', 'goes with', 'outfit'],
      care: ['care', 'clean', 'wash', 'maintain', 'iron'],
      price: ['cost', 'price', 'expensive', 'budget', 'afford'],
      occasion: ['wedding', 'prom', 'business', 'formal', 'casual', 'party'],
      comparison: ['difference', 'compare', 'versus', 'or', 'better'],
    };

    const queryLower = query.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  private async extractEntities(query: string): Promise<any> {
    const entities: any = {};
    const queryLower = query.toLowerCase();

    // Extract colors
    const colors = ['black', 'navy', 'grey', 'blue', 'white', 'burgundy', 'red', 'brown'];
    entities.colors = colors.filter(color => queryLower.includes(color));

    // Extract occasions
    const occasions = ['wedding', 'prom', 'business', 'formal', 'casual', 'party', 'date'];
    entities.occasions = occasions.filter(occasion => queryLower.includes(occasion));

    // Extract product types
    const productTypes = ['suit', 'tuxedo', 'shirt', 'tie', 'shoes', 'blazer', 'pants', 'vest'];
    entities.productTypes = productTypes.filter(type => queryLower.includes(type));

    // Extract price mentions
    const priceMatch = queryLower.match(/\$?(\d+)/g);
    if (priceMatch) {
      entities.priceRange = priceMatch.map(p => parseInt(p.replace('$', '')));
    }

    // Extract sizes
    const sizePatterns = /\b(small|medium|large|xl|xxl|\d{2}[rsl]?)\b/gi;
    const sizeMatches = queryLower.match(sizePatterns);
    if (sizeMatches) {
      entities.sizes = sizeMatches;
    }

    return entities;
  }

  private shouldSearchProducts(intent: string): boolean {
    const searchIntents = ['product_search', 'recommendation', 'comparison', 'occasion'];
    return searchIntents.includes(intent);
  }

  private async searchProducts(
    query: string,
    context: ConversationContext
  ): Promise<any[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await embeddingsGenerator.generateQueryEmbedding(query);

      // Build filter based on context preferences
      const filter = this.buildSearchFilter(context);

      // Search in vector store
      const results = await vectorStore.search(queryEmbedding, 5, filter);

      return results.map(result => ({
        ...result.payload,
        score: result.score,
      }));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  private buildSearchFilter(context: ConversationContext): any {
    const filter: any = { must: [] };

    if (context.preferences) {
      if (context.preferences.budget) {
        filter.must.push({
          key: 'price',
          range: {
            gte: context.preferences.budget.min,
            lte: context.preferences.budget.max,
          },
        });
      }

      if (context.preferences.occasion) {
        filter.must.push({
          key: 'occasion',
          match: { any: [context.preferences.occasion] },
        });
      }

      if (context.preferences.color && context.preferences.color.length > 0) {
        filter.must.push({
          key: 'color',
          match: { any: context.preferences.color },
        });
      }
    }

    return filter.must.length > 0 ? filter : undefined;
  }

  private createEnhancedPrompt(
    query: string,
    products: any[],
    context: ConversationContext,
    intent: string,
    entities: any
  ): ChatPromptTemplate {
    const systemMessage = `${this.trainingPrompts.systemPrompt}

Current Context:
- Intent: ${intent}
- Customer preferences: ${JSON.stringify(context.preferences || {})}
- Detected entities: ${JSON.stringify(entities)}

Available Knowledge:
- Total products in catalog: ${this.knowledgeBase.totalProducts || 411}
- Categories: ${Object.keys(this.knowledgeBase.categories || {}).join(', ')}
- Price ranges: Budget (<$100), Mid ($100-$300), Luxury ($300+)

${products.length > 0 ? `
Relevant Products Found:
${products.map((p, i) => `
${i + 1}. ${p.title} - $${p.price}
   Category: ${p.category}
   Color: ${p.color}
   Features: ${JSON.stringify(p.features)}
`).join('\n')}
` : ''}

Guidelines:
1. Be helpful and professional
2. Provide specific product recommendations when relevant
3. Include styling advice and outfit coordination tips
4. Mention care instructions when discussing specific materials
5. Consider the customer's budget and preferences
6. Use the product information provided above when making recommendations`;

    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemMessage),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);
  }

  private async postProcessResponse(
    response: string,
    products: any[],
    intent: string,
    entities: any
  ): Promise<AIResponse> {
    // Extract suggestions from response
    const suggestions = this.extractSuggestions(response);

    // Calculate confidence based on product matches and intent clarity
    const confidence = this.calculateConfidence(products, intent);

    return {
      message: response,
      products: products.slice(0, 3), // Return top 3 products
      suggestions,
      metadata: {
        confidence,
        intent,
        entities,
      },
    };
  }

  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];

    // Look for bullet points or numbered lists
    const listItems = response.match(/[•\-\*\d]+\.?\s+(.+)/gm);
    if (listItems) {
      suggestions.push(...listItems.map(item => item.replace(/[•\-\*\d]+\.?\s+/, '').trim()));
    }

    // Look for recommendation phrases
    const recommendationPhrases = [
      /I (?:recommend|suggest) (.+?)(?:\.|,|$)/gi,
      /You (?:should|could|might) (?:consider|try) (.+?)(?:\.|,|$)/gi,
      /(?:Consider|Try) (.+?)(?:\.|,|$)/gi,
    ];

    recommendationPhrases.forEach(pattern => {
      const matches = response.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && !suggestions.includes(match[1])) {
          suggestions.push(match[1].trim());
        }
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  private calculateConfidence(products: any[], intent: string): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence if products were found
    if (products.length > 0) {
      confidence += 0.2;
      
      // Additional boost for high-scoring products
      const avgScore = products.reduce((sum, p) => sum + (p.score || 0), 0) / products.length;
      if (avgScore > 0.8) {
        confidence += 0.2;
      }
    }

    // Increase confidence for clear intents
    if (intent !== 'general') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  private getOrCreateMemory(sessionId: string): BufferMemory {
    if (!this.memory.has(sessionId)) {
      this.memory.set(sessionId, new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
      }));
    }
    return this.memory.get(sessionId)!;
  }

  clearMemory(sessionId: string): void {
    this.memory.delete(sessionId);
  }

  clearAllMemory(): void {
    this.memory.clear();
  }

  async getRecommendations(
    productId: string,
    limit: number = 5
  ): Promise<any[]> {
    try {
      return await vectorStore.getRecommendations(productId, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  async generateOutfit(
    mainPiece: string,
    occasion: string,
    budget?: number
  ): Promise<AIResponse> {
    const query = `Create a complete outfit with ${mainPiece} for ${occasion}${
      budget ? ` with a budget of $${budget}` : ''
    }`;

    const context: ConversationContext = {
      sessionId: `outfit_${Date.now()}`,
      preferences: {
        occasion,
        budget: budget ? { min: 0, max: budget } : undefined,
      },
    };

    return this.processQuery(query, context);
  }
}

// Export singleton instance
export const conversationalAI = new ConversationalAI();