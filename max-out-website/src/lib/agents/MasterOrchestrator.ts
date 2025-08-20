import { BaseAgent } from './core/BaseAgent';
import { AgentConfig, AgentRole, AgentTask, SystemHealth, AgentDecision, TaskPriority } from './types';
import { EventEmitter } from 'events';

export class MasterOrchestrator extends BaseAgent {
  private agents: Map<AgentRole, BaseAgent> = new Map();
  private systemHealth: SystemHealth;
  private decisionLog: AgentDecision[] = [];

  constructor() {
    const config: AgentConfig = {
      role: 'orchestrator',
      name: 'KCT Master Orchestrator',
      description: 'Coordinates all agent activities and maintains system health',
      capabilities: [
        'Agent coordination',
        'Task prioritization',
        'Resource allocation',
        'System health monitoring',
        'Decision making',
        'Conflict resolution'
      ],
      constraints: [
        'Cannot execute domain-specific tasks',
        'Must maintain system stability',
        'Requires consensus for critical decisions'
      ],
      schedule: {
        interval: 5, // Check every 5 minutes
      },
      metrics: {
        tasksCompleted: 0,
        successRate: 100,
        averageExecutionTime: 0,
        lastActiveAt: new Date()
      }
    };

    super(config);

    this.systemHealth = {
      overall: 'healthy',
      agents: {} as any,
      metrics: {
        tasksInQueue: 0,
        tasksCompleted24h: 0,
        averageTaskTime: 0,
        systemLoad: 0
      }
    };
  }

  // Register an agent with the orchestrator
  registerAgent(agent: BaseAgent): void {
    const agentConfig = agent.getConfig();
    this.agents.set(agentConfig.role, agent);

    // Subscribe to agent events
    agent.on('agent:error', (data) => this.handleAgentError(data));
    agent.on('task:completed', (data) => this.handleTaskCompleted(data));
    agent.on('task:failed', (data) => this.handleTaskFailed(data));
    agent.on('message:sent', (message) => this.routeMessage(message));

  }

  async execute(task: AgentTask): Promise<any> {
    // Orchestrator tasks are mainly coordination tasks
    switch (task.title) {
      case 'system-health-check':
        return await this.performHealthCheck();

      case 'balance-workload':
        return await this.balanceWorkload();

      case 'resolve-conflict':
        return await this.resolveConflict(task.description);

      case 'emergency-response':
        return await this.handleEmergency(task.description);

      default:
        // Delegate to appropriate agent
        return await this.delegateTask(task);
    }
  }

  async analyzeEnvironment(): Promise<AgentTask[]> {
    const tasks: AgentTask[] = [];
    const now = new Date();

    // Regular system health check
    tasks.push({
      id: `health-${now.getTime()}`,
      agentRole: 'orchestrator',
      title: 'system-health-check',
      description: 'Perform routine system health check',
      priority: 'medium',
      status: 'pending',
      createdAt: now
    });

    // Check for workload imbalances
    const workloadStats = this.getWorkloadStatistics();
    if (workloadStats.maxQueueSize > 10 || workloadStats.imbalanceRatio > 2) {
      tasks.push({
        id: `balance-${now.getTime()}`,
        agentRole: 'orchestrator',
        title: 'balance-workload',
        description: 'Redistribute tasks among agents',
        priority: 'high',
        status: 'pending',
        createdAt: now
      });
    }

    // Check for stuck tasks
    const stuckTasks = await this.findStuckTasks();
    if (stuckTasks.length > 0) {
      tasks.push({
        id: `stuck-${now.getTime()}`,
        agentRole: 'orchestrator',
        title: 'resolve-stuck-tasks',
        description: `Resolve ${stuckTasks.length} stuck tasks`,
        priority: 'high',
        status: 'pending',
        createdAt: now
      });
    }

    return tasks;
  }

  validateTask(task: AgentTask): boolean {
    // Orchestrator can handle any orchestration task
    return task.agentRole === 'orchestrator' || 
           task.title.includes('coordinate') ||
           task.title.includes('system');
  }

