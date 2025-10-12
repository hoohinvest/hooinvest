import { NextRequest, NextResponse } from 'next/server';
import { businessLeadSchema, investorLeadSchema } from '@/lib/validation';
import { insertRow, createLeadRow } from '@/lib/sheetsdb';
import { createHash } from 'crypto';

// Simple in-memory rate limiter (fail-open in dev)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 submissions per minute per IP

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data: formData } = body;

    if (!type || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    if (type !== 'BUSINESS' && type !== 'INVESTOR') {
      return NextResponse.json(
        { error: 'Invalid type. Must be BUSINESS or INVESTOR' },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    
    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate based on type
    let validatedData;
    try {
      if (type === 'BUSINESS') {
        validatedData = businessLeadSchema.parse(formData);
      } else {
        validatedData = investorLeadSchema.parse(formData);
      }
    } catch (validationError: any) {
      console.error('Validation error:', validationError.errors);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationError.errors 
        },
        { status: 400 }
      );
    }

    // Extract metadata
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

    // Create row for SheetsDB
    const row = createLeadRow(type, validatedData, metadata);

    // Submit to Google Sheets via SheetsDB
    const result = await insertRow(row);

    if (!result.success) {
      console.error('SheetsDB submission failed:', result.error);
      return NextResponse.json(
        { error: 'Failed to submit lead. Please try again.' },
        { status: 500 }
      );
    }

    // Log success (minimal, no PII)
    console.log(`✅ ${type} lead submitted successfully from ${sourcePath}`);

    return NextResponse.json({ 
      ok: true, 
      message: 'Lead submitted successfully' 
    });

  } catch (error) {
    console.error('Unexpected error in lead submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


