/**
 * KYC/KYB Provider Stub
 * 
 * Stub implementation for identity verification
 * Replace with real provider (Jumio, Onfido, etc.) in production
 */

export interface KycResult {
  verified: boolean;
  level: 'basic' | 'enhanced' | 'full';
  verifiedAt: Date;
  provider: string;
  providerId: string;
  metadata: Record<string, any>;
}

export interface KybResult {
  verified: boolean;
  businessType: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'other';
  verifiedAt: Date;
  provider: string;
  providerId: string;
  metadata: Record<string, any>;
}

class KycKybService {
  private verifiedInvestors = new Set<string>();
  private verifiedBusinesses = new Set<string>();
  private verificationResults = new Map<string, KycResult | KybResult>();

  /**
   * Check if investor is KYC verified
   */
  async isInvestorVerified(investorId: string): Promise<boolean> {
    // For demo purposes, auto-verify all investors
    // In production, this would check against real KYC provider
    if (!this.verifiedInvestors.has(investorId)) {
      console.log(`[STUB] Auto-verifying investor ${investorId}`);
      await this.verifyInvestor(investorId);
    }
    
    return this.verifiedInvestors.has(investorId);
  }

  /**
   * Check if business is KYB verified
   */
  async isBusinessVerified(businessId: string): Promise<boolean> {
    // For demo purposes, auto-verify all businesses
    // In production, this would check against real KYB provider
    if (!this.verifiedBusinesses.has(businessId)) {
      console.log(`[STUB] Auto-verifying business ${businessId}`);
      await this.verifyBusiness(businessId);
    }
    
    return this.verifiedBusinesses.has(businessId);
  }

  /**
   * Initiate KYC verification for investor
   */
  async verifyInvestor(investorId: string, investorData?: any): Promise<KycResult> {
    // Stub implementation - always succeeds
    const result: KycResult = {
      verified: true,
      level: 'enhanced',
      verifiedAt: new Date(),
      provider: 'stub-provider',
      providerId: `kyc_${investorId}_${Date.now()}`,
      metadata: {
        investorId,
        method: 'stub_auto_verification',
        riskScore: 0.1,
        documentsVerified: ['government_id', 'proof_of_address'],
        sanctionsCheck: 'passed',
        pepCheck: 'passed'
      }
    };

    this.verifiedInvestors.add(investorId);
    this.verificationResults.set(`investor_${investorId}`, result);

    console.log(`[STUB] Investor ${investorId} verified successfully`);
    return result;
  }

  /**
   * Initiate KYB verification for business
   */
  async verifyBusiness(businessId: string, businessData?: any): Promise<KybResult> {
    // Stub implementation - always succeeds
    const result: KybResult = {
      verified: true,
      businessType: 'corporation',
      verifiedAt: new Date(),
      provider: 'stub-provider',
      providerId: `kyb_${businessId}_${Date.now()}`,
      metadata: {
        businessId,
        method: 'stub_auto_verification',
        riskScore: 0.2,
        documentsVerified: ['business_registration', 'tax_id', 'bank_account'],
        ownershipVerified: true,
        beneficialOwnersVerified: true,
        sanctionsCheck: 'passed'
      }
    };

    this.verifiedBusinesses.add(businessId);
    this.verificationResults.set(`business_${businessId}`, result);

    console.log(`[STUB] Business ${businessId} verified successfully`);
    return result;
  }

  /**
   * Get verification result for investor
   */
  async getInvestorVerification(investorId: string): Promise<KycResult | null> {
    return this.verificationResults.get(`investor_${investorId}`) as KycResult || null;
  }

  /**
   * Get verification result for business
   */
  async getBusinessVerification(businessId: string): Promise<KybResult | null> {
    return this.verificationResults.get(`business_${businessId}`) as KybResult || null;
  }

  /**
   * Revoke verification (for testing)
   */
  async revokeInvestorVerification(investorId: string): Promise<void> {
    this.verifiedInvestors.delete(investorId);
    this.verificationResults.delete(`investor_${investorId}`);
    console.log(`[STUB] Investor ${investorId} verification revoked`);
  }

  /**
   * Revoke verification (for testing)
   */
  async revokeBusinessVerification(businessId: string): Promise<void> {
    this.verifiedBusinesses.delete(businessId);
    this.verificationResults.delete(`business_${businessId}`);
    console.log(`[STUB] Business ${businessId} verification revoked`);
  }

  /**
   * List all verified investors (for admin)
   */
  async listVerifiedInvestors(): Promise<string[]> {
    return Array.from(this.verifiedInvestors);
  }

  /**
   * List all verified businesses (for admin)
   */
  async listVerifiedBusinesses(): Promise<string[]> {
    return Array.from(this.verifiedBusinesses);
  }

