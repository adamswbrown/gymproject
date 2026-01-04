'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(email, password, name || undefined);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--body-color)' }}>
        <div style={{ color: 'var(--text-color-light)' }}>Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="main">
        <section className="section" style={{ paddingTop: '8rem' }}>
          <div className="container">
            <div className="section__data">
              <h2 className="section__title">Join Us</h2>
            </div>

            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <form onSubmit={handleSubmit} style={{ display: 'grid', rowGap: '1.5rem' }}>
                {error && (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: 'hsla(0, 80%, 64%, 0.1)',
                    border: '2px solid hsl(0, 80%, 64%)',
                    color: 'hsl(0, 80%, 64%)',
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ position: 'relative', border: '2px solid var(--first-color-light)' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    style={{ 
                      width: '100%',
                      background: 'transparent',
                      padding: '1.5rem',
                      paddingRight: '4rem',
                      color: 'var(--title-color)',
                      fontSize: 'var(--h3-font-size)',
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                  <label style={{ position: 'absolute', right: '1.5rem', top: '1.25rem', color: 'var(--title-color)' }}>
                    <i className="ri-mail-line"></i>
                  </label>
                </div>

                <div style={{ position: 'relative', border: '2px solid var(--first-color-light)' }}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Password (min 8 characters)"
                    style={{ 
                      width: '100%',
                      background: 'transparent',
                      padding: '1.5rem',
                      paddingRight: '4rem',
                      color: 'var(--title-color)',
                      fontSize: 'var(--h3-font-size)',
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                  <label style={{ position: 'absolute', right: '1.5rem', top: '1.25rem', color: 'var(--title-color)' }}>
                    <i className="ri-lock-line"></i>
                  </label>
                </div>

                <div style={{ position: 'relative', border: '2px solid var(--first-color-light)' }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name (optional)"
                    style={{ 
                      width: '100%',
                      background: 'transparent',
                      padding: '1.5rem',
                      paddingRight: '4rem',
                      color: 'var(--title-color)',
                      fontSize: 'var(--h3-font-size)',
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                  <label style={{ position: 'absolute', right: '1.5rem', top: '1.25rem', color: 'var(--title-color)' }}>
                    <i className="ri-user-line"></i>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="button"
                  style={{ marginTop: '1.5rem', width: '100%' }}
                >
                  {submitting ? 'Registering...' : 'Register'}
                </button>

                <div style={{ textAlign: 'center', color: 'var(--text-color-light)' }}>
                  Already have an account?{' '}
                  <Link href="/login" style={{ color: 'var(--first-color)' }}>
                    Log In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--body-color)' }}>
        <div style={{ color: 'var(--text-color-light)' }}>Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
