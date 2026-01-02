'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getMyBookings, cancelBooking } from '@/lib/api';
import type { BookingResponse } from '@/lib/api';

export default function MemberBookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      await cancelBooking(bookingId);
      loadBookings(); // Reload to update list
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
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
          <div className="mb-6 p-4" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>
          {error}
        </div>
      )}

        {loading && (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading bookings...
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="p-8 text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <p className="text-lg" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                You have no bookings yet.
              </p>
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
                    <h3 className="text-xl font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
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

