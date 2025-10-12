import { UnitEconomics, CalculatorResult, BusinessType } from '@/types';

export function calculateBusinessMetrics(
  businessType: BusinessType,
  unitEcon: UnitEconomics
): CalculatorResult {
  let revenue = 0;
  let cogs = 0;
  let labor = 0;
  let ebitda = 0;

  if (businessType === 'restaurant') {
    const {
      seats = 0,
      turns_per_day = 0,
      days_open_week = 0,
      avg_ticket = 0,
      cogs_pct = 0,
      labor_pct = 0,
      rent_yr = 0,
      other_opex_yr = 0,
    } = unitEcon;

    revenue = seats * turns_per_day * days_open_week * 52 * avg_ticket;
    cogs = revenue * cogs_pct;
    labor = revenue * labor_pct;
    ebitda = revenue - cogs - labor - rent_yr - other_opex_yr;
  } else if (businessType === 'retail' || businessType === 'convenience') {
    const {
      daily_customers = 0,
      aov = 0,
      days_per_year = 0,
      margin_pct = 0,
      labor_pct = 0,
      fixed_opex_yr = 0,
    } = unitEcon;

    revenue = daily_customers * aov * days_per_year;
    cogs = revenue * (1 - margin_pct);
    labor = revenue * labor_pct;
    ebitda = revenue - cogs - labor - fixed_opex_yr;
  } else if (businessType === 'real_estate') {
    // Real estate calculations are handled separately
    const realEstate = unitEcon.real_estate;
    if (realEstate) {
      revenue = realEstate.gross_potential_rent_annual + realEstate.other_income_annual;
      const vacancyLoss = realEstate.gross_potential_rent_annual * (realEstate.vacancy_rate_pct / 100);
      const operatingExpenses = 
        realEstate.taxes_annual +
        realEstate.insurance_annual +
        realEstate.repairs_maintenance_annual +
        realEstate.utilities_annual +
        (realEstate.gross_potential_rent_annual * realEstate.management_fee_pct / 100) +
        realEstate.capex_reserve_annual;
      
      ebitda = revenue - vacancyLoss - operatingExpenses;
      cogs = 0; // No COGS for real estate
      labor = 0; // Labor included in operating expenses
    }
  } else {
    // For 'other' type, provide basic calculation
    revenue = 0;
    cogs = 0;
    labor = 0;
    ebitda = 0;
  }

  const { capex = 0, working_capital = 0 } = unitEcon;
  const cash_outlay = capex + working_capital;
  const ebitda_margin = revenue > 0 ? ebitda / revenue : 0;
  const payback_years = ebitda > 0 ? cash_outlay / ebitda : 999;
  const simple_moic = cash_outlay > 0 ? ebitda / cash_outlay : 0;

  return {
    revenue: Math.round(revenue),
    cogs: Math.round(cogs),
    labor: Math.round(labor),
    ebitda: Math.round(ebitda),
    ebitda_margin: Math.round(ebitda_margin * 100) / 100,
    cash_outlay: Math.round(cash_outlay),
    payback_years: Math.round(payback_years * 10) / 10,
    simple_moic: Math.round(simple_moic * 100) / 100,
  };
}

export const unitEconPresets: Record<BusinessType, UnitEconomics> = {
  restaurant: {
    seats: 60,
    turns_per_day: 1.6,
    days_open_week: 6,
    avg_ticket: 28,
    cogs_pct: 0.32,
    labor_pct: 0.28,
    rent_yr: 72000,
    other_opex_yr: 96000,
    capex: 450000,
    working_capital: 80000,
    rev_share_pct: 0.04,
  },
  retail: {
    daily_customers: 650,
    aov: 8.75,
    days_per_year: 360,
    margin_pct: 0.24,
    labor_pct: 0.15,
    fixed_opex_yr: 180000,
    capex: 350000,
    working_capital: 120000,
    rev_share_pct: 0.03,
  },
  convenience: {
    daily_customers: 800,
    aov: 6.50,
    days_per_year: 365,
    margin_pct: 0.20,
    labor_pct: 0.12,
    fixed_opex_yr: 150000,
    capex: 280000,
    working_capital: 90000,
    rev_share_pct: 0.03,
  },
  real_estate: {
    real_estate: {
      property_type: 'multi_family',
      property_class: 'B',
      units_doors: 20,
      sf_total: 20000,
      address_line1: '',
      city: '',
      state: '',
      zip: '',
      year_built: 1995,
      year_renovated: undefined,
      current_occupancy_pct: 95,
      market_rent_per_unit: 1200,
      market_rent_per_sf: undefined,
      gross_potential_rent_annual: 288000,
      vacancy_rate_pct: 5,
      other_income_annual: 0,
      taxes_annual: 0,
      insurance_annual: 0,
      repairs_maintenance_annual: 0,
      utilities_annual: 0,
      management_fee_pct: 5,
      capex_reserve_annual: 0,
      noi_annual: 0,
    },
    capex: 0,
    working_capital: 0,
    rev_share_pct: 0.08,
  },
  other: {
    capex: 100000,
    working_capital: 50000,
    rev_share_pct: 0.05,
  },
};

// Real Estate specific calculations
export function calculateRealEstateNOI(realEstate: UnitEconomics['real_estate']): number {
  if (!realEstate) return 0;
  
  const grossIncome = realEstate.gross_potential_rent_annual + realEstate.other_income_annual;
  const vacancyLoss = realEstate.gross_potential_rent_annual * (realEstate.vacancy_rate_pct / 100);
  const operatingExpenses = 
    realEstate.taxes_annual +
    realEstate.insurance_annual +
    realEstate.repairs_maintenance_annual +
    realEstate.utilities_annual +
    (realEstate.gross_potential_rent_annual * realEstate.management_fee_pct / 100) +
    realEstate.capex_reserve_annual;
  
  return grossIncome - vacancyLoss - operatingExpenses;
}

export function calculateCapRate(noi: number, propertyValue: number): number {
  if (propertyValue <= 0) return 0;
  return (noi / propertyValue) * 100;
}

export function calculateDSCR(noi: number, annualDebtService: number): number {
  if (annualDebtService <= 0) return 0;
  return noi / annualDebtService;
}

export function calculateEquityRequired(totalProjectCost: number, ltvPct: number, arv: number): number {
  const loanAmount = (ltvPct / 100) * arv;
  return totalProjectCost - loanAmount;
}

export function calculateTotalProjectCost(acquisitionPrice: number, rehabCapex: number, softCosts: number): number {
  return acquisitionPrice + rehabCapex + softCosts;
}

