'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { ActionButton } from '@/components/ui/ActionButton';
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getClassTypes,
  getInstructors,
  type Session,
  type CreateSessionDto,
  type ClassType,
  type Instructor,
} from '@/lib/api';

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sessionsData, classTypesData, instructorsData] = await Promise.all([
        getSessions(),
        getClassTypes(),
        getInstructors(),
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

  const handleUpdate = async (id: string, data: CreateSessionDto) => {
    try {
      setError(null);
      await updateSession(id, data);
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update session');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteSession(id);
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
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader title="SESSIONS" />

      {/* Error State */}
      {error && (
        <div
          className="p-4 mb-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-accent-primary)',
            color: 'var(--color-accent-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          className="py-12"
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            opacity: 0.7,
          }}
        >
          Loading sessions…
        </div>
      )}

      {!loading && (
        <Section>
          {/* Create Form */}
          <form onSubmit={handleCreate} className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <h2
              className="text-xl font-bold uppercase mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              CREATE SESSION
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm uppercase mb-2"
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
                      backgroundColor: 'var(--color-bg-primary)',
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
                    className="block text-sm uppercase mb-2"
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
                      backgroundColor: 'var(--color-bg-primary)',
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
                        {instructor.user.name || instructor.user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm uppercase mb-2"
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
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Ends At (UTC) *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endsAt}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm uppercase mb-2"
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
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm uppercase mb-2"
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
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Registration Closes (UTC)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.registrationCloses || ''}
                    onChange={(e) => setFormData({ ...formData, registrationCloses: e.target.value || undefined })}
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
                    backgroundColor: 'var(--color-bg-primary)',
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
              <ActionButton type="submit">Create</ActionButton>
            </div>
          </form>

          {/* Sessions List */}
          <div className="space-y-6">
            {sessions.length === 0 ? (
              <div
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
                  {editingId === session.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(session.id, formData);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm uppercase mb-2"
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
                              backgroundColor: 'var(--color-bg-primary)',
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
                            className="block text-sm uppercase mb-2"
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
                              backgroundColor: 'var(--color-bg-primary)',
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
                                {instructor.user.name || instructor.user.email}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm uppercase mb-2"
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
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            Ends At (UTC) *
                          </label>
                          <input
                            type="datetime-local"
                            required
                            value={formData.endsAt}
                            onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm uppercase mb-2"
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
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm uppercase mb-2"
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
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            Registration Closes (UTC)
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.registrationCloses || ''}
                            onChange={(e) => setFormData({ ...formData, registrationCloses: e.target.value || undefined })}
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
                            backgroundColor: 'var(--color-bg-primary)',
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
                      <div className="flex gap-4">
                        <ActionButton type="submit">Save</ActionButton>
                        <ActionButton type="button" variant="secondary" onClick={cancelEdit}>
                          Cancel
                        </ActionButton>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3
                            className="text-lg font-bold mb-2"
                            style={{
                              fontFamily: 'var(--font-body)',
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
                            {formatDate(session.startsAt)} {formatTime(session.startsAt)} - {formatTime(session.endsAt)} •{' '}
                            {session.instructor?.user?.name || 'Unknown Instructor'} • capacity {session.capacity} • {session.status}
                          </div>
                          <div
                            className="text-sm mb-2"
                            style={{
                              color: 'var(--color-text-muted)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {session.location}
                          </div>
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
                        <div className="flex gap-2">
                          <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => startEdit(session)}
                            className="text-sm py-2 px-4"
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => handleDelete(session.id)}
                            className="text-sm py-2 px-4"
                          >
                            Delete
                          </ActionButton>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
