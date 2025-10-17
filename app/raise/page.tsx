/**
 * Investment Pool Browse Page
 * 
 * Lists all open raises for investors to browse and invest
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RaiseStatus, InstrumentType } from '@/types/raise';

interface Raise {
  id: string;
  title: string;
  description?: string;
  goalCents: number;
  raisedCents: number;
  instrument: InstrumentType;
  status: RaiseStatus;
  expiresAt: string;
  remainingCents: number;
  totalInvestors: number;
  daysRemaining: number;
  canInvest: boolean;
  minContributionCents: number;
  maxContributionCents?: number;
}

interface RaisesResponse {
  raises: Raise[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function RaisesPage() {
  const [raises, setRaises] = useState<Raise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RaiseStatus | 'ALL'>('OPEN');

  useEffect(() => {
    fetchRaises();
  }, [filter]);

  const fetchRaises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filter !== 'ALL') {
        params.append('status', filter);
      }
      
      const response = await fetch(`/api/raise?${params}`);
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
      case RaiseStatus.OPEN:
        return 'text-green-400';
      case RaiseStatus.FUNDED:
        return 'text-blue-400';
      case RaiseStatus.CLOSED:
        return 'text-gray-400';
      case RaiseStatus.EXPIRED:
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-[#E8EEF5] text-xl">Loading investment opportunities...</div>
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#E8EEF5] mb-4">
              Investment Opportunities
            </h1>
            <p className="text-[#A9B4C0] text-lg mb-6">
              Discover and invest in real businesses with transparent data and escrow protection.
            </p>
            
            {/* Filter Tabs */}
            <div className="flex gap-4">
              {[
                { key: 'ALL', label: 'All' },
                { key: 'OPEN', label: 'Open' },
                { key: 'FUNDED', label: 'Funded' },
                { key: 'CLOSED', label: 'Closed' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as RaiseStatus | 'ALL')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === key
                      ? 'bg-[#00E18D] text-black'
                      : 'bg-[#1A222C] text-[#E8EEF5] hover:bg-[#2A3240]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Raises Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {raises.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#A9B4C0] text-xl mb-4">
                No investment opportunities found
              </div>
              <div className="text-[#A9B4C0]">
                Check back later for new raises or try a different filter.
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {raises.map((raise) => (
                <div
                  key={raise.id}
                  className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6 hover:border-[#00E18D]/50 transition-colors"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold ${getStatusColor(raise.status)}`}>
                        {getInstrumentLabel(raise.instrument)}
                      </span>
                      <span className="text-sm text-[#A9B4C0]">
                        {raise.daysRemaining} days left
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#E8EEF5] mb-2">
                      {raise.title}
                    </h3>
                    {raise.description && (
                      <p className="text-[#A9B4C0] text-sm line-clamp-2">
                        {raise.description}
                      </p>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#A9B4C0]">
                        {formatCurrency(raise.raisedCents)} raised
                      </span>
                      <span className="text-[#E8EEF5]">
                        {formatCurrency(raise.goalCents)} goal
                      </span>
                    </div>
                    <div className="w-full bg-[#1A222C] rounded-full h-2">
                      <div
                        className="bg-[#00E18D] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${formatProgress(raise.raisedCents, raise.goalCents)}%` }}
                      />
                    </div>
                    <div className="text-xs text-[#A9B4C0] mt-1">
                      {formatProgress(raise.raisedCents, raise.goalCents).toFixed(1)}% funded
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-[#A9B4C0] mb-4">
                    <span>{raise.totalInvestors} investors</span>
                    <span>
                      Min: {formatCurrency(raise.minContributionCents)}
                      {raise.maxContributionCents && (
                        <span> • Max: {formatCurrency(raise.maxContributionCents)}</span>
                      )}
                    </span>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/raise/${raise.id}`}
                    className={`w-full block text-center py-3 rounded-lg font-semibold transition-colors ${
                      raise.canInvest
                        ? 'bg-[#00E18D] text-black hover:bg-[#00C67A]'
                        : 'bg-[#1A222C] text-[#A9B4C0] cursor-not-allowed'
                    }`}
                  >
                    {raise.canInvest ? 'Invest Now' : 'View Details'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
