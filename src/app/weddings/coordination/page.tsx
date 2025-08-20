'use client';

import { useState } from 'react';
import { GroupCoordination } from '@/components/wedding/GroupCoordination';
import { Wedding, Measurements } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock wedding data
const mockWedding: Wedding = {
  id: 'w-123',
  weddingDate: new Date('2024-08-15'),
  groomId: 'user-1',
  status: 'planning',
  partyMembers: [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'groom',
      measurements: {
        chest: 40,
        waist: 32,
        hips: 38,
        neck: 15.5,
        inseam: 32,
        sleeve: 34,
      },
    },
    {
      id: 'user-2',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'best_man',
      measurements: undefined,
    },
    {
      id: 'user-3',
      name: 'David Lee',
      email: 'david@example.com',
      role: 'groomsman',
      measurements: {
        chest: 42,
        waist: 34,
        hips: 40,
        neck: 16,
        inseam: 30,
        sleeve: 33,
      },
    },
    {
      id: 'user-4',
      name: 'Chris Wilson',
      email: 'chris@example.com',
      role: 'groomsman',
      measurements: undefined,
    },
    {
      id: 'user-5',
      name: 'Ryan Brown',
      email: 'ryan@example.com',
      role: 'groomsman',
      measurements: undefined,
    },
  ],
};

export default function WeddingCoordinationPage() {
  const [wedding, setWedding] = useState<Wedding>(mockWedding);

  const handleSendInvitations = (memberIds: string[]) => {

    // Implement invitation sending logic
  };

  const handleUpdateMeasurements = (memberId: string, measurements: Measurements) => {

    // Update the wedding state with new measurements
    setWedding(prev => ({
      ...prev,
      partyMembers: prev.partyMembers.map(member =>
        member.id === memberId ? { ...member, measurements } : member
      ),
    }));
  };

  const handleCreateGroupOrder = (memberIds: string[], items: any[]) => {

    // Implement group order creation
  };

  const handleInitiatePaymentSplit = (amount: number, memberIds: string[]) => {

    // Implement payment splitting logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/weddings" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Back to Wedding Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Group Coordination Tools */}
      <GroupCoordination
        wedding={wedding}
        onSendInvitations={handleSendInvitations}
        onUpdateMeasurements={handleUpdateMeasurements}
        onCreateGroupOrder={handleCreateGroupOrder}
        onInitiatePaymentSplit={handleInitiatePaymentSplit}
      />
    </div>
  );
}