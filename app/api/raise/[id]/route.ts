/**
 * API Routes for Individual Raise Management
 * 
 * GET /api/raise/[id] - Get raise details
 * POST /api/raise/[id]/invest - Make investment
 * POST /api/raise/[id]/open - Open raise (admin)
 * POST /api/raise/[id]/cancel - Cancel raise (admin)
 * POST /api/raise/[id]/extend - Extend raise (admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { raiseService } from '@/lib/raise/service';
import { raiseAdapter } from '@/lib/db/raiseAdapter';
import { RaiseStatus } from '@/types/raise';

// Validation schemas
const investSchema = z.object({
  amountCents: z.number().int().min(100, 'Minimum investment is $1'),
});

const extendRaiseSchema = z.object({
  newExpiresAt: z.string().datetime(),
});

/**
 * GET /api/raise/[id] - Get raise details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const raiseId = params.id;
    
    if (!raiseId) {
      return NextResponse.json({
        success: false,
        error: 'Raise ID is required'
      }, { status: 400 });
    }
    
    const raiseDetails = await raiseService.getRaiseDetails(raiseId);
    
    return NextResponse.json({
      success: true,
      data: raiseDetails
    });
    
  } catch (error) {
    console.error('Error getting raise details:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * POST /api/raise/[id]/invest - Make investment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const raiseId = params.id;
    const body = await request.json();
    
    if (!raiseId) {
      return NextResponse.json({
        success: false,
        error: 'Raise ID is required'
      }, { status: 400 });
    }
    
    // Validate investment request
    const validatedData = investSchema.parse(body);
    
    // TODO: Get investor ID from authenticated user session
    // For now, use a placeholder investor ID
    const investorId = 'investor_' + crypto.randomUUID();
    
    // Process investment
    const result = await raiseService.invest(raiseId, investorId, {
      amountCents: validatedData.amountCents
    });
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error processing investment:', error);
    
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
 * PUT /api/raise/[id] - Update raise (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const raiseId = params.id;
    const body = await request.json();
    const action = body.action;
    
    if (!raiseId) {
      return NextResponse.json({
        success: false,
        error: 'Raise ID is required'
      }, { status: 400 });
    }
    
    // TODO: Verify admin authentication
    // For now, allow all actions (stub)
    
    switch (action) {
      case 'open':
        await raiseService.openRaise(raiseId);
        break;
        
      case 'cancel':
        await raiseService.cancelRaise(raiseId);
        break;
        
      case 'extend':
        const extendData = extendRaiseSchema.parse(body);
        await raiseService.extendRaise(raiseId, new Date(extendData.newExpiresAt));
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Raise ${action} successful`
    });
    
  } catch (error) {
    console.error('Error updating raise:', error);
    
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
