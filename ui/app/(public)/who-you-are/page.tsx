'use client';

import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function WhoYouArePage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl text-center" style={{ color: 'var(--color-text-dark)' }}>
            Is this for you
          </h1>

          <p className="font-inter text-base leading-7 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)' }}>
            If you don't like typical gyms, this might work. It's still a gym. Just different.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                You want to get stronger
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                You want to get stronger. You're willing to do the work. That's what it takes.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                You don't like typical gyms
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                You don't like typical gyms. No mirrors. No egos. Just people working out.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                You want to train with other people
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                You want to train with other people. Same people. Same time. You get to know them.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                You're busy
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                You're busy. 25 minutes works. You can fit it in.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                You don't want to dread it
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                You don't want to dread working out. It's still work. But it's manageable.
              </p>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                You want someone to tell you what to do
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                You want someone to tell you what to do. Coach does that. You follow along.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-6" style={{ color: 'var(--color-text-dark)' }}>
              Try it
            </h2>
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