  // Core orchestration methods
  private async performHealthCheck(): Promise<SystemHealth> {
    const agents = Array.from(this.agents.entries());
    const now = new Date();

    // Update agent health status
    for (const [role, agent] of agents) {
      const status = agent.getStatus();
      const metrics = agent.getMetrics();
      const lastHeartbeat = metrics.lastActiveAt;
      const timeSinceLastActivity = now.getTime() - lastHeartbeat.getTime();

      let health: 'healthy' | 'warning' | 'error' = 'healthy';
      if (timeSinceLastActivity > 30 * 60 * 1000) { // 30 minutes
        health = 'error';
      } else if (timeSinceLastActivity > 10 * 60 * 1000) { // 10 minutes
        health = 'warning';
      }

      this.systemHealth.agents[role] = {
        status,
        lastHeartbeat,
        health,
        currentTask: undefined // Would need to track this
      };
    }

    // Calculate overall system metrics
    const allQueues = agents.map(([_, agent]) => agent.getTaskQueue());
    const totalTasks = allQueues.reduce((sum, queue) => sum + queue.length, 0);

    this.systemHealth.metrics.tasksInQueue = totalTasks;
    this.systemHealth.metrics.systemLoad = totalTasks / (agents.length * 10); // Normalized load

    // Determine overall health
    const agentHealths = Object.values(this.systemHealth.agents);
    const errorCount = agentHealths.filter(a => a.health === 'error').length;
    const warningCount = agentHealths.filter(a => a.health === 'warning').length;

    if (errorCount > 0) {
      this.systemHealth.overall = 'critical';
    } else if (warningCount > agents.length / 2) {
      this.systemHealth.overall = 'degraded';
    } else {
      this.systemHealth.overall = 'healthy';
    }

    this.emit('health:updated', this.systemHealth);
    return this.systemHealth;
  }

  private async balanceWorkload(): Promise<void> {
    const workloadByAgent = new Map<AgentRole, number>();

    // Calculate current workload
    for (const [role, agent] of this.agents) {
      const queue = agent.getTaskQueue();
      workloadByAgent.set(role, queue.length);
    }

    // Find overloaded and underutilized agents
    const avgWorkload = Array.from(workloadByAgent.values()).reduce((a, b) => a + b, 0) / workloadByAgent.size;
    const overloaded = Array.from(workloadByAgent.entries()).filter(([_, load]) => load > avgWorkload * 1.5);
    const underutilized = Array.from(workloadByAgent.entries()).filter(([_, load]) => load < avgWorkload * 0.5);

    // Redistribute tasks
    for (const [overloadedRole, _] of overloaded) {
      const agent = this.agents.get(overloadedRole)!;
      const tasks = agent.getTaskQueue().filter(t => t.status === 'pending');

      // Move some tasks to underutilized agents
      const tasksToMove = tasks.slice(0, Math.floor(tasks.length / 3));
      for (const task of tasksToMove) {
        // Find suitable agent
        const targetRole = this.findSuitableAgent(task, underutilized.map(([role]) => role));
        if (targetRole) {
          this.reassignTask(task, overloadedRole, targetRole);
        }
      }
    }

    this.logDecision({
      agent: 'orchestrator',
      action: 'balance-workload',
      reasoning: `Redistributed tasks from ${overloaded.length} overloaded agents`,
      confidence: 0.85,
      timestamp: new Date()
    });
  }

  private async delegateTask(task: AgentTask): Promise<any> {
    const targetAgent = this.agents.get(task.agentRole);
    if (!targetAgent) {
      throw new Error(`No agent found for role: ${task.agentRole}`);
    }

    targetAgent.addTask(task);
    return { delegated: true, agent: task.agentRole };
  }

  private async resolveConflict(description: string): Promise<void> {
    // Implement conflict resolution logic
    // This could involve analyzing task dependencies, priorities, etc.

  }

  private async handleEmergency(description: string): Promise<void> {
    // Pause all non-critical agents
    for (const [role, agent] of this.agents) {
      if (role !== 'orchestrator') {
        await agent.pause();
      }
    }

    // Create emergency response task
    const emergencyTask: AgentTask = {
      id: `emergency-${Date.now()}`,
      agentRole: 'orchestrator',
      title: 'emergency-response',
      description,
      priority: 'critical',
      status: 'pending',
      createdAt: new Date()
    };

    // Handle emergency
    await this.execute(emergencyTask);

    // Resume agents
    for (const [role, agent] of this.agents) {
      if (role !== 'orchestrator') {
        await agent.resume();
      }
    }
  }

  // Helper methods
  private getWorkloadStatistics() {
    const loads = Array.from(this.agents.values()).map(agent => agent.getTaskQueue().length);
    const maxQueueSize = Math.max(...loads);
    const minQueueSize = Math.min(...loads);
    const imbalanceRatio = minQueueSize > 0 ? maxQueueSize / minQueueSize : maxQueueSize;

    return { maxQueueSize, minQueueSize, imbalanceRatio };
  }

