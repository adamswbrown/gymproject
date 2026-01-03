'use client';

import Image from 'next/image';
import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function WhatWeOfferPage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl text-center" style={{ color: 'var(--color-text-dark)' }}>
            What we have
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/25-minute-sessions.png" alt="25 minute sessions" width={100} height={100} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                25 minute sessions
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Sessions are 25 minutes. You can fit it in. That's the point.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/small-group-exercise.png" alt="Small group exercise" width={100} height={100} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Small groups
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Small groups. Less intimidating. More manageable.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/feature-1.png" alt="Coach led training" width={100} height={100} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Coach tells you what to do
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Coach runs the session. You follow along. No thinking required.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/unlimited-support.png" alt="Unrivalled Community" width={100} height={100} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                People show up
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Same people. Same time. You get to know them. That's it.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/feature-3.png" alt="Heart Rate Monitors" width={100} height={100} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Heart rate monitors
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                We track your heart rate. Helps us know if you're working hard enough.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/hit-icon.png" alt="Unique Patented Machines" width={100} height={100} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Basic equipment
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Machines adjust to how hard you push. Everyone uses the same equipment. Works for everyone.
              </p>
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
