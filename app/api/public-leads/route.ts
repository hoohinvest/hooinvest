import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  businessPublicLeadSchema,
  investorPublicLeadSchema,
  publicLeadPayloadSchema,
} from '@/lib/validationPublicLeads';
import {
  insertPublicLead,
  createBusinessLeadRow,
  createInvestorLeadRow,
} from '@/lib/sheetsdbPublic';
import { checkRateLimit } from '@/lib/rateLimitTiny';

// Mark this route as dynamic (not static)
export const dynamic = 'force-dynamic';

/**
 * Get client IP address from request headers
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Hash IP address for privacy (SHA-256)
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * POST /api/public-leads
 * 
 * Unified endpoint for Business and Investor CTA lead submissions
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate top-level payload
    const body = await request.json();
    
    const payloadValidation = publicLeadPayloadSchema.safeParse(body);
    if (!payloadValidation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid payload structure',
          details: payloadValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const { type, data } = payloadValidation.data;

    // 2. Honeypot check (silent rejection if honeypot field is filled)
    if (data.hp_field && data.hp_field.trim() !== '') {
      console.log('🍯 Honeypot triggered - silently rejecting');
      // Return success to not alert bots
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 3. Rate limiting
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    
    if (!checkRateLimit(ipHash)) {
      console.warn(`⚠️  Rate limit exceeded for IP hash: ${ipHash}`);
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many requests. Please try again in a minute.',
        },
        { status: 429 }
      );
    }

    // 4. Validate based on type
    let validatedData;
    try {
      if (type === 'BUSINESS') {
        validatedData = businessPublicLeadSchema.parse(data);
      } else {
        validatedData = investorPublicLeadSchema.parse(data);
      }
    } catch (validationError: any) {
      console.error('Validation error:', validationError.errors);
      return NextResponse.json(
        {
          ok: false,
          error: 'Validation failed',
          details: validationError.errors,
        },
        { status: 400 }
      );
    }

    // 5. Extract metadata
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const referer = request.headers.get('referer') || '';
    const sourcePath = referer ? new URL(referer).pathname : '/';
    
    const metadata = {
      sourcePath,
      utmSource: searchParams.get('utm_source') || undefined,
      utmMedium: searchParams.get('utm_medium') || undefined,
      utmCampaign: searchParams.get('utm_campaign') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      ipHash,
    };

    // 6. Create unified row based on type
    const row = type === 'BUSINESS'
      ? createBusinessLeadRow(validatedData, metadata)
      : createInvestorLeadRow(validatedData, metadata);

    // 7. Insert to Google Sheets via SheetsDB
    await insertPublicLead(row);

    // 8. Log success (minimal, no PII)
    console.log(`✅ ${type} public lead submitted from ${sourcePath}`);

    return NextResponse.json(
      {
        ok: true,
        message: 'Lead submitted successfully',
      },
      { status: 201 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('❌ Unexpected error in /api/public-leads:', errorMessage);
    console.error('Stack trace:', errorStack);
    return NextResponse.json(
      {
        ok: false,
        error: 'Internal server error',
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Reject non-POST requests
 */
export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

