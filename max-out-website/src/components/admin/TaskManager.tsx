'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Upload,
  Download,
  ListChecks
} from 'lucide-react'
import { AgentRole, AgentTask, TaskPriority } from '@/lib/agents/types'
import { predefinedTasks, productionChecklistTasks } from '@/lib/agents/persistence/PredefinedTasks'

interface TaskManagerProps {
  onTaskAssign: (task: AgentTask) => void
}

export function TaskManager({ onTaskAssign }: TaskManagerProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | 'all'>('all')
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    agentRole: 'marketing-analytics-seo' as AgentRole
  })

  const agents: AgentRole[] = [
    'marketing-analytics-seo',
    'ui-ux-frontend',
    'e-commerce-operations',
    'product-inventory',
    'customer-experience'
  ]

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white'
      case 'high':
        return 'bg-orange-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-green-500 text-white'
    }
  }

  const getAgentIcon = (role: AgentRole) => {
    const icons: Record<string, string> = {
      'marketing-analytics-seo': '📊',
      'ui-ux-frontend': '🎨',
      'e-commerce-operations': '🛒',
      'product-inventory': '📦',
      'customer-experience': '👥'
    }
    return icons[role] || '🤖'
  }

  const loadPredefinedTasks = () => {
    const tasks = selectedAgent === 'all' 
      ? Object.values(predefinedTasks).flat()
      : predefinedTasks[selectedAgent] || []
    
    tasks.forEach(task => onTaskAssign(task))
  }

  const loadProductionChecklist = () => {
    productionChecklistTasks.forEach(task => onTaskAssign(task))
  }

  const createCustomTask = () => {
    const task: AgentTask = {
      id: `custom-${Date.now()}`,
      agentRole: newTask.agentRole,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pending',
      metadata: {
        type: 'custom',
        createdAt: new Date().toISOString()
      }
    }
    
    onTaskAssign(task)
    setShowNewTaskForm(false)
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      agentRole: 'marketing-analytics-seo'
    })
  }

  return (
    <div className="space-y-6">
      {/* Task Assignment Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Task Management</h3>
        
        {/* Agent Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Filter by Agent</label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value as AgentRole | 'all')}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent} value={agent}>
                {getAgentIcon(agent)} {agent.replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={loadPredefinedTasks}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Load Predefined Tasks
          </Button>
          
          <Button 
            onClick={loadProductionChecklist}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ListChecks className="h-4 w-4" />
            Load Production Checklist
          </Button>
        </div>

        {/* Custom Task Creation */}
        <div className="border-t pt-4">
          <Button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="flex items-center gap-2 mb-4"
          >
            <Plus className="h-4 w-4" />
            Create Custom Task
          </Button>

          {showNewTaskForm && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Agent</label>
                  <select
                    value={newTask.agentRole}
                    onChange={(e) => setNewTask({ ...newTask, agentRole: e.target.value as AgentRole })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {agents.map(agent => (
                      <option key={agent} value={agent}>
                        {agent.replace(/-/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={createCustomTask}
                  disabled={!newTask.title}
                >
                  Create Task
                </Button>
                <Button 
                  onClick={() => setShowNewTaskForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Predefined Tasks Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Predefined Tasks</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {(selectedAgent === 'all' 
            ? Object.values(predefinedTasks).flat()
            : predefinedTasks[selectedAgent as AgentRole] || []
          ).map(task => (
            <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <span className="text-2xl">{getAgentIcon(task.agentRole)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.title}</span>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}