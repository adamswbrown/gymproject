'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { getAllRegistrations, getClassRegistrations, getCourseRegistrations, exportCalendar } from '@/lib/api';
import type { RegistrationResponse } from '@/lib/api';

export default function MemberRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'classes' | 'courses'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, [activeTab]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: RegistrationResponse[];
      if (activeTab === 'classes') {
        data = await getClassRegistrations();
      } else if (activeTab === 'courses') {
        data = await getCourseRegistrations();
      } else {
        data = await getAllRegistrations();
      }
      setRegistrations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarExport = async () => {
    try {
      setExportError(null);
      const blob = await exportCalendar();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registrations.ics';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setExportError('Failed to export calendar: ' + (err.message || 'Unknown error'));
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

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Registrations" />
        <button
          onClick={handleCalendarExport}
          className="px-4 py-2"
          style={{
            backgroundColor: 'var(--color-accent-primary)',
            color: 'white',
            fontFamily: 'var(--font-body)',
          }}
        >
          Calendar Export
        </button>
      </div>

      {error && (
        <DismissibleError
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {exportError && (
        <DismissibleError
          message={exportError}
          onDismiss={() => setExportError(null)}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2' : ''}`}
          style={{
            borderBottomColor: activeTab === 'all' ? 'var(--color-accent-primary)' : 'transparent',
            color: activeTab === 'all' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Classes/Appointments
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 ${activeTab === 'courses' ? 'border-b-2' : ''}`}
          style={{
            borderBottomColor: activeTab === 'courses' ? 'var(--color-accent-primary)' : 'transparent',
            color: activeTab === 'courses' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Courses
        </button>
      </div>

      <div className="mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
        All times Europe/London
      </div>

      {loading && (
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      )}

      {!loading && registrations.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          No registrations found.
        </div>
      )}

      {!loading && registrations.length > 0 && (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="p-6"
              style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
            >
              {reg.type === 'CLASS' && reg.session ? (
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {reg.session.classType.name}
                  </h3>
                  <div className="space-y-1 mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    <p>{reg.session.location}</p>
                    <p>{formatDateTime(reg.session.startsAt)} - {formatDateTime(reg.session.endsAt)}</p>
                    {reg.session.instructor?.user?.name && <p>Instructor: {reg.session.instructor.user.name}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}
                    >
                      {getInitials(reg.session.instructor?.user?.name)}
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                      {reg.session.instructor?.user?.name || 'TBA'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <a
                      href={`/schedule?e=${reg.sessionId}&date=${reg.session.startsAt.split('T')[0]}`}
                      className="text-sm underline"
                      style={{ color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}
                    >
                      View Event
                    </a>
                  </div>
                </div>
              ) : reg.type === 'COURSE' && reg.course ? (
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {reg.course.name}
                  </h3>
                  <div className="space-y-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    <p>
                      {formatDateTime(reg.course.startDate)} - {formatDateTime(reg.course.endDate)}
                    </p>
                    <p>Status: {reg.status}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

