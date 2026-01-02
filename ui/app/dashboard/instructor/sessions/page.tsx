'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { ActionButton } from '@/components/ui/ActionButton';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { getInstructorMySessions } from '@/lib/api';
import type { Session } from '@/lib/api';

export default function InstructorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInstructorMySessions();
      setSessions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div>
      <PageHeader title="MY SESSIONS" />

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

      {/* Sessions List */}
      {!loading && !error && (
        <Section>
          <div className="space-y-6">
            {sessions.length === 0 ? (
              <div
                className="text-center py-12"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                  opacity: 0.7,
                }}
              >
                No sessions scheduled.
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="pb-6 border-b"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {session.classType?.name || 'Unknown Class'}
                      </h3>
                      <div
                        className="text-sm mb-2"
                        style={{
                          color: 'var(--color-text-muted)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {formatDate(session.startsAt)} {formatTime(session.startsAt)} - {formatTime(session.endsAt)} • capacity {session.capacity} • {session.status}
                      </div>
                      {session.location && (
                        <div
                          className="text-sm mb-2"
                          style={{
                            color: 'var(--color-text-muted)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {session.location}
                        </div>
                      )}
                      {(session.registrationOpens || session.registrationCloses) && (
                        <div
                          className="text-sm"
                          style={{
                            color: 'var(--color-text-muted)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          Registration: {session.registrationOpens ? formatDateTime(session.registrationOpens) : 'open'} -{' '}
                          {session.registrationCloses ? formatDateTime(session.registrationCloses) : 'open'}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Link href={`/dashboard/instructor/sessions/${session.id}/roster`}>
                        <ActionButton variant="secondary" className="text-sm py-2 px-4">
                          VIEW ROSTER
                        </ActionButton>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
