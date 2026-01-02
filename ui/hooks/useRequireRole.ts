'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { UserRole } from '@prisma/client';

export function useRequireRole(requiredRole: UserRole) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      } else if (user?.role !== requiredRole) {
        setAccessDenied(true);
        // Redirect after showing message
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    }
  }, [user, isAuthenticated, isLoading, requiredRole, router]);

  return {
    hasAccess: user?.role === requiredRole && isAuthenticated,
    isLoading: isLoading || !isAuthenticated || user?.role !== requiredRole,
    accessDenied,
  };
}