  /**
   * Get verification statistics
   */
  async getVerificationStats(): Promise<{
    totalInvestors: number;
    verifiedInvestors: number;
    totalBusinesses: number;
    verifiedBusinesses: number;
    verificationRate: number;
  }> {
    const totalInvestors = 100; // Would be actual count from database
    const totalBusinesses = 50; // Would be actual count from database
    
    return {
      totalInvestors,
      verifiedInvestors: this.verifiedInvestors.size,
      totalBusinesses,
      verifiedBusinesses: this.verifiedBusinesses.size,
      verificationRate: (this.verifiedInvestors.size + this.verifiedBusinesses.size) / 
                       (totalInvestors + totalBusinesses) * 100
    };
  }

  /**
   * Simulate verification failure (for testing)
   */
  async simulateVerificationFailure(entityId: string, entityType: 'investor' | 'business'): Promise<void> {
    if (entityType === 'investor') {
      this.verifiedInvestors.delete(entityId);
      console.log(`[STUB] Simulated KYC failure for investor ${entityId}`);
    } else {
      this.verifiedBusinesses.delete(entityId);
      console.log(`[STUB] Simulated KYB failure for business ${entityId}`);
    }
  }

  /**
   * Check compliance requirements
   */
  async checkComplianceRequirements(
    amountCents: number,
    investorType: 'accredited' | 'non_accredited'
  ): Promise<{
    requiresKyc: boolean;
    requiresEnhancedKyc: boolean;
    requiresAccreditation: boolean;
    maxInvestmentAmount: number;
  }> {
    // Basic compliance rules
    const requiresKyc = amountCents > 10000; // $100+ requires KYC
    const requiresEnhancedKyc = amountCents > 50000; // $500+ requires enhanced KYC
    const requiresAccreditation = amountCents > 100000; // $1000+ requires accreditation
    
    // Max investment amounts based on accreditation status
    const maxInvestmentAmount = investorType === 'accredited' 
      ? 10000000 // $100k max for accredited
      : 500000; // $5k max for non-accredited

    return {
      requiresKyc,
      requiresEnhancedKyc,
      requiresAccreditation,
      maxInvestmentAmount
    };
  }

  /**
   * Validate investment against compliance rules
   */
  async validateInvestmentCompliance(
    investorId: string,
    amountCents: number,
    investorType: 'accredited' | 'non_accredited'
  ): Promise<{
    allowed: boolean;
    reason?: string;
    requiredActions: string[];
  }> {
    const compliance = await this.checkComplianceRequirements(amountCents, investorType);
    const requiredActions: string[] = [];
    
    // Check KYC requirements
    if (compliance.requiresKyc) {
      const isVerified = await this.isInvestorVerified(investorId);
      if (!isVerified) {
        return {
          allowed: false,
          reason: 'KYC verification required for this investment amount',
          requiredActions: ['Complete KYC verification']
        };
      }
    }
    
    // Check accreditation requirements
    if (compliance.requiresAccreditation && investorType !== 'accredited') {
      return {
        allowed: false,
        reason: 'Accredited investor status required for this investment amount',
        requiredActions: ['Provide accredited investor documentation']
      };
    }
    
    // Check maximum investment limits
    if (amountCents > compliance.maxInvestmentAmount) {
      return {
        allowed: false,
        reason: `Investment exceeds maximum allowed amount for ${investorType} investors`,
        requiredActions: []
      };
    }

    return {
      allowed: true,
      requiredActions
    };
  }
}

export const kycService = new KycKybService();

// TODO: Replace with real KYC/KYB provider integration
/*
Real implementation would integrate with:

1. Identity Verification:
   - Jumio (https://www.jumio.com/)
   - Onfido (https://onfido.com/)
   - Trulioo (https://www.trulioo.com/)
   - ID.me (https://www.id.me/)

2. Business Verification:
   - Dun & Bradstreet
   - LexisNexis
   - Experian Business

3. AML/Sanctions Screening:
   - Refinitiv World-Check
   - Dow Jones Risk Center
   - LexisNexis Risk Solutions

Example integration:
```typescript
import { JumioClient } from '@jumio/api-client';

class JumioKycProvider {
  private client: JumioClient;
  
  async verifyInvestor(investorId: string, investorData: any): Promise<KycResult> {
    const verification = await this.client.createVerification({
      userReference: investorId,
      workflowId: 'enhanced-kyc',
      customerInternalReference: investorId
    });
    
    return {
      verified: verification.result === 'APPROVED_VERIFIED',
      level: verification.level,
      verifiedAt: new Date(verification.timestamp),
      provider: 'jumio',
      providerId: verification.transactionReference,
      metadata: verification
    };
  }
}
```
*/
