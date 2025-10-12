import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export const createBrowserClient = () => {
  return createClientComponentClient();
};

// Server-side client with service role (for admin operations)
export const createServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};




