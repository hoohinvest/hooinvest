import { z } from 'zod';

/**
 * Validation schemas for public website Business and Investor lead submissions
 */

// Business Lead Schema
export const businessPublicLeadSchema = z.object({
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
  useOfFunds: z.string()
    .transform((val) => val?.trim() || '')
    .refine((val) => val.length >= 10, {
      message: 'Please describe how you will use the funds',
    }),
  targetCloseDate: z.string().optional(),

  // Business Profile
  businessType: z.string().min(1, 'Business type is required'),
  years: z.coerce.number().int().min(0, 'Years must be 0 or greater'),
  location: z.string().min(3, 'Location (City, State) is required'),
  keyMetrics: z.string().optional(),
  docsLink: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  audience: z.enum(['Accredited Only', 'Open to All'], {
    required_error: 'Please select audience type',
  }),

  // Consent
  consentConfirm: z.boolean().refine((val) => val === true, {
    message: 'You must confirm information is accurate',
  }),

  // How did you hear about us
  hearAbout: z.enum([
    'Instagram',
    'TikTok',
    'YouTube',
    'LinkedIn',
    'Twitter/X',
    'Facebook',
    'Google Search',
    'Friend / Family',
    'Coworker / Professional Referral',
    'Event / Conference',
    'Press / Media',
    'Other'
  ], {
    required_error: 'Please select how you heard about us',
  }),
  hearAboutOther: z.string().trim().optional(),

  // Honeypot (optional, should be empty)
  hp_field: z.string().optional(),
}).refine((data) => {
  // If "Other" is selected, hearAboutOther must be provided
  if (data.hearAbout === 'Other') {
    return data.hearAboutOther && data.hearAboutOther.length > 1;
  }
  return true;
}, {
  message: 'Please specify how you heard about us',
  path: ['hearAboutOther'],
});

export type BusinessPublicLeadFormData = z.infer<typeof businessPublicLeadSchema>;

// Investor Lead Schema
export const investorPublicLeadSchema = z.object({
  // Contact Info
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  location: z.string().optional(),

  // Investment Profile
  amount: z.coerce.number().positive('Investment amount must be positive'),
  returnTargetPct: z.union([z.coerce.number().min(0), z.literal('')]).optional(),
  riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive'], {
    required_error: 'Please select your risk tolerance',
  }),
  types: z.array(z.string()).optional().default([]),
  horizon: z.string().optional(),

  // Consent
  emailOptIn: z.boolean().optional(),
  consentAcknowledge: z.boolean().refine((val) => val === true, {
    message: 'You must understand this is an expression of interest',
  }),

  // How did you hear about us
  hearAbout: z.enum([
    'Instagram',
    'TikTok',
    'YouTube',
    'LinkedIn',
    'Twitter/X',
    'Facebook',
    'Google Search',
    'Friend / Family',
    'Coworker / Professional Referral',
    'Event / Conference',
    'Press / Media',
    'Other'
  ], {
    required_error: 'Please select how you heard about us',
  }),
  hearAboutOther: z.string().trim().optional(),

  // Honeypot (optional, should be empty)
  hp_field: z.string().optional(),
}).refine((data) => {
  // If "Other" is selected, hearAboutOther must be provided
  if (data.hearAbout === 'Other') {
    return data.hearAboutOther && data.hearAboutOther.length > 1;
  }
  return true;
}, {
  message: 'Please specify how you heard about us',
  path: ['hearAboutOther'],
});

export type InvestorPublicLeadFormData = z.infer<typeof investorPublicLeadSchema>;

// Main payload wrapper
export const publicLeadPayloadSchema = z.object({
  type: z.enum(['BUSINESS', 'INVESTOR'], {
    required_error: 'Type must be BUSINESS or INVESTOR',
  }),
  data: z.record(z.any()), // Will be validated based on type
});

export type PublicLeadPayload = z.infer<typeof publicLeadPayloadSchema>;

