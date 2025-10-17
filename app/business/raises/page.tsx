/**
 * Business Raises Dashboard
 * 
 * Lists all raises created by the business with management actions
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RaiseStatus, InstrumentType } from '@/types/raise';

interface BusinessRaise {
  id: string;
  title: string;
  goalCents: number;
  raisedCents: number;
  instrument: InstrumentType;
  status: RaiseStatus;
  expiresAt: string;
  createdAt: string;
  totalInvestors: number;
}

export default function BusinessRaisesPage() {
  const [raises, setRaises] = useState<BusinessRaise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRaises();
  }, []);

  const fetchRaises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Filter by business ID from authenticated user
      const response = await fetch('/api/raise');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch raises');
      }
      
      setRaises(data.data.raises);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load raises');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const formatProgress = (raised: number, goal: number) => {
    return Math.min(100, (raised / goal) * 100);
  };

  const getInstrumentLabel = (instrument: InstrumentType) => {
    switch (instrument) {
      case InstrumentType.EQUITY:
        return 'Equity';
      case InstrumentType.INTEREST:
        return 'Debt Note';
      case InstrumentType.ROYALTY:
        return 'Royalty';
      default:
        return instrument;
    }
  };

  const getStatusColor = (status: RaiseStatus) => {
    switch (status) {
      case RaiseStatus.DRAFT:
        return 'text-yellow-400 bg-yellow-400/10';
      case RaiseStatus.OPEN:
        return 'text-green-400 bg-green-400/10';
      case RaiseStatus.FUNDED:
        return 'text-blue-400 bg-blue-400/10';
      case RaiseStatus.CLOSED:
        return 'text-gray-400 bg-gray-400/10';
      case RaiseStatus.EXPIRED:
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusActions = (raise: BusinessRaise) => {
    switch (raise.status) {
      case RaiseStatus.DRAFT:
        return (
          <Link
            href={`/business/raises/${raise.id}/edit`}
            className="bg-[#00E18D] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors"
          >
            Edit & Launch
          </Link>
        );
      case RaiseStatus.OPEN:
        return (
          <div className="flex gap-2">
            <Link
              href={`/business/raises/${raise.id}`}
              className="bg-[#00E18D] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors"
            >
              View Progress
            </Link>
            <button
              onClick={() => handleCancelRaise(raise.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        );
      case RaiseStatus.FUNDED:
      case RaiseStatus.CLOSED:
        return (
          <Link
            href={`/business/raises/${raise.id}`}
            className="bg-[#1A222C] text-[#E8EEF5] px-4 py-2 rounded-lg font-semibold hover:bg-[#2A3240] transition-colors"
          >
            View Results
          </Link>
        );
      default:
        return null;
    }
  };

  const handleCancelRaise = async (raiseId: string) => {
    if (!confirm('Are you sure you want to cancel this raise? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/raise/${raiseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel'
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel raise');
      }
      
      // Refresh the list
      fetchRaises();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel raise');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-[#E8EEF5] text-xl">Loading your raises...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading raises</div>
          <div className="text-[#A9B4C0] mb-4">{error}</div>
          <button
            onClick={fetchRaises}
            className="bg-[#00E18D] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* Header */}
      <div className="bg-[#11161D] border-b border-[#1A222C]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-[#E8EEF5] mb-2">
                  Your Raises
                </h1>
                <p className="text-[#A9B4C0] text-lg">
                  Manage your investment opportunities and track progress
                </p>
              </div>
              <Link
                href="/business/raises/new"
                className="bg-[#00E18D] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors"
              >
                Create New Raise
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Raises List */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {raises.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#A9B4C0] text-xl mb-4">
                No raises created yet
              </div>
              <div className="text-[#A9B4C0] mb-6">
                Create your first investment opportunity to start raising capital
              </div>
              <Link
                href="/business/raises/new"
                className="bg-[#00E18D] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors"
              >
                Create Your First Raise
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {raises.map((raise) => (
                <div
                  key={raise.id}
                  className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#E8EEF5]">
                          {raise.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(raise.status)}`}>
                          {raise.status}
                        </span>
                        <span className="bg-[#1A222C] text-[#A9B4C0] px-2 py-1 rounded-lg text-xs">
                          {getInstrumentLabel(raise.instrument)}
                        </span>
                      </div>
                      
                      <div className="text-[#A9B4C0] text-sm">
                        Created {new Date(raise.createdAt).toLocaleDateString()} • 
                        Expires {new Date(raise.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {getStatusActions(raise)}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#A9B4C0]">
                        {formatCurrency(raise.raisedCents)} raised
                      </span>
                      <span className="text-[#E8EEF5] font-semibold">
                        {formatCurrency(raise.goalCents)} goal
                      </span>
                    </div>
                    
                    <div className="w-full bg-[#1A222C] rounded-full h-2">
                      <div
                        className="bg-[#00E18D] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${formatProgress(raise.raisedCents, raise.goalCents)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-[#A9B4C0] mt-1">
                      <span>{raise.totalInvestors} investors</span>
                      <span>{formatProgress(raise.raisedCents, raise.goalCents).toFixed(1)}% funded</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1A222C]">
                    <div>
                      <div className="text-xs text-[#A9B4C0] mb-1">Total Raised</div>
                      <div className="text-[#E8EEF5] font-semibold">
                        {formatCurrency(raise.raisedCents)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#A9B4C0] mb-1">Goal</div>
                      <div className="text-[#E8EEF5] font-semibold">
                        {formatCurrency(raise.goalCents)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#A9B4C0] mb-1">Investors</div>
                      <div className="text-[#E8EEF5] font-semibold">
                        {raise.totalInvestors}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
