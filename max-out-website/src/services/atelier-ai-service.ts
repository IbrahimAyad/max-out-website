import axios from 'axios';

interface ConversationStartResponse {
  sessionId: string;
  framework: string;
  message: string;
  suggestions?: string[];
}

interface MessageResponse {
  message: string;
  suggestions?: string[];
  products?: any[];
  layerLevel?: 1 | 2 | 3;
  intent?: string;
  sentiment?: number;
  nextBestActions?: string[];
}

interface CustomerIntelligence {
  segmentation: {
    primarySegment: string;
    characteristics: string[];
    dynamicPersona: any;
  };
  salesOptimization: {
    pricing?: any;
    bundles?: any[];
    crossSell?: any[];
  };
  predictions: {
    purchaseProbability?: number;
    lifetimeValue?: number;
    churnRisk?: number;
  };
}

export class AtelierAIService {
  private apiUrl: string;
  private apiKey: string;
  private sessionId: string | null = null;
  private ws: WebSocket | null = null;
  private chatEnabled: boolean;

  constructor() {
    // Updated Railway deployment URLs
    this.apiUrl = process.env.NEXT_PUBLIC_KCT_API_URL || 'https://kct-knowledge-api-2-production.up.railway.app';
    this.apiKey = process.env.NEXT_PUBLIC_KCT_API_KEY || '';
    this.chatEnabled = process.env.NEXT_PUBLIC_KCT_CHAT_ENABLED === 'true';
  }

  async startConversation(customerId?: string): Promise<ConversationStartResponse> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v3/chat/conversation/start`,
        { 
          customerId,
          channel: 'web',
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            currentPage: window.location.pathname
          }
        },
        { 
          headers: { 
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      this.sessionId = response.data.sessionId;
      return response.data;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      // Fallback response
      return {
        sessionId: `local-${Date.now()}`,
        framework: 'atelierAI',
        message: "Welcome to Atelier AI, your personal luxury menswear consultant. I embody the Sterling Crown philosophy - where luxury is a mindset, not just a price tag. How may I elevate your style today?",
        suggestions: ["Find my perfect suit", "Wedding styling", "Business attire guide", "Seasonal recommendations"]
      };
    }
  }

  async sendMessage(message: string, images?: string[]): Promise<MessageResponse> {
    if (!this.sessionId) {
      await this.startConversation();
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v3/chat/conversation/message`,
        { 
          sessionId: this.sessionId, 
          message,
          images,
          timestamp: new Date().toISOString()
        },
        { 
          headers: { 
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          } 
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Fallback response with intelligent mock data
      return this.generateFallbackResponse(message);
    }
  }

  async getCustomerIntelligence(customerId: string): Promise<CustomerIntelligence | null> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/v1/integration/customer-intelligence/${customerId}`,
        { 
          headers: { 
            'X-API-Key': this.apiKey 
          } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get customer intelligence:', error);
      return null;
    }
  }

  connectWebSocket(onMessage: (data: any) => void): WebSocket | null {
    try {
      const wsUrl = this.apiUrl.replace('http', 'ws').replace('https', 'wss');
      this.ws = new WebSocket(`${wsUrl}/ws`);
      
      this.ws.onopen = () => {
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
      };

      return this.ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      return null;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = null;
  }

  private generateFallbackResponse(message: string): MessageResponse {
    const lowerMessage = message.toLowerCase();
    
    // Wedding response
    if (lowerMessage.includes('wedding')) {
      return {
        message: "Congratulations on your upcoming wedding! I'll help you create the perfect look for your special day. Based on the Sterling Crown philosophy, let's explore options that reflect your personal style while ensuring you look absolutely distinguished.",
        suggestions: ["Classic black tuxedo", "Navy suit options", "Three-piece suits", "Accessories guide"],
        products: [],
        layerLevel: 1
      };
    }
    
    // Style personality
    if (lowerMessage.includes('style') && lowerMessage.includes('personality')) {
      return {
        message: "Let's discover your unique style identity! In the Sterling Crown philosophy, we believe your attire should amplify your personal narrative. Are you drawn to timeless elegance, modern minimalism, or perhaps a fusion of classic and contemporary?",
        suggestions: ["Classic Gentleman", "Modern Professional", "Fashion Forward", "Smart Casual"],
        layerLevel: 1
      };
    }
    
    // Suit recommendations
    if (lowerMessage.includes('suit') || lowerMessage.includes('perfect')) {
      return {
        message: "I'll curate the perfect suit selection for you. At KCT, we believe in the transformative power of a well-tailored suit - it's not just clothing, it's confidence materialized. Let me show you options that align with your lifestyle and aspirations.",
        suggestions: ["Business suits", "Wedding suits", "Casual blazers", "Complete outfit"],
        products: [],
        layerLevel: 2
      };
    }
    
    // Default intelligent response
    return {
      message: "I understand you're looking for sophisticated style guidance. Let me curate the perfect recommendations for you based on our Sterling Crown philosophy. Each piece is selected not just for its quality, but for how it empowers your personal narrative.",
      suggestions: ["Show me suits", "Style consultation", "Occasion wear", "Trending now"],
      layerLevel: 1
    };
  }
}

// Singleton instance
export const atelierAIService = new AtelierAIService();