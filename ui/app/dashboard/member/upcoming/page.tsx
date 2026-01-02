'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getUpcomingRegistrations, cancelBooking } from '@/lib/api';
import type { RegistrationResponse } from '@/lib/api';

export default function MemberUpcomingPage() {
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUpcoming();
  }, []);

  const loadUpcoming = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUpcomingRegistrations();
      setRegistrations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load upcoming registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async (registration: RegistrationResponse) => {
    if (!confirm('Are you sure you want to leave this session?')) {
      return;
    }

    try {
      setError(null);
      if (registration.type === 'CLASS' && registration.id) {
        // For CLASS registrations, the id is the booking ID
        const { cancelBooking } = await import('@/lib/api');
        await cancelBooking(registration.id);
        // Reload upcoming registrations
        await loadUpcoming();
      } else if (registration.type === 'COURSE' && registration.courseId) {
        // For COURSE registrations, use the course unregister endpoint
        const { unregisterFromCourse } = await import('@/lib/api');
        await unregisterFromCourse(registration.courseId);
        // Reload upcoming registrations
        await loadUpcoming();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to leave session');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Upcoming Registrations" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <PageHeader title="Upcoming Registrations" />
        <p className="mt-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
          All times Europe/London
        </p>
      </div>

      {error && (
        <div
          className="mb-6 p-4"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-accent-primary)',
            color: 'var(--color-accent-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {error}
        </div>
      )}

      <div className="mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
        Your upcoming session count: {registrations.length}
      </div>

      <div className="space-y-4">
        {registrations.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            No upcoming registrations.
          </div>
        ) : (
          registrations.map((reg) => (
            reg.type === 'CLASS' && reg.session ? (
              <div
                key={reg.id}
                className="p-6"
                style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                        {reg.session.classType.name}
                      </h3>
                      <span
                        className="px-3 py-1 text-sm font-semibold"
                        style={{
                          backgroundColor: 'var(--color-accent-primary)',
                          color: 'white',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        You're Attending
                      </span>
                    </div>
                    <div className="space-y-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                      <p>{formatDateTime(reg.session.startsAt)} ~ {formatDateTime(reg.session.endsAt)}</p>
                      {reg.session.instructor?.user?.name && <p>{reg.session.instructor.user.name}</p>}
                      <p>{reg.session.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ActionButton
                      variant="secondary"
                      onClick={() => window.location.href = `/schedule?e=${reg.sessionId}&date=${reg.session.startsAt.split('T')[0]}`}
                    >
                      Details
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={() => handleLeave(reg)}>
                      Leave
                    </ActionButton>
                  </div>
                </div>
              </div>
            ) : null
          ))
        )}
      </div>
    </div>
  );
}

