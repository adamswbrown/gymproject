'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await login(email, password);
      // Store token in cookie for middleware (already done in login function)
      // Use router.push instead of window.location for better Next.js integration
      const redirect = searchParams.get('redirect') || '/dashboard';
      // Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 150));
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>Loading...</div>
      </div>
    );
  }

  // If already authenticated, show a message but don't auto-redirect
  // The middleware or dashboard will handle the redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You are already logged in. Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <PageHeader title="Log In" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)', 
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-body)',
                  lineHeight: 'var(--line-height-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              />
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)', 
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-body)',
                  lineHeight: 'var(--line-height-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              />
            </div>

            <ActionButton
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Logging In...' : 'Log In'}
            </ActionButton>

            <div className="text-center" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: 'var(--color-accent-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}>
                Register
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
