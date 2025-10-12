import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';
import { generateAssetCode } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const serviceClient = createServiceClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // Get application
    const { data: application, error: appError } = await supabase
      .from('business_applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'approved') {
      return NextResponse.json({ error: 'Only approved applications can be published' }, { status: 400 });
    }

    // Generate asset code
    const assetCode = generateAssetCode('business');

    // Create ASSET
    const { data: asset, error: assetError } = await serviceClient
      .from('asset')
      .insert([{
        code: assetCode,
        name: application.company_name,
        description: `${application.business_type} in ${application.city}, ${application.state}`,
        asset_type: 'business',
        status: 'raising',
        city: application.city,
        state: application.state,
      }])
      .select()
      .single();

    if (assetError) {
      console.error('Error creating asset:', assetError);
      return NextResponse.json({ error: assetError.message }, { status: 500 });
    }

    // Create ASSET_META entries
    const metaEntries = [
      { asset_id: asset.id, key: 'unit_econ', value_json: application.unit_econ },
      { asset_id: asset.id, key: 'funding_terms', value_json: application.funding_terms },
      { asset_id: asset.id, key: 'business_type', value_json: application.business_type },
      { asset_id: asset.id, key: 'stage', value_json: application.stage },
    ];

    const { error: metaError } = await serviceClient
      .from('asset_meta')
      .insert(metaEntries);

    if (metaError) {
      console.error('Error creating asset meta:', metaError);
    }

    // Create OFFERING
    const fundingTerms = application.funding_terms as any;
    const { data: offering, error: offeringError } = await serviceClient
      .from('offering')
      .insert([{
        asset_id: asset.id,
        round_type: fundingTerms?.structure || 'revenue_share',
        target_raise: fundingTerms?.target_raise || 0,
        min_invest: fundingTerms?.min_invest || 0,
        max_invest: fundingTerms?.max_invest || 0,
        opens_at: fundingTerms?.opens_at,
        closes_at: fundingTerms?.closes_at,
        jurisdiction: application.state,
        status: 'open',
      }])
      .select()
      .single();

    if (offeringError) {
      console.error('Error creating offering:', offeringError);
      return NextResponse.json({ error: offeringError.message }, { status: 500 });
    }

    // Update application status to published
    const { error: updateError } = await supabase
      .from('business_applications')
      .update({
        status: 'published',
        asset_id: asset.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (updateError) {
      console.error('Error updating application:', updateError);
    }

    // Log publication (stub for webhook to MVP1)
    console.log(`🚀 Published asset: ${assetCode} (${asset.id})`);
    console.log(`📊 Offering created: ${offering.id}`);
    console.log(`🔗 MVP1 integration ready for asset: ${asset.id}`);

    return NextResponse.json({
      success: true,
      asset_code: assetCode,
      asset_id: asset.id,
      offering_id: offering.id,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




