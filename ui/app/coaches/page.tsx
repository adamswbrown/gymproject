'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function CoachesPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      
      <main className="flex-1" style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
            The coaches
          </h1>

          <p className="text-lg mb-12 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
            They run the sessions. They know what they're doing. That's about it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/gav.png" alt="Coach Gav" width={200} height={200} className="mb-4 rounded-full" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Coach Gav
              </h2>
              <p className="mb-2 font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Owner and Head Coach
              </p>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Runs most sessions. Knows his stuff. Keeps it simple.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/conor.png" alt="Coach Conor" width={200} height={200} className="mb-4 rounded-full" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Coach Conor
              </h2>
              <p className="mb-2 font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Gym Manager
              </p>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Runs sessions. Helps out. Does the job.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/michelle.png" alt="Coach Michelle" width={200} height={200} className="mb-4 rounded-full" />
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Coach Michelle
              </h2>
              <p className="mb-2 font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Coach
              </p>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Runs sessions. Shows new people around. Does the work.
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

