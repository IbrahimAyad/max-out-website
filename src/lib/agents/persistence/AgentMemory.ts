import { AgentTask, AgentDecision, AgentRole } from '../types';

interface MemoryStore {
  tasks: AgentTask[];
  decisions: AgentDecision[];
  learnings: Map<string, any>;
  lastSaved: Date;
}

export class AgentMemory {
  private static instance: AgentMemory;
  private memoryStore: Map<AgentRole, MemoryStore>;
  private globalMemory: {
    systemInsights: Map<string, any>;
    customerPatterns: Map<string, any>;
    performanceMetrics: Map<string, any>;
  };

  private constructor() {
    this.memoryStore = new Map();
    this.globalMemory = {
      systemInsights: new Map(),
      customerPatterns: new Map(),
      performanceMetrics: new Map()
    };
    this.loadFromStorage();
  }

  static getInstance(): AgentMemory {
    if (!AgentMemory.instance) {
      AgentMemory.instance = new AgentMemory();
    }
    return AgentMemory.instance;
  }

  // Save agent memory to localStorage (in production, use database)
  private saveToStorage(): void {
    try {
      const memoryData = {
        agentMemory: Object.fromEntries(this.memoryStore),
        globalMemory: {
          systemInsights: Object.fromEntries(this.globalMemory.systemInsights),
          customerPatterns: Object.fromEntries(this.globalMemory.customerPatterns),
          performanceMetrics: Object.fromEntries(this.globalMemory.performanceMetrics)
        },
        lastSaved: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('kct-agent-memory', JSON.stringify(memoryData));
      }
    } catch (error) {

    }
  }

  // Load agent memory from storage
  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('kct-agent-memory');
        if (saved) {
          const data = JSON.parse(saved);

          // Restore agent memory
          Object.entries(data.agentMemory || {}).forEach(([role, memory]) => {
            this.memoryStore.set(role as AgentRole, {
              tasks: memory.tasks || [],
              decisions: memory.decisions || [],
              learnings: new Map(Object.entries(memory.learnings || {})),
              lastSaved: new Date(memory.lastSaved)
            });
          });

          // Restore global memory
          this.globalMemory.systemInsights = new Map(Object.entries(data.globalMemory?.systemInsights || {}));
          this.globalMemory.customerPatterns = new Map(Object.entries(data.globalMemory?.customerPatterns || {}));
          this.globalMemory.performanceMetrics = new Map(Object.entries(data.globalMemory?.performanceMetrics || {}));
        }
      }
    } catch (error) {

    }
  }

  // Store a task for an agent
  storeTask(agentRole: AgentRole, task: AgentTask): void {
    const memory = this.getAgentMemory(agentRole);
    memory.tasks.push(task);

    // Keep only last 100 tasks per agent
    if (memory.tasks.length > 100) {
      memory.tasks = memory.tasks.slice(-100);
    }

    this.saveToStorage();
  }

  // Store a decision made by an agent
  storeDecision(agentRole: AgentRole, decision: AgentDecision): void {
    const memory = this.getAgentMemory(agentRole);
    memory.decisions.push(decision);

    // Keep only last 50 decisions per agent
    if (memory.decisions.length > 50) {
      memory.decisions = memory.decisions.slice(-50);
    }

    this.saveToStorage();
  }

  // Store learning/insight
  storeLearning(agentRole: AgentRole, key: string, value: any): void {
    const memory = this.getAgentMemory(agentRole);
    memory.learnings.set(key, value);
    this.saveToStorage();
  }

  // Get agent memory
  getAgentMemory(agentRole: AgentRole): MemoryStore {
    if (!this.memoryStore.has(agentRole)) {
      this.memoryStore.set(agentRole, {
        tasks: [],
        decisions: [],
        learnings: new Map(),
        lastSaved: new Date()
      });
    }
    return this.memoryStore.get(agentRole)!;
  }

  // Get tasks for an agent
  getTasks(agentRole: AgentRole, status?: 'pending' | 'in_progress' | 'completed'): AgentTask[] {
    const memory = this.getAgentMemory(agentRole);
    if (status) {
      return memory.tasks.filter(task => task.status === status);
    }
    return memory.tasks;
  }

  // Get recent decisions
  getRecentDecisions(agentRole?: AgentRole, limit: number = 10): AgentDecision[] {
    if (agentRole) {
      const memory = this.getAgentMemory(agentRole);
      return memory.decisions.slice(-limit);
    }

    // Get decisions from all agents
    const allDecisions: AgentDecision[] = [];
    this.memoryStore.forEach((memory) => {
      allDecisions.push(...memory.decisions);
    });

    // Sort by timestamp and return most recent
    return allDecisions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Store global insights
  storeSystemInsight(key: string, value: any): void {
    this.globalMemory.systemInsights.set(key, {
      value,
      timestamp: new Date().toISOString()
    });
    this.saveToStorage();
  }

  storeCustomerPattern(key: string, pattern: any): void {
    this.globalMemory.customerPatterns.set(key, {
      pattern,
      timestamp: new Date().toISOString()
    });
    this.saveToStorage();
  }

  storePerformanceMetric(key: string, metric: any): void {
    this.globalMemory.performanceMetrics.set(key, {
      metric,
      timestamp: new Date().toISOString()
    });
    this.saveToStorage();
  }

  // Get insights
  getSystemInsights(): Map<string, any> {
    return this.globalMemory.systemInsights;
  }

  getCustomerPatterns(): Map<string, any> {
    return this.globalMemory.customerPatterns;
  }

  getPerformanceMetrics(): Map<string, any> {
    return this.globalMemory.performanceMetrics;
  }

  // Clear memory for an agent
  clearAgentMemory(agentRole: AgentRole): void {
    this.memoryStore.delete(agentRole);
    this.saveToStorage();
  }

  // Export memory for backup
  exportMemory(): string {
    const data = {
      agentMemory: Object.fromEntries(
        Array.from(this.memoryStore.entries()).map(([role, memory]) => [
          role,
          {
            tasks: memory.tasks,
            decisions: memory.decisions,
            learnings: Object.fromEntries(memory.learnings),
            lastSaved: memory.lastSaved
          }
        ])
      ),
      globalMemory: {
        systemInsights: Object.fromEntries(this.globalMemory.systemInsights),
        customerPatterns: Object.fromEntries(this.globalMemory.customerPatterns),
        performanceMetrics: Object.fromEntries(this.globalMemory.performanceMetrics)
      },
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  // Import memory from backup
  importMemory(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);

      // Clear existing memory
      this.memoryStore.clear();
      this.globalMemory.systemInsights.clear();
      this.globalMemory.customerPatterns.clear();
      this.globalMemory.performanceMetrics.clear();

      // Import agent memory
      Object.entries(data.agentMemory || {}).forEach(([role, memory]: [string, any]) => {
        this.memoryStore.set(role as AgentRole, {
          tasks: memory.tasks || [],
          decisions: memory.decisions || [],
          learnings: new Map(Object.entries(memory.learnings || {})),
          lastSaved: new Date(memory.lastSaved)
        });
      });

      // Import global memory
      Object.entries(data.globalMemory?.systemInsights || {}).forEach(([key, value]) => {
        this.globalMemory.systemInsights.set(key, value);
      });

      Object.entries(data.globalMemory?.customerPatterns || {}).forEach(([key, value]) => {
        this.globalMemory.customerPatterns.set(key, value);
      });

      Object.entries(data.globalMemory?.performanceMetrics || {}).forEach(([key, value]) => {
        this.globalMemory.performanceMetrics.set(key, value);
      });

      this.saveToStorage();
    } catch (error) {

      throw error;
    }
  }
}