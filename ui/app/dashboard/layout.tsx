'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isMember = user?.role === 'MEMBER';
  const isAdmin = user?.role === 'ADMIN';
  const isInstructor = user?.role === 'INSTRUCTOR';

  const memberNavItems = [
    { href: '/dashboard/member/upcoming', label: 'Upcoming Registrations' },
    { href: '/dashboard/member/profile', label: 'Profiles' },
    { href: '/dashboard/member/memberships', label: 'Memberships' },
    { href: '/dashboard/member/registrations', label: 'Registrations' },
    { href: '/dashboard/member/payments', label: 'Payments' },
    { href: '/dashboard/member/documents', label: 'Documents' },
    { href: '/dashboard/member/notifications', label: 'Notifications' },
    { href: '/dashboard/member/contact', label: 'Contact' },
    { href: '/dashboard/member/family', label: 'Family' },
  ];

  const adminNavItems = [
    { href: '/dashboard/admin/class-types', label: 'Class Types' },
    { href: '/dashboard/admin/sessions', label: 'Sessions' },
    { href: '/dashboard/admin/instructors', label: 'Instructors' },
    { href: '/dashboard/admin/users', label: 'Users' },
    { href: '/dashboard/admin/products', label: 'Products' },
  ];

  const instructorNavItems = [
    { href: '/dashboard/instructor/sessions', label: 'My Sessions' },
  ];

  const navItems = isMember ? memberNavItems : isAdmin ? adminNavItems : isInstructor ? instructorNavItems : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      <div className="flex-1 flex">
        {navItems.length > 0 && (
          <aside className="w-64 p-4" style={{ backgroundColor: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border-subtle)' }}>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 rounded ${
                      isActive ? 'font-semibold' : ''
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--color-accent-primary)' : 'transparent',
                      color: isActive ? 'white' : 'var(--color-text-primary)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}
        <main className="flex-1 mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 'var(--container-max-width)' }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

