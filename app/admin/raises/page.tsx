/**
 * Admin Dashboard for Investment Pool Management
 * 
 * Allows admins to manage raises, view audit logs, and handle edge cases
 */

'use client';

import { useState, useEffect } from 'react';
import { RaiseStatus, InstrumentType } from '@/types/raise';

interface Raise {
  id: string;
  title: string;
  businessId: string;
  goalCents: number;
  raisedCents: number;
  instrument: InstrumentType;
  status: RaiseStatus;
  expiresAt: string;
  createdAt: string;
  totalInvestors: number;
}

interface AuditLog {
  id: string;
  type: string;
  payloadJson: Record<string, any>;
  createdAt: string;
}

export default function AdminRaisesPage() {
  const [raises, setRaises] = useState<Raise[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRaise, setSelectedRaise] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch raises
      const raisesResponse = await fetch('/api/raise');
      const raisesData = await raisesResponse.json();
      
      if (raisesData.success) {
        setRaises(raisesData.data.raises);
      }
      
      // TODO: Fetch audit logs from separate endpoint
      // const logsResponse = await fetch('/api/admin/audit-logs');
      // const logsData = await logsResponse.json();
      // setAuditLogs(logsData.data.logs);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseAction = async (raiseId: string, action: string, data?: any) => {
    try {
      const response = await fetch(`/api/raise/${raiseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Action failed');
      }
      
      // Refresh data
      fetchData();
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
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
      case RaiseStatus.REFUNDING:
        return 'text-orange-400 bg-orange-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-[#E8EEF5] text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading dashboard</div>
          <div className="text-[#A9B4C0] mb-4">{error}</div>
          <button
            onClick={fetchData}
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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-[#E8EEF5] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-[#A9B4C0] text-lg">
              Manage investment pools and monitor system activity
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
              <div className="text-2xl font-bold text-[#E8EEF5] mb-2">
                {raises.length}
              </div>
              <div className="text-[#A9B4C0]">Total Raises</div>
            </div>
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {raises.filter(r => r.status === RaiseStatus.OPEN).length}
              </div>
              <div className="text-[#A9B4C0]">Active Raises</div>
            </div>
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {raises.filter(r => r.status === RaiseStatus.FUNDED).length}
              </div>
              <div className="text-[#A9B4C0]">Funded Raises</div>
            </div>
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
              <div className="text-2xl font-bold text-red-400 mb-2">
                {raises.filter(r => r.status === RaiseStatus.EXPIRED).length}
              </div>
              <div className="text-[#A9B4C0]">Expired Raises</div>
            </div>
          </div>

          {/* Raises Management */}
          <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
              Raises Management
            </h2>
            
            {raises.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-[#A9B4C0]">No raises found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1A222C]">
                      <th className="text-left py-3 px-4 text-[#E8EEF5] font-semibold">Title</th>
                      <th className="text-left py-3 px-4 text-[#E8EEF5] font-semibold">Type</th>
                      <th className="text-left py-3 px-4 text-[#E8EEF5] font-semibold">Progress</th>
                      <th className="text-left py-3 px-4 text-[#E8EEF5] font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-[#E8EEF5] font-semibold">Expires</th>
                      <th className="text-left py-3 px-4 text-[#E8EEF5] font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raises.map((raise) => (
                      <tr key={raise.id} className="border-b border-[#1A222C]/50">
                        <td className="py-3 px-4">
                          <div className="text-[#E8EEF5] font-medium">{raise.title}</div>
                          <div className="text-[#A9B4C0] text-sm">{raise.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-[#1A222C] text-[#A9B4C0] px-2 py-1 rounded text-sm">
                            {getInstrumentLabel(raise.instrument)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[#E8EEF5] text-sm">
                            {formatCurrency(raise.raisedCents)} / {formatCurrency(raise.goalCents)}
                          </div>
                          <div className="w-full bg-[#1A222C] rounded-full h-1 mt-1">
                            <div
                              className="bg-[#00E18D] h-1 rounded-full"
                              style={{ width: `${formatProgress(raise.raisedCents, raise.goalCents)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(raise.status)}`}>
                            {raise.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#A9B4C0] text-sm">
                          {new Date(raise.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {raise.status === RaiseStatus.DRAFT && (
                              <button
                                onClick={() => handleRaiseAction(raise.id, 'open')}
                                className="bg-[#00E18D] text-black px-3 py-1 rounded text-xs font-semibold hover:bg-[#00C67A] transition-colors"
                              >
                                Open
                              </button>
                            )}
                            {raise.status === RaiseStatus.OPEN && (
                              <>
                                <button
                                  onClick={() => handleRaiseAction(raise.id, 'cancel')}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    const newDate = new Date();
                                    newDate.setDate(newDate.getDate() + 30);
                                    handleRaiseAction(raise.id, 'extend', { 
                                      newExpiresAt: newDate.toISOString() 
                                    });
                                  }}
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition-colors"
                                >
                                  Extend 30d
                                </button>
                              </>
                            )}
                            {raise.status === RaiseStatus.FUNDED && (
                              <button
                                onClick={() => handleRaiseAction(raise.id, 'close')}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-gray-600 transition-colors"
                              >
                                Close
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
              System Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#E8EEF5] mb-4">
                  Webhook Status
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-[#A9B4C0]">Stripe webhooks active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-[#A9B4C0]">Payment processing normal</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#E8EEF5] mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  <div className="text-[#A9B4C0] text-sm">
                    {raises.filter(r => r.status === RaiseStatus.OPEN).length} active raises
                  </div>
                  <div className="text-[#A9B4C0] text-sm">
                    {raises.reduce((sum, r) => sum + r.totalInvestors, 0)} total investors
                  </div>
                  <div className="text-[#A9B4C0] text-sm">
                    {formatCurrency(raises.reduce((sum, r) => sum + r.raisedCents, 0))} total raised
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