  private async findStuckTasks(): Promise<AgentTask[]> {
    const stuckTasks: AgentTask[] = [];
    const now = new Date();

    for (const agent of this.agents.values()) {
      const tasks = agent.getTaskQueue();
      for (const task of tasks) {
        if (task.status === 'in-progress' && task.startedAt) {
          const duration = now.getTime() - task.startedAt.getTime();
          const expectedDuration = task.estimatedDuration || 30; // default 30 minutes

          if (duration > expectedDuration * 60 * 1000 * 2) { // 2x expected duration
            stuckTasks.push(task);
          }
        }
      }
    }

    return stuckTasks;
  }

  private findSuitableAgent(task: AgentTask, candidateRoles: AgentRole[]): AgentRole | null {
    // Find an agent that can handle this type of task
    for (const role of candidateRoles) {
      const agent = this.agents.get(role);
      if (agent && agent.validateTask(task)) {
        return role;
      }
    }
    return null;
  }

  private reassignTask(task: AgentTask, fromRole: AgentRole, toRole: AgentRole): void {
    const newTask = { ...task, agentRole: toRole };
    const targetAgent = this.agents.get(toRole);
    if (targetAgent) {
      targetAgent.addTask(newTask);
      this.emit('task:reassigned', { task, from: fromRole, to: toRole });
    }
  }

  private routeMessage(message: any): void {
    if (message.to === 'broadcast') {
      // Send to all agents
      for (const agent of this.agents.values()) {
        agent.receiveMessage(message);
      }
    } else if (message.to !== 'orchestrator') {
      // Route to specific agent
      const targetAgent = this.agents.get(message.to);
      if (targetAgent) {
        targetAgent.receiveMessage(message);
      }
    }
  }

  private handleAgentError(data: any): void {

    // Log the error as a decision
    this.logDecision({
      agent: 'orchestrator',
      action: 'handle-agent-error',
      reasoning: `Agent ${data.agent} encountered error: ${data.error}`,
      confidence: 1,
      timestamp: new Date(),
      requiredApproval: false
    });

    // Check if we need emergency response
    const criticalAgents: AgentRole[] = ['e-commerce-operations', 'product-inventory'];
    if (criticalAgents.includes(data.agent)) {
      this.addTask({
        id: `emergency-${Date.now()}`,
        agentRole: 'orchestrator',
        title: 'emergency-response',
        description: `Critical agent ${data.agent} failed`,
        priority: 'critical',
        status: 'pending',
        createdAt: new Date()
      });
    }
  }

  private handleTaskCompleted(data: any): void {
    // Update metrics
    this.systemHealth.metrics.tasksCompleted24h++;

    // Check if this completion affects other tasks
    if (data.task.dependencies) {
      // Notify agents that might be waiting
      this.sendMessage('broadcast', 'alert', {
        type: 'dependency-completed',
        taskId: data.task.id
      });
    }
  }

  private handleTaskFailed(data: any): void {
    // Decide if task should be retried
    const task = data.task;
    if (task.priority === 'critical' || task.priority === 'high') {
      // Retry critical tasks
      const retryTask = {
        ...task,
        id: `${task.id}-retry`,
        status: 'pending' as const,
        createdAt: new Date()
      };

      const agent = this.agents.get(task.agentRole);
      if (agent) {
        agent.addTask(retryTask);
      }
    }
  }

  private logDecision(decision: AgentDecision): void {
    this.decisionLog.push(decision);
    this.emit('decision:made', decision);

    // Keep only recent decisions
    if (this.decisionLog.length > 1000) {
      this.decisionLog = this.decisionLog.slice(-500);
    }
  }

  // Public methods
  getSystemHealth(): SystemHealth {
    // Ensure system health is initialized
    if (!this.systemHealth.agents || Object.keys(this.systemHealth.agents).length === 0) {
      this.performHealthCheck();
    }
    return this.systemHealth;
  }

  getDecisionLog(): AgentDecision[] {
    return [...this.decisionLog];
  }

  async startAllAgents(): Promise<void> {

    // Start orchestrator first
    await this.start();

    // Then start all other agents
    for (const [role, agent] of this.agents) {

      await agent.start();
    }

  }

  async stopAllAgents(): Promise<void> {

    // Stop all other agents first
    for (const [role, agent] of this.agents) {

      await agent.stop();
    }

    // Stop orchestrator last
    await this.stop();

  }
}