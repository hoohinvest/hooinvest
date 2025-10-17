/**
 * Comprehensive Unit Tests for Allocation Engine
 * 
 * Tests equity, interest, and royalty allocation calculations
 * with edge cases, rounding, and validation
 */

import { 
  computeAllocations, 
  calculatePlatformFee, 
  calculateNetAmount,
  validateAllocationConfig,
  AllocationConfig 
} from '../engine';
import { Raise, Investment, InstrumentType, InvestmentStatus } from '@/types/raise';

// Test data factory
const createRaise = (overrides: Partial<Raise> = {}): Raise => ({
  id: 'raise-1',
  businessId: 'business-1',
  title: 'Test Raise',
  goalCents: 100000, // $1000
  minContributionCents: 1000, // $10
  maxContributionCents: 50000, // $500
  instrument: InstrumentType.EQUITY,
  instrumentTermsJson: {
    equityPoolPct: 20
  },
  status: 'FUNDED' as any,
  raisedCents: 100000,
  expiresAt: new Date('2024-12-31'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
});

const createInvestment = (overrides: Partial<Investment> = {}): Investment => ({
  id: 'inv-1',
  raiseId: 'raise-1',
  investorId: 'investor-1',
  amountCents: 10000, // $100
  status: InvestmentStatus.CAPTURED,
  paymentProviderId: 'pi-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
});

describe('Allocation Engine', () => {
  describe('Equity Allocations', () => {
    it('should calculate equal equity allocations for equal investments', () => {
      const raise = createRaise({
        instrument: InstrumentType.EQUITY,
        instrumentTermsJson: { equityPoolPct: 20 },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 50000 }),
        createInvestment({ id: 'inv-2', amountCents: 50000 })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(2);
      expect(result.allocations[0].allocationJson.equityPct).toBe(10); // 50% of 20%
      expect(result.allocations[1].allocationJson.equityPct).toBe(10); // 50% of 20%
      expect(result.totalAllocatedCents).toBe(0); // No principal for equity
    });

    it('should calculate proportional equity allocations for different investments', () => {
      const raise = createRaise({
        instrument: InstrumentType.EQUITY,
        instrumentTermsJson: { equityPoolPct: 30 },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 75000 }), // 75%
        createInvestment({ id: 'inv-2', amountCents: 25000 })  // 25%
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations[0].allocationJson.equityPct).toBe(22.5); // 75% of 30%
      expect(result.allocations[1].allocationJson.equityPct).toBe(7.5);  // 25% of 30%
    });

    it('should handle rounding correctly for equity allocations', () => {
      const raise = createRaise({
        instrument: InstrumentType.EQUITY,
        instrumentTermsJson: { equityPoolPct: 33.333333 },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 33333 }),
        createInvestment({ id: 'inv-2', amountCents: 33333 }),
        createInvestment({ id: 'inv-3', amountCents: 33334 })
      ];

      const result = computeAllocations(raise, investments);

      // Each should get ~11.111% of 33.333%, rounded to 4 decimal places
      expect(result.allocations[0].allocationJson.equityPct).toBe(11.1111);
      expect(result.allocations[1].allocationJson.equityPct).toBe(11.1111);
      expect(result.allocations[2].allocationJson.equityPct).toBe(11.1111);
    });

    it('should handle single investor equity allocation', () => {
      const raise = createRaise({
        instrument: InstrumentType.EQUITY,
        instrumentTermsJson: { equityPoolPct: 25 },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 100000 })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(1);
      expect(result.allocations[0].allocationJson.equityPct).toBe(25);
    });

    it('should throw error for invalid equity pool percentage', () => {
      const raise = createRaise({
        instrument: InstrumentType.EQUITY,
        instrumentTermsJson: { equityPoolPct: 0 }
      });

      const investments = [createInvestment()];

      expect(() => computeAllocations(raise, investments)).toThrow('Equity pool percentage must be positive');
    });
  });

  describe('Interest Allocations', () => {
    it('should create debt notes with correct terms', () => {
      const raise = createRaise({
        instrument: InstrumentType.INTEREST,
        instrumentTermsJson: { 
          interestAPR: 8.5,
          termMonths: 36
        },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 60000 }),
        createInvestment({ id: 'inv-2', amountCents: 40000 })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(2);
      expect(result.allocations[0].allocationJson.notePrincipalCents).toBe(60000);
      expect(result.allocations[0].allocationJson.noteAPR).toBe(8.5);
      expect(result.allocations[1].allocationJson.notePrincipalCents).toBe(40000);
      expect(result.allocations[1].allocationJson.noteAPR).toBe(8.5);

      // Check maturity date is 36 months from now
      const maturityDate = new Date(result.allocations[0].allocationJson.maturityDate!);
      const expectedDate = new Date();
      expectedDate.setMonth(expectedDate.getMonth() + 36);
      expect(maturityDate.getFullYear()).toBe(expectedDate.getFullYear());
      expect(maturityDate.getMonth()).toBe(expectedDate.getMonth());
    });

    it('should calculate total allocated amount for interest notes', () => {
      const raise = createRaise({
        instrument: InstrumentType.INTEREST,
        instrumentTermsJson: { 
          interestAPR: 10,
          termMonths: 24
        },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 75000 }),
        createInvestment({ id: 'inv-2', amountCents: 25000 })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.totalAllocatedCents).toBe(100000); // Sum of all note principals
      expect(result.remainingCents).toBe(0);
    });

    it('should throw error for invalid interest terms', () => {
      const raise = createRaise({
        instrument: InstrumentType.INTEREST,
        instrumentTermsJson: { 
          interestAPR: 0, // Invalid
          termMonths: 36
        }
      });

      const investments = [createInvestment()];

      expect(() => computeAllocations(raise, investments)).toThrow('Interest APR must be positive');
    });
  });

  describe('Royalty Allocations', () => {
    it('should calculate proportional royalty allocations', () => {
      const raise = createRaise({
        instrument: InstrumentType.ROYALTY,
        instrumentTermsJson: { 
          royaltyPoolPct: 5,
          royaltyDurationMonths: 60
        },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 80000 }), // 80%
        createInvestment({ id: 'inv-2', amountCents: 20000 })  // 20%
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(2);
      expect(result.allocations[0].allocationJson.royaltyPct).toBe(4); // 80% of 5%
      expect(result.allocations[1].allocationJson.royaltyPct).toBe(1); // 20% of 5%

      // Check duration dates
      const startDate = new Date(result.allocations[0].allocationJson.royaltyStartDate!);
      const endDate = new Date(result.allocations[0].allocationJson.royaltyEndDate!);
      const durationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                            (endDate.getMonth() - startDate.getMonth());
      expect(durationMonths).toBe(60);
    });

    it('should handle rounding for small royalty percentages', () => {
      const raise = createRaise({
        instrument: InstrumentType.ROYALTY,
        instrumentTermsJson: { 
          royaltyPoolPct: 1.234567,
          royaltyDurationMonths: 120
        },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 33333 }),
        createInvestment({ id: 'inv-2', amountCents: 33333 }),
        createInvestment({ id: 'inv-3', amountCents: 33334 })
      ];

      const result = computeAllocations(raise, investments);

      // Should be rounded to 6 decimal places
      expect(result.allocations[0].allocationJson.royaltyPct).toBe(0.411522);
      expect(result.allocations[1].allocationJson.royaltyPct).toBe(0.411522);
      expect(result.allocations[2].allocationJson.royaltyPct).toBe(0.411523);
    });

    it('should throw error for invalid royalty terms', () => {
      const raise = createRaise({
        instrument: InstrumentType.ROYALTY,
        instrumentTermsJson: { 
          royaltyPoolPct: 0, // Invalid
          royaltyDurationMonths: 60
        }
      });

      const investments = [createInvestment()];

      expect(() => computeAllocations(raise, investments)).toThrow('Royalty pool percentage must be positive');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty investments array', () => {
      const raise = createRaise();
      const investments: Investment[] = [];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(0);
      expect(result.totalAllocatedCents).toBe(0);
      expect(result.remainingCents).toBe(raise.goalCents);
    });

    it('should handle investments that exceed goal', () => {
      const raise = createRaise({
        goalCents: 50000,
        raisedCents: 75000 // Overfunded
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 30000 }),
        createInvestment({ id: 'inv-2', amountCents: 45000 })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(2);
      expect(result.totalAllocatedCents).toBe(0); // For equity
      expect(result.remainingCents).toBe(50000); // Goal amount
    });

    it('should handle very small investment amounts', () => {
      const raise = createRaise({
        instrument: InstrumentType.EQUITY,
        instrumentTermsJson: { equityPoolPct: 0.1 },
        goalCents: 1000,
        raisedCents: 1000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 1 }),
        createInvestment({ id: 'inv-2', amountCents: 999 })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(2);
      expect(result.allocations[0].allocationJson.equityPct).toBe(0.0001); // 0.1% of 0.1%
      expect(result.allocations[1].allocationJson.equityPct).toBe(0.0999); // 99.9% of 0.1%
    });

    it('should filter out non-captured investments', () => {
      const raise = createRaise();
      
      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 50000, status: InvestmentStatus.CAPTURED }),
        createInvestment({ id: 'inv-2', amountCents: 30000, status: InvestmentStatus.PENDING }),
        createInvestment({ id: 'inv-3', amountCents: 20000, status: InvestmentStatus.FAILED })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations).toHaveLength(1);
      expect(result.allocations[0].investorId).toBe('investor-1');
    });

    it('should generate unique certificate numbers', () => {
      const raise = createRaise();
      
      const investments = [
        createInvestment({ id: 'inv-1', investorId: 'investor-1' }),
        createInvestment({ id: 'inv-2', investorId: 'investor-2' })
      ];

      const result = computeAllocations(raise, investments);

      expect(result.allocations[0].certificateNumber).toBeDefined();
      expect(result.allocations[1].certificateNumber).toBeDefined();
      expect(result.allocations[0].certificateNumber).not.toBe(result.allocations[1].certificateNumber);
    });
  });

  describe('Platform Fee Calculations', () => {
    it('should calculate platform fees correctly', () => {
      expect(calculatePlatformFee(10000, 300)).toBe(30); // 3% of $100 = $0.30
      expect(calculatePlatformFee(100000, 250)).toBe(250); // 2.5% of $1000 = $25
      expect(calculatePlatformFee(50000, 500)).toBe(250); // 5% of $500 = $25
    });

    it('should calculate net amounts after fees', () => {
      expect(calculateNetAmount(10000, 300)).toBe(9970); // $100 - $0.30 = $99.70
      expect(calculateNetAmount(100000, 250)).toBe(99750); // $1000 - $25 = $975
      expect(calculateNetAmount(50000, 500)).toBe(49750); // $500 - $25 = $475
    });

    it('should handle zero fees', () => {
      expect(calculatePlatformFee(10000, 0)).toBe(0);
      expect(calculateNetAmount(10000, 0)).toBe(10000);
    });

    it('should handle high fees', () => {
      expect(calculatePlatformFee(10000, 1000)).toBe(100); // 10% fee
      expect(calculateNetAmount(10000, 1000)).toBe(9900);
    });

    it('should round fees correctly', () => {
      expect(calculatePlatformFee(33333, 333)).toBe(111); // 3.33% of $333.33 = $11.11, rounded to $11
      expect(calculateNetAmount(33333, 333)).toBe(33222);
    });
  });

  describe('Configuration Validation', () => {
    it('should validate correct configuration', () => {
      const config: AllocationConfig = {
        EQUITY_ROUNDING_DECIMALS: 4,
        ROYALTY_ROUNDING_DECIMALS: 6,
        PLATFORM_FEE_BPS: 300,
        CERTIFICATE_PREFIX: 'HOO'
      };

      const errors = validateAllocationConfig(config);
      expect(errors).toHaveLength(0);
    });

    it('should catch invalid equity rounding decimals', () => {
      const config: AllocationConfig = {
        EQUITY_ROUNDING_DECIMALS: -1,
        ROYALTY_ROUNDING_DECIMALS: 6,
        PLATFORM_FEE_BPS: 300,
        CERTIFICATE_PREFIX: 'HOO'
      };

      const errors = validateAllocationConfig(config);
      expect(errors).toContain('EQUITY_ROUNDING_DECIMALS must be between 0 and 10');
    });

    it('should catch invalid platform fee', () => {
      const config: AllocationConfig = {
        EQUITY_ROUNDING_DECIMALS: 4,
        ROYALTY_ROUNDING_DECIMALS: 6,
        PLATFORM_FEE_BPS: 15000, // 150% - too high
        CERTIFICATE_PREFIX: 'HOO'
      };

      const errors = validateAllocationConfig(config);
      expect(errors).toContain('PLATFORM_FEE_BPS must be between 0 and 10000 (0-100%)');
    });

    it('should catch invalid certificate prefix', () => {
      const config: AllocationConfig = {
        EQUITY_ROUNDING_DECIMALS: 4,
        ROYALTY_ROUNDING_DECIMALS: 6,
        PLATFORM_FEE_BPS: 300,
        CERTIFICATE_PREFIX: '' // Empty prefix
      };

      const errors = validateAllocationConfig(config);
      expect(errors).toContain('CERTIFICATE_PREFIX must be 1-10 characters');
    });

    it('should catch multiple validation errors', () => {
      const config: AllocationConfig = {
        EQUITY_ROUNDING_DECIMALS: 15, // Too high
        ROYALTY_ROUNDING_DECIMALS: -2, // Too low
        PLATFORM_FEE_BPS: 50000, // Too high
        CERTIFICATE_PREFIX: 'VERYLONGPREFIX' // Too long
      };

      const errors = validateAllocationConfig(config);
      expect(errors).toHaveLength(4);
    });
  });

  describe('Custom Configuration', () => {
    it('should use custom rounding configuration', () => {
      const raise = createRaise({
        instrument: InstrumentType.EQUITY,
        instrumentTermsJson: { equityPoolPct: 33.333333 },
        goalCents: 100000,
        raisedCents: 100000
      });

      const investments = [
        createInvestment({ id: 'inv-1', amountCents: 33333 }),
        createInvestment({ id: 'inv-2', amountCents: 33333 }),
        createInvestment({ id: 'inv-3', amountCents: 33334 })
      ];

      const config = {
        EQUITY_ROUNDING_DECIMALS: 2, // Round to 2 decimal places
        ROYALTY_ROUNDING_DECIMALS: 6,
        PLATFORM_FEE_BPS: 300,
        CERTIFICATE_PREFIX: 'TEST'
      };

      const result = computeAllocations(raise, investments, config);

      // Should be rounded to 2 decimal places
      expect(result.allocations[0].allocationJson.equityPct).toBe(11.11);
      expect(result.allocations[1].allocationJson.equityPct).toBe(11.11);
      expect(result.allocations[2].allocationJson.equityPct).toBe(11.11);
    });
  });
});
