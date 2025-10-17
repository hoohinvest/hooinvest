/**
 * Allocation Engine for Investment Pool
 * 
 * Calculates equity, interest, and royalty distributions
 * Handles rounding and edge cases with comprehensive unit tests
 */

import { 
  Raise, 
  Investment, 
  Allocation, 
  AllocationDetails, 
  InstrumentType,
  InstrumentTerms 
} from '@/types/raise';

export interface AllocationResult {
  allocations: Allocation[];
  totalAllocatedCents: number;
  remainingCents: number;
}

export interface AllocationConfig {
  // Rounding rules
  EQUITY_ROUNDING_DECIMALS: number; // e.g., 4 = 0.0001%
  ROYALTY_ROUNDING_DECIMALS: number; // e.g., 6 = 0.000001%
  
  // Platform fees
  PLATFORM_FEE_BPS: number; // e.g., 300 = 3.00%
  
  // Certificate numbering
  CERTIFICATE_PREFIX: string; // e.g., "HOO"
}

const DEFAULT_CONFIG: AllocationConfig = {
  EQUITY_ROUNDING_DECIMALS: 4,
  ROYALTY_ROUNDING_DECIMALS: 6,
  PLATFORM_FEE_BPS: 300, // 3.00%
  CERTIFICATE_PREFIX: 'HOO'
};

/**
 * Compute allocations for a funded raise
 */
export function computeAllocations(
  raise: Raise, 
  investments: Investment[],
  config: Partial<AllocationConfig> = {}
): AllocationResult {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Filter only captured investments
  const capturedInvestments = investments.filter(
    inv => inv.status === 'CAPTURED'
  );
  
  if (capturedInvestments.length === 0) {
    return {
      allocations: [],
      totalAllocatedCents: 0,
      remainingCents: raise.goalCents
    };
  }
  
  const totalRaised = capturedInvestments.reduce(
    (sum, inv) => sum + inv.amountCents, 
    0
  );
  
  const allocations: Allocation[] = [];
  let totalAllocatedCents = 0;
  
  switch (raise.instrument) {
    case InstrumentType.EQUITY:
      allocations.push(...computeEquityAllocations(
        raise, 
        capturedInvestments, 
        finalConfig
      ));
      break;
      
    case InstrumentType.INTEREST:
      allocations.push(...computeInterestAllocations(
        raise, 
        capturedInvestments, 
        finalConfig
      ));
      break;
      
    case InstrumentType.ROYALTY:
      allocations.push(...computeRoyaltyAllocations(
        raise, 
        capturedInvestments, 
        finalConfig
      ));
      break;
      
    default:
      throw new Error(`Unsupported instrument type: ${raise.instrument}`);
  }
  
  totalAllocatedCents = allocations.reduce(
    (sum, alloc) => sum + getPrincipalAmount(alloc.allocationJson), 
    0
  );
  
  return {
    allocations,
    totalAllocatedCents,
    remainingCents: raise.goalCents - totalAllocatedCents
  };
}

/**
 * Compute equity allocations
 */
function computeEquityAllocations(
  raise: Raise,
  investments: Investment[],
  config: AllocationConfig
): Allocation[] {
  const terms = raise.instrumentTermsJson;
  const equityPoolPct = terms.equityPoolPct || 0;
  
  if (equityPoolPct <= 0) {
    throw new Error('Equity pool percentage must be positive');
  }
  
  const totalRaised = investments.reduce(
    (sum, inv) => sum + inv.amountCents, 
    0
  );
  
  const allocations: Allocation[] = [];
  
  for (const investment of investments) {
    const investmentPct = investment.amountCents / totalRaised;
    const equityPct = investmentPct * equityPoolPct;
    
    // Round to specified decimal places
    const roundedEquityPct = roundToDecimals(
      equityPct, 
      config.EQUITY_ROUNDING_DECIMALS
    );
    
    const allocationDetails: AllocationDetails = {
      equityPct: roundedEquityPct
    };
    
    allocations.push({
      id: crypto.randomUUID(),
      raiseId: raise.id,
      investorId: investment.investorId,
      allocationJson: allocationDetails,
      certificateNumber: generateCertificateNumber(
        raise.id, 
        investment.investorId, 
        config.CERTIFICATE_PREFIX
      ),
      createdAt: new Date()
    });
  }
  
  return allocations;
}

/**
 * Compute interest allocations (debt notes)
 */
