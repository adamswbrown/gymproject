'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case 'MEMBER':
          router.push('/dashboard/member/bookings');
          break;
        case 'INSTRUCTOR':
          router.push('/dashboard/instructor/sessions');
          break;
        case 'ADMIN':
          router.push('/dashboard/admin/class-types');
          break;
        default:
          router.push('/schedule');
      }
    }
  }, [user, isLoading, router]);

  return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Redirecting...</div>
    </div>
  );
}

