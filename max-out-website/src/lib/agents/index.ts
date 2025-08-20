// Agent System Entry Point
import { MasterOrchestrator } from './MasterOrchestrator';
import { MarketingAnalyticsSEOAgent } from './MarketingAnalyticsSEOAgent';
import { BaseAgent } from './core/BaseAgent';
import { AgentRole } from './types';

// Agents
import { UIUXFrontendAgent } from './UIUXFrontendAgent';
import { ECommerceOperationsAgent } from './ECommerceOperationsAgent';
import { ProductInventoryAgent } from './ProductInventoryAgent';
import { CustomerExperienceAgent } from './CustomerExperienceAgent';

// Persistence
import { AgentMemory } from './persistence/AgentMemory';
import { predefinedTasks, getAllPredefinedTasks } from './persistence/PredefinedTasks';

export class AgentSystem {
  private static instance: AgentSystem;
  private orchestrator: MasterOrchestrator;
  private agents: Map<AgentRole, BaseAgent>;
  private isRunning: boolean = false;

  private constructor() {
    this.orchestrator = new MasterOrchestrator();
    this.agents = new Map();
    this.initializeAgents();
  }

  static getInstance(): AgentSystem {
    if (!AgentSystem.instance) {
      AgentSystem.instance = new AgentSystem();
    }
    return AgentSystem.instance;
  }

  private initializeAgents(): void {
    // Initialize all agents
    const marketingAgent = new MarketingAnalyticsSEOAgent();
    const uiuxAgent = new UIUXFrontendAgent();
    const ecommerceAgent = new ECommerceOperationsAgent();
    const inventoryAgent = new ProductInventoryAgent();
    const customerAgent = new CustomerExperienceAgent();

    // Register agents with orchestrator
    this.orchestrator.registerAgent(marketingAgent);
    this.orchestrator.registerAgent(uiuxAgent);
    this.orchestrator.registerAgent(ecommerceAgent);
    this.orchestrator.registerAgent(inventoryAgent);
    this.orchestrator.registerAgent(customerAgent);

    // Store references
    this.agents.set('marketing-analytics-seo', marketingAgent);
    this.agents.set('ui-ux-frontend', uiuxAgent);
    this.agents.set('e-commerce-operations', ecommerceAgent);
    this.agents.set('product-inventory', inventoryAgent);
    this.agents.set('customer-experience', customerAgent);
  }

  async start(): Promise<void> {
    if (this.isRunning) {

      return;
    }

    this.isRunning = true;

    try {
      // Load predefined tasks if this is the first run
      this.loadInitialTasks();

      // Start the orchestrator and all agents
      await this.orchestrator.startAllAgents();

      // Set up system monitoring
      this.setupMonitoring();

    } catch (error) {

      this.isRunning = false;
      throw error;
    }
  }

  private loadInitialTasks(): void {
    const memory = AgentMemory.getInstance();

    // Check if we already have tasks in memory
    const existingTasks = [];
    this.agents.forEach((agent, role) => {
      existingTasks.push(...memory.getTasks(role));
    });

    // If no tasks exist, load predefined ones
    if (existingTasks.length === 0) {

      // Load tasks for each agent
      Object.entries(predefinedTasks).forEach(([role, tasks]) => {
        const agent = this.agents.get(role as AgentRole);
        if (agent) {
          tasks.forEach(task => {
            agent.addTask(task);
          });

        }
      });
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {

      return;
    }

    try {
      await this.orchestrator.stopAllAgents();
      this.isRunning = false;

    } catch (error) {

      throw error;
    }
  }

  private setupMonitoring(): void {
    // Monitor system health
    setInterval(() => {
      const health = this.orchestrator.getSystemHealth();
      if (health.overall === 'critical') {

        // Could trigger alerts here
      }
    }, 60000); // Check every minute

    // Log agent decisions
    this.orchestrator.on('decision:made', (decision) => {

      // Store important decisions
      if (decision.requiredApproval) {
        // Handle decisions that need human approval
        this.handleApprovalRequired(decision);
      }
    });

    // Monitor task failures
    this.orchestrator.on('task:failed', (data) => {

      // Could send notifications here
    });
  }

  private handleApprovalRequired(decision: any): void {
    // In a real system, this would notify administrators

    // Store pending approvals
    // Send notifications
    // Wait for human input
  }

  // Public API
  getSystemHealth() {
    return this.orchestrator.getSystemHealth();
  }

  getAgent(role: AgentRole): BaseAgent | undefined {
    return this.agents.get(role);
  }

  getDecisionLog() {
    return this.orchestrator.getDecisionLog();
  }

  isSystemRunning(): boolean {
    return this.isRunning;
  }

  // Manual task injection
  async injectTask(task: any): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Agent system is not running');
    }

    const agent = this.agents.get(task.agentRole);
    if (agent) {
      agent.addTask(task);
    } else {
      // Let orchestrator handle it
      this.orchestrator.addTask(task);
    }
  }
}

// Export singleton instance
export const agentSystem = AgentSystem.getInstance();

// Export individual components for testing
export { MasterOrchestrator, MarketingAnalyticsSEOAgent, BaseAgent };
export * from './types';