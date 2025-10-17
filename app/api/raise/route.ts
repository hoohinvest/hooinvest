/**
 * API Routes for Investment Pool (Raise) Management
 * 
 * POST /api/raise - Create new raise
 * GET /api/raise - List raises with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { raiseService } from '@/lib/raise/service';
import { raiseAdapter } from '@/lib/db/raiseAdapter';
import { InstrumentType, RaiseStatus } from '@/types/raise';

// Validation schemas
const createRaiseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  goalCents: z.number().int().min(1000, 'Goal must be at least $10'),
  minContributionCents: z.number().int().min(100, 'Minimum contribution must be at least $1'),
  maxContributionCents: z.number().int().optional(),
  instrument: z.nativeEnum(InstrumentType),
  instrumentTerms: z.object({
    equityPoolPct: z.number().min(0).max(100).optional(),
    interestAPR: z.number().min(0).optional(),
    termMonths: z.number().int().min(1).optional(),
    royaltyPoolPct: z.number().min(0).max(100).optional(),
    royaltyDurationMonths: z.number().int().min(1).optional(),
  }),
  expiresAt: z.string().datetime(),
}).refine((data) => {
  // Validate max contribution doesn't exceed goal
  if (data.maxContributionCents && data.maxContributionCents > data.goalCents) {
    return false;
  }
  // Validate min contribution doesn't exceed max
  if (data.maxContributionCents && data.minContributionCents > data.maxContributionCents) {
    return false;
  }
  return true;
}, {
  message: 'Invalid contribution limits',
});

const listRaisesSchema = z.object({
  status: z.nativeEnum(RaiseStatus).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

/**
 * POST /api/raise - Create new raise
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validatedData = createRaiseSchema.parse(body);
    
    // TODO: Get business ID from authenticated user session
    // For now, use a placeholder business ID
    const businessId = 'business_' + crypto.randomUUID();
    
    // Convert expiresAt string to Date
    const createRequest = {
      ...validatedData,
      expiresAt: new Date(validatedData.expiresAt)
    };
    
    // Create raise
    const raise = await raiseService.createRaise(businessId, createRequest);
    
    return NextResponse.json({
      success: true,
      data: raise
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating raise:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * GET /api/raise - List raises with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const query = {
      status: searchParams.get('status'),
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };
    
    const validatedQuery = listRaisesSchema.parse(query);
    
    // Get raises from database
    const raises = await raiseAdapter.listRaises(
      validatedQuery.status as RaiseStatus
    );
    
    // Apply pagination
    const paginatedRaises = raises.slice(
      validatedQuery.offset,
      validatedQuery.offset + validatedQuery.limit
    );
    
    // Get additional details for each raise
    const raisesWithDetails = await Promise.all(
      paginatedRaises.map(async (raise) => {
        const details = await raiseService.getRaiseDetails(raise.id);
        return {
          ...raise,
          remainingCents: details.remainingCents,
          totalInvestors: details.totalInvestors,
          daysRemaining: details.daysRemaining,
          canInvest: details.canInvest
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      data: {
        raises: raisesWithDetails,
        pagination: {
          total: raises.length,
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          hasMore: validatedQuery.offset + validatedQuery.limit < raises.length
        }
      }
    });
    
  } catch (error) {
    console.error('Error listing raises:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
