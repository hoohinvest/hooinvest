'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/sign-in');
        return;
      }

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData || { user_id: user.id, role: 'business' });
      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="loading-spinner w-8 h-8"></div>
        <div className="ml-4 text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-panel border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-brand">
              HooInvest
            </Link>
            
            <nav className="flex items-center gap-6">
              {profile?.role === 'admin' ? (
                <>
                  <Link href="/admin/review" className="nav-link">
                    Review Queue
                  </Link>
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link href="/application" className="nav-link">
                    Application
                  </Link>
                  <Link href="/docs" className="nav-link">
                    Documents
                  </Link>
                </>
              )}
              
              <span className="text-sm text-muted-foreground">
                {profile?.role === 'admin' ? '👑 Admin' : '🏢 Business'}
              </span>
              
              <button
                onClick={handleSignOut}
                className="text-sm nav-link"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

