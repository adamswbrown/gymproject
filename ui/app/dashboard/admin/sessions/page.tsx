'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { ActionButton } from '@/components/ui/ActionButton';
import { Modal } from '@/components/ui/Modal';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { useRequireRole } from '@/hooks/useRequireRole';
import {
  getAdminSessions,
  createSession,
  updateSession,
  deleteSession,
  getAdminClassTypes,
  getAdminInstructors,
  type Session,
  type CreateSessionDto,
  type ClassType,
  type AdminInstructor,
} from '@/lib/api';

export default function AdminSessionsPage() {
  const pathname = usePathname();
  const { hasAccess, isLoading: roleLoading, accessDenied } = useRequireRole('ADMIN');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [instructors, setInstructors] = useState<AdminInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'upcoming'>('upcoming');
  const [statusFilter, setStatusFilter] = useState<'all' | 'SCHEDULED' | 'CANCELLED'>('all');
  const [formData, setFormData] = useState<CreateSessionDto>({
    classTypeId: '',
    instructorId: '',
    startsAt: '',
    endsAt: '',
    capacity: 10,
    location: 'Main Studio',
    status: 'SCHEDULED',
    registrationOpens: undefined,
    registrationCloses: undefined,
  });

  useEffect(() => {
    if (hasAccess) {
      loadData();
    }
  }, [hasAccess]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sessionsData, classTypesData, instructorsData] = await Promise.all([
        getAdminSessions(),
        getAdminClassTypes(),
        getAdminInstructors(),
      ]);
      setSessions(sessionsData);
      setClassTypes(classTypesData);
      setInstructors(instructorsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createSession(formData);
      setIsCreateModalOpen(false);
      setFormData({
        classTypeId: '',
        instructorId: '',
        startsAt: '',
        endsAt: '',
        capacity: 10,
        location: 'Main Studio',
        status: 'SCHEDULED',
        registrationOpens: undefined,
        registrationCloses: undefined,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setError(null);
      await updateSession(editingId, formData);
      setEditingId(null);
      setFormData({
        classTypeId: '',
        instructorId: '',
        startsAt: '',
        endsAt: '',
        capacity: 10,
        location: 'Main Studio',
        status: 'SCHEDULED',
        registrationOpens: undefined,
        registrationCloses: undefined,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update session');
    }
  };

  const handleDelete = async (session: Session) => {
    const sessionDate = new Date(session.startsAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    const confirmMessage = `Are you sure you want to delete the session "${session.classType?.name || 'Unknown'}" on ${sessionDate}? All bookings for this session will be cancelled.`;
    if (!confirm(confirmMessage)) return;
    try {
      setError(null);
      await deleteSession(session.id);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete session');
    }
  };

  const startEdit = (session: Session) => {
    setEditingId(session.id);
    setFormData({
      classTypeId: session.classTypeId,
      instructorId: session.instructorId,
      startsAt: session.startsAt.slice(0, 16),
      endsAt: session.endsAt.slice(0, 16),
      capacity: session.capacity,
      location: session.location,
      status: session.status,
      registrationOpens: session.registrationOpens ? session.registrationOpens.slice(0, 16) : undefined,
      registrationCloses: session.registrationCloses ? session.registrationCloses.slice(0, 16) : undefined,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      classTypeId: '',
      instructorId: '',
      startsAt: '',
      endsAt: '',
      capacity: 10,
      location: 'Main Studio',
      status: 'SCHEDULED',
      registrationOpens: undefined,
      registrationCloses: undefined,
    });
  };

  const openCreateModal = () => {
    setFormData({
      classTypeId: '',
      instructorId: '',
      startsAt: '',
      endsAt: '',
      capacity: 10,
      location: 'Main Studio',
      status: 'SCHEDULED',
      registrationOpens: undefined,
      registrationCloses: undefined,
    });
    setIsCreateModalOpen(true);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter sessions
  const filteredSessions = useMemo(() => {
    const now = new Date();
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startsAt);
      
      // Date filter
      let matchesDate = true;
      if (dateFilter === 'today') {
        const today = new Date();
        matchesDate = sessionDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        matchesDate = sessionDate >= now && sessionDate <= weekFromNow;
      } else if (dateFilter === 'month') {
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        matchesDate = sessionDate >= now && sessionDate <= monthFromNow;
      } else if (dateFilter === 'upcoming') {
        matchesDate = sessionDate >= now;
      }

      // Status filter
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;

      return matchesDate && matchesStatus;
    }).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [sessions, dateFilter, statusFilter]);

  const renderForm = (onSubmit: (e: React.FormEvent) => void, submitLabel: string) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Class Type *
          </label>
          <select
            required
            value={formData.classTypeId}
            onChange={(e) => setFormData({ ...formData, classTypeId: e.target.value })}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
          >
            <option value="">Select class type</option>
            {classTypes.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {ct.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Instructor *
          </label>
          <select
            required
            value={formData.instructorId}
            onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
          >
            <option value="">Select instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name || instructor.email}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Starts At (UTC) *
          </label>
          <input
            type="datetime-local"
            required
            value={formData.startsAt}
            onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
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
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Ends At (UTC) *
          </label>
          <input
            type="datetime-local"
            required
            value={formData.endsAt}
            onChange={(e) => {
              const newEndsAt = e.target.value;
              // Validate that end time is after start time
              if (formData.startsAt && newEndsAt && newEndsAt <= formData.startsAt) {
                // Don't update if invalid, or set error
                return;
              }
              setFormData({ ...formData, endsAt: newEndsAt });
            }}
            min={formData.startsAt || undefined}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Capacity *
          </label>
          <input
            type="number"
            required
            min="1"
            max="1000"
            value={formData.capacity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              // Validate capacity is positive and reasonable
              if (value < 1) return;
              if (value > 1000) return; // Reasonable max
              setFormData({ ...formData, capacity: value });
            }}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
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
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Location *
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Registration Opens (UTC)
          </label>
          <input
            type="datetime-local"
            value={formData.registrationOpens || ''}
            onChange={(e) => setFormData({ ...formData, registrationOpens: e.target.value || undefined })}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
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
            className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Registration Closes (UTC)
          </label>
          <input
            type="datetime-local"
            value={formData.registrationCloses || ''}
            onChange={(e) => {
              const newCloses = e.target.value || undefined;
              // Validate that registration closes is after opens (if both set)
              if (formData.registrationOpens && newCloses && newCloses <= formData.registrationOpens) {
                return; // Don't update if invalid
              }
              // Validate that registration closes is before session starts
              if (formData.startsAt && newCloses && newCloses >= formData.startsAt) {
                return; // Don't update if invalid
              }
              setFormData({ ...formData, registrationCloses: newCloses });
            }}
            min={formData.registrationOpens || formData.startsAt || undefined}
            max={formData.startsAt || undefined}
            className="w-full px-4 py-2 focus:outline-none"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
          />
        </div>
      </div>
      <div>
        <label
          className="block text-sm uppercase mb-2"
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Status *
        </label>
        <select
          required
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'SCHEDULED' | 'CANCELLED' })}
          className="w-full px-4 py-2 focus:outline-none"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
        >
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>
      <ModalFooter>
        <ActionButton type="button" variant="secondary" onClick={() => {
          setIsCreateModalOpen(false);
          cancelEdit();
        }}>
          Cancel
        </ActionButton>
        <ActionButton type="submit">{submitLabel}</ActionButton>
      </ModalFooter>
    </form>
  );

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    if (accessDenied) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
          <div style={{ color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>
            Access Denied. You must be an administrator to view this page. Redirecting...
          </div>
        </div>
      );
    }
    return null; // Redirect is handled by useRequireRole
  }

  return (
    <div>
      <PageHeader title="ADMIN" />

      {/* Admin Navigation Tabs */}
      <div className="mb-6 flex gap-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <Link
          href="/dashboard/admin/class-types"
          className="pb-4 px-2 text-sm font-semibold transition-colors"
          style={{
            color: pathname === '/dashboard/admin/class-types' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            borderBottom: pathname === '/dashboard/admin/class-types' ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
          }}
        >
          Class Types
        </Link>
        <Link
          href="/dashboard/admin/sessions"
          className="pb-4 px-2 text-sm font-semibold transition-colors"
          style={{
            color: pathname === '/dashboard/admin/sessions' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            borderBottom: pathname === '/dashboard/admin/sessions' ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
          }}
        >
          Sessions
        </Link>
        <Link
          href="/dashboard/admin/instructors"
          className="pb-4 px-2 text-sm font-semibold transition-colors"
          style={{
            color: pathname === '/dashboard/admin/instructors' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            borderBottom: pathname === '/dashboard/admin/instructors' ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
          }}
        >
          Instructors
        </Link>
      </div>

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

      {!loading && (
        <Section>
          {/* Header with Create Button and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <ActionButton onClick={openCreateModal}>
                Create Session
              </ActionButton>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                className="px-4 py-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="upcoming">Upcoming</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-4 py-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              >
                <option value="all">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Sessions Table */}
          {filteredSessions.length === 0 ? (
            <div
              className="text-center py-12"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                opacity: 0.7,
              }}
            >
              No sessions found. Create your first session to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-subtle)' }}>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Class
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Date & Time
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Instructor
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Location
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Capacity
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-semibold"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Status
                    </th>
                    <th
                      className="text-right py-3 px-4 text-sm font-semibold"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, index) => (
                    <tr
                      key={session.id}
                      style={{
                        borderBottom: index < filteredSessions.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                      }}
                    >
                      <td className="py-3 px-4">
                        <div
                          className="font-bold"
                          style={{
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {session.classType?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          style={{
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {formatDate(session.startsAt)}
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            color: 'var(--color-text-muted)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          style={{
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {session.instructor?.user?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          style={{
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {session.location}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          style={{
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {session.capacity}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={session.status === 'SCHEDULED' ? 'scheduled' : 'cancelled'} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(session)}
                            className="p-2 hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--color-text-muted)' }}
                            aria-label="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(session)}
                            className="p-2 hover:opacity-70 transition-opacity"
                            style={{ color: '#ef4444' }}
                            aria-label="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          cancelEdit();
        }}
        title="Create Session"
        size="large"
      >
        {renderForm(handleCreate, 'Create')}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingId !== null}
        onClose={cancelEdit}
        title="Edit Session"
        size="large"
      >
        {editingId && renderForm(handleUpdate, 'Save')}
      </Modal>
    </div>
  );
}
