'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const supabase = createBrowserClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage('Check your email for the confirmation link');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-brand">
            HooVest
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-foreground">
            Business Onboarding
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to manage your application
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="bg-danger/20 border border-danger/30 text-danger px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {message && (
              <div className="bg-success/20 border border-success/30 text-success px-4 py-3 rounded">
                {message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input w-full"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input w-full"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Loading...
                  </>
                ) : 'Sign In'}
              </button>
              
              <button
                type="button"
                onClick={handleSignUp}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-brand hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

