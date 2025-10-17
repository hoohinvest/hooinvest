/**
 * Stripe Webhook Handler
 * 
 * POST /api/payments/webhook - Handle Stripe webhook events
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/payments/stripe';
import { raiseAdapter } from '@/lib/db/raiseAdapter';

// Track processed events to prevent duplicate processing
const processedEvents = new Set<string>();

/**
 * POST /api/payments/webhook - Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({
        error: 'Missing Stripe signature'
      }, { status: 400 });
    }
    
    // Verify webhook signature
    const event = stripeService.verifyWebhookSignature(body, signature);
    
    // Check if we've already processed this event
    if (processedEvents.has(event.id)) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({
        received: true,
        message: 'Event already processed'
      });
    }
    
    // Mark event as processed
    processedEvents.add(event.id);
    
    // Log webhook event
    await raiseAdapter.createAuditLog('STRIPE_WEBHOOK_RECEIVED', {
      eventId: event.id,
      eventType: event.type,
      timestamp: new Date().toISOString()
    });
    
    // Handle the webhook event
    await stripeService.handleWebhookEvent(event);
    
    // Log successful processing
    await raiseAdapter.createAuditLog('STRIPE_WEBHOOK_PROCESSED', {
      eventId: event.id,
      eventType: event.type,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      received: true,
      eventId: event.id
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Log webhook error
    try {
      await raiseAdapter.createAuditLog('STRIPE_WEBHOOK_ERROR', {
        error: String(error),
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }
    
    return NextResponse.json({
      error: 'Webhook processing failed'
    }, { status: 500 });
  }
}

/**
 * GET /api/payments/webhook - Webhook endpoint verification
 */
export async function GET() {
  return NextResponse.json({
    message: 'Stripe webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
