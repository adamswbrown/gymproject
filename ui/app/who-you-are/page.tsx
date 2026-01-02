'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function WhoYouArePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      
      <main className="flex-1" style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
            Is this for you
          </h1>

          <p className="text-lg mb-12 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
            If you don't like typical gyms, this might work. It's still a gym. Just different.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                You want to get stronger
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                You want to get stronger. You're willing to do the work. That's what it takes.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                You don't like typical gyms
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                You don't like typical gyms. No mirrors. No egos. Just people working out.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                You want to train with other people
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                You want to train with other people. Same people. Same time. You get to know them.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                You're busy
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                You're busy. 25 minutes works. You can fit it in.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                You don't want to dread it
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                You don't want to dread working out. It's still work. But it's manageable.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                You want someone to tell you what to do
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                You want someone to tell you what to do. Coach does that. You follow along.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
              Try it
            </h2>
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="text-lg px-8 py-4">
                Book a Session
              </ActionButton>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

