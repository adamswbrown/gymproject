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
  getAdminInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  type AdminInstructor,
  type CreateInstructorDto,
} from '@/lib/api';

export default function AdminInstructorsPage() {
  const pathname = usePathname();
  const { hasAccess, isLoading: roleLoading, accessDenied } = useRequireRole('ADMIN');
  const [instructors, setInstructors] = useState<AdminInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<CreateInstructorDto>({
    name: '',
    email: '',
    bio: '',
    active: true,
  });

  useEffect(() => {
    if (hasAccess) {
      loadInstructors();
    }
  }, [hasAccess]);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminInstructors();
      setInstructors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createInstructor(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        email: '',
        bio: '',
        active: true,
      });
      loadInstructors();
    } catch (err: any) {
      setError(err.message || 'Failed to create instructor');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setError(null);
      await updateInstructor(editingId, formData);
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        bio: '',
        active: true,
      });
      loadInstructors();
    } catch (err: any) {
      setError(err.message || 'Failed to update instructor');
    }
  };

  const handleDelete = async (instructor: AdminInstructor) => {
    const confirmMessage = `Are you sure you want to delete the instructor "${instructor.name || instructor.email}"? This action cannot be undone.`;
    if (!confirm(confirmMessage)) return;
    try {
      setError(null);
      await deleteInstructor(instructor.id);
      loadInstructors();
    } catch (err: any) {
      setError(err.message || 'Failed to delete instructor');
    }
  };

  const startEdit = (instructor: AdminInstructor) => {
    setEditingId(instructor.id);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      bio: instructor.bio || '',
      active: instructor.active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      bio: '',
      active: true,
    });
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      active: true,
    });
    setIsCreateModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter and search
  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (instructor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && instructor.active) ||
        (statusFilter === 'inactive' && !instructor.active);
      return matchesSearch && matchesStatus;
    });
  }, [instructors, searchQuery, statusFilter]);

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

  const renderForm = (onSubmit: (e: React.FormEvent) => void, submitLabel: string) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          Email *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
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
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="mr-2"
        />
        <label
          style={{
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Active
        </label>
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
          {/* Header with Create Button and Search/Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <ActionButton onClick={openCreateModal}>
                Create Instructor
              </ActionButton>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  minWidth: '200px',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Instructors Grid */}
          {filteredInstructors.length === 0 ? (
            <div
              className="text-center py-12"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                opacity: 0.7,
              }}
            >
              {searchQuery || statusFilter !== 'all' ? 'No instructors match your filters.' : 'No instructors. Create your first instructor to get started.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInstructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="p-4 border"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border-subtle)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {getInitials(instructor.name)}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold mb-1"
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {instructor.name}
                        </h3>
                        <StatusBadge status={instructor.active ? 'active' : 'inactive'} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(instructor)}
                        className="p-2 hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-text-muted)' }}
                        aria-label="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(instructor)}
                        className="p-2 hover:opacity-70 transition-opacity"
                        style={{ color: '#ef4444' }}
                        aria-label="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div
                    className="text-sm mb-2"
                    style={{
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {instructor.email}
                  </div>
                  {instructor.bio && (
                    <div
                      className="text-sm mt-2 pt-2 border-t"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                        borderColor: 'var(--color-border-subtle)',
                      }}
                    >
                      {instructor.bio}
                    </div>
                  )}
                </div>
              ))}
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
        title="Create Instructor"
      >
        {renderForm(handleCreate, 'Create')}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingId !== null}
        onClose={cancelEdit}
        title="Edit Instructor"
      >
        {editingId && renderForm(handleUpdate, 'Save')}
      </Modal>
    </div>
  );
}
