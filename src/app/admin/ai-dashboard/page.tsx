'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Bot, TrendingUp, Users, MessageSquare, Clock, Target,
  Award, AlertCircle, Activity, Zap, Brain, Sparkles,
  CheckCircle, XCircle, RefreshCw, ChevronDown, Settings,
  Download, Filter, Calendar, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils/cn';

// Mock data - replace with real API calls
const mockData = {
  overview: {
    totalConversations: 15420,
    activeUsers: 3847,
    avgResponseTime: 1.2,
    satisfactionScore: 4.6,
    conversionRate: 18.5,
    handoffRate: 3.2
  },
  agentPerformance: [
    { name: 'Marcus', conversations: 4521, satisfaction: 4.7, conversion: 22, avgTime: 0.9 },
    { name: 'James', conversations: 3892, satisfaction: 4.8, conversion: 28, avgTime: 1.1 },
    { name: 'David', conversations: 2976, satisfaction: 4.5, conversion: 15, avgTime: 1.3 },
    { name: 'Mike', conversations: 2341, satisfaction: 4.6, conversion: 19, avgTime: 0.8 },
    { name: 'Alex', conversations: 1690, satisfaction: 4.4, conversion: 12, avgTime: 1.5 }
  ],
  conversationTrends: [
    { date: 'Mon', total: 342, successful: 289, handoffs: 8 },
    { date: 'Tue', total: 398, successful: 341, handoffs: 12 },
    { date: 'Wed', total: 456, successful: 398, handoffs: 15 },
    { date: 'Thu', total: 512, successful: 459, handoffs: 18 },
    { date: 'Fri', total: 623, successful: 561, handoffs: 22 },
    { date: 'Sat', total: 789, successful: 712, handoffs: 31 },
    { date: 'Sun', total: 567, successful: 498, handoffs: 19 }
  ],
  topIntents: [
    { intent: 'Wedding Planning', count: 3421, percentage: 22 },
    { intent: 'Sizing Help', count: 2987, percentage: 19 },
    { intent: 'Style Advice', count: 2543, percentage: 17 },
    { intent: 'Product Search', count: 2109, percentage: 14 },
    { intent: 'Pricing Inquiry', count: 1876, percentage: 12 },
    { intent: 'General Question', count: 2484, percentage: 16 }
  ],
  responseMetrics: {
    averageLength: 18,
    quickReplyUsage: 67,
    followUpRate: 82,
    resolutionRate: 91
  },
  emotionDistribution: [
    { emotion: 'Happy', value: 42, color: '#10b981' },
    { emotion: 'Neutral', value: 31, color: '#6b7280' },
    { emotion: 'Confused', value: 18, color: '#f59e0b' },
    { emotion: 'Frustrated', value: 9, color: '#ef4444' }
  ],
  trainingEffectiveness: [
    { scenario: 'Wedding', before: 72, after: 94 },
    { scenario: 'Sizing', before: 68, after: 91 },
    { scenario: 'Budget', before: 65, after: 87 },
    { scenario: 'Style', before: 70, after: 89 },
    { scenario: 'Emergency', before: 58, after: 85 }
  ]
};

