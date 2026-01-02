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
  getAdminClassTypes,
  createClassType,
  updateClassType,
  deleteClassType,
  type ClassType,
  type CreateClassTypeDto,
} from '@/lib/api';

export default function AdminClassTypesPage() {
  const pathname = usePathname();
  const { hasAccess, isLoading: roleLoading, accessDenied } = useRequireRole('ADMIN');
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<CreateClassTypeDto>({
    name: '',
    description: '',
    durationMinutes: 30,
    defaultCapacity: 10,
    cancellationCutoffHours: undefined,
    active: true,
  });

  useEffect(() => {
    if (hasAccess) {
      loadClassTypes();
    }
  }, [hasAccess]);

  const loadClassTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminClassTypes();
      setClassTypes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load class types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createClassType(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        durationMinutes: 30,
        defaultCapacity: 10,
        cancellationCutoffHours: undefined,
        active: true,
      });
      loadClassTypes();
    } catch (err: any) {
      setError(err.message || 'Failed to create class type');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setError(null);
      await updateClassType(editingId, formData);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        durationMinutes: 30,
        defaultCapacity: 10,
        cancellationCutoffHours: undefined,
        active: true,
      });
      loadClassTypes();
    } catch (err: any) {
      setError(err.message || 'Failed to update class type');
    }
  };

  const handleDelete = async (classType: ClassType) => {
    const confirmMessage = `Are you sure you want to delete the class type "${classType.name}"? This action cannot be undone.`;
    if (!confirm(confirmMessage)) return;
    try {
      setError(null);
      await deleteClassType(classType.id);
      loadClassTypes();
    } catch (err: any) {
      setError(err.message || 'Failed to delete class type');
    }
  };

  const startEdit = (classType: ClassType) => {
    setEditingId(classType.id);
    setFormData({
      name: classType.name,
      description: classType.description || '',
      durationMinutes: classType.durationMinutes,
      defaultCapacity: classType.defaultCapacity,
      cancellationCutoffHours: classType.cancellationCutoffHours,
      active: classType.active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      durationMinutes: 30,
      defaultCapacity: 10,
      cancellationCutoffHours: undefined,
      active: true,
    });
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      durationMinutes: 30,
      defaultCapacity: 10,
      cancellationCutoffHours: undefined,
      active: true,
    });
    setIsCreateModalOpen(true);
  };

  // Filter and search
  const filteredClassTypes = useMemo(() => {
    return classTypes.filter((ct) => {
      const matchesSearch = ct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ct.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && ct.active) ||
        (statusFilter === 'inactive' && !ct.active);
      return matchesSearch && matchesStatus;
    });
  }, [classTypes, searchQuery, statusFilter]);

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
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
                  className="block text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Duration (minutes) *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
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
            Default Capacity *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.defaultCapacity}
            onChange={(e) => setFormData({ ...formData, defaultCapacity: parseInt(e.target.value) || 0 })}
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
                  className="block text-sm font-medium mb-2"
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Cancellation Cutoff Hours
        </label>
        <input
          type="number"
          min="0"
          value={formData.cancellationCutoffHours || ''}
          onChange={(e) => setFormData({ ...formData, cancellationCutoffHours: e.target.value ? parseInt(e.target.value) : undefined })}
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
          {/* Header with Create Button and Search/Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <ActionButton onClick={openCreateModal}>
                Create Class Type
              </ActionButton>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search class types..."
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

          {/* Class Types Grid */}
          {filteredClassTypes.length === 0 ? (
            <div
              className="text-center py-12"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                opacity: 0.7,
              }}
            >
              {searchQuery || statusFilter !== 'all' ? 'No class types match your filters.' : 'No class types. Create your first class type to get started.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClassTypes.map((classType) => (
                <div
                  key={classType.id}
                  className="p-4 border"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border-subtle)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {classType.name}
                      </h3>
                      <StatusBadge status={classType.active ? 'active' : 'inactive'} />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(classType)}
                        className="p-2 hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-text-muted)' }}
                        aria-label="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(classType)}
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
                    {classType.durationMinutes} min • Capacity {classType.defaultCapacity}
                  </div>
                  {classType.cancellationCutoffHours !== null && classType.cancellationCutoffHours !== undefined && (
                    <div
                      className="text-sm mb-2"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Cancellation: {classType.cancellationCutoffHours}h before
                    </div>
                  )}
                  {classType.description && (
                    <div
                      className="text-sm mt-2 pt-2 border-t"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                        borderColor: 'var(--color-border-subtle)',
                      }}
                    >
                      {classType.description}
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
        title="Create Class Type"
      >
        {renderForm(handleCreate, 'Create')}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingId !== null}
        onClose={cancelEdit}
        title="Edit Class Type"
      >
        {editingId && renderForm(handleUpdate, 'Save')}
      </Modal>
    </div>
  );
}
