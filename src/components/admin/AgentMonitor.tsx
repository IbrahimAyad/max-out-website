'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Play, 
  Pause,
  Bot,
  Brain,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  ListTodo,
  Database,
  Download,
  Upload
} from 'lucide-react'
import { TaskManager } from './TaskManager'
import { AgentTask } from '@/lib/agents/types'

interface AgentHealth {
  status: 'idle' | 'working' | 'error' | 'paused';
  lastHeartbeat: string;
  health: 'healthy' | 'warning' | 'error';
  currentTask?: string;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  agents: Record<string, AgentHealth>;
  metrics: {
    tasksInQueue: number;
    tasksCompleted24h: number;
    averageTaskTime: number;
    systemLoad: number;
  };
}

interface AgentDecision {
  agent: string;
  action: string;
  reasoning: string;
  confidence: number;
  timestamp: string;
}

export function AgentMonitor() {
  const [isRunning, setIsRunning] = useState(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'tasks' | 'memory'>('monitor');

  const fetchStatus = async () => {
    try {

      const response = await fetch('/api/agents');
      const data = await response.json();

      if (data.status === 'success') {
        setIsRunning(data.data.isRunning);
        setHealth(data.data.health);
        setDecisions(data.data.recentDecisions || []);
      } else {

      }
    } catch (error) {

    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });

      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
      });

      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleTaskAssign = async (task: AgentTask) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'inject-task',
          task 
        })
      });

      if (response.ok) {
        await fetchStatus();
        // Show success message

      }
    } catch (error) {

    }
  };

  const getAgentIcon = (role: string) => {
    const icons: Record<string, any> = {
      'orchestrator': Brain,
      'ui-ux-frontend': Activity,
      'e-commerce-operations': ShoppingCart,
      'product-inventory': Package,
      'customer-experience': Users,
      'marketing-analytics-seo': BarChart3
    };

    const Icon = icons[role] || Bot;
    return <Icon className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-blue-500';
      case 'idle':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'healthy':
        return <Badge className="bg-green-500 text-white">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      case 'critical':
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case 'degraded':
        return <Badge className="bg-orange-500 text-white">Degraded</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading agent system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('monitor')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'monitor'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitor
          </div>
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Task Management
          </div>
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'memory'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Agent Memory
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'monitor' && (
        <>
          {/* Control Panel */}
          <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Agent System Monitor</h2>
            {health && getHealthBadge(health.overall)}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm">Auto-refresh</label>
            </div>

            <Button
              onClick={fetchStatus}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            {!isRunning ? (
              <Button onClick={handleStart} disabled={loading}>
                <Play className="h-4 w-4 mr-2" />
                Start System
              </Button>
            ) : (
              <Button onClick={handleStop} disabled={loading} variant="destructive">
                <Pause className="h-4 w-4 mr-2" />
                Stop System
              </Button>
            )}
          </div>
        </div>

        {/* System Metrics */}
        {health && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Tasks in Queue</div>
              <div className="text-2xl font-bold">{health.metrics.tasksInQueue}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Completed (24h)</div>
              <div className="text-2xl font-bold">{health.metrics.tasksCompleted24h}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Avg Task Time</div>
              <div className="text-2xl font-bold">{health.metrics.averageTaskTime.toFixed(1)}m</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">System Load</div>
              <div className="text-2xl font-bold">{(health.metrics.systemLoad * 100).toFixed(0)}%</div>
            </div>
          </div>
        )}
      </Card>

      {/* Agent Status Grid */}
      {health && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(health.agents).map(([role, agent]) => (
              <div key={role} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAgentIcon(role)}
                    <span className="font-medium capitalize">
                      {role.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="capitalize">{agent.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health:</span>
                    {getHealthBadge(agent.health)}
                  </div>
                  {agent.currentTask && (
                    <div className="mt-2 text-xs text-gray-600">
                      Current: {agent.currentTask}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Decisions */}
      {decisions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Decisions</h3>
          <div className="space-y-3">
            {decisions.map((decision, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">
                        {decision.agent.replace(/-/g, ' ')}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {(decision.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">{decision.action}</div>
                    <div className="text-xs text-gray-600">{decision.reasoning}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(decision.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* System Status */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">System is running</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600 font-medium">System is stopped</span>
            </>
          )}
        </div>
      </Card>
        </>
      )}

      {/* Task Management Tab */}
      {activeTab === 'tasks' && (
        <TaskManager onTaskAssign={handleTaskAssign} />
      )}

      {/* Agent Memory Tab */}
      {activeTab === 'memory' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Memory System</h3>
          <div className="space-y-4">
            <p className="text-gray-600">
              The agent memory system stores decisions, learnings, and patterns discovered by the agents.
              This allows them to improve over time and maintain context between sessions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">System Insights</h4>
                <p className="text-sm text-gray-600">Performance patterns and optimization opportunities</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Customer Patterns</h4>
                <p className="text-sm text-gray-600">Behavioral insights and preferences</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <p className="text-sm text-gray-600">Historical performance data and trends</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Memory
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Memory
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}