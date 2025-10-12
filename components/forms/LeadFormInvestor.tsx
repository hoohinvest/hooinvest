'use client';

import { useState } from 'react';
import { investorPublicLeadSchema, type InvestorPublicLeadFormData } from '@/lib/validationPublicLeads';

interface LeadFormInvestorProps {
  onSuccess?: () => void;
}

export default function LeadFormInvestor({ onSuccess }: LeadFormInvestorProps) {
  const [formData, setFormData] = useState<Partial<InvestorPublicLeadFormData>>({
    types: [],
    consentAcknowledge: false,
    emailOptIn: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxGroup = (value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentTypes = prev.types || [];
      const newTypes = checked
        ? [...currentTypes, value]
        : currentTypes.filter((t) => t !== value);
      return { ...prev, types: newTypes };
    });

    if (errors.types) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.types;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validatedData = investorPublicLeadSchema.parse(formData);

      // Submit to API
      const response = await fetch('/api/public-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'INVESTOR',
          data: validatedData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Submission failed');
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ submit: error.message || 'Something went wrong' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#11161D] border border-[#00E18D] rounded-2xl p-8 text-center" role="alert" aria-live="polite">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-[#00E18D] mb-2">Interest Received!</h3>
        <p className="text-[#A9B4C0] mb-6">
          Thank you for your interest in investing with HooVest. We'll send you curated opportunities that match your investment profile.
        </p>
        <p className="text-[#A9B4C0] text-sm">
          Check your email for a confirmation and next steps.
        </p>
      </div>
    );
  }

  const businessTypeOptions = [
    'Real Estate',
    'Food & Bev',
    'Retail',
    'Services',
    'Tech',
    'Industrial',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#E8EEF5] border-b border-[#1A222C] pb-2">
          Contact Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Full Name <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-[#FF5C5C] text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Email <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-[#FF5C5C] text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              City, State (optional)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="San Francisco, CA"
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Investment Profile */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#E8EEF5] border-b border-[#1A222C] pb-2">
          Investment Profile
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              How much do you want to invest? <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount || ''}
              onChange={handleChange}
              placeholder="25000"
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
            {errors.amount && (
              <p id="amount-error" className="text-[#FF5C5C] text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="returnTargetPct" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Expected return target (%) (optional)
            </label>
            <input
              type="number"
              id="returnTargetPct"
              name="returnTargetPct"
              value={formData.returnTargetPct || ''}
              onChange={handleChange}
              placeholder="10"
              step="0.1"
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="riskTolerance" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Risk Tolerance <span className="text-[#FF5C5C]">*</span>
            </label>
            <select
              id="riskTolerance"
              name="riskTolerance"
              value={formData.riskTolerance || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.riskTolerance}
              aria-describedby={errors.riskTolerance ? 'riskTolerance-error' : undefined}
            >
              <option value="">Select risk tolerance</option>
              <option value="Conservative">Conservative</option>
              <option value="Moderate">Moderate</option>
              <option value="Aggressive">Aggressive</option>
            </select>
            {errors.riskTolerance && (
              <p id="riskTolerance-error" className="text-[#FF5C5C] text-sm mt-1">{errors.riskTolerance}</p>
            )}
          </div>

          <div>
            <label htmlFor="horizon" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Investment Horizon (optional)
            </label>
            <select
              id="horizon"
              name="horizon"
              value={formData.horizon || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            >
              <option value="">Select investment horizon</option>
              <option value="<1 yr">&lt;1 year</option>
              <option value="1-3 yrs">1-3 years</option>
              <option value="3-5 yrs">3-5 years</option>
              <option value="5+ yrs">5+ years</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E8EEF5] mb-3">
            Types of businesses you're interested in <span className="text-[#FF5C5C]">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {businessTypeOptions.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.types?.includes(type) || false}
                  onChange={(e) => handleCheckboxGroup(type, e.target.checked)}
                  className="w-5 h-5 rounded border-[#1F2A36] bg-[#0B0F14] text-[#00E18D] focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-0"
                />
                <span className="text-[#E8EEF5] text-sm">{type}</span>
              </label>
            ))}
          </div>
          {errors.types && (
            <p className="text-[#FF5C5C] text-sm mt-2">{errors.types}</p>
          )}
        </div>
      </div>

      {/* Preferences & Consent */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#E8EEF5] border-b border-[#1A222C] pb-2">
          Preferences & Consent
        </h3>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentAcknowledge"
              checked={formData.consentAcknowledge || false}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-[#1F2A36] bg-[#0B0F14] text-[#00E18D] focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-0"
              aria-required="true"
              aria-invalid={!!errors.consentAcknowledge}
              aria-describedby={errors.consentAcknowledge ? 'consentAcknowledge-error' : undefined}
            />
            <span className="text-[#E8EEF5] text-sm">
              I understand this is an expression of interest, not a commitment. <span className="text-[#FF5C5C]">*</span>
            </span>
          </label>
          {errors.consentAcknowledge && (
            <p id="consentAcknowledge-error" className="text-[#FF5C5C] text-sm ml-8">{errors.consentAcknowledge}</p>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="emailOptIn"
              checked={formData.emailOptIn || false}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-[#1F2A36] bg-[#0B0F14] text-[#00E18D] focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-0"
            />
            <span className="text-[#E8EEF5] text-sm">
              Email me curated offerings that match my investment profile (optional)
            </span>
          </label>
        </div>

        <p className="text-[#A9B4C0] text-xs">
          By submitting, you agree to our Terms and Privacy Policy. This is an expression of interest, not a binding commitment.
        </p>
      </div>

      {/* Submit */}
      {errors.submit && (
        <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C] rounded-lg p-4 text-[#FF5C5C]" role="alert">
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#00E18D] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00E18D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            Submitting...
          </span>
        ) : (
          'Express Interest to Invest'
        )}
      </button>
    </form>
  );
}

