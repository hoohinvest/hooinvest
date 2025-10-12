import { NextRequest, NextResponse } from 'next/server';
import { unitEconPresets } from '@/lib/businessCalc';
import { BusinessType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as BusinessType | null;

    if (type && unitEconPresets[type]) {
      return NextResponse.json(unitEconPresets[type]);
    }

    // Return all presets
    return NextResponse.json(unitEconPresets);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




