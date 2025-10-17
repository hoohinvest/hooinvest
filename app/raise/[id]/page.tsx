/**
 * Individual Raise Detail Page
 * 
 * Shows raise details and investment form
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { RaiseDetails, InstrumentType } from '@/types/raise';

export default function RaiseDetailPage() {
  const params = useParams();
  const raiseId = params.id as string;
  
  const [raiseDetails, setRaiseDetails] = useState<RaiseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investing, setInvesting] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentError, setInvestmentError] = useState<string | null>(null);

  useEffect(() => {
    if (raiseId) {
      fetchRaiseDetails();
    }
  }, [raiseId]);

  const fetchRaiseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/raise/${raiseId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch raise details');
      }
      
      setRaiseDetails(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load raise details');
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!raiseDetails || !raiseDetails.canInvest) {
      return;
    }

    const amountCents = Math.round(parseFloat(investmentAmount) * 100);
    
    if (isNaN(amountCents) || amountCents < raiseDetails.minContributionCents) {
      setInvestmentError(`Minimum investment is $${raiseDetails.minContributionCents / 100}`);
      return;
    }

    if (raiseDetails.maxContributionCents && amountCents > raiseDetails.maxContributionCents) {
      setInvestmentError(`Maximum investment is $${raiseDetails.maxContributionCents / 100}`);
      return;
    }

    try {
      setInvesting(true);
      setInvestmentError(null);
      
      const response = await fetch(`/api/raise/${raiseId}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountCents
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Investment failed');
      }
      
      // Redirect to Stripe Checkout or handle payment
      console.log('Investment initiated:', data.data);
      
      // For now, just show success message
      alert('Investment initiated! You will be redirected to complete payment.');
      
    } catch (err) {
      setInvestmentError(err instanceof Error ? err.message : 'Investment failed');
    } finally {
      setInvesting(false);
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

  const getInstrumentDescription = (instrument: InstrumentType, terms: any) => {
    switch (instrument) {
      case InstrumentType.EQUITY:
        return `${terms.equityPoolPct}% equity stake in the company`;
      case InstrumentType.INTEREST:
        return `${terms.interestAPR}% APR debt note for ${terms.termMonths} months`;
      case InstrumentType.ROYALTY:
        return `${terms.royaltyPoolPct}% royalty share for ${terms.royaltyDurationMonths} months`;
      default:
        return 'Investment opportunity';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-[#E8EEF5] text-xl">Loading raise details...</div>
      </div>
    );
  }

  if (error || !raiseDetails) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading raise</div>
          <div className="text-[#A9B4C0] mb-4">{error}</div>
          <button
            onClick={fetchRaiseDetails}
            className="bg-[#00E18D] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { raise } = raiseDetails;

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* Header */}
      <div className="bg-[#11161D] border-b border-[#1A222C]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#00E18D] text-black px-3 py-1 rounded-lg text-sm font-semibold">
                {getInstrumentLabel(raise.instrument)}
              </span>
              <span className="text-sm text-[#A9B4C0]">
                {raiseDetails.daysRemaining} days remaining
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-[#E8EEF5] mb-4">
              {raise.title}
            </h1>
            
            {raise.description && (
              <p className="text-[#A9B4C0] text-lg mb-6">
                {raise.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Section */}
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
                Investment Progress
              </h2>
              
              <div className="mb-6">
                <div className="flex justify-between text-lg mb-3">
                  <span className="text-[#A9B4C0]">
                    {formatCurrency(raise.raisedCents)} raised
                  </span>
                  <span className="text-[#E8EEF5] font-semibold">
                    {formatCurrency(raise.goalCents)} goal
                  </span>
                </div>
                
                <div className="w-full bg-[#1A222C] rounded-full h-3 mb-2">
                  <div
                    className="bg-[#00E18D] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${formatProgress(raise.raisedCents, raise.goalCents)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-[#A9B4C0]">
                  <span>{raiseDetails.totalInvestors} investors</span>
                  <span>{formatProgress(raise.raisedCents, raise.goalCents).toFixed(1)}% funded</span>
                </div>
              </div>

              {raiseDetails.remainingCents > 0 && (
                <div className="text-center">
                  <div className="text-[#E8EEF5] text-lg font-semibold mb-2">
                    {formatCurrency(raiseDetails.remainingCents)} remaining
                  </div>
                  <div className="text-[#A9B4C0] text-sm">
                    Help reach the funding goal
                  </div>
                </div>
              )}
            </div>

            {/* Investment Terms */}
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-4">
                Investment Terms
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#E8EEF5] mb-2">
                    {getInstrumentLabel(raise.instrument)}
                  </h3>
                  <p className="text-[#A9B4C0]">
                    {getInstrumentDescription(raise.instrument, raise.instrumentTermsJson)}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-[#1A222C]">
                  <div>
                    <div className="text-sm text-[#A9B4C0] mb-1">Minimum Investment</div>
                    <div className="text-[#E8EEF5] font-semibold">
                      {formatCurrency(raise.minContributionCents)}
                    </div>
                  </div>
                  
                  {raise.maxContributionCents && (
                    <div>
                      <div className="text-sm text-[#A9B4C0] mb-1">Maximum Investment</div>
                      <div className="text-[#E8EEF5] font-semibold">
                        {formatCurrency(raise.maxContributionCents)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Disclosure */}
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-4">
                Risk Disclosure
              </h2>
              
              <div className="text-[#A9B4C0] space-y-3">
                <p>
                  Investments in private companies carry significant risk and may result in the loss of your entire investment.
                </p>
                <p>
                  Past performance does not guarantee future results. You should carefully consider your investment objectives and risk tolerance.
                </p>
                <p>
                  All investments are subject to regulatory requirements and may be restricted based on your investor status.
                </p>
              </div>
            </div>
          </div>

          {/* Investment Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
                Invest Now
              </h2>
              
              {raiseDetails.canInvest ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                      Investment Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A9B4C0]">
                        $
                      </span>
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder="0.00"
                        min={raise.minContributionCents / 100}
                        max={raise.maxContributionCents ? raise.maxContributionCents / 100 : undefined}
                        step="1"
                        className="w-full pl-8 pr-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                      />
                    </div>
                    {investmentError && (
                      <p className="text-red-400 text-sm mt-1">{investmentError}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={handleInvest}
                    disabled={investing || !investmentAmount}
                    className="w-full bg-[#00E18D] text-black py-3 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {investing ? 'Processing...' : 'Invest Now'}
                  </button>
                  
                  <div className="text-xs text-[#A9B4C0] text-center">
                    Secure payment powered by Stripe
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-[#A9B4C0] mb-4">
                    This raise is no longer accepting investments
                  </div>
                  <div className="text-sm text-[#A9B4C0]">
                    Status: {raise.status}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
