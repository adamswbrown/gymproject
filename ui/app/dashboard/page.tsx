'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Use replace instead of push to avoid history issues
      switch (user.role) {
        case 'MEMBER':
          router.replace('/dashboard/member/bookings');
          break;
        case 'INSTRUCTOR':
          router.replace('/dashboard/instructor/sessions');
          break;
        case 'ADMIN':
          router.replace('/dashboard/admin/class-types');
          break;
        default:
          // Unknown role - redirect to login to re-authenticate
          router.replace('/login');
      }
    } else if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Redirecting...</div>
    </div>
  );
}

