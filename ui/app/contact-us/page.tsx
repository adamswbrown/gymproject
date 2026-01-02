'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ContactUsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      
      <main className="flex-1" style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
            Contact
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                How to reach us
              </h2>
              <div className="space-y-4" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Address</h3>
                  <p>Unit 54, 3 Balloo Dr, Bangor BT19 7QY</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Phone</h3>
                  <p>07769 859348</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Email</h3>
                  <p>[email protected]</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                How to find us
              </h2>
              <div className="space-y-4" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                <p>
                  749 East Temple Street, Los Angeles. We're on the ground floor. Look for the door.
                </p>
                <p>
                  There's parking. Street parking mostly. Sometimes you have to walk a bit.
                </p>
                <p>
                  Public transport works. Check your route. We're in the city.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
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