function computeInterestAllocations(
  raise: Raise,
  investments: Investment[],
  config: AllocationConfig
): Allocation[] {
  const terms = raise.instrumentTermsJson;
  const apr = terms.interestAPR || 0;
  const termMonths = terms.termMonths || 36;
  
  if (apr <= 0) {
    throw new Error('Interest APR must be positive');
  }
  
  const maturityDate = new Date();
  maturityDate.setMonth(maturityDate.getMonth() + termMonths);
  
  const allocations: Allocation[] = [];
  
  for (const investment of investments) {
    const allocationDetails: AllocationDetails = {
      notePrincipalCents: investment.amountCents,
      noteAPR: apr,
      maturityDate: maturityDate
    };
    
    allocations.push({
      id: crypto.randomUUID(),
      raiseId: raise.id,
      investorId: investment.investorId,
      allocationJson: allocationDetails,
      certificateNumber: generateCertificateNumber(
        raise.id, 
        investment.investorId, 
        config.CERTIFICATE_PREFIX
      ),
      createdAt: new Date()
    });
  }
  
  return allocations;
}

/**
 * Compute royalty allocations
 */
function computeRoyaltyAllocations(
  raise: Raise,
  investments: Investment[],
  config: AllocationConfig
): Allocation[] {
  const terms = raise.instrumentTermsJson;
  const royaltyPoolPct = terms.royaltyPoolPct || 0;
  const durationMonths = terms.royaltyDurationMonths || 60;
  
  if (royaltyPoolPct <= 0) {
    throw new Error('Royalty pool percentage must be positive');
  }
  
  const totalRaised = investments.reduce(
    (sum, inv) => sum + inv.amountCents, 
    0
  );
  
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);
  
  const allocations: Allocation[] = [];
  
  for (const investment of investments) {
    const investmentPct = investment.amountCents / totalRaised;
    const royaltyPct = investmentPct * royaltyPoolPct;
    
    // Round to specified decimal places
    const roundedRoyaltyPct = roundToDecimals(
      royaltyPct, 
      config.ROYALTY_ROUNDING_DECIMALS
    );
    
    const allocationDetails: AllocationDetails = {
      royaltyPct: roundedRoyaltyPct,
      royaltyStartDate: startDate,
      royaltyEndDate: endDate
    };
    
    allocations.push({
      id: crypto.randomUUID(),
      raiseId: raise.id,
      investorId: investment.investorId,
      allocationJson: allocationDetails,
      certificateNumber: generateCertificateNumber(
        raise.id, 
        investment.investorId, 
        config.CERTIFICATE_PREFIX
      ),
      createdAt: new Date()
    });
  }
  
  return allocations;
}

/**
 * Extract principal amount from allocation details
 */
function getPrincipalAmount(details: AllocationDetails): number {
  if (details.notePrincipalCents) {
    return details.notePrincipalCents;
  }
  
  // For equity and royalty, we don't have a "principal" amount
  // Return 0 as they don't affect the total allocated calculation
  return 0;
}

/**
 * Round number to specified decimal places
 */
function roundToDecimals(num: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * Generate certificate number
 */
function generateCertificateNumber(
  raiseId: string, 
  investorId: string, 
  prefix: string
): string {
  const raiseShort = raiseId.substring(0, 8).toUpperCase();
  const investorShort = investorId.substring(0, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  
  return `${prefix}-${raiseShort}-${investorShort}-${timestamp}`;
}

/**
 * Calculate platform fees
 */
export function calculatePlatformFee(
  amountCents: number, 
  feeBps: number
): number {
  return Math.round((amountCents * feeBps) / 10000);
}

/**
 * Calculate net amount after platform fees
 */
export function calculateNetAmount(
  amountCents: number, 
  platformFeeBps: number
): number {
  const fee = calculatePlatformFee(amountCents, platformFeeBps);
  return amountCents - fee;
}

/**
 * Validate allocation configuration
 */
export function validateAllocationConfig(config: AllocationConfig): string[] {
  const errors: string[] = [];
  
  if (config.EQUITY_ROUNDING_DECIMALS < 0 || config.EQUITY_ROUNDING_DECIMALS > 10) {
    errors.push('EQUITY_ROUNDING_DECIMALS must be between 0 and 10');
  }
  
  if (config.ROYALTY_ROUNDING_DECIMALS < 0 || config.ROYALTY_ROUNDING_DECIMALS > 10) {
    errors.push('ROYALTY_ROUNDING_DECIMALS must be between 0 and 10');
  }
  
  if (config.PLATFORM_FEE_BPS < 0 || config.PLATFORM_FEE_BPS > 10000) {
    errors.push('PLATFORM_FEE_BPS must be between 0 and 10000 (0-100%)');
  }
  
  if (!config.CERTIFICATE_PREFIX || config.CERTIFICATE_PREFIX.length > 10) {
    errors.push('CERTIFICATE_PREFIX must be 1-10 characters');
  }
  
  return errors;
}
