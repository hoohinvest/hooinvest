import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's applications
    const { data, error } = await supabase
      .from('business_applications')
      .select('*')
      .eq('owner_user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...applicationData } = body;

    if (id) {
      // Update existing application
      const { data, error } = await supabase
        .from('business_applications')
        .update({
          ...applicationData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('owner_user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    } else {
      // Create new application
      const { data, error } = await supabase
        .from('business_applications')
        .insert([{
          ...applicationData,
          owner_user_id: user.id,
          status: 'draft',
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating application:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




