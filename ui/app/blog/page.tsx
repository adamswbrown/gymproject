'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function BlogPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      
      <main className="flex-1" style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
            Blog
          </h1>

          <p className="text-lg mb-12 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
            Stay up to date with the latest fitness tips, nutrition advice, and community news from Hitsona Bangor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)' }}>
                Coming Soon
              </h2>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                Our blog is coming soon! Check back for fitness tips, nutrition advice, and community stories.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="text-lg px-8 py-4">
                {isAuthenticated ? 'Book a Class' : 'Get Started'}
              </ActionButton>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

