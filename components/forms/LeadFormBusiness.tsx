'use client';

import { useState } from 'react';
import { businessPublicLeadSchema, type BusinessPublicLeadFormData } from '@/lib/validationPublicLeads';

interface LeadFormBusinessProps {
  onSuccess?: () => void;
}

export default function LeadFormBusiness({ onSuccess }: LeadFormBusinessProps) {
  const [formData, setFormData] = useState<Partial<BusinessPublicLeadFormData>>({
    consentConfirm: false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validatedData = businessPublicLeadSchema.parse(formData);

      // Submit to API
      const response = await fetch('/api/public-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'BUSINESS',
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
        <h3 className="text-2xl font-bold text-[#00E18D] mb-2">Application Received!</h3>
        <p className="text-[#A9B4C0] mb-6">
          Thank you for your interest in raising capital with HooVest. Our team will review your application and reach out within 2-3 business days.
        </p>
        <p className="text-[#A9B4C0] text-sm">
          Check your email for a confirmation and next steps.
        </p>
      </div>
    );
  }

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
              Business Email <span className="text-[#FF5C5C]">*</span>
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
            <label htmlFor="company" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Company / DBA <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.company}
              aria-describedby={errors.company ? 'company-error' : undefined}
            />
            {errors.company && (
              <p id="company-error" className="text-[#FF5C5C] text-sm mt-1">{errors.company}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            Website or Listing URL (optional)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://"
            className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            aria-invalid={!!errors.website}
            aria-describedby={errors.website ? 'website-error' : undefined}
          />
          {errors.website && (
            <p id="website-error" className="text-[#FF5C5C] text-sm mt-1">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Raise Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#E8EEF5] border-b border-[#1A222C] pb-2">
          Raise Details
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="capitalSeeking" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              How much capital are you seeking? <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="number"
              id="capitalSeeking"
              name="capitalSeeking"
              value={formData.capitalSeeking || ''}
              onChange={handleChange}
              placeholder="250000"
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.capitalSeeking}
              aria-describedby={errors.capitalSeeking ? 'capitalSeeking-error' : undefined}
            />
            {errors.capitalSeeking && (
              <p id="capitalSeeking-error" className="text-[#FF5C5C] text-sm mt-1">{errors.capitalSeeking}</p>
            )}
          </div>

          <div>
            <label htmlFor="minInvestment" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Minimum investment per investor? <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="number"
              id="minInvestment"
              name="minInvestment"
              value={formData.minInvestment || ''}
              onChange={handleChange}
              placeholder="5000"
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.minInvestment}
              aria-describedby={errors.minInvestment ? 'minInvestment-error' : undefined}
            />
            {errors.minInvestment && (
              <p id="minInvestment-error" className="text-[#FF5C5C] text-sm mt-1">{errors.minInvestment}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxInvestors" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Maximum number of investors? <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="number"
              id="maxInvestors"
              name="maxInvestors"
              value={formData.maxInvestors || ''}
              onChange={handleChange}
              placeholder="50"
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.maxInvestors}
              aria-describedby={errors.maxInvestors ? 'maxInvestors-error' : undefined}
            />
            {errors.maxInvestors && (
              <p id="maxInvestors-error" className="text-[#FF5C5C] text-sm mt-1">{errors.maxInvestors}</p>
            )}
          </div>

          <div>
            <label htmlFor="offeringType" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Offering Type <span className="text-[#FF5C5C]">*</span>
            </label>
            <select
              id="offeringType"
              name="offeringType"
              value={formData.offeringType || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.offeringType}
              aria-describedby={errors.offeringType ? 'offeringType-error' : undefined}
            >
              <option value="">Select offering type</option>
              <option value="Equity">Equity</option>
              <option value="Interest (Debt)">Interest (Debt)</option>
              <option value="Royalty">Royalty</option>
            </select>
            {errors.offeringType && (
              <p id="offeringType-error" className="text-[#FF5C5C] text-sm mt-1">{errors.offeringType}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="offerPercentOrRate" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            {formData.offeringType === 'Equity' && '% Equity Offered'}
            {formData.offeringType === 'Interest (Debt)' && 'Interest Rate (%)'}
            {formData.offeringType === 'Royalty' && 'Royalty % Offered'}
            {!formData.offeringType && '% Equity / Interest Rate / Royalty %'}
            <span className="text-[#FF5C5C]"> *</span>
          </label>
          <input
            type="number"
            id="offerPercentOrRate"
            name="offerPercentOrRate"
            value={formData.offerPercentOrRate || ''}
            onChange={handleChange}
            placeholder="10"
            step="0.01"
            className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            aria-required="true"
            aria-invalid={!!errors.offerPercentOrRate}
            aria-describedby={errors.offerPercentOrRate ? 'offerPercentOrRate-error' : undefined}
          />
          {errors.offerPercentOrRate && (
            <p id="offerPercentOrRate-error" className="text-[#FF5C5C] text-sm mt-1">{errors.offerPercentOrRate}</p>
          )}
        </div>

        <div>
          <label htmlFor="useOfFunds" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            Use of Funds <span className="text-[#FF5C5C]">*</span>
          </label>
          <textarea
            id="useOfFunds"
            name="useOfFunds"
            value={formData.useOfFunds || ''}
            onChange={handleChange}
            rows={4}
            placeholder="Describe how you will use the capital raised..."
            className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            aria-required="true"
            aria-invalid={!!errors.useOfFunds}
            aria-describedby={errors.useOfFunds ? 'useOfFunds-error' : undefined}
          />
          {errors.useOfFunds && (
            <p id="useOfFunds-error" className="text-[#FF5C5C] text-sm mt-1">{errors.useOfFunds}</p>
          )}
        </div>

        <div>
          <label htmlFor="targetCloseDate" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            Target Close Date (optional)
          </label>
          <input
            type="date"
            id="targetCloseDate"
            name="targetCloseDate"
            value={formData.targetCloseDate || ''}
            onChange={handleChange}
            className="w-full bg-[#0B0F14] text-white border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
          />
        </div>
      </div>

      {/* Business Profile */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#E8EEF5] border-b border-[#1A222C] pb-2">
          Business Profile
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Business Type <span className="text-[#FF5C5C]">*</span>
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType || ''}
              onChange={handleChange}
              className="w-full bg-[#0B0F14] text-white border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.businessType}
              aria-describedby={errors.businessType ? 'businessType-error' : undefined}
            >
              <option value="">Select business type</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Retail">Retail</option>
              <option value="Services">Services</option>
              <option value="Real Estate SPV">Real Estate SPV</option>
              <option value="Tech">Tech</option>
              <option value="Other">Other</option>
            </select>
            {errors.businessType && (
              <p id="businessType-error" className="text-[#FF5C5C] text-sm mt-1">{errors.businessType}</p>
            )}
          </div>

          <div>
            <label htmlFor="years" className="block text-sm font-medium text-[#E8EEF5] mb-2">
              Years in Operation <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              type="number"
              id="years"
              name="years"
              value={formData.years || ''}
              onChange={handleChange}
              placeholder="3"
              min="0"
              className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
              aria-required="true"
              aria-invalid={!!errors.years}
              aria-describedby={errors.years ? 'years-error' : undefined}
            />
            {errors.years && (
              <p id="years-error" className="text-[#FF5C5C] text-sm mt-1">{errors.years}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            Location (City, State) <span className="text-[#FF5C5C]">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            aria-required="true"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'location-error' : undefined}
          />
          {errors.location && (
            <p id="location-error" className="text-[#FF5C5C] text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label htmlFor="keyMetrics" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            Key Metrics (optional)
          </label>
          <textarea
            id="keyMetrics"
            name="keyMetrics"
            value={formData.keyMetrics || ''}
            onChange={handleChange}
            rows={3}
            placeholder="Revenue run-rate, gross margin, unit economics, etc."
            className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="docsLink" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            Supporting Metrics/Docs Link (optional)
          </label>
          <input
            type="url"
            id="docsLink"
            name="docsLink"
            value={formData.docsLink || ''}
            onChange={handleChange}
            placeholder="https://"
            className="w-full bg-[#0B0F14] text-white placeholder-gray-400 border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            aria-invalid={!!errors.docsLink}
            aria-describedby={errors.docsLink ? 'docsLink-error' : undefined}
          />
          {errors.docsLink && (
            <p id="docsLink-error" className="text-[#FF5C5C] text-sm mt-1">{errors.docsLink}</p>
          )}
        </div>

        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-[#E8EEF5] mb-2">
            Investor Audience <span className="text-[#FF5C5C]">*</span>
          </label>
          <select
            id="audience"
            name="audience"
            value={formData.audience || ''}
            onChange={handleChange}
            className="w-full bg-[#0B0F14] text-white border border-[#1F2A36] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:border-transparent"
            aria-required="true"
            aria-invalid={!!errors.audience}
            aria-describedby={errors.audience ? 'audience-error' : undefined}
          >
            <option value="">Select audience</option>
            <option value="Accredited Only">Accredited Only</option>
            <option value="Open to All">Open to All</option>
          </select>
          {errors.audience && (
            <p id="audience-error" className="text-[#FF5C5C] text-sm mt-1">{errors.audience}</p>
          )}
        </div>
      </div>

      {/* Compliance & Consent */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#E8EEF5] border-b border-[#1A222C] pb-2">
          Compliance & Consent
        </h3>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentConfirm"
              checked={formData.consentConfirm || false}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-[#1F2A36] bg-[#0B0F14] text-[#00E18D] focus:ring-2 focus:ring-[#00E18D] focus:ring-offset-0"
              aria-required="true"
              aria-invalid={!!errors.consentConfirm}
              aria-describedby={errors.consentConfirm ? 'consentConfirm-error' : undefined}
            />
            <span className="text-[#E8EEF5] text-sm">
              I confirm that all information provided is accurate and complete. <span className="text-[#FF5C5C]">*</span>
            </span>
          </label>
          {errors.consentConfirm && (
            <p id="consentConfirm-error" className="text-[#FF5C5C] text-sm ml-8">{errors.consentConfirm}</p>
          )}
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
          'Submit Application'
        )}
      </button>
    </form>
  );
}

