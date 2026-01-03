'use client';

import Image from 'next/image';
import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function CoachesPage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl text-center" style={{ color: 'var(--color-text-dark)' }}>
            The coaches
          </h1>

          <p className="font-inter text-base leading-7 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)' }}>
            They run the sessions. They know what they're doing. That's about it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/gav.png" alt="Coach Gav" width={200} height={200} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Coach Gav
              </h2>
              <p className="mb-2 font-inter text-base leading-7 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Owner and Head Coach
              </p>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Runs most sessions. Knows his stuff. Keeps it simple.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/conor.png" alt="Coach Conor" width={200} height={200} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Coach Conor
              </h2>
              <p className="mb-2 font-inter text-base leading-7 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Gym Manager
              </p>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Runs sessions. Helps out. Does the job.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/michelle.png" alt="Coach Michelle" width={200} height={200} className="mb-4" />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Coach Michelle
              </h2>
              <p className="mb-2 font-inter text-base leading-7 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Coach
              </p>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Runs sessions. Shows new people around. Does the work.
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
