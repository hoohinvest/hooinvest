/**
 * Investment Pool (Raise) Domain Service
 * 
 * Core business logic for raise lifecycle management
 */

import { 
  Raise, 
  Investment, 
  BusinessPayout,
  RaiseStatus,
  InvestmentStatus,
  PayoutStatus,
  InstrumentType,
  CreateRaiseRequest,
  InvestRequest,
  RaiseDetails,
  InvestmentProgress,
  RaiseConfig
} from '@/types/raise';
import { raiseAdapter } from '@/lib/db/raiseAdapter';
import { computeAllocations, calculateNetAmount } from '@/lib/alloc/engine';
import { stripeService } from '@/lib/payments/stripe';
import { kycService } from '@/lib/kyc/providerStub';

const DEFAULT_CONFIG: RaiseConfig = {
  CLIP_TO_REMAINING: true,
  PLATFORM_FEE_BPS: 300, // 3.00%
  PAYMENT_FEE_BPS: 60, // ~2.9% + $0.30 for small amounts
  AUTO_CLOSE_DELAY_MS: 5000, // 5 seconds
  REFUND_RETRY_ATTEMPTS: 3,
  REFUND_RETRY_DELAY_MS: 60000 // 1 minute
};

export class RaiseService {
  constructor(private config: RaiseConfig = DEFAULT_CONFIG) {}

  /**
   * Create a new raise
   */
  async createRaise(
    businessId: string, 
    request: CreateRaiseRequest
  ): Promise<Raise> {
    // Validate business exists and is verified
    const isBusinessVerified = await kycService.isBusinessVerified(businessId);
    if (!isBusinessVerified) {
      throw new Error('Business must be KYC/KYB verified to create raises');
    }

    // Validate request
    this.validateCreateRaiseRequest(request);

    const raise: Omit<Raise, 'id' | 'createdAt' | 'updatedAt'> = {
      businessId,
      title: request.title,
      description: request.description,
      goalCents: request.goalCents,
      minContributionCents: request.minContributionCents,
      maxContributionCents: request.maxContributionCents,
      instrument: request.instrument,
      instrumentTermsJson: request.instrumentTerms,
      status: RaiseStatus.DRAFT,
      raisedCents: 0,
      expiresAt: request.expiresAt
    };

    const createdRaise = await raiseAdapter.createRaise(raise);

    // Log audit event
    await raiseAdapter.createAuditLog('RAISE_CREATED', {
      raiseId: createdRaise.id,
      businessId,
      title: request.title,
      goalCents: request.goalCents,
      instrument: request.instrument
    });

    return createdRaise;
  }

  /**
   * Open a raise for investments
   */
  async openRaise(raiseId: string): Promise<Raise> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    if (raise.status !== RaiseStatus.DRAFT) {
      throw new Error('Only draft raises can be opened');
    }

    if (raise.expiresAt <= new Date()) {
      throw new Error('Raise expiration date must be in the future');
    }

    await raiseAdapter.updateRaiseStatus(raiseId, RaiseStatus.OPEN);

    // Log audit event
    await raiseAdapter.createAuditLog('RAISE_OPENED', {
      raiseId,
      businessId: raise.businessId,
      goalCents: raise.goalCents,
      expiresAt: raise.expiresAt
    });

