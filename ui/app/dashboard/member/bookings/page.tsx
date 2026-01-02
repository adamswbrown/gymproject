'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { DismissibleSuccess } from '@/components/ui/DismissibleSuccess';
import { getMyBookings, cancelBooking } from '@/lib/api';
import type { BookingResponse } from '@/lib/api';

export default function MemberBookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelError(null);
      setSuccessMessage(null);
      
      // Optimistic update: remove booking from list immediately
      setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));
      
      await cancelBooking(bookingId);
      setSuccessMessage('Booking cancelled successfully');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      // Reload to get accurate data
      loadBookings();
    } catch (err: any) {
      // Revert optimistic update on error
      loadBookings();
      setCancelError(err.message || 'Failed to cancel booking');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const canCancel = (booking: BookingResponse): boolean => {
    if (booking.status === 'CANCELLED') return false;
    if (!booking.session?.classType?.cancellationCutoffHours) return true;
    
    const cutoffHours = booking.session.classType.cancellationCutoffHours;
    const sessionStart = new Date(booking.session.startsAt);
    const cutoffTime = new Date(sessionStart.getTime() - cutoffHours * 60 * 60 * 1000);
    const now = new Date();
    
    return now < cutoffTime;
  };

  return (
    <div>
      <PageHeader title="My Bookings" />
      
        {error && (
          <DismissibleError
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {cancelError && (
          <DismissibleError
            message={cancelError}
            onDismiss={() => setCancelError(null)}
          />
        )}

        {successMessage && (
          <DismissibleSuccess
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        )}

        {loading && (
          <div 
            className="text-center py-12" 
            style={{ 
              color: 'var(--color-text-muted)', 
              fontFamily: 'var(--font-body)',
              opacity: 0.7,
            }}
          >
            Loading …
          </div>
        )}

      {!loading && !error && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div 
              className="text-center py-12" 
              style={{ 
                color: 'var(--color-text-muted)', 
                fontFamily: 'var(--font-body)',
                opacity: 0.7,
              }}
            >
              No bookings.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-6"
                style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      {booking.session?.classType?.name || 'Class'}
                    </h3>
                    <div className="flex flex-wrap gap-4 mb-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                      <span>{formatDateTime(booking.session?.startsAt || booking.bookedAt)}</span>
                      {booking.session?.instructor?.user?.name && (
                        <span>with {booking.session.instructor.user.name}</span>
                      )}
                      {booking.session?.location && (
                        <span>{booking.session.location}</span>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      <span style={{ color: booking.status === 'CONFIRMED' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)' }}>
                        Status: {booking.status}
                      </span>
                      {booking.session?.classType?.cancellationCutoffHours && (
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          Cancel by: {new Date(
                            new Date(booking.session.startsAt).getTime() - 
                            booking.session.classType.cancellationCutoffHours * 60 * 60 * 1000
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ActionButton
                      variant="secondary"
                      onClick={() => handleCancel(booking.id)}
                      disabled={!canCancel(booking) || booking.status === 'CANCELLED'}
                    >
                      {booking.status === 'CANCELLED' ? 'Cancelled' : 'Cancel'}
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

