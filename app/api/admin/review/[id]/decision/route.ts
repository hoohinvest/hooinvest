import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
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

    const body = await request.json();
    const { decision, note } = body;

    if (!decision || !['approve', 'reject', 'needs_changes'].includes(decision)) {
      return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
    }

    // Map decision to status
    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      needs_changes: 'needs_changes',
    };

    // Update application status
    const { data: application, error: updateError } = await supabase
      .from('business_applications')
      .update({
        status: statusMap[decision],
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating application:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Add comment if provided
    if (note) {
      const { error: commentError } = await supabase
        .from('review_comments')
        .insert([{
          application_id: params.id,
          author_user_id: user.id,
          body: note,
        }]);

      if (commentError) {
        console.error('Error creating comment:', commentError);
      }
    }

    // Log decision (stub for email notification)
    console.log(`✅ Decision made on application ${params.id}: ${decision}`);
    if (note) {
      console.log(`📝 Note: ${note}`);
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




