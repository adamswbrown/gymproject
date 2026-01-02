'use client';

import { ActionButton } from './ActionButton';
import { StatLabel } from './StatLabel';
import type { ScheduleResponse } from '@/lib/api';

interface ScheduleCardProps {
  session: ScheduleResponse;
  onBook?: (sessionId: string) => void;
  isAuthenticated: boolean;
}

export function ScheduleCard({ session, onBook, isAuthenticated }: ScheduleCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleBook = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/schedule`;
      return;
    }
    if (onBook) {
      onBook(session.id);
    }
  };

  return (
    <div 
      className="p-6 flex flex-col h-full" 
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)', 
        border: '1px solid var(--color-border-subtle)',
        minHeight: '180px',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 flex-1">
        <div className="flex-1 flex flex-col">
          <h3 
            className="text-xl font-bold uppercase mb-2" 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              color: 'var(--color-text-primary)' 
            }}
          >
            {session.classType.name}
          </h3>
          <div 
            className="flex flex-wrap gap-4 mb-4" 
            style={{ 
              color: 'var(--color-text-muted)', 
              fontFamily: 'var(--font-body)' 
            }}
          >
            <span>{formatDate(session.startsAt)}</span>
            <span>{formatTime(session.startsAt)} - {formatTime(session.endsAt)}</span>
            <span>with {session.instructor.name || 'Instructor'}</span>
          </div>
          <div className="flex gap-6 mt-auto">
            <StatLabel 
              label="Capacity" 
              value={`${session.confirmedCount} / ${session.capacity}`}
            />
            <StatLabel 
              label="Available" 
              value={session.remainingCapacity}
            />
            {!session.registrationOpen && session.registrationCloseReason && (
              <span 
                className="text-sm" 
                style={{ 
                  color: 'var(--color-accent-primary)', 
                  fontFamily: 'var(--font-body)' 
                }}
              >
                {session.registrationCloseReason}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 md:self-end">
          <ActionButton
            onClick={handleBook}
            disabled={!session.registrationOpen}
          >
            {session.registrationOpen ? 'Book' : 'Closed'}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
