import { z } from 'zod';

/**
 * Validation schemas for Business and Investor lead forms
 */

// Business Lead Form Schema
export const businessLeadSchema = z.object({
  // Contact Info
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().min(2, 'Company name is required'),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),

  // Raise Details
  capitalSeeking: z.coerce.number().positive('Amount must be positive'),
  minInvestment: z.coerce.number().positive('Minimum investment must be positive'),
  maxInvestors: z.coerce.number().int().positive('Must be a positive integer'),
  offeringType: z.enum(['Equity', 'Interest (Debt)', 'Royalty'], {
    required_error: 'Please select an offering type',
  }),
  offerPercentOrRate: z.coerce.number().positive('This field is required based on offering type'),
  useOfFunds: z.string().min(10, 'Please describe how you will use the funds'),
  targetCloseDate: z.string().optional(),

  // Business Profile
  businessType: z.string().min(1, 'Business type is required'),
  yearsInOperation: z.coerce.number().int().min(0, 'Years must be 0 or greater'),
  location: z.string().min(3, 'Location (City, State) is required'),
  keyMetrics: z.string().optional(),
  docsLink: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  audience: z.enum(['Accredited Only', 'Open to All'], {
    required_error: 'Please select audience type',
  }),

  // Compliance & Consent
  infoAccurate: z.boolean().refine((val) => val === true, {
    message: 'You must confirm information is accurate',
  }),
  marketingConsent: z.boolean().optional(),
});

export type BusinessLeadFormData = z.infer<typeof businessLeadSchema>;

// Investor Lead Form Schema
export const investorLeadSchema = z.object({
  // Contact Info
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  location: z.string().optional(),

  // Investment Profile
  investmentAmount: z.coerce.number().positive('Investment amount must be positive'),
  returnTarget: z.coerce.number().min(0).optional(),
  riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive'], {
    required_error: 'Please select your risk tolerance',
  }),
  businessTypes: z.array(z.string()).min(1, 'Select at least one business type'),
  investmentHorizon: z.enum(['<1 yr', '1-3 yrs', '3-5 yrs', '5+ yrs'], {
    required_error: 'Please select investment horizon',
  }),

  // Preferences & Consent
  understandsExpression: z.boolean().refine((val) => val === true, {
    message: 'You must understand this is an expression of interest',
  }),
  emailOptIn: z.boolean().optional(),
});

export type InvestorLeadFormData = z.infer<typeof investorLeadSchema>;


