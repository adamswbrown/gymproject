'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function WhatWeOfferPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      
      <main className="flex-1" style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
            What we have
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/25-minute-sessions.png" alt="25 minute sessions" width={100} height={100} className="mb-4" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                25 minute sessions
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Sessions are 25 minutes. You can fit it in. That's the point.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/small-group-exercise.png" alt="Small group exercise" width={100} height={100} className="mb-4" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Small groups
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Small groups. Less intimidating. More manageable.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/feature-1.png" alt="Coach led training" width={100} height={100} className="mb-4" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Coach tells you what to do
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Coach runs the session. You follow along. No thinking required.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/unlimited-support.png" alt="Unrivalled Community" width={100} height={100} className="mb-4" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                People show up
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Same people. Same time. You get to know them. That's it.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/feature-3.png" alt="Heart Rate Monitors" width={100} height={100} className="mb-4" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Heart rate monitors
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                We track your heart rate. Helps us know if you're working hard enough.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/hit-icon.png" alt="Unique Patented Machines" width={100} height={100} className="mb-4" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Basic equipment
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Machines adjust to how hard you push. Everyone uses the same equipment. Works for everyone.
              </p>
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

