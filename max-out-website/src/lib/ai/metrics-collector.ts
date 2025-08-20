// AI Metrics Collection System
// Tracks performance, learns from interactions, and optimizes responses

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface ConversationMetric {
  sessionId: string
  userId?: string
  timestamp: Date
  agent: string
  intent: string
  message: string
  response: string
  responseTime: number
  confidence: number
  emotion?: string
  urgency?: string
  quickRepliesUsed: boolean
  followUpEngaged: boolean
  handoffRequested: boolean
  resolved: boolean
  satisfaction?: number
  conversionEvent?: string
  revenue?: number
}

export interface AgentMetric {
  agentName: string
  period: string
  totalConversations: number
  avgResponseTime: number
  avgConfidence: number
  satisfactionScore: number
  conversionRate: number
  handoffRate: number
  resolutionRate: number
  topIntents: string[]
  commonIssues: string[]
}

export interface ResponseMetric {
  responseId: string
  scenarioId: string
  variant: 'primary' | 'alternative'
  impressions: number
  selections: number
  satisfactionSum: number
  conversions: number
  avgResponseTime: number
}

export class MetricsCollector {
  private buffer: ConversationMetric[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private responseCache = new Map<string, ResponseMetric>()
  
  constructor() {
    // Flush metrics every 30 seconds
    this.flushInterval = setInterval(() => this.flush(), 30000)
  }
  
  // Track conversation metric
  async trackConversation(metric: Partial<ConversationMetric>) {
    const fullMetric: ConversationMetric = {
      sessionId: metric.sessionId || `session_${Date.now()}`,
      timestamp: new Date(),
      agent: metric.agent || 'unknown',
      intent: metric.intent || 'general',
      message: metric.message || '',
      response: metric.response || '',
      responseTime: metric.responseTime || 0,
      confidence: metric.confidence || 0,
      quickRepliesUsed: metric.quickRepliesUsed || false,
      followUpEngaged: metric.followUpEngaged || false,
      handoffRequested: metric.handoffRequested || false,
      resolved: metric.resolved || false,
      ...metric
    }
    
    this.buffer.push(fullMetric)
    
    // Flush if buffer is large
    if (this.buffer.length >= 50) {
      await this.flush()
    }
  }
  
  // Track response effectiveness
  trackResponseEffectiveness(
    responseId: string,
    scenarioId: string,
    variant: 'primary' | 'alternative',
    satisfaction?: number,
    converted?: boolean
  ) {
    const key = `${scenarioId}_${variant}`
    const existing = this.responseCache.get(key) || {
      responseId,
      scenarioId,
      variant,
      impressions: 0,
      selections: 0,
      satisfactionSum: 0,
      conversions: 0,
      avgResponseTime: 0
    }
    
    existing.impressions++
    if (satisfaction) {
      existing.selections++
      existing.satisfactionSum += satisfaction
    }
    if (converted) {
      existing.conversions++
    }
    
    this.responseCache.set(key, existing)
  }
  
  // Flush metrics to database
  async flush() {
    if (this.buffer.length === 0) return
    
    const metricsToSave = [...this.buffer]
    this.buffer = []
    
    try {
      // Save conversation metrics
      const { error } = await supabase
        .from('ai_conversation_metrics')
        .insert(metricsToSave)
      
      if (error) {
        console.error('Failed to save metrics:', error)
        // Re-add to buffer if failed
        this.buffer.unshift(...metricsToSave)
      }
      
      // Save response effectiveness metrics
      if (this.responseCache.size > 0) {
        const responseMetrics = Array.from(this.responseCache.values())
        await supabase
          .from('ai_response_metrics')
          .upsert(responseMetrics)
        
        this.responseCache.clear()
      }
    } catch (error) {
      console.error('Metrics flush error:', error)
    }
  }
  
  // Get agent performance metrics
  async getAgentMetrics(agentName: string, period: '24h' | '7d' | '30d'): Promise<AgentMetric> {
    const startDate = this.getStartDate(period)
    
    const { data, error } = await supabase
      .from('ai_conversation_metrics')
      .select('*')
      .eq('agent', agentName)
      .gte('timestamp', startDate.toISOString())
    
    if (error || !data) {
      return this.getEmptyAgentMetric(agentName, period)
    }
    
    return this.calculateAgentMetrics(agentName, period, data)
  }
  
  // Get conversation trends
  async getConversationTrends(period: '24h' | '7d' | '30d') {
    const startDate = this.getStartDate(period)
    
    const { data, error } = await supabase
      .from('ai_conversation_metrics')
      .select('timestamp, agent, resolved, handoffRequested, satisfaction')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true })
    
    if (error || !data) return []
    
