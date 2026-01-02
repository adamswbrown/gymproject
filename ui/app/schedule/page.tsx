'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { CalendarView } from '@/components/ui/CalendarView';
import { ScheduleFilters } from '@/components/ui/ScheduleFilters';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { getSchedule } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { ScheduleResponse } from '@/lib/api';

export default function SchedulePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessions, setSessions] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    classTypeId: '',
    instructorId: '',
  });
  const [selectedClassTypes, setSelectedClassTypes] = useState<string[]>(
    searchParams.get('classTypes')?.split(',').filter(Boolean) || []
  );
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>(
    searchParams.get('instructors')?.split(',').filter(Boolean) || []
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }, [isAuthenticated, isLoading]);

  // Extract unique class types and instructors from sessions
  const classTypes = useMemo(() => {
    const unique = new Map<string, { id: string; name: string }>();
    sessions.forEach((session) => {
      if (!unique.has(session.classType.id)) {
        unique.set(session.classType.id, {
          id: session.classType.id,
          name: session.classType.name,
        });
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [sessions]);

  const instructors = useMemo(() => {
    const unique = new Map<string, { id: string; name: string }>();
    sessions.forEach((session) => {
      if (session.instructor.id && session.instructor.name && !unique.has(session.instructor.id)) {
        unique.set(session.instructor.id, {
          id: session.instructor.id,
          name: session.instructor.name,
        });
      }
    });
    return Array.from(unique.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [sessions]);

  // Set default date range to current month if not in URL
  useEffect(() => {
    if (!filters.from || !filters.to) {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setFilters(prev => ({
        ...prev,
        from: prev.from || firstDay.toISOString().split('T')[0],
        to: prev.to || lastDay.toISOString().split('T')[0],
      }));
    }
  }, []);

  // Update URL when filters change (debounced to avoid too many updates)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      if (selectedClassTypes.length > 0) params.set('classTypes', selectedClassTypes.join(','));
      if (selectedInstructors.length > 0) params.set('instructors', selectedInstructors.join(','));
      
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      const currentUrl = window.location.search;
      if (currentUrl !== newUrl) {
        router.replace(`/schedule${newUrl}`, { scroll: false });
      }
    }, 300); // Debounce URL updates

    return () => clearTimeout(timeoutId);
  }, [filters.from, filters.to, selectedClassTypes, selectedInstructors, router]);

  // Update filters when selections change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      classTypeId: selectedClassTypes.length > 0 ? selectedClassTypes[0] : '',
      instructorId: selectedInstructors.length > 0 ? selectedInstructors[0] : '',
    }));
  }, [selectedClassTypes, selectedInstructors]);

  useEffect(() => {
    // Only load schedule if authenticated and filters are set
    if (isAuthenticated && !isLoading && filters.from && filters.to) {
      loadSchedule();
    }
  }, [filters, isAuthenticated, isLoading]);

  const loadSchedule = async () => {
    if (!filters.from || !filters.to) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll use the first selected filter (backend expects single IDs)
      // TODO: Update backend to support multiple IDs or filter client-side
      const data = await getSchedule({
        from: filters.from || undefined,
        to: filters.to || undefined,
        classTypeId: selectedClassTypes.length > 0 ? selectedClassTypes[0] : undefined,
        instructorId: selectedInstructors.length > 0 ? selectedInstructors[0] : undefined,
      });
      
      // Filter client-side if multiple selections
      let filteredData = data;
      
      // Apply class type filter
      if (selectedClassTypes.length > 1) {
        filteredData = filteredData.filter(session => 
          selectedClassTypes.includes(session.classType.id)
        );
      } else if (selectedClassTypes.length === 1) {
        // Already filtered by API, but ensure it matches
        filteredData = filteredData.filter(session => 
          selectedClassTypes.includes(session.classType.id)
        );
      }
      
      // Apply instructor filter
      if (selectedInstructors.length > 1) {
        filteredData = filteredData.filter(session => 
          selectedInstructors.includes(session.instructor.id)
        );
      } else if (selectedInstructors.length === 1) {
        // Already filtered by API, but ensure it matches
        filteredData = filteredData.filter(session => 
          selectedInstructors.includes(session.instructor.id)
        );
      }
      
      setSessions(filteredData);
    } catch (err: any) {
      setError(err.message || 'Failed to load schedule');
      setSessions([]); // Clear sessions on error
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (sessionId: string) => {
    // This should never happen since page requires auth, but keep as safety check
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/schedule`;
      return;
    }

    try {
      setBookingError(null);
      const { createBooking } = await import('@/lib/api');
      
      // Optimistic update: decrease remaining capacity immediately
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId
            ? { ...session, remainingCapacity: Math.max(0, session.remainingCapacity - 1), confirmedCount: session.confirmedCount + 1 }
            : session
        )
      );
      
      await createBooking(sessionId);
      // Reload schedule to get accurate data from server
      await loadSchedule();
    } catch (err: any) {
      // Revert optimistic update on error
      await loadSchedule();
      setBookingError(err.message || 'Failed to book class');
      throw err; // Re-throw so modal can handle it
    }
  };

  const handleClassTypeToggle = (id: string) => {
    setSelectedClassTypes(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleInstructorToggle = (id: string) => {
    setSelectedInstructors(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSelectedClassTypes([]);
    setSelectedInstructors([]);
  };

  const today = new Date().toISOString().split('T')[0];

  // Show loading state while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      <main className="flex-1 flex" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        {/* Left Sidebar - Filters */}
        <ScheduleFilters
          classTypes={classTypes}
          instructors={instructors}
          selectedClassTypes={selectedClassTypes}
          selectedInstructors={selectedInstructors}
          onClassTypeToggle={handleClassTypeToggle}
          onInstructorToggle={handleInstructorToggle}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '100%' }}>
            <PageHeader title="Class Schedule" />
            
            {/* Date Range Filters - Compact */}
            <div className="mb-6 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label 
                  className="block font-medium mb-2 text-xs" 
                  style={{ 
                    color: 'var(--color-text-muted)', 
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    lineHeight: '1.5'
                  }}
                >
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                  min={today}
                  className="w-full px-3 py-2 focus:outline-none rounded-sm"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)', 
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label 
                  className="block font-medium mb-2 text-xs" 
                  style={{ 
                    color: 'var(--color-text-muted)', 
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    lineHeight: '1.5'
                  }}
                >
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                  min={filters.from || today}
                  className="w-full px-3 py-2 focus:outline-none rounded-sm"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)', 
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
                />
              </div>
            </div>

        {/* Error Message */}
        {error && (
          <DismissibleError
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Booking Error Message */}
        {bookingError && (
          <DismissibleError
            message={bookingError}
            onDismiss={() => setBookingError(null)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div 
            className="text-center py-12" 
            style={{ 
              color: 'var(--color-text-muted)', 
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-body)',
              lineHeight: 'var(--line-height-body)',
              opacity: 0.7,
            }}
          >
            Loading …
          </div>
        )}

        {/* Calendar View */}
        {!loading && !error && (
          <div>
            {sessions.length === 0 ? (
              <div 
                className="text-center py-12" 
                style={{ 
                  color: 'var(--color-text-muted)', 
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-body)',
                  lineHeight: 'var(--line-height-body)',
                  opacity: 0.7,
                }}
              >
                No sessions scheduled.
              </div>
            ) : (
              <CalendarView
                sessions={sessions}
                onBook={handleBook}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>
        )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


