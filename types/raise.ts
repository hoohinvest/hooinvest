/**
 * Investment Pool (Raise) Domain Types
 * 
 * Core entities for goal-based fundraising with auto-allocation
 */

export enum RaiseStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  FUNDED = 'FUNDED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDING = 'REFUNDING'
}

export enum InvestmentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum InstrumentType {
  EQUITY = 'EQUITY',
  INTEREST = 'INTEREST',
  ROYALTY = 'ROYALTY'
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  RELEASED = 'RELEASED',
  FAILED = 'FAILED'
}

export interface Raise {
  id: string;
  businessId: string;
  title: string;
  description?: string;
  goalCents: number;
  minContributionCents: number;
  maxContributionCents?: number;
  instrument: InstrumentType;
  instrumentTermsJson: InstrumentTerms;
  status: RaiseStatus;
  raisedCents: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstrumentTerms {
  // Equity terms
  equityPoolPct?: number; // e.g., 20 = 20% of company
  
  // Interest terms
  interestAPR?: number; // e.g., 8.5 = 8.5% APR
  termMonths?: number; // e.g., 36 = 3 years
  
  // Royalty terms
  royaltyPoolPct?: number; // e.g., 5 = 5% of revenue
  royaltyDurationMonths?: number; // e.g., 60 = 5 years
}

export interface Investment {
  id: string;
  raiseId: string;
  investorId: string;
  amountCents: number;
  status: InvestmentStatus;
  paymentProviderId: string; // Stripe PaymentIntent ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Allocation {
  id: string;
  raiseId: string;
  investorId: string;
  allocationJson: AllocationDetails;
  certificateNumber?: string;
  createdAt: Date;
}

export interface AllocationDetails {
  // Equity allocation
  equityPct?: number; // e.g., 2.5 = 2.5% ownership
  
  // Interest allocation
  notePrincipalCents?: number;
  noteAPR?: number;
  maturityDate?: Date;
  
  // Royalty allocation
  royaltyPct?: number; // e.g., 0.25 = 0.25% of revenue
  royaltyStartDate?: Date;
  royaltyEndDate?: Date;
}

export interface BusinessPayout {
  id: string;
  raiseId: string;
  amountCents: number;
  status: PayoutStatus;
  providerTransferId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  type: string;
  payloadJson: Record<string, any>;
  createdAt: Date;
}

// Request/Response DTOs
export interface CreateRaiseRequest {
  title: string;
  description?: string;
  goalCents: number;
  minContributionCents: number;
  maxContributionCents?: number;
  instrument: InstrumentType;
  instrumentTerms: InstrumentTerms;
  expiresAt: Date;
}

export interface InvestRequest {
  amountCents: number;
}

export interface RaiseDetails {
  raise: Raise;
  remainingCents: number;
  totalInvestors: number;
  daysRemaining: number;
  canInvest: boolean;
  minContributionCents: number;
  maxContributionCents?: number;
}

export interface InvestmentProgress {
  raisedCents: number;
  goalCents: number;
  progressPct: number;
  remainingCents: number;
  totalInvestors: number;
  status: RaiseStatus;
}

// Configuration
export interface RaiseConfig {
  CLIP_TO_REMAINING: boolean;
  PLATFORM_FEE_BPS: number; // e.g., 300 = 3.00%
  PAYMENT_FEE_BPS: number; // e.g., 29 + 2.9% = ~60 bps for small amounts
  AUTO_CLOSE_DELAY_MS: number; // Delay before auto-closing funded raises
  REFUND_RETRY_ATTEMPTS: number;
  REFUND_RETRY_DELAY_MS: number;
}
