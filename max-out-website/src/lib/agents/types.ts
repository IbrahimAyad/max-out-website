// Agent System Types and Interfaces

export type AgentRole = 
  | 'orchestrator'
  | 'ui-ux-frontend'
  | 'e-commerce-operations'
  | 'product-inventory'
  | 'customer-experience'
  | 'marketing-analytics-seo';

export type AgentStatus = 'idle' | 'working' | 'error' | 'paused';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'blocked';

export interface AgentTask {
  id: string;
  agentRole: AgentRole;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedDuration?: number; // in minutes
  dependencies?: string[]; // task IDs
  metrics?: {
    impactScore?: number;
    completionPercentage?: number;
    affectedUsers?: number;
  };
  result?: any;
  error?: string;
}

export interface AgentConfig {
  role: AgentRole;
  name: string;
  description: string;
  capabilities: string[];
  constraints: string[];
  schedule?: {
    interval: number; // in minutes
    activeHours?: { start: number; end: number }; // 24-hour format
  };
  metrics: {
    tasksCompleted: number;
    successRate: number;
    averageExecutionTime: number;
    lastActiveAt: Date;
  };
}

export interface AgentMessage {
  id: string;
  from: AgentRole;
  to: AgentRole | 'broadcast';
  type: 'task' | 'status' | 'metric' | 'alert' | 'request';
  payload: any;
  timestamp: Date;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  agents: Record<AgentRole, {
    status: AgentStatus;
    lastHeartbeat: Date;
    currentTask?: string;
    health: 'healthy' | 'warning' | 'error';
  }>;
  metrics: {
    tasksInQueue: number;
    tasksCompleted24h: number;
    averageTaskTime: number;
    systemLoad: number;
  };
}

export interface AgentDecision {
  agent: AgentRole;
  action: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
  requiredApproval?: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  timestamp: Date;
  agent?: AgentRole;
}