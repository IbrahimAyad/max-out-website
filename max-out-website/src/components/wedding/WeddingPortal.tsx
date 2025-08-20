'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, MessageCircle, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Wedding, WeddingMember, WeddingStatus } from '@/lib/types';

interface WeddingPortalProps {
  wedding: Wedding;
  currentUserId: string;
  onUpdateWedding: (wedding: Wedding) => void;
  onSendMessage: (message: string, recipientId?: string) => void;
}

interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  status: 'completed' | 'upcoming' | 'overdue';
  type: 'milestone' | 'reminder' | 'task';
}

interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  items: { name: string; cost: number }[];
}

export function WeddingPortal({ wedding, currentUserId, onUpdateWedding, onSendMessage }: WeddingPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'budget' | 'messages'>('overview');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([
    { id: '1', category: 'Suits', allocated: 500000, spent: 0, items: [] },
    { id: '2', category: 'Accessories', allocated: 100000, spent: 0, items: [] },
    { id: '3', category: 'Alterations', allocated: 50000, spent: 0, items: [] },
  ]);

  const isGroom = wedding.groomId === currentUserId;
  const currentMember = wedding.partyMembers.find(m => m.id === currentUserId);

  useEffect(() => {
    generateTimelineEvents();
  }, [wedding.weddingDate]);

  const generateTimelineEvents = () => {
    const weddingDate = new Date(wedding.weddingDate);
    const today = new Date();
    
    const events: TimelineEvent[] = [
      {
        id: '1',
        title: 'Send Party Invitations',
        date: new Date(weddingDate.getTime() - 120 * 24 * 60 * 60 * 1000), // 4 months before
        status: getEventStatus(new Date(weddingDate.getTime() - 120 * 24 * 60 * 60 * 1000)),
        type: 'task'
      },
      {
        id: '2',
        title: 'Collect Measurements',
        date: new Date(weddingDate.getTime() - 90 * 24 * 60 * 60 * 1000), // 3 months before
        status: getEventStatus(new Date(weddingDate.getTime() - 90 * 24 * 60 * 60 * 1000)),
        type: 'task'
      },
      {
        id: '3',
        title: 'Order Suits',
        date: new Date(weddingDate.getTime() - 60 * 24 * 60 * 60 * 1000), // 2 months before
        status: getEventStatus(new Date(weddingDate.getTime() - 60 * 24 * 60 * 60 * 1000)),
        type: 'milestone'
      },
      {
        id: '4',
        title: 'First Fitting',
        date: new Date(weddingDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 1 month before
        status: getEventStatus(new Date(weddingDate.getTime() - 30 * 24 * 60 * 60 * 1000)),
        type: 'task'
      },
      {
        id: '5',
        title: 'Final Fitting',
        date: new Date(weddingDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week before
        status: getEventStatus(new Date(weddingDate.getTime() - 7 * 24 * 60 * 60 * 1000)),
        type: 'task'
      },
      {
        id: '6',
        title: 'Wedding Day',
        date: weddingDate,
        status: getEventStatus(weddingDate),
        type: 'milestone'
      },
    ];
    
    setTimelineEvents(events.sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  const getEventStatus = (eventDate: Date): 'completed' | 'upcoming' | 'overdue' => {
    const today = new Date();
    if (eventDate < today) {
      return Math.random() > 0.3 ? 'completed' : 'overdue';
    }
    return 'upcoming';
  };

  const getMemberStatus = (member: WeddingMember) => {
    if (member.measurements) return 'completed';
    return 'pending';
  };

  const totalBudget = budget.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = budget.reduce((sum, item) => sum + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  const daysUntilWedding = Math.ceil((new Date(wedding.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-burgundy to-black p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif mb-2">Wedding Portal</h1>
              <p className="text-white/80">
                {daysUntilWedding > 0 ? `${daysUntilWedding} days until the big day` : 'Today is the day!'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Wedding Date</p>
              <p className="text-2xl font-semibold">
                {new Date(wedding.weddingDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {(['overview', 'timeline', 'budget', 'messages'] as const).map((tab) => {
              const icons = {
                overview: Users,
                timeline: Calendar,
                budget: DollarSign,
                messages: MessageCircle,
              };
              const Icon = icons[tab];
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white text-black'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif mb-6">Party Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wedding.partyMembers.map((member) => {
                    const status = getMemberStatus(member);
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{member.role.replace('_', ' ')}</p>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Measurements</span>
                            <span className={member.measurements ? 'text-green-600' : 'text-gray-400'}>
                              {member.measurements ? 'Complete' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Suit Ordered</span>
                            <span className="text-gray-400">Pending</span>
                          </div>
                        </div>
                        {isGroom && (
                          <button
                            onClick={() => onSendMessage(`Reminder: Please submit your measurements`, member.id)}
                            className="mt-3 w-full text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                          >
                            Send Reminder
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-gold" />
                    <span className="text-3xl font-bold">{wedding.partyMembers.length}</span>
                  </div>
                  <p className="text-gray-600">Party Members</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-3xl font-bold">
                      {wedding.partyMembers.filter(m => m.measurements).length}
                    </span>
                  </div>
                  <p className="text-gray-600">Measurements Complete</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <span className="text-3xl font-bold">
                      {Math.round((wedding.partyMembers.filter(m => m.measurements).length / wedding.partyMembers.length) * 100)}%
                    </span>
                  </div>
                  <p className="text-gray-600">Progress</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Wedding Timeline</h2>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      event.status === 'completed' ? 'bg-green-50 border-green-200' :
                      event.status === 'overdue' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-green-100' :
                      event.status === 'overdue' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      {event.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : event.status === 'overdue' ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'milestone' ? 'bg-gold text-black' :
                      event.type === 'reminder' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.type}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Budget Tracker</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                  <p className="text-2xl font-bold">${(totalBudget / 100).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Spent</p>
                  <p className="text-2xl font-bold text-red-600">${(totalSpent / 100).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-green-600">${(remainingBudget / 100).toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4">
                {budget.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{category.category}</h3>
                      <span className="text-sm text-gray-600">
                        ${(category.spent / 100).toFixed(2)} / ${(category.allocated / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full transition-all"
                        style={{ width: `${(category.spent / category.allocated) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Group Messages</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Group messaging coming soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Stay connected with your wedding party
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}