    return { ...raise, status: RaiseStatus.OPEN };
  }

  /**
   * Get raise details for investor view
   */
  async getRaiseDetails(raiseId: string): Promise<RaiseDetails> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    const investments = await raiseAdapter.getInvestmentsByRaise(raiseId);
    const totalInvestors = investments.filter(
      inv => inv.status === InvestmentStatus.CAPTURED
    ).length;

    const remainingCents = Math.max(0, raise.goalCents - raise.raisedCents);
    const daysRemaining = Math.max(0, Math.ceil(
      (raise.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ));

    const canInvest = raise.status === RaiseStatus.OPEN && 
                     remainingCents > 0 && 
                     raise.expiresAt > new Date();

    return {
      raise,
      remainingCents,
      totalInvestors,
      daysRemaining,
      canInvest,
      minContributionCents: raise.minContributionCents,
      maxContributionCents: raise.maxContributionCents
    };
  }

  /**
   * Process investment request
   */
  async invest(
    raiseId: string, 
    investorId: string, 
    request: InvestRequest
  ): Promise<{ paymentIntentId: string; clientSecret: string }> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    // Validate raise is open
    if (raise.status !== RaiseStatus.OPEN) {
      throw new Error('Raise is not open for investments');
    }

    if (raise.expiresAt <= new Date()) {
      throw new Error('Raise has expired');
    }

    // Validate investment amount
    this.validateInvestmentAmount(raise, request.amountCents);

    // Check if investor can invest (existing investments)
    const existingInvestments = await raiseAdapter.getInvestmentsByRaise(raiseId);
    const investorInvestments = existingInvestments.filter(
      inv => inv.investorId === investorId && inv.status === InvestmentStatus.CAPTURED
    );
    
    const totalInvestedByInvestor = investorInvestments.reduce(
      (sum, inv) => sum + inv.amountCents, 
      0
    );

    // Check max contribution per investor
    if (raise.maxContributionCents && 
        (totalInvestedByInvestor + request.amountCents) > raise.maxContributionCents) {
      throw new Error(`Investment would exceed maximum contribution limit of $${raise.maxContributionCents / 100}`);
    }

    // Check if investment would exceed goal
    const remainingCents = raise.goalCents - raise.raisedCents;
    let actualAmountCents = request.amountCents;
    
    if (request.amountCents > remainingCents) {
      if (this.config.CLIP_TO_REMAINING) {
        actualAmountCents = remainingCents;
      } else {
        throw new Error(`Investment amount exceeds remaining goal of $${remainingCents / 100}`);
      }
    }

    // Create Stripe PaymentIntent
    const { paymentIntentId, clientSecret } = await stripeService.createPaymentIntent({
      amountCents: actualAmountCents,
      raiseId,
      investorId,
      metadata: {
        raiseId,
        investorId,
        businessId: raise.businessId,
        instrument: raise.instrument
      }
    });

    // Create investment record
    await raiseAdapter.createInvestment({
      raiseId,
      investorId,
      amountCents: actualAmountCents,
      status: InvestmentStatus.PENDING,
      paymentProviderId: paymentIntentId
    });

    // Log audit event
    await raiseAdapter.createAuditLog('INVESTMENT_INITIATED', {
      raiseId,
      investorId,
      amountCents: actualAmountCents,
      paymentIntentId
    });

    return { paymentIntentId, clientSecret };
  }

  /**
   * Handle successful payment
   */
  async onPaymentSucceeded(paymentIntentId: string): Promise<void> {
    // Find investment by payment intent ID
    const investments = await raiseAdapter.getInvestmentsByRaise(''); // Get all
    const investment = investments.find(inv => inv.paymentProviderId === paymentIntentId);
    
    if (!investment) {
      throw new Error('Investment not found for payment intent');
    }

    if (investment.status !== InvestmentStatus.PENDING && 
        investment.status !== InvestmentStatus.AUTHORIZED) {
      throw new Error('Investment is not in a valid state for capture');
    }

    const raise = await raiseAdapter.getRaiseById(investment.raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    // Update investment status
    await raiseAdapter.updateInvestmentStatus(investment.id, InvestmentStatus.CAPTURED);

    // Update raise totals atomically
    const newRaisedCents = raise.raisedCents + investment.amountCents;
    
    if (newRaisedCents >= raise.goalCents) {
      // Goal reached - mark as funded
      await raiseAdapter.updateTotalsAtomic(investment.raiseId, newRaisedCents, RaiseStatus.FUNDED);
      
      // Schedule allocation and payout (async)
      setTimeout(() => {
        this.allocateAndPayout(investment.raiseId).catch(console.error);
      }, this.config.AUTO_CLOSE_DELAY_MS);
      
    } else {
      // Update totals only
      await raiseAdapter.updateTotalsAtomic(investment.raiseId, newRaisedCents);
    }

    // Log audit event
    await raiseAdapter.createAuditLog('PAYMENT_SUCCEEDED', {
      investmentId: investment.id,
      raiseId: investment.raiseId,
      investorId: investment.investorId,
      amountCents: investment.amountCents,
      paymentIntentId,
      newRaisedCents,
      goalReached: newRaisedCents >= raise.goalCents
    });
  }

  /**
   * Allocate investments and process business payout
   */
  async allocateAndPayout(raiseId: string): Promise<void> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    if (raise.status !== RaiseStatus.FUNDED) {
      throw new Error('Raise must be funded to allocate and payout');
    }

    // Check if allocations already exist (idempotent)
    const existingAllocations = await raiseAdapter.getAllocationsByRaise(raiseId);
    if (existingAllocations.length > 0) {
      console.log(`Allocations already exist for raise ${raiseId}`);
      return;
    }

    // Verify KYC/KYB requirements
    const isBusinessVerified = await kycService.isBusinessVerified(raise.businessId);
    if (!isBusinessVerified) {
      throw new Error('Business must be KYC/KYB verified before payout');
    }

    const investments = await raiseAdapter.getInvestmentsByRaise(raiseId);
    const capturedInvestments = investments.filter(
      inv => inv.status === InvestmentStatus.CAPTURED
    );

    if (capturedInvestments.length === 0) {
      throw new Error('No captured investments found');
    }

    // Verify all investors are KYC verified
    for (const investment of capturedInvestments) {
      const isInvestorVerified = await kycService.isInvestorVerified(investment.investorId);
      if (!isInvestorVerified) {
        throw new Error(`Investor ${investment.investorId} must be KYC verified before payout`);
      }
    }

    // Compute allocations
    const { computeAllocations } = await import('@/lib/alloc/engine');
    const { allocations } = computeAllocations(raise, capturedInvestments);

    // Create allocation records
    for (const allocation of allocations) {
      await raiseAdapter.createAllocation(allocation);
    }

    // Calculate business payout (goal amount minus platform fees)
    const netAmount = calculateNetAmount(raise.goalCents, this.config.PLATFORM_FEE_BPS);
    
    // Create payout record
    const payout = await raiseAdapter.createBusinessPayout({
      raiseId,
      amountCents: netAmount,
      status: PayoutStatus.PENDING
    });

    // Process payout via Stripe
    try {
      const transferId = await stripeService.transferToBusiness({
        amountCents: netAmount,
        businessId: raise.businessId,
        metadata: {
          raiseId,
          payoutId: payout.id
        }
      });

      // Update payout status
      await raiseAdapter.updatePayoutStatus(payout.id, PayoutStatus.RELEASED, transferId);

      // Mark raise as closed
      await raiseAdapter.updateRaiseStatus(raiseId, RaiseStatus.CLOSED);

      // Log audit event
      await raiseAdapter.createAuditLog('RAISE_CLOSED', {
        raiseId,
        businessId: raise.businessId,
        totalAllocations: allocations.length,
        payoutAmountCents: netAmount,
        transferId
      });

    } catch (error) {
      // Mark payout as failed
      await raiseAdapter.updatePayoutStatus(payout.id, PayoutStatus.FAILED);
      
      // Log error
      await raiseAdapter.createAuditLog('PAYOUT_FAILED', {
        raiseId,
        payoutId: payout.id,
        error: String(error)
      });
      
      throw error;
    }
  }

  /**
   * Handle raise expiration
   */
  async handleExpiration(raiseId: string): Promise<void> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    if (raise.status !== RaiseStatus.OPEN) {
      return; // Already handled
    }

    if (raise.raisedCents < raise.goalCents) {
      // Goal not met - begin refunding
      await raiseAdapter.updateRaiseStatus(raiseId, RaiseStatus.REFUNDING);
      
      const investments = await raiseAdapter.getInvestmentsByRaise(raiseId);
      const capturedInvestments = investments.filter(
        inv => inv.status === InvestmentStatus.CAPTURED
      );

      // Refund each investment
      for (const investment of capturedInvestments) {
        try {
          await stripeService.refundPayment(investment.paymentProviderId);
          await raiseAdapter.updateInvestmentStatus(investment.id, InvestmentStatus.REFUNDED);
        } catch (error) {
          console.error(`Failed to refund investment ${investment.id}:`, error);
          // Continue with other refunds
        }
      }

      // Mark as expired
      await raiseAdapter.updateRaiseStatus(raiseId, RaiseStatus.EXPIRED);

      // Log audit event
      await raiseAdapter.createAuditLog('RAISE_EXPIRED', {
        raiseId,
        businessId: raise.businessId,
        raisedCents: raise.raisedCents,
        goalCents: raise.goalCents,
        refundedInvestments: capturedInvestments.length
      });
    }
  }

  /**
   * Admin: Cancel raise
   */
  async cancelRaise(raiseId: string): Promise<void> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    if (raise.status !== RaiseStatus.OPEN && raise.status !== RaiseStatus.FUNDED) {
      throw new Error('Only open or funded raises can be cancelled');
    }

    await raiseAdapter.updateRaiseStatus(raiseId, RaiseStatus.CANCELLED);

    // Log audit event
    await raiseAdapter.createAuditLog('RAISE_CANCELLED', {
      raiseId,
      businessId: raise.businessId,
      raisedCents: raise.raisedCents
    });
  }

  /**
   * Admin: Extend raise expiration
   */
  async extendRaise(raiseId: string, newExpiresAt: Date): Promise<void> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    if (raise.status !== RaiseStatus.OPEN) {
      throw new Error('Only open raises can be extended');
    }

    if (newExpiresAt <= new Date()) {
      throw new Error('New expiration date must be in the future');
    }

    // Update expiration date (would need to add this method to adapter)
    // await raiseAdapter.updateRaiseExpiration(raiseId, newExpiresAt);

    // Log audit event
    await raiseAdapter.createAuditLog('RAISE_EXTENDED', {
      raiseId,
      oldExpiresAt: raise.expiresAt,
      newExpiresAt
    });
  }

  /**
   * Get investment progress for a raise
   */
  async getInvestmentProgress(raiseId: string): Promise<InvestmentProgress> {
    const raise = await raiseAdapter.getRaiseById(raiseId);
    if (!raise) {
      throw new Error('Raise not found');
    }

    const investments = await raiseAdapter.getInvestmentsByRaise(raiseId);
    const totalInvestors = investments.filter(
      inv => inv.status === InvestmentStatus.CAPTURED
    ).length;

    const progressPct = Math.min(100, (raise.raisedCents / raise.goalCents) * 100);
    const remainingCents = Math.max(0, raise.goalCents - raise.raisedCents);

    return {
      raisedCents: raise.raisedCents,
      goalCents: raise.goalCents,
      progressPct,
      remainingCents,
      totalInvestors,
      status: raise.status
    };
  }

  // Private validation methods
  private validateCreateRaiseRequest(request: CreateRaiseRequest): void {
    if (!request.title || request.title.length < 3) {
      throw new Error('Title must be at least 3 characters');
    }

    if (request.goalCents < 1000) { // $10 minimum
      throw new Error('Goal must be at least $10');
    }

    if (request.minContributionCents < 100) { // $1 minimum
      throw new Error('Minimum contribution must be at least $1');
    }

    if (request.maxContributionCents && 
        request.maxContributionCents > request.goalCents) {
      throw new Error('Maximum contribution cannot exceed goal');
    }

    if (request.minContributionCents > request.maxContributionCents!) {
      throw new Error('Minimum contribution cannot exceed maximum');
    }

    if (request.expiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }

    this.validateInstrumentTerms(request.instrument, request.instrumentTerms);
  }

  private validateInvestmentAmount(raise: Raise, amountCents: number): void {
    if (amountCents < raise.minContributionCents) {
      throw new Error(`Minimum investment is $${raise.minContributionCents / 100}`);
    }

    if (raise.maxContributionCents && amountCents > raise.maxContributionCents) {
      throw new Error(`Maximum investment is $${raise.maxContributionCents / 100}`);
    }
  }

  private validateInstrumentTerms(instrument: InstrumentType, terms: any): void {
    switch (instrument) {
      case InstrumentType.EQUITY:
        if (!terms.equityPoolPct || terms.equityPoolPct <= 0 || terms.equityPoolPct > 100) {
          throw new Error('Equity pool percentage must be between 0 and 100');
        }
        break;
        
      case InstrumentType.INTEREST:
        if (!terms.interestAPR || terms.interestAPR <= 0) {
          throw new Error('Interest APR must be positive');
        }
        if (!terms.termMonths || terms.termMonths <= 0) {
          throw new Error('Term months must be positive');
        }
        break;
        
      case InstrumentType.ROYALTY:
        if (!terms.royaltyPoolPct || terms.royaltyPoolPct <= 0 || terms.royaltyPoolPct > 100) {
          throw new Error('Royalty pool percentage must be between 0 and 100');
        }
        if (!terms.royaltyDurationMonths || terms.royaltyDurationMonths <= 0) {
          throw new Error('Royalty duration must be positive');
        }
        break;
        
      default:
        throw new Error(`Unsupported instrument type: ${instrument}`);
    }
  }
}

export const raiseService = new RaiseService();
