'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { BusinessApplication, BusinessType, BusinessStage, UnitEconomics, FundingTerms, ComplianceData } from '@/types';
import { unitEconPresets, calculateRealEstateNOI, calculateCapRate, calculateTotalProjectCost, calculateEquityRequired } from '@/lib/businessCalc';
import { formatCurrency } from '@/lib/utils';

export default function ApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Step 1: Company Profile
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [einLast4, setEinLast4] = useState('');

  // Step 2: Business Details
  const [businessType, setBusinessType] = useState<BusinessType>('restaurant');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [stage, setStage] = useState<BusinessStage>('planning');

  // Step 3: Unit Economics
  const [unitEcon, setUnitEcon] = useState<UnitEconomics>(unitEconPresets.restaurant);

  // Step 4: Funding Terms
  const [fundingStructure, setFundingStructure] = useState<'equity' | 'revenue_share'>('revenue_share');
  const [equityPct, setEquityPct] = useState(10);
  const [valuation, setValuation] = useState(1000000);
  const [revSharePct, setRevSharePct] = useState(0.04);
  const [targetRaise, setTargetRaise] = useState(500000);
  const [minInvest, setMinInvest] = useState(10000);
  const [maxInvest, setMaxInvest] = useState(100000);
  const [opensAt, setOpensAt] = useState('');
  const [closesAt, setClosesAt] = useState('');

  // Step 5: Compliance
  const [kycAttestation, setKycAttestation] = useState(false);
  const [amlAttestation, setAmlAttestation] = useState(false);
  const [entityRegistered, setEntityRegistered] = useState(false);
  const [taxCompliant, setTaxCompliant] = useState(false);

  // Real Estate specific state
  const [realEstateData, setRealEstateData] = useState({
    property_type: 'multi_family' as const,
    property_class: 'B' as const,
    units_doors: 20,
    sf_total: 20000,
    address_line1: '',
    city: '',
    state: '',
    zip: '',
    year_built: 1995,
    year_renovated: undefined as number | undefined,
    current_occupancy_pct: 95,
    market_rent_per_unit: 1200,
    market_rent_per_sf: undefined as number | undefined,
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
  });

  const [realEstateFunding, setRealEstateFunding] = useState({
    acquisition_price: 0,
    rehab_capex: 0,
    soft_costs: 0,
    total_project_cost: 0,
    arv_or_stabilized_value: 0,
    ltv_pct: 75,
    lender_type: 'bank' as const,
    interest_rate_pct: 6.5,
    amortization_years: 30,
    io_months: 0,
    dscr_min: 1.25,
    equity_required: 0,
    preferred_return_pct: 8,
    gp_lp_split: '70/30',
    distribution_frequency: 'quarterly' as const,
    hold_period_months: 36,
    exit_strategy: 'refi' as const,
    target_cap_rate_exit_pct: 5.5,
    projected_irr_pct: 15,
    projected_equity_multiple: 1.5,
    sources_uses: [] as Array<{label: string; amount: number}>,
    timeline_milestones: [] as Array<{milestone: string; target_date: string}>,
  });

  const [realEstateCompliance, setRealEstateCompliance] = useState({
    zoning_verified: false,
    permits_required: false,
    environmental_phase1: false,
    gc_engaged: false,
  });

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  useEffect(() => {
    // Load preset when business type changes
    if (businessType) {
      setUnitEcon(unitEconPresets[businessType]);
    }
  }, [businessType]);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/application/${applicationId}`);
      const app: BusinessApplication = await response.json();
      
      // Load data into form
      setCompanyName(app.company_name);
      setWebsite(app.website || '');
      setContactEmail(app.contact_email);
      setEinLast4(app.ein_last4 || '');
      setBusinessType(app.business_type);
      setCity(app.city);
      setState(app.state);
      setStage(app.stage);
      
      if (app.unit_econ) setUnitEcon(app.unit_econ);
      
      if (app.funding_terms) {
        const terms = app.funding_terms;
        setFundingStructure(terms.structure);
        if (terms.equity_pct) setEquityPct(terms.equity_pct);
        if (terms.valuation) setValuation(terms.valuation);
        if (terms.rev_share_pct) setRevSharePct(terms.rev_share_pct);
        setTargetRaise(terms.target_raise);
        setMinInvest(terms.min_invest);
        setMaxInvest(terms.max_invest);
        setOpensAt(terms.opens_at || '');
        setClosesAt(terms.closes_at || '');
      }
      
      if (app.compliance) {
        const comp = app.compliance;
        setKycAttestation(comp.kyc_attestation);
        setAmlAttestation(comp.aml_attestation);
        setEntityRegistered(comp.entity_registered);
        setTaxCompliant(comp.tax_compliant);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApplication = async (submitStatus: 'draft' | 'submitted' = 'draft') => {
    setSaving(true);
    try {
      const fundingTerms: FundingTerms = {
        structure: fundingStructure,
        target_raise: targetRaise,
        min_invest: minInvest,
        max_invest: maxInvest,
        opens_at: opensAt,
        closes_at: closesAt,
      };

      if (fundingStructure === 'equity') {
        fundingTerms.equity_pct = equityPct;
        fundingTerms.valuation = valuation;
      } else {
        fundingTerms.rev_share_pct = revSharePct;
      }

      const compliance: ComplianceData = {
        kyc_attestation: kycAttestation,
        aml_attestation: amlAttestation,
        entity_registered: entityRegistered,
        tax_compliant: taxCompliant,
      };

      // Add real estate specific data if business type is real estate
      let data;
      if (businessType === 'real_estate') {
        // Update unit economics with real estate data
        const updatedUnitEcon = {
          ...unitEcon,
          real_estate: {
            ...realEstateData,
            noi_annual: calculateRealEstateNOI(realEstateData),
          },
        };

        // Update funding terms with real estate data
        const updatedFundingTerms = {
          ...fundingTerms,
          real_estate: {
            ...realEstateFunding,
            total_project_cost: calculateTotalProjectCost(
              realEstateFunding.acquisition_price,
              realEstateFunding.rehab_capex,
              realEstateFunding.soft_costs
            ),
            equity_required: calculateEquityRequired(
              realEstateFunding.total_project_cost,
              realEstateFunding.ltv_pct,
              realEstateFunding.arv_or_stabilized_value
            ),
          },
        };

        // Update compliance with real estate data
        const updatedCompliance = {
          ...compliance,
          ...realEstateCompliance,
        };

        data = {
          id: applicationId || undefined,
          company_name: companyName,
          website,
          contact_email: contactEmail,
          ein_last4: einLast4,
          business_type: businessType,
          city,
          state,
          stage,
          unit_econ: updatedUnitEcon,
          funding_terms: updatedFundingTerms,
          compliance: updatedCompliance,
          status: submitStatus,
        };
      } else {
        data = {
          id: applicationId || undefined,
          company_name: companyName,
          website,
          contact_email: contactEmail,
          ein_last4: einLast4,
          business_type: businessType,
          city,
          state,
          stage,
          unit_econ: unitEcon,
          funding_terms: fundingTerms,
          compliance,
          status: submitStatus,
        };
      }

      const response = await fetch('/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (submitStatus === 'submitted') {
          alert('Application submitted successfully!');
          router.push('/dashboard');
        } else {
          alert('Application saved as draft');
        }
      }
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Error saving application');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!kycAttestation || !amlAttestation || !entityRegistered || !taxCompliant) {
      alert('Please complete all compliance attestations');
      return;
    }
    saveApplication('submitted');
  };

  const canProgress = () => {
    if (step === 1) return companyName && contactEmail;
    if (step === 2) return businessType && city && state && stage;
    if (step === 3) {
      if (businessType === 'real_estate') {
        return realEstateData.property_type && realEstateData.units_doors && 
               realEstateData.city && realEstateData.state && 
               realEstateData.gross_potential_rent_annual;
      }
      return unitEcon.capex !== undefined && unitEcon.working_capital !== undefined;
    }
    if (step === 4) {
      if (businessType === 'real_estate') {
        return realEstateFunding.acquisition_price && realEstateFunding.total_project_cost && 
               realEstateFunding.arv_or_stabilized_value && targetRaise && minInvest && maxInvest && opensAt && closesAt;
      }
      return targetRaise && minInvest && maxInvest && opensAt && closesAt;
    }
    if (step === 5) {
      if (businessType === 'real_estate') {
        return kycAttestation && amlAttestation && entityRegistered && taxCompliant;
      }
      return kycAttestation && amlAttestation && entityRegistered && taxCompliant;
    }
    return true;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          {applicationId ? 'Edit Application' : 'New Application'}
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  s === step
                    ? 'bg-primary text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>Profile</span>
            <span>Business</span>
            <span>Economics</span>
            <span>Terms</span>
            <span>Compliance</span>
            <span>Review</span>
          </div>
        </div>

        <div className="card">
          {/* Step 1: Company Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Company Profile</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input w-full"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contact Email *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">EIN (Last 4 Digits)</label>
                <input
                  type="text"
                  value={einLast4}
                  onChange={(e) => setEinLast4(e.target.value)}
                  className="input w-full"
                  maxLength={4}
                  placeholder="1234"
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Business Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Business Type *</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                  className="input w-full"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail</option>
                  <option value="convenience">Convenience Store</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="input w-full"
                    maxLength={2}
                    placeholder="CT"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Business Stage *</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as BusinessStage)}
                  className="input w-full"
                >
                  <option value="planning">Planning</option>
                  <option value="raising">Raising Capital</option>
                  <option value="buildout">In Buildout</option>
                  <option value="operating">Operating</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Unit Economics */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Unit Economics</h2>
              <p className="text-sm text-gray-600 mb-4">
                We've pre-filled typical values for a {businessType}. You can edit these values.
              </p>

              {businessType === 'restaurant' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Seats</label>
                      <input
                        type="number"
                        value={unitEcon.seats || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, seats: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Turns per Day</label>
                      <input
                        type="number"
                        step="0.1"
                        value={unitEcon.turns_per_day || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, turns_per_day: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Days Open/Week</label>
                      <input
                        type="number"
                        value={unitEcon.days_open_week || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, days_open_week: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Avg Ticket ($)</label>
                      <input
                        type="number"
                        value={unitEcon.avg_ticket || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, avg_ticket: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">COGS %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={unitEcon.cogs_pct || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, cogs_pct: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Labor %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={unitEcon.labor_pct || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, labor_pct: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Annual Rent ($)</label>
                      <input
                        type="number"
                        value={unitEcon.rent_yr || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, rent_yr: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Other OpEx/Year ($)</label>
                      <input
                        type="number"
                        value={unitEcon.other_opex_yr || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, other_opex_yr: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {(businessType === 'retail' || businessType === 'convenience') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Daily Customers</label>
                      <input
                        type="number"
                        value={unitEcon.daily_customers || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, daily_customers: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Avg Order Value ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={unitEcon.aov || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, aov: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Days Open/Year</label>
                      <input
                        type="number"
                        value={unitEcon.days_per_year || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, days_per_year: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Margin %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={unitEcon.margin_pct || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, margin_pct: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Labor %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={unitEcon.labor_pct || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, labor_pct: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fixed OpEx/Year ($)</label>
                      <input
                        type="number"
                        value={unitEcon.fixed_opex_yr || ''}
                        onChange={(e) => setUnitEcon({...unitEcon, fixed_opex_yr: Number(e.target.value)})}
                        className="input w-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {businessType === 'real_estate' && (
                <>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Property Type *</label>
                          <select
                            value={realEstateData.property_type}
                            onChange={(e) => setRealEstateData({...realEstateData, property_type: e.target.value as any})}
                            className="input w-full"
                          >
                            <option value="single_family">Single Family</option>
                            <option value="multi_family">Multi Family</option>
                            <option value="mixed_use">Mixed Use</option>
                            <option value="retail">Retail</option>
                            <option value="office">Office</option>
                            <option value="industrial">Industrial</option>
                            <option value="land">Land</option>
                            <option value="short_term_rental">Short Term Rental</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Property Class *</label>
                          <select
                            value={realEstateData.property_class}
                            onChange={(e) => setRealEstateData({...realEstateData, property_class: e.target.value as any})}
                            className="input w-full"
                          >
                            <option value="A">Class A</option>
                            <option value="B">Class B</option>
                            <option value="C">Class C</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Units/Doors *</label>
                          <input
                            type="number"
                            value={realEstateData.units_doors}
                            onChange={(e) => setRealEstateData({...realEstateData, units_doors: Number(e.target.value)})}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Total SF</label>
                          <input
                            type="number"
                            value={realEstateData.sf_total}
                            onChange={(e) => setRealEstateData({...realEstateData, sf_total: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Property Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                          <input
                            type="text"
                            value={realEstateData.address_line1}
                            onChange={(e) => setRealEstateData({...realEstateData, address_line1: e.target.value})}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City *</label>
                          <input
                            type="text"
                            value={realEstateData.city}
                            onChange={(e) => setRealEstateData({...realEstateData, city: e.target.value})}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">State *</label>
                          <input
                            type="text"
                            value={realEstateData.state}
                            onChange={(e) => setRealEstateData({...realEstateData, state: e.target.value})}
                            className="input w-full"
                            maxLength={2}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                          <input
                            type="text"
                            value={realEstateData.zip}
                            onChange={(e) => setRealEstateData({...realEstateData, zip: e.target.value})}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Year Built *</label>
                          <input
                            type="number"
                            value={realEstateData.year_built}
                            onChange={(e) => setRealEstateData({...realEstateData, year_built: Number(e.target.value)})}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Year Renovated</label>
                          <input
                            type="number"
                            value={realEstateData.year_renovated || ''}
                            onChange={(e) => setRealEstateData({...realEstateData, year_renovated: e.target.value ? Number(e.target.value) : undefined})}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Rental Income</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Current Occupancy %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={realEstateData.current_occupancy_pct}
                            onChange={(e) => setRealEstateData({...realEstateData, current_occupancy_pct: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Market Rent per Unit ($)</label>
                          <input
                            type="number"
                            value={realEstateData.market_rent_per_unit || ''}
                            onChange={(e) => setRealEstateData({...realEstateData, market_rent_per_unit: e.target.value ? Number(e.target.value) : 0})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Market Rent per SF ($)</label>
                          <input
                            type="number"
                            value={realEstateData.market_rent_per_sf || ''}
                            onChange={(e) => setRealEstateData({...realEstateData, market_rent_per_sf: e.target.value ? Number(e.target.value) : undefined})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Gross Potential Rent Annual ($) *</label>
                          <input
                            type="number"
                            value={realEstateData.gross_potential_rent_annual}
                            onChange={(e) => setRealEstateData({...realEstateData, gross_potential_rent_annual: Number(e.target.value)})}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Vacancy Rate %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={realEstateData.vacancy_rate_pct}
                            onChange={(e) => setRealEstateData({...realEstateData, vacancy_rate_pct: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Other Income Annual ($)</label>
                          <input
                            type="number"
                            value={realEstateData.other_income_annual}
                            onChange={(e) => setRealEstateData({...realEstateData, other_income_annual: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Operating Expenses</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Taxes Annual ($)</label>
                          <input
                            type="number"
                            value={realEstateData.taxes_annual}
                            onChange={(e) => setRealEstateData({...realEstateData, taxes_annual: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Insurance Annual ($)</label>
                          <input
                            type="number"
                            value={realEstateData.insurance_annual}
                            onChange={(e) => setRealEstateData({...realEstateData, insurance_annual: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Repairs & Maintenance Annual ($)</label>
                          <input
                            type="number"
                            value={realEstateData.repairs_maintenance_annual}
                            onChange={(e) => setRealEstateData({...realEstateData, repairs_maintenance_annual: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Utilities Annual ($)</label>
                          <input
                            type="number"
                            value={realEstateData.utilities_annual}
                            onChange={(e) => setRealEstateData({...realEstateData, utilities_annual: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Management Fee %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={realEstateData.management_fee_pct}
                            onChange={(e) => setRealEstateData({...realEstateData, management_fee_pct: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">CapEx Reserve Annual ($)</label>
                          <input
                            type="number"
                            value={realEstateData.capex_reserve_annual}
                            onChange={(e) => setRealEstateData({...realEstateData, capex_reserve_annual: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Calculated Metrics Panel */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Calculated Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">NOI (Annual):</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(calculateRealEstateNOI(realEstateData))}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cap Rate:</span>
                          <span className="ml-2 font-medium">
                            {realEstateFunding.arv_or_stabilized_value > 0 
                              ? `${calculateCapRate(calculateRealEstateNOI(realEstateData), realEstateFunding.arv_or_stabilized_value).toFixed(2)}%`
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">CapEx ($) *</label>
                  <input
                    type="number"
                    value={unitEcon.capex || ''}
                    onChange={(e) => setUnitEcon({...unitEcon, capex: Number(e.target.value)})}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Working Capital ($) *</label>
                  <input
                    type="number"
                    value={unitEcon.working_capital || ''}
                    onChange={(e) => setUnitEcon({...unitEcon, working_capital: Number(e.target.value)})}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Funding Terms */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Funding Terms</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Structure *</label>
                <select
                  value={fundingStructure}
                  onChange={(e) => setFundingStructure(e.target.value as 'equity' | 'revenue_share')}
                  className="input w-full"
                >
                  <option value="revenue_share">Revenue Share</option>
                  <option value="equity">Equity</option>
                </select>
              </div>

              {fundingStructure === 'equity' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Equity % *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={equityPct}
                      onChange={(e) => setEquityPct(Number(e.target.value))}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valuation ($) *</label>
                    <input
                      type="number"
                      value={valuation}
                      onChange={(e) => setValuation(Number(e.target.value))}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">Revenue Share % *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={revSharePct * 100}
                    onChange={(e) => setRevSharePct(Number(e.target.value) / 100)}
                    className="input w-full"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">% of monthly revenue paid to investors</p>
                </div>
              )}

              {businessType === 'real_estate' && (
                <>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Capital & Structure</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Acquisition Price ($) *</label>
                          <input
                            type="number"
                            value={realEstateFunding.acquisition_price}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRealEstateFunding({...realEstateFunding, acquisition_price: val});
                              // Auto-calculate total project cost
                              const totalCost = val + realEstateFunding.rehab_capex + realEstateFunding.soft_costs;
                              setRealEstateFunding(prev => ({...prev, total_project_cost: totalCost}));
                            }}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Rehab CapEx ($)</label>
                          <input
                            type="number"
                            value={realEstateFunding.rehab_capex}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRealEstateFunding({...realEstateFunding, rehab_capex: val});
                              // Auto-calculate total project cost
                              const totalCost = realEstateFunding.acquisition_price + val + realEstateFunding.soft_costs;
                              setRealEstateFunding(prev => ({...prev, total_project_cost: totalCost}));
                            }}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Soft Costs ($)</label>
                          <input
                            type="number"
                            value={realEstateFunding.soft_costs}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRealEstateFunding({...realEstateFunding, soft_costs: val});
                              // Auto-calculate total project cost
                              const totalCost = realEstateFunding.acquisition_price + realEstateFunding.rehab_capex + val;
                              setRealEstateFunding(prev => ({...prev, total_project_cost: totalCost}));
                            }}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Total Project Cost ($)</label>
                          <input
                            type="number"
                            value={realEstateFunding.total_project_cost}
                            className="input w-full bg-gray-100"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">ARV/Stabilized Value ($) *</label>
                          <input
                            type="number"
                            value={realEstateFunding.arv_or_stabilized_value}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRealEstateFunding({...realEstateFunding, arv_or_stabilized_value: val});
                              // Auto-calculate equity required
                              const loanAmount = (realEstateFunding.ltv_pct / 100) * val;
                              const equityRequired = realEstateFunding.total_project_cost - loanAmount;
                              setRealEstateFunding(prev => ({...prev, equity_required: equityRequired}));
                            }}
                            className="input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">LTV %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={realEstateFunding.ltv_pct}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRealEstateFunding({...realEstateFunding, ltv_pct: val});
                              // Auto-calculate equity required
                              const loanAmount = (val / 100) * realEstateFunding.arv_or_stabilized_value;
                              const equityRequired = realEstateFunding.total_project_cost - loanAmount;
                              setRealEstateFunding(prev => ({...prev, equity_required: equityRequired}));
                            }}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Financing Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Lender Type</label>
                          <select
                            value={realEstateFunding.lender_type}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, lender_type: e.target.value as any})}
                            className="input w-full"
                          >
                            <option value="bank">Bank</option>
                            <option value="dscr">DSCR</option>
                            <option value="bridge">Bridge</option>
                            <option value="private">Private</option>
                            <option value="agency">Agency</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Interest Rate %</label>
                          <input
                            type="number"
                            step="0.01"
                            value={realEstateFunding.interest_rate_pct}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, interest_rate_pct: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Amortization Years</label>
                          <input
                            type="number"
                            value={realEstateFunding.amortization_years}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, amortization_years: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Interest Only Months</label>
                          <input
                            type="number"
                            value={realEstateFunding.io_months}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, io_months: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">DSCR Minimum</label>
                          <input
                            type="number"
                            step="0.01"
                            value={realEstateFunding.dscr_min}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, dscr_min: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Equity Required ($)</label>
                          <input
                            type="number"
                            value={realEstateFunding.equity_required}
                            className="input w-full bg-gray-100"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Investment Terms</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Preferred Return %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={realEstateFunding.preferred_return_pct}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, preferred_return_pct: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">GP/LP Split</label>
                          <input
                            type="text"
                            value={realEstateFunding.gp_lp_split}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, gp_lp_split: e.target.value})}
                            className="input w-full"
                            placeholder="e.g., 70/30"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Distribution Frequency</label>
                          <select
                            value={realEstateFunding.distribution_frequency}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, distribution_frequency: e.target.value as any})}
                            className="input w-full"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="semiannual">Semiannual</option>
                            <option value="annual">Annual</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Hold Period (Months)</label>
                          <input
                            type="number"
                            value={realEstateFunding.hold_period_months}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, hold_period_months: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Exit Strategy</label>
                          <select
                            value={realEstateFunding.exit_strategy}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, exit_strategy: e.target.value as any})}
                            className="input w-full"
                          >
                            <option value="refi">Refinance</option>
                            <option value="sale">Sale</option>
                            <option value="refi_then_hold">Refi then Hold</option>
                            <option value="condo_conversion">Condo Conversion</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Target Cap Rate Exit %</label>
                          <input
                            type="number"
                            step="0.01"
                            value={realEstateFunding.target_cap_rate_exit_pct}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, target_cap_rate_exit_pct: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Projected IRR %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={realEstateFunding.projected_irr_pct}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, projected_irr_pct: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Projected Equity Multiple</label>
                          <input
                            type="number"
                            step="0.01"
                            value={realEstateFunding.projected_equity_multiple}
                            onChange={(e) => setRealEstateFunding({...realEstateFunding, projected_equity_multiple: Number(e.target.value)})}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Calculated Metrics Panel */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Calculated Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Equity Required:</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(realEstateFunding.equity_required)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">DSCR:</span>
                          <span className="ml-2 font-medium">
                            {realEstateFunding.total_project_cost > 0 && realEstateFunding.ltv_pct > 0
                              ? `${((calculateRealEstateNOI(realEstateData) / (realEstateFunding.total_project_cost * realEstateFunding.ltv_pct / 100 * realEstateFunding.interest_rate_pct / 100)).toFixed(2))}`
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target Raise ($) *</label>
                  <input
                    type="number"
                    value={targetRaise}
                    onChange={(e) => setTargetRaise(Number(e.target.value))}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Investment ($) *</label>
                  <input
                    type="number"
                    value={minInvest}
                    onChange={(e) => setMinInvest(Number(e.target.value))}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Investment ($) *</label>
                  <input
                    type="number"
                    value={maxInvest}
                    onChange={(e) => setMaxInvest(Number(e.target.value))}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Offering Opens *</label>
                  <input
                    type="date"
                    value={opensAt?.split('T')[0] || ''}
                    onChange={(e) => setOpensAt(e.target.value ? `${e.target.value}T00:00:00Z` : '')}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Offering Closes *</label>
                  <input
                    type="date"
                    value={closesAt?.split('T')[0] || ''}
                    onChange={(e) => setClosesAt(e.target.value ? `${e.target.value}T23:59:59Z` : '')}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Compliance */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Compliance Attestations</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please confirm the following to proceed:
              </p>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={kycAttestation}
                    onChange={(e) => setKycAttestation(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">KYC Attestation</div>
                    <div className="text-sm text-gray-600">
                      I attest that I have completed Know Your Customer verification
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={amlAttestation}
                    onChange={(e) => setAmlAttestation(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">AML Attestation</div>
                    <div className="text-sm text-gray-600">
                      I attest compliance with Anti-Money Laundering regulations
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={entityRegistered}
                    onChange={(e) => setEntityRegistered(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Entity Registration</div>
                    <div className="text-sm text-gray-600">
                      My business entity is properly registered with state authorities
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={taxCompliant}
                    onChange={(e) => setTaxCompliant(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Tax Compliance</div>
                    <div className="text-sm text-gray-600">
                      I am current on all tax obligations
                    </div>
                  </div>
                </label>

                {businessType === 'real_estate' && (
                  <>
                    <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={realEstateCompliance.zoning_verified}
                        onChange={(e) => setRealEstateCompliance({...realEstateCompliance, zoning_verified: e.target.checked})}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">Zoning Verified</div>
                        <div className="text-sm text-gray-600">
                          Property zoning is verified and appropriate for intended use
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={realEstateCompliance.permits_required}
                        onChange={(e) => setRealEstateCompliance({...realEstateCompliance, permits_required: e.target.checked})}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">Permits Required</div>
                        <div className="text-sm text-gray-600">
                          All necessary permits have been identified and obtained
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={realEstateCompliance.environmental_phase1}
                        onChange={(e) => setRealEstateCompliance({...realEstateCompliance, environmental_phase1: e.target.checked})}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">Environmental Phase 1</div>
                        <div className="text-sm text-gray-600">
                          Environmental Phase 1 assessment completed (if required)
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={realEstateCompliance.gc_engaged}
                        onChange={(e) => setRealEstateCompliance({...realEstateCompliance, gc_engaged: e.target.checked})}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">General Contractor Engaged</div>
                        <div className="text-sm text-gray-600">
                          General contractor has been engaged for construction work
                        </div>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2">Company Profile</h3>
                  <p><strong>Company:</strong> {companyName}</p>
                  <p><strong>Email:</strong> {contactEmail}</p>
                  {website && <p><strong>Website:</strong> {website}</p>}
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2">Business Details</h3>
                  <p><strong>Type:</strong> {businessType}</p>
                  <p><strong>Location:</strong> {city}, {state}</p>
                  <p><strong>Stage:</strong> {stage}</p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2">Funding</h3>
                  <p><strong>Structure:</strong> {fundingStructure === 'equity' ? 'Equity' : 'Revenue Share'}</p>
                  <p><strong>Target Raise:</strong> {formatCurrency(targetRaise)}</p>
                  <p><strong>Investment Range:</strong> {formatCurrency(minInvest)} - {formatCurrency(maxInvest)}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                  <p className="text-sm font-medium text-yellow-900">
                    ⚠️ Once submitted, your application will be locked for review. You won't be able to edit it unless our team requests changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {step > 1 && (
                <button onClick={handlePrev} className="btn-secondary">
                  ← Previous
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => saveApplication('draft')}
                disabled={saving}
                className="btn-secondary"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>

              {step < 6 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProgress()}
                  className="btn-primary"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={saving || !canProgress()}
                  className="btn-primary"
                >
                  {saving ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

