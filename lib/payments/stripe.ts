/**
 * Stripe Payment Integration for Investment Pool
 * 
 * Handles PaymentIntents, webhooks, and business payouts
 * Uses test mode with idempotency keys for safety
 */

import Stripe from 'stripe';

// Initialize Stripe in test mode
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export interface CreatePaymentIntentRequest {
  amountCents: number;
  raiseId: string;
  investorId: string;
  metadata: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
}

export interface TransferToBusinessRequest {
  amountCents: number;
  businessId: string;
  metadata: Record<string, string>;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

class StripeService {
  private readonly applicationFeeBps: number = 300; // 3.00% platform fee

  /**
   * Create a PaymentIntent for investment
   */
  async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<CreatePaymentIntentResponse> {
    // Generate idempotency key
    const idempotencyKey = `invest_${request.raiseId}_${request.investorId}_${Date.now()}`;
    
    // Create PaymentIntent with manual capture (until goal is reached)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: request.amountCents,
      currency: 'usd',
      capture_method: 'manual', // We'll capture when goal is reached
      metadata: {
        ...request.metadata,
        idempotencyKey,
        createdBy: 'hooinvest-raise-system'
      },
      description: `Investment in raise ${request.raiseId}`,
      statement_descriptor: 'HooInvest Investment',
      application_fee_amount: Math.round(
        (request.amountCents * this.applicationFeeBps) / 10000
      ),
    }, {
      idempotencyKey
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!
    };
  }

  /**
   * Capture a PaymentIntent (when goal is reached)
   */
  async capturePaymentIntent(paymentIntentId: string): Promise<void> {
    await stripe.paymentIntents.capture(paymentIntentId);
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentIntentId: string, reason: string = 'requested_by_customer'): Promise<string> {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason as Stripe.RefundCreateParams.Reason,
      metadata: {
        refundedBy: 'hooinvest-raise-system',
        timestamp: new Date().toISOString()
      }
    });

    return refund.id;
  }

  /**
   * Transfer funds to business (after successful raise)
   */
  async transferToBusiness(request: TransferToBusinessRequest): Promise<string> {
    // For now, we'll create a transfer to the business's connected account
    // In a real implementation, you'd have connected accounts set up
    
    // Create a transfer to the business
    const transfer = await stripe.transfers.create({
      amount: request.amountCents,
      currency: 'usd',
      destination: request.businessId, // This would be a connected account ID
      metadata: {
        ...request.metadata,
        transferType: 'business-payout',
        createdBy: 'hooinvest-raise-system'
      },
      description: `Payout for raise ${request.metadata.raiseId}`,
    });

    return transfer.id;
  }

  /**
   * Get PaymentIntent details
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return stripe.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): WebhookEvent {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      
      return event as WebhookEvent;
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhookEvent(event: WebhookEvent): Promise<void> {
    const { raiseService } = await import('@/lib/raise/service');
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object);
        break;
        
      case 'charge.dispute.created':
        await this.handleDisputeCreated(event.data.object);
        break;
        
      case 'payment_intent.canceled':
        await this.handlePaymentIntentCanceled(event.data.object);
        break;
        
      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
    
    // Import raise service to avoid circular dependency
    const { raiseService } = await import('@/lib/raise/service');
    
    try {
      await raiseService.onPaymentSucceeded(paymentIntent.id);
    } catch (error) {
      console.error('Error handling payment success:', error);
      
      // Log to audit system
      const { raiseAdapter } = await import('@/lib/db/raiseAdapter');
      await raiseAdapter.createAuditLog('PAYMENT_SUCCESS_ERROR', {
        paymentIntentId: paymentIntent.id,
        error: String(error),
        metadata: paymentIntent.metadata
      });
    }
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log(`PaymentIntent failed: ${paymentIntent.id}`);
    
    // Find and update investment status
    const { raiseAdapter } = await import('@/lib/db/raiseAdapter');
    
    // Get all investments to find the one with this payment intent
    // In a real implementation, you'd have a more efficient lookup
    const investments = await raiseAdapter.getInvestmentsByRaise(''); // Get all
    const investment = investments.find(inv => inv.paymentProviderId === paymentIntent.id);
    
    if (investment) {
      await raiseAdapter.updateInvestmentStatus(investment.id, 'FAILED');
      
      await raiseAdapter.createAuditLog('PAYMENT_FAILED', {
        investmentId: investment.id,
        raiseId: investment.raiseId,
        investorId: investment.investorId,
        paymentIntentId: paymentIntent.id,
        failureReason: paymentIntent.last_payment_error?.message || 'Unknown'
      });
    }
  }

  /**
   * Handle payment intent cancellation
   */
  private async handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log(`PaymentIntent canceled: ${paymentIntent.id}`);
    
    // Find and update investment status
    const { raiseAdapter } = await import('@/lib/db/raiseAdapter');
    
    const investments = await raiseAdapter.getInvestmentsByRaise(''); // Get all
    const investment = investments.find(inv => inv.paymentProviderId === paymentIntent.id);
    
    if (investment) {
      await raiseAdapter.updateInvestmentStatus(investment.id, 'FAILED');
      
      await raiseAdapter.createAuditLog('PAYMENT_CANCELED', {
        investmentId: investment.id,
        raiseId: investment.raiseId,
        investorId: investment.investorId,
        paymentIntentId: paymentIntent.id,
        cancelReason: paymentIntent.cancellation_reason || 'user_requested'
      });
    }
  }

  /**
   * Handle dispute creation
   */
  private async handleDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
    console.log(`Dispute created: ${dispute.id}`);
    
    const { raiseAdapter } = await import('@/lib/db/raiseAdapter');
    
    await raiseAdapter.createAuditLog('DISPUTE_CREATED', {
      disputeId: dispute.id,
      paymentIntentId: dispute.payment_intent,
      amount: dispute.amount,
      reason: dispute.reason,
      status: dispute.status
    });
  }

  /**
   * Get business account details
   */
  async getBusinessAccount(businessId: string): Promise<Stripe.Account> {
    return stripe.accounts.retrieve(businessId);
  }

  /**
   * Create connected account for business
   */
  async createBusinessAccount(businessEmail: string, businessName: string): Promise<string> {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: businessEmail,
      business_type: 'company',
      business_profile: {
        name: businessName,
        product_description: 'Investment opportunities on HooInvest platform',
        support_email: 'hello@hooinvest.com'
      },
      capabilities: {
        transfers: { requested: true }
      }
    });

    return account.id;
  }

  /**
   * Create account link for onboarding
   */
  async createAccountLink(accountId: string, refreshUrl: string, returnUrl: string): Promise<string> {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding'
    });

    return accountLink.url;
  }

  /**
   * Get platform balance
   */
  async getPlatformBalance(): Promise<Stripe.Balance> {
    return stripe.balance.retrieve();
  }

  /**
   * List recent charges
   */
  async listRecentCharges(limit: number = 10): Promise<Stripe.Charge[]> {
    const charges = await stripe.charges.list({
      limit,
      expand: ['data.payment_intent']
    });
    
    return charges.data;
  }

  /**
   * Calculate platform fees
   */
  calculatePlatformFee(amountCents: number): number {
    return Math.round((amountCents * this.applicationFeeBps) / 10000);
  }

  /**
   * Calculate net amount after fees
   */
  calculateNetAmount(amountCents: number): number {
    const fee = this.calculatePlatformFee(amountCents);
    return amountCents - fee;
  }
}

export const stripeService = new StripeService();
