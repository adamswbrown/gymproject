'use client';

import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ContactUsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl text-center" style={{ color: 'var(--color-text-dark)' }}>
            Contact
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-6" style={{ color: 'var(--color-text-dark)' }}>
                How to reach us
              </h2>
              <div className="space-y-4 font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
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
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-6" style={{ color: 'var(--color-text-dark)' }}>
                How to find us
              </h2>
              <div className="space-y-4 font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
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
              <ActionButton className="px-4 py-2 font-oswald uppercase">
                Book a Session
              </ActionButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
