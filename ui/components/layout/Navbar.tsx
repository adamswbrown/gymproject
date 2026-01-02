'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ActionButton } from '../ui/ActionButton';

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'MEMBER':
        return '/dashboard/member/bookings';
      case 'INSTRUCTOR':
        return '/dashboard/instructor/sessions';
      case 'ADMIN':
        return '/dashboard/admin/class-types';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="border-b" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              HITSONA
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/schedule" 
              className="transition-colors"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            >
              Schedule
            </Link>
            
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link 
                      href={getDashboardPath()}
                      className="transition-colors"
                      style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    >
                      Dashboard
                    </Link>
                    <ActionButton 
                      variant="secondary" 
                      onClick={logout}
                      className="text-sm py-2 px-4"
                    >
                      Logout
                    </ActionButton>
                  </>
                ) : (
                  <Link href="/login">
                    <ActionButton variant="secondary" className="text-sm py-2 px-4">
                      Login
                    </ActionButton>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

