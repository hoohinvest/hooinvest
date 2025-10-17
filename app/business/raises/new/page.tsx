/**
 * Create New Raise Page
 * 
 * Form for businesses to create investment opportunities
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InstrumentType } from '@/types/raise';

interface FormData {
  title: string;
  description: string;
  goalCents: number;
  minContributionCents: number;
  maxContributionCents: number;
  instrument: InstrumentType;
  instrumentTerms: {
    equityPoolPct?: number;
    interestAPR?: number;
    termMonths?: number;
    royaltyPoolPct?: number;
    royaltyDurationMonths?: number;
  };
  expiresAt: string;
}

export default function CreateRaisePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    goalCents: 50000, // $500 default
    minContributionCents: 1000, // $10 default
    maxContributionCents: 10000, // $100 default
    instrument: InstrumentType.EQUITY,
    instrumentTerms: {
      equityPoolPct: 10,
    },
    expiresAt: '',
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInstrumentTermsChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      instrumentTerms: {
        ...prev.instrumentTerms,
        [field]: value
      }
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }

    if (formData.goalCents < 10000) {
      errors.push('Goal must be at least $100');
    }

    if (formData.minContributionCents < 100) {
      errors.push('Minimum contribution must be at least $1');
    }

    if (formData.maxContributionCents > formData.goalCents) {
      errors.push('Maximum contribution cannot exceed goal');
    }

    if (formData.minContributionCents > formData.maxContributionCents) {
      errors.push('Minimum contribution cannot exceed maximum');
    }

    if (!formData.expiresAt) {
      errors.push('Expiration date is required');
    } else {
      const expiresAt = new Date(formData.expiresAt);
      if (expiresAt <= new Date()) {
        errors.push('Expiration date must be in the future');
      }
    }

    // Validate instrument-specific terms
    switch (formData.instrument) {
      case InstrumentType.EQUITY:
        if (!formData.instrumentTerms.equityPoolPct || 
            formData.instrumentTerms.equityPoolPct <= 0 || 
            formData.instrumentTerms.equityPoolPct > 100) {
          errors.push('Equity pool percentage must be between 0 and 100');
        }
        break;
      case InstrumentType.INTEREST:
        if (!formData.instrumentTerms.interestAPR || formData.instrumentTerms.interestAPR <= 0) {
          errors.push('Interest APR must be positive');
        }
        if (!formData.instrumentTerms.termMonths || formData.instrumentTerms.termMonths <= 0) {
          errors.push('Term months must be positive');
        }
        break;
      case InstrumentType.ROYALTY:
        if (!formData.instrumentTerms.royaltyPoolPct || 
            formData.instrumentTerms.royaltyPoolPct <= 0 || 
            formData.instrumentTerms.royaltyPoolPct > 100) {
          errors.push('Royalty pool percentage must be between 0 and 100');
        }
        if (!formData.instrumentTerms.royaltyDurationMonths || 
            formData.instrumentTerms.royaltyDurationMonths <= 0) {
          errors.push('Royalty duration must be positive');
        }
        break;
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/raise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          expiresAt: new Date(formData.expiresAt).toISOString(),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create raise');
      }

      // Redirect to the created raise
      router.push(`/business/raises/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create raise');
    } finally {
      setLoading(false);
    }
  };

  const renderInstrumentTerms = () => {
    switch (formData.instrument) {
      case InstrumentType.EQUITY:
        return (
          <div>
            <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Equity Pool Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.instrumentTerms.equityPoolPct || ''}
                onChange={(e) => handleInstrumentTermsChange('equityPoolPct', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
                className="w-full pr-8 pl-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A9B4C0]">
                %
              </span>
            </div>
            <p className="text-xs text-[#A9B4C0] mt-1">
              Percentage of company equity to offer to investors
            </p>
          </div>
        );

      case InstrumentType.INTEREST:
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                Interest Rate (APR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.instrumentTerms.interestAPR || ''}
                  onChange={(e) => handleInstrumentTermsChange('interestAPR', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="50"
                  step="0.1"
                  className="w-full pr-8 pl-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A9B4C0]">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                Term (Months)
              </label>
              <input
                type="number"
                value={formData.instrumentTerms.termMonths || ''}
                onChange={(e) => handleInstrumentTermsChange('termMonths', parseInt(e.target.value) || 0)}
                min="1"
                max="120"
                className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              />
            </div>
          </div>
        );

      case InstrumentType.ROYALTY:
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                Royalty Pool Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.instrumentTerms.royaltyPoolPct || ''}
                  onChange={(e) => handleInstrumentTermsChange('royaltyPoolPct', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full pr-8 pl-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A9B4C0]">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                Duration (Months)
              </label>
              <input
                type="number"
                value={formData.instrumentTerms.royaltyDurationMonths || ''}
                onChange={(e) => handleInstrumentTermsChange('royaltyDurationMonths', parseInt(e.target.value) || 0)}
                min="1"
                max="240"
                className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* Header */}
      <div className="bg-[#11161D] border-b border-[#1A222C]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#E8EEF5] mb-2">
              Create New Raise
            </h1>
            <p className="text-[#A9B4C0] text-lg">
              Set up your investment opportunity and start raising capital
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <div className="text-red-400 font-semibold mb-2">Error</div>
              <div className="text-red-300">{error}</div>
            </div>
          )}

          <div className="bg-[#11161D] border border-[#1A222C] rounded-xl p-8 space-y-8">
            {/* Step 1: Basic Information */}
            <div>
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
                Basic Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                    Raise Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Series A Funding for Tech Startup"
                    className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your business, growth plans, and how the funds will be used..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Funding Details */}
            <div>
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
                Funding Details
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                    Goal Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A9B4C0]">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.goalCents / 100}
                      onChange={(e) => handleInputChange('goalCents', Math.round((parseFloat(e.target.value) || 0) * 100))}
                      min="100"
                      step="100"
                      className="w-full pl-8 pr-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                    Min Investment *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A9B4C0]">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.minContributionCents / 100}
                      onChange={(e) => handleInputChange('minContributionCents', Math.round((parseFloat(e.target.value) || 0) * 100))}
                      min="1"
                      step="1"
                      className="w-full pl-8 pr-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                    Max Investment
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A9B4C0]">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.maxContributionCents / 100}
                      onChange={(e) => handleInputChange('maxContributionCents', Math.round((parseFloat(e.target.value) || 0) * 100))}
                      min="1"
                      step="1"
                      className="w-full pl-8 pr-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Investment Type */}
            <div>
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
                Investment Type
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#E8EEF5] mb-3">
                    Choose Instrument *
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: InstrumentType.EQUITY, label: 'Equity', description: 'Ownership stake in the company' },
                      { value: InstrumentType.INTEREST, label: 'Debt Note', description: 'Fixed interest rate loan' },
                      { value: InstrumentType.ROYALTY, label: 'Royalty', description: 'Percentage of revenue share' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="instrument"
                          value={option.value}
                          checked={formData.instrument === option.value}
                          onChange={(e) => handleInputChange('instrument', e.target.value as InstrumentType)}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-[#E8EEF5] font-semibold">{option.label}</div>
                          <div className="text-[#A9B4C0] text-sm">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {renderInstrumentTerms()}
              </div>
            </div>

            {/* Step 4: Timeline */}
            <div>
              <h2 className="text-2xl font-semibold text-[#E8EEF5] mb-6">
                Timeline
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-[#E8EEF5] mb-2">
                  Expiration Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1A222C] rounded-lg text-[#E8EEF5] focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
                />
                <p className="text-xs text-[#A9B4C0] mt-1">
                  Minimum 24 hours from now
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-[#1A222C]">
              <div className="flex gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex-1 bg-[#1A222C] text-[#E8EEF5] px-6 py-3 rounded-lg font-semibold hover:bg-[#2A3240] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#00E18D] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00C67A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Raise'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
