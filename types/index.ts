export type UserRole = 'admin' | 'business';

export type BusinessType = 'restaurant' | 'retail' | 'convenience' | 'real_estate' | 'other';

export type BusinessStage = 'planning' | 'raising' | 'buildout' | 'operating';

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'in_review' 
  | 'needs_changes' 
  | 'approved' 
  | 'rejected' 
  | 'published';

export type DocType = 'pitch_deck' | 'pnl' | 'lease' | 'bank_stmt' | 'permit';

export type AssetType = 'business' | 'project';

export type OfferingStatus = 'draft' | 'open' | 'closed';

export interface Profile {
  user_id: string;
  role: UserRole;
  email?: string;
  created_at?: string;
}

export interface UnitEconomics {
  // Restaurant
  seats?: number;
  turns_per_day?: number;
  days_open_week?: number;
  avg_ticket?: number;
  cogs_pct?: number;
  labor_pct?: number;
  rent_yr?: number;
  other_opex_yr?: number;
  
  // Retail/Convenience
  daily_customers?: number;
  aov?: number;
  days_per_year?: number;
  margin_pct?: number;
  fixed_opex_yr?: number;
  
  // Real Estate
  real_estate?: {
    property_type: 'single_family' | 'multi_family' | 'mixed_use' | 'retail' | 'office' | 'industrial' | 'land' | 'short_term_rental';
    property_class: 'A' | 'B' | 'C';
    units_doors: number;
    sf_total: number;
    address_line1: string;
    city: string;
    state: string;
    zip: string;
    year_built: number;
    year_renovated?: number;
    current_occupancy_pct: number;
    market_rent_per_unit?: number;
    market_rent_per_sf?: number;
    gross_potential_rent_annual: number;
    vacancy_rate_pct: number;
    other_income_annual: number;
    taxes_annual: number;
    insurance_annual: number;
    repairs_maintenance_annual: number;
    utilities_annual: number;
    management_fee_pct: number;
    capex_reserve_annual: number;
    noi_annual: number;
  };
  
  // Common
  capex?: number;
  working_capital?: number;
  rev_share_pct?: number;
}

export interface FundingTerms {
  structure: 'equity' | 'revenue_share';
  equity_pct?: number;
  valuation?: number;
  rev_share_pct?: number;
  target_raise: number;
  min_invest: number;
  max_invest: number;
  opens_at: string;
  closes_at: string;
  
  // Real Estate
  real_estate?: {
    acquisition_price: number;
    rehab_capex: number;
    soft_costs: number;
    total_project_cost: number;
    arv_or_stabilized_value: number;
    ltv_pct: number;
    lender_type: 'bank' | 'dscr' | 'bridge' | 'private' | 'agency' | 'other';
    interest_rate_pct: number;
    amortization_years: number;
    io_months: number;
    dscr_min: number;
    equity_required: number;
    preferred_return_pct: number;
    gp_lp_split: string;
    distribution_frequency: 'monthly' | 'quarterly' | 'semiannual' | 'annual';
    hold_period_months: number;
    exit_strategy: 'refi' | 'sale' | 'refi_then_hold' | 'condo_conversion' | 'other';
    target_cap_rate_exit_pct: number;
    projected_irr_pct: number;
    projected_equity_multiple: number;
    sources_uses: Array<{label: string; amount: number}>;
    timeline_milestones: Array<{milestone: string; target_date: string}>;
  };
}

export interface ComplianceData {
  kyc_attestation: boolean;
  aml_attestation: boolean;
  entity_registered: boolean;
  tax_compliant: boolean;
  
  // Real Estate
  zoning_verified?: boolean;
  permits_required?: boolean;
  environmental_phase1?: boolean;
  gc_engaged?: boolean;
}

export interface BusinessApplication {
  id: string;
  owner_user_id: string;
  company_name: string;
  website?: string;
  contact_email: string;
  ein_last4?: string;
  business_type: BusinessType;
  city: string;
  state: string;
  stage: BusinessStage;
  unit_econ?: UnitEconomics;
  funding_terms?: FundingTerms;
  compliance?: ComplianceData;
  status: ApplicationStatus;
  asset_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessDoc {
  id: string;
  application_id: string;
  doc_type: DocType;
  url: string;
  uploaded_at: string;
}

export interface ReviewComment {
  id: string;
  application_id: string;
  author_user_id: string;
  author_email?: string;
  body: string;
  created_at: string;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  description?: string;
  asset_type: AssetType;
  status: string;
  city?: string;
  state?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetMeta {
  id: string;
  asset_id: string;
  key: string;
  value_json: any;
  created_at: string;
}

export interface Offering {
  id: string;
  asset_id: string;
  round_type?: string;
  target_raise: number;
  min_invest: number;
  max_invest: number;
  opens_at?: string;
  closes_at?: string;
  jurisdiction?: string;
  status: OfferingStatus;
}

export interface CalculatorResult {
  revenue: number;
  cogs?: number;
  labor: number;
  ebitda: number;
  ebitda_margin: number;
  cash_outlay: number;
  payback_years: number;
  simple_moic: number;
}

