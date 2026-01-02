'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { getSessionRoster } from '@/lib/api';
import type { RosterResponse } from '@/lib/api';

export default function RosterPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [roster, setRoster] = useState<RosterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoster = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getSessionRoster(sessionId);
        setRoster(data);
      } catch (err: any) {
        // Handle specific error cases
        if ((err as any).status === 404) {
          setError('Session not found. It may have been deleted or you may not have access to it.');
        } else if ((err as any).status === 403) {
          setError('You do not have permission to view this roster.');
        } else {
          setError(err.message || 'Failed to load roster');
        }
      } finally {
        setLoading(false);
      }
    };

    loadRoster();
  }, [sessionId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div>
      <PageHeader title="CLASS ROSTER" />

      {/* Session Metadata */}
      {!loading && !error && roster && (
        <div
          className="mb-6 text-sm"
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {roster.session.classType.name} • {formatDate(roster.session.startsAt)} •{' '}
          {formatTime(roster.session.startsAt)} - {formatTime(roster.session.endsAt)}
        </div>
      )}

      {/* Error State */}
      {error && (
        <DismissibleError
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Loading State */}
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

      {/* Roster Content */}
      {!loading && !error && roster && (
        <Section>
          {/* Roster List */}
          {roster.members.length === 0 ? (
            <div
              className="text-center py-12"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                opacity: 0.7,
              }}
            >
              No members booked.
            </div>
          ) : (
            <div className="space-y-3">
              {roster.members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {member.name}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