    // Group by day/hour
    const grouped = this.groupByTimeInterval(data, period)
    return grouped
  }
  
  // Get top performing responses
  async getTopResponses(limit = 10): Promise<ResponseMetric[]> {
    const { data, error } = await supabase
      .from('ai_response_metrics')
      .select('*')
      .order('conversions', { ascending: false })
      .limit(limit)
    
    return data || []
  }
  
  // Calculate satisfaction score
  async getSatisfactionScore(period: '24h' | '7d' | '30d'): Promise<number> {
    const startDate = this.getStartDate(period)
    
    const { data } = await supabase
      .from('ai_conversation_metrics')
      .select('satisfaction')
      .gte('timestamp', startDate.toISOString())
      .not('satisfaction', 'is', null)
    
    if (!data || data.length === 0) return 0
    
    const sum = data.reduce((acc, m) => acc + (m.satisfaction || 0), 0)
    return sum / data.length
  }
  
  // Get emotion distribution
  async getEmotionDistribution(period: '24h' | '7d' | '30d') {
    const startDate = this.getStartDate(period)
    
    const { data } = await supabase
      .from('ai_conversation_metrics')
      .select('emotion')
      .gte('timestamp', startDate.toISOString())
      .not('emotion', 'is', null)
    
    if (!data) return []
    
    const emotions = new Map<string, number>()
    data.forEach(m => {
      const count = emotions.get(m.emotion) || 0
      emotions.set(m.emotion, count + 1)
    })
    
    const total = data.length
    return Array.from(emotions.entries()).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: (count / total * 100).toFixed(1)
    }))
  }
  
  // Get intent distribution
  async getIntentDistribution(period: '24h' | '7d' | '30d') {
    const startDate = this.getStartDate(period)
    
    const { data } = await supabase
      .from('ai_conversation_metrics')
      .select('intent')
      .gte('timestamp', startDate.toISOString())
    
    if (!data) return []
    
    const intents = new Map<string, number>()
    data.forEach(m => {
      const count = intents.get(m.intent) || 0
      intents.set(m.intent, count + 1)
    })
    
    return Array.from(intents.entries())
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
  }
  
  // Real-time metrics stream
  subscribeToMetrics(callback: (metric: ConversationMetric) => void) {
    const subscription = supabase
      .channel('ai_metrics')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_conversation_metrics'
      }, payload => {
        callback(payload.new as ConversationMetric)
      })
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }
  
  // Helper methods
  private getStartDate(period: '24h' | '7d' | '30d'): Date {
    const now = new Date()
    switch (period) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }
  
  private getEmptyAgentMetric(agentName: string, period: string): AgentMetric {
    return {
      agentName,
      period,
      totalConversations: 0,
      avgResponseTime: 0,
      avgConfidence: 0,
      satisfactionScore: 0,
      conversionRate: 0,
      handoffRate: 0,
      resolutionRate: 0,
      topIntents: [],
      commonIssues: []
    }
  }
  
  private calculateAgentMetrics(
    agentName: string,
    period: string,
    data: any[]
  ): AgentMetric {
    const total = data.length
    if (total === 0) return this.getEmptyAgentMetric(agentName, period)
    
    const avgResponseTime = data.reduce((acc, m) => acc + m.responseTime, 0) / total
    const avgConfidence = data.reduce((acc, m) => acc + m.confidence, 0) / total
    const satisfactionData = data.filter(m => m.satisfaction !== null)
    const satisfactionScore = satisfactionData.length > 0
      ? satisfactionData.reduce((acc, m) => acc + m.satisfaction, 0) / satisfactionData.length
      : 0
    
    const conversions = data.filter(m => m.conversionEvent).length
    const handoffs = data.filter(m => m.handoffRequested).length
    const resolved = data.filter(m => m.resolved).length
    
    // Get top intents
    const intents = new Map<string, number>()
    data.forEach(m => {
      const count = intents.get(m.intent) || 0
      intents.set(m.intent, count + 1)
    })
    const topIntents = Array.from(intents.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([intent]) => intent)
    
    return {
      agentName,
      period,
      totalConversations: total,
      avgResponseTime,
      avgConfidence,
      satisfactionScore,
      conversionRate: (conversions / total) * 100,
      handoffRate: (handoffs / total) * 100,
      resolutionRate: (resolved / total) * 100,
      topIntents,
      commonIssues: []
    }
  }
  
  private groupByTimeInterval(data: any[], period: '24h' | '7d' | '30d') {
    const interval = period === '24h' ? 'hour' : 'day'
    const grouped = new Map<string, any[]>()
    
    data.forEach(item => {
      const date = new Date(item.timestamp)
      const key = interval === 'hour'
        ? `${date.getHours()}:00`
        : date.toLocaleDateString()
      
      const items = grouped.get(key) || []
      items.push(item)
      grouped.set(key, items)
    })
    
    return Array.from(grouped.entries()).map(([time, items]) => ({
      time,
      total: items.length,
      resolved: items.filter(i => i.resolved).length,
      handoffs: items.filter(i => i.handoffRequested).length,
      avgSatisfaction: items
        .filter(i => i.satisfaction !== null)
        .reduce((acc, i) => acc + i.satisfaction, 0) / items.length || 0
    }))
  }
  
  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flush()
  }
}

// Singleton instance
export const metricsCollector = new MetricsCollector()

// Export convenience functions
export async function trackConversation(metric: Partial<ConversationMetric>) {
  return metricsCollector.trackConversation(metric)
}

export function trackResponse(
  responseId: string,
  scenarioId: string,
  variant: 'primary' | 'alternative',
  satisfaction?: number,
  converted?: boolean
) {
  return metricsCollector.trackResponseEffectiveness(
    responseId,
    scenarioId,
    variant,
    satisfaction,
    converted
  )
}