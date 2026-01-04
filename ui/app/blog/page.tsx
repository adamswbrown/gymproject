'use client';

import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function BlogPage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl text-center" style={{ color: 'var(--color-text-dark)' }}>
            Blog
          </h1>

          <p className="font-inter text-base leading-7 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)' }}>
            Stay up to date with the latest fitness tips, nutrition advice, and community news from Average Joe's Gym.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Coming Soon
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Our blog is coming soon! Check back for fitness tips, nutrition advice, and community stories.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="px-4 py-2 font-oswald uppercase">
                {isAuthenticated ? 'Book a Class' : 'Get Started'}
              </ActionButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
