import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('application_id');

    if (!applicationId) {
      return NextResponse.json({ error: 'application_id required' }, { status: 400 });
    }

    // Verify user owns the application or is admin
    const { data: application } = await supabase
      .from('business_applications')
      .select('owner_user_id')
      .eq('id', applicationId)
      .single();

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';

    if (application.owner_user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('business_docs')
      .select('*')
      .eq('application_id', applicationId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching docs:', error);
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
    const { application_id, doc_type, url } = body;

    if (!application_id || !doc_type || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user owns the application
    const { data: application } = await supabase
      .from('business_applications')
      .select('owner_user_id')
      .eq('id', application_id)
      .single();

    if (!application || application.owner_user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('business_docs')
      .insert([{ application_id, doc_type, url }])
      .select()
      .single();

    if (error) {
      console.error('Error creating doc:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log file upload (stub for webhook/email)
    console.log(`📄 Document uploaded: ${doc_type} for application ${application_id}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




