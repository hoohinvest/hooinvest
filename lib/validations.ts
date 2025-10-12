import { z } from 'zod';

export const companyProfileSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  contact_email: z.string().email('Invalid email address'),
  ein_last4: z.string().regex(/^\d{4}$/, 'Must be 4 digits').optional().or(z.literal('')),
});

export const businessDetailsSchema = z.object({
  business_type: z.enum(['restaurant', 'retail', 'convenience', 'other']),
  city: z.string().min(2, 'City is required'),
  state: z.string().length(2, 'State must be 2 letter code'),
  stage: z.enum(['planning', 'raising', 'buildout', 'operating']),
});

export const unitEconomicsSchema = z.object({
  // Restaurant fields
  seats: z.number().optional(),
  turns_per_day: z.number().optional(),
  days_open_week: z.number().optional(),
  avg_ticket: z.number().optional(),
  cogs_pct: z.number().optional(),
  labor_pct: z.number().optional(),
  rent_yr: z.number().optional(),
  other_opex_yr: z.number().optional(),
  
  // Retail/Convenience fields
  daily_customers: z.number().optional(),
  aov: z.number().optional(),
  days_per_year: z.number().optional(),
  margin_pct: z.number().optional(),
  fixed_opex_yr: z.number().optional(),
  
  // Common fields
  capex: z.number().min(0, 'Must be non-negative'),
  working_capital: z.number().min(0, 'Must be non-negative'),
  rev_share_pct: z.number().min(0).max(1).optional(),
});

export const fundingTermsSchema = z.object({
  structure: z.enum(['equity', 'revenue_share']),
  equity_pct: z.number().min(0).max(100).optional(),
  valuation: z.number().min(0).optional(),
  rev_share_pct: z.number().min(0).max(1).optional(),
  target_raise: z.number().min(1000, 'Minimum raise is $1,000'),
  min_invest: z.number().min(100, 'Minimum investment is $100'),
  max_invest: z.number().min(100, 'Maximum investment is $100'),
  opens_at: z.string(),
  closes_at: z.string(),
}).refine(
  (data) => {
    if (data.structure === 'equity') {
      return data.equity_pct !== undefined && data.valuation !== undefined;
    }
    return data.rev_share_pct !== undefined;
  },
  {
    message: 'Equity structure requires equity % and valuation; revenue share requires %',
  }
).refine(
  (data) => data.max_invest >= data.min_invest,
  {
    message: 'Maximum investment must be >= minimum investment',
    path: ['max_invest'],
  }
);

export const complianceSchema = z.object({
  kyc_attestation: z.boolean().refine((val) => val === true, {
    message: 'KYC attestation is required',
  }),
  aml_attestation: z.boolean().refine((val) => val === true, {
    message: 'AML attestation is required',
  }),
  entity_registered: z.boolean().refine((val) => val === true, {
    message: 'Entity registration is required',
  }),
  tax_compliant: z.boolean().refine((val) => val === true, {
    message: 'Tax compliance is required',
  }),
});

export const applicationSchema = z.object({
  ...companyProfileSchema.shape,
  ...businessDetailsSchema.shape,
  unit_econ: unitEconomicsSchema,
  funding_terms: fundingTermsSchema,
  compliance: complianceSchema,
});




