'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ScheduleCard } from '@/components/ui/ScheduleCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getPublicSchedule } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { ScheduleResponse } from '@/lib/api';

export default function SchedulePage() {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    classTypeId: '',
    instructorId: '',
  });

  useEffect(() => {
    loadSchedule();
  }, [filters]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicSchedule({
        from: filters.from || undefined,
        to: filters.to || undefined,
        classTypeId: filters.classTypeId || undefined,
        instructorId: filters.instructorId || undefined,
      });
      setSessions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (sessionId: string) => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/schedule`;
      return;
    }

    try {
      const { createBooking } = await import('@/lib/api');
      await createBooking(sessionId);
      loadSchedule();
    } catch (err: any) {
      alert(err.message || 'Failed to book class');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="Class Schedule" />
        
        {/* Filters */}
        <div 
          className="mb-8 p-4" 
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)', 
            border: '1px solid var(--color-border-subtle)' 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label 
                className="block text-sm uppercase mb-2" 
                style={{ 
                  color: 'var(--color-text-muted)', 
                  fontFamily: 'var(--font-body)' 
                }}
              >
                From Date
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                min={today}
                className="w-full px-4 py-2 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)', 
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              />
            </div>
            <div>
              <label 
                className="block text-sm uppercase mb-2" 
                style={{ 
                  color: 'var(--color-text-muted)', 
                  fontFamily: 'var(--font-body)' 
                }}
              >
                To Date
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                min={filters.from || today}
                className="w-full px-4 py-2 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)', 
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              />
            </div>
            <div>
              <label 
                className="block text-sm uppercase mb-2" 
                style={{ 
                  color: 'var(--color-text-muted)', 
                  fontFamily: 'var(--font-body)' 
                }}
              >
                Class Type
              </label>
              <input
                type="text"
                placeholder="Filter by class..."
                value={filters.classTypeId}
                onChange={(e) => setFilters({ ...filters, classTypeId: e.target.value })}
                className="w-full px-4 py-2 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)', 
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              />
            </div>
            <div>
              <label 
                className="block text-sm uppercase mb-2" 
                style={{ 
                  color: 'var(--color-text-muted)', 
                  fontFamily: 'var(--font-body)' 
                }}
              >
                Instructor
              </label>
              <input
                type="text"
                placeholder="Filter by instructor..."
                value={filters.instructorId}
                onChange={(e) => setFilters({ ...filters, instructorId: e.target.value })}
                className="w-full px-4 py-2 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)', 
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4" 
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)', 
              border: '1px solid var(--color-accent-primary)', 
              color: 'var(--color-accent-primary)', 
              fontFamily: 'var(--font-body)' 
            }}
          >
            {error}
          </div>
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
            Loading schedule...
          </div>
        )}

        {/* Schedule List */}
        {!loading && !error && (
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div 
                className="text-center py-12" 
                style={{ 
                  color: 'var(--color-text-muted)', 
                  fontFamily: 'var(--font-body)',
                  opacity: 0.7,
                }}
              >
                No classes scheduled for this period.
              </div>
            ) : (
              sessions.map((session) => (
                <ScheduleCard
                  key={session.id}
                  session={session}
                  onBook={handleBook}
                  isAuthenticated={isAuthenticated}
                />
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


