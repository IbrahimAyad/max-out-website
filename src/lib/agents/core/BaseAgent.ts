import { AgentConfig, AgentRole, AgentStatus, AgentTask, AgentMessage, AgentDecision } from '../types';
import { EventEmitter } from 'events';
import { AgentMemory } from '../persistence/AgentMemory';

export abstract class BaseAgent extends EventEmitter {
  protected config: AgentConfig;
  protected status: AgentStatus = 'idle';
  protected currentTask: AgentTask | null = null;
  protected taskQueue: AgentTask[] = [];
  protected isRunning: boolean = false;
  protected intervalId: NodeJS.Timeout | null = null;
  protected memory: AgentMemory;

  constructor(config: AgentConfig) {
    super();
    this.config = config;
    this.memory = AgentMemory.getInstance();

    // Load tasks from memory
    this.loadTasksFromMemory();
  }

  // Abstract methods that each agent must implement
  abstract execute(task: AgentTask): Promise<any>;
  abstract analyzeEnvironment(): Promise<AgentTask[]>;
  abstract validateTask(task: AgentTask): boolean;

  // Common agent lifecycle methods
  async start(): Promise<void> {
    if (this.isRunning) {

      return;
    }

    this.isRunning = true;
    this.status = 'idle';
    this.emit('agent:started', { agent: this.config.role });

    // Set up scheduled execution if configured
    if (this.config.schedule) {
      this.intervalId = setInterval(() => {
        this.runCycle();
      }, this.config.schedule.interval * 60 * 1000);
    }

    // Run initial cycle
    await this.runCycle();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.status = 'idle';

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.emit('agent:stopped', { agent: this.config.role });
  }

  async pause(): Promise<void> {
    this.status = 'paused';
    this.emit('agent:paused', { agent: this.config.role });
  }

  async resume(): Promise<void> {
    if (this.status === 'paused') {
      this.status = 'idle';
      this.emit('agent:resumed', { agent: this.config.role });
      await this.runCycle();
    }
  }

  // Core execution cycle
  protected async runCycle(): Promise<void> {
    if (!this.isRunning || this.status === 'paused') return;

    try {
      // Check if within active hours
      if (!this.isWithinActiveHours()) {
        return;
      }

      // Analyze environment for new tasks
      const newTasks = await this.analyzeEnvironment();
      this.addTasks(newTasks);

      // Process task queue
      await this.processQueue();

      // Update metrics
      this.updateMetrics();

    } catch (error) {
      this.handleError(error);
    }
  }

  protected async processQueue(): Promise<void> {
    while (this.taskQueue.length > 0 && this.isRunning) {
      const task = this.getNextTask();
      if (!task) break;

      await this.processTask(task);
    }
  }

  protected async processTask(task: AgentTask): Promise<void> {
    try {
      this.currentTask = task;
      this.status = 'working';
      task.status = 'in-progress';
      task.startedAt = new Date();

      this.emit('task:started', { agent: this.config.role, task });

      // Execute the task
      const result = await this.execute(task);

      // Mark task as completed
      task.status = 'completed';
      task.completedAt = new Date();
      task.result = result;

      this.emit('task:completed', { agent: this.config.role, task, result });

      // Update success metrics
      this.config.metrics.tasksCompleted++;
      this.updateSuccessRate(true);

    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);

      this.emit('task:failed', { agent: this.config.role, task, error });
      this.updateSuccessRate(false);

    } finally {
      this.currentTask = null;
      this.status = 'idle';
      this.config.metrics.lastActiveAt = new Date();
    }
  }

  // Task management
  // Load tasks from memory
  protected loadTasksFromMemory(): void {
    const pendingTasks = this.memory.getTasks(this.config.role, 'pending');
    const inProgressTasks = this.memory.getTasks(this.config.role, 'in_progress');

    // Add pending and in-progress tasks back to queue
    this.taskQueue = [...inProgressTasks, ...pendingTasks];
  }

  addTask(task: AgentTask): void {
    if (this.validateTask(task)) {
      this.taskQueue.push(task);
      this.memory.storeTask(this.config.role, task);
      this.sortTaskQueue();
      this.emit('task:added', { agent: this.config.role, task });
    }
  }

  addTasks(tasks: AgentTask[]): void {
    tasks.forEach(task => this.addTask(task));
  }

  protected getNextTask(): AgentTask | null {
    // Get highest priority task that's not blocked
    return this.taskQueue.find(task => 
      task.status === 'pending' && 
      this.areDependenciesMet(task)
    ) || null;
  }

  protected sortTaskQueue(): void {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.taskQueue.sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  protected areDependenciesMet(task: AgentTask): boolean {
    if (!task.dependencies || task.dependencies.length === 0) return true;

    // Check if all dependencies are completed
    return task.dependencies.every(depId => {
      const depTask = this.taskQueue.find(t => t.id === depId);
      return !depTask || depTask.status === 'completed';
    });
  }

  // Utility methods
  protected isWithinActiveHours(): boolean {
    if (!this.config.schedule?.activeHours) return true;

    const now = new Date();
    const currentHour = now.getHours();
    const { start, end } = this.config.schedule.activeHours;

    if (start <= end) {
      return currentHour >= start && currentHour < end;
    } else {
      // Handle overnight schedules (e.g., 22:00 - 06:00)
      return currentHour >= start || currentHour < end;
    }
  }

  protected updateMetrics(): void {
    const completedTasks = this.taskQueue.filter(t => t.status === 'completed');
    const totalDuration = completedTasks.reduce((sum, task) => {
      if (task.startedAt && task.completedAt) {
        return sum + (task.completedAt.getTime() - task.startedAt.getTime());
      }
      return sum;
    }, 0);

    if (completedTasks.length > 0) {
      this.config.metrics.averageExecutionTime = 
        totalDuration / completedTasks.length / 1000 / 60; // in minutes
    }
  }

  protected updateSuccessRate(success: boolean): void {
    const total = this.config.metrics.tasksCompleted;
    const currentRate = this.config.metrics.successRate;
    const newRate = ((currentRate * (total - 1)) + (success ? 100 : 0)) / total;
    this.config.metrics.successRate = newRate;
  }

  protected handleError(error: any): void {
    this.status = 'error';
    this.emit('agent:error', { 
      agent: this.config.role, 
      error: error instanceof Error ? error.message : String(error) 
    });
  }

  // Communication methods
  sendMessage(to: AgentRole | 'broadcast', type: AgentMessage['type'], payload: any): void {
    const message: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: this.config.role,
      to,
      type,
      payload,
      timestamp: new Date()
    };

    this.emit('message:sent', message);
  }

  receiveMessage(message: AgentMessage): void {
    if (message.to === this.config.role || message.to === 'broadcast') {
      this.emit('message:received', message);
      this.handleMessage(message);
    }
  }

  protected handleMessage(message: AgentMessage): void {
    // Override in specific agents to handle messages
    switch (message.type) {
      case 'task':
        this.addTask(message.payload);
        break;
      case 'status':
        // Handle status requests
        this.sendMessage(message.from, 'status', {
          status: this.status,
          currentTask: this.currentTask,
          queueLength: this.taskQueue.length
        });
        break;
      default:
        // Agent-specific message handling
        break;
    }
  }

  // Getters
  getStatus(): AgentStatus {
    return this.status;
  }

  getConfig(): AgentConfig {
    return this.config;
  }

  getMetrics(): AgentConfig['metrics'] {
    return this.config.metrics;
  }

  getTaskQueue(): AgentTask[] {
    return [...this.taskQueue];
  }
}