export default function AIDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Export data
  const handleExport = () => {
    // Export logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Performance Dashboard</h1>
              <p className="text-gray-600">Monitor and optimize your conversational AI system</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
              Refresh
            </Button>
            
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <Badge variant="secondary">+12%</Badge>
          </div>
          <div className="text-2xl font-bold">{mockData.overview.totalConversations.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Conversations</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-gray-400" />
            <Badge variant="secondary" className="bg-green-100 text-green-700">+8%</Badge>
          </div>
          <div className="text-2xl font-bold">{mockData.overview.activeUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">-15%</Badge>
          </div>
          <div className="text-2xl font-bold">{mockData.overview.avgResponseTime}s</div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-5 w-5 text-gray-400" />
            <Badge variant="secondary">+5%</Badge>
          </div>
          <div className="text-2xl font-bold">{mockData.overview.satisfactionScore}/5</div>
          <div className="text-sm text-gray-600">Satisfaction Score</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-gray-400" />
            <Badge variant="secondary" className="bg-green-100 text-green-700">+18%</Badge>
          </div>
          <div className="text-2xl font-bold">{mockData.overview.conversionRate}%</div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            <Badge variant="secondary" className="bg-red-100 text-red-700">-22%</Badge>
          </div>
          <div className="text-2xl font-bold">{mockData.overview.handoffRate}%</div>
          <div className="text-sm text-gray-600">Handoff Rate</div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversation Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conversation Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockData.conversationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="total" stackId="1" stroke="#8B1A1A" fill="#8B1A1A" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="successful" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="handoffs" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Intents */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Intents</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.topIntents} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="intent" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B1A1A" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Emotion Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Emotions</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mockData.emotionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.emotion}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockData.emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Response Metrics */}
            <Card className="p-6 col-span-2">
              <h3 className="text-lg font-semibold mb-4">Response Quality Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Response Length</span>
                    <span className="font-semibold">{mockData.responseMetrics.averageLength} words</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-burgundy-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quick Reply Usage</span>
                    <span className="font-semibold">{mockData.responseMetrics.quickReplyUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mockData.responseMetrics.quickReplyUsage}%` }}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Follow-up Rate</span>
                    <span className="font-semibold">{mockData.responseMetrics.followUpRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mockData.responseMetrics.followUpRate}%` }}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resolution Rate</span>
                    <span className="font-semibold">{mockData.responseMetrics.resolutionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${mockData.responseMetrics.resolutionRate}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agent Performance Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Agent</th>
                    <th className="text-right py-3 px-4">Conversations</th>
                    <th className="text-right py-3 px-4">Satisfaction</th>
                    <th className="text-right py-3 px-4">Conversion</th>
                    <th className="text-right py-3 px-4">Avg Time</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.agentPerformance.map((agent) => (
                    <tr key={agent.name} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-burgundy-100 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-burgundy-600" />
                          </div>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-xs text-gray-500">AI Agent</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">{agent.conversations.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <span>{agent.satisfaction}</span>
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <Badge variant="secondary" className={cn(
                          agent.conversion > 20 ? "bg-green-100 text-green-700" : "bg-gray-100"
                        )}>
                          {agent.conversion}%
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-4">{agent.avgTime}s</td>
                      <td className="text-center py-3 px-4">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Agent Performance Radar */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agent Capabilities</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={[
                { subject: 'Speed', Marcus: 95, James: 85, David: 75, Mike: 90, Alex: 70 },
                { subject: 'Accuracy', Marcus: 90, James: 95, David: 88, Mike: 82, Alex: 78 },
                { subject: 'Empathy', Marcus: 85, James: 92, David: 80, Mike: 88, Alex: 95 },
                { subject: 'Sales', Marcus: 88, James: 90, David: 70, Mike: 85, Alex: 65 },
                { subject: 'Technical', Marcus: 92, James: 78, David: 95, Mike: 75, Alex: 70 },
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Marcus" dataKey="Marcus" stroke="#8B1A1A" fill="#8B1A1A" fillOpacity={0.3} />
                <Radar name="James" dataKey="James" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="David" dataKey="David" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Mike" dataKey="Mike" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Radar name="Alex" dataKey="Alex" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Training Effectiveness</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.trainingEffectiveness}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="before" fill="#ef4444" name="Before Training" />
                <Bar dataKey="after" fill="#10b981" name="After Training" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Training Scenarios</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Wedding Planning Scenarios</span>
                  </div>
                  <Badge>225 scenarios</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Sizing & Fit Questions</span>
                  </div>
                  <Badge>180 scenarios</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Style Advice Patterns</span>
                  </div>
                  <Badge>195 scenarios</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-yellow-600" />
                    <span>Emergency Situations</span>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Response Accuracy</span>
                    <span className="text-sm text-gray-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Context Understanding</span>
                    <span className="text-sm text-gray-600">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Emotion Detection</span>
                    <span className="text-sm text-gray-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-yellow-600 h-3 rounded-full transition-all" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Product Matching</span>
                    <span className="text-sm text-gray-600">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}