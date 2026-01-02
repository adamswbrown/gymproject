'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { ActionButton } from '@/components/ui/ActionButton';
import {
  getClassTypes,
  createClassType,
  updateClassType,
  deleteClassType,
  type ClassType,
  type CreateClassTypeDto,
} from '@/lib/api';

export default function AdminClassTypesPage() {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateClassTypeDto>({
    name: '',
    description: '',
    durationMinutes: 30,
    defaultCapacity: 10,
    cancellationCutoffHours: undefined,
    active: true,
  });

  useEffect(() => {
    loadClassTypes();
  }, []);

  const loadClassTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClassTypes();
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

  const handleUpdate = async (id: string, data: CreateClassTypeDto) => {
    try {
      setError(null);
      await updateClassType(id, data);
      setEditingId(null);
      loadClassTypes();
    } catch (err: any) {
      setError(err.message || 'Failed to update class type');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteClassType(id);
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

  return (
    <div>
      <PageHeader title="CLASS TYPES" />

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
          Loading class types…
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
              CREATE CLASS TYPE
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm uppercase mb-2"
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm uppercase mb-2"
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
                  Cancellation Cutoff Hours
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.cancellationCutoffHours || ''}
                  onChange={(e) => setFormData({ ...formData, cancellationCutoffHours: e.target.value ? parseInt(e.target.value) : undefined })}
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
              <ActionButton type="submit">Create</ActionButton>
            </div>
          </form>

          {/* Class Types List */}
          <div className="space-y-6">
            {classTypes.length === 0 ? (
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                  opacity: 0.7,
                }}
              >
                No class types.
              </div>
            ) : (
              classTypes.map((classType) => (
                <div
                  key={classType.id}
                  className="pb-6 border-b"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  {editingId === classType.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(classType.id, formData);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          className="block text-sm uppercase mb-2"
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
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm uppercase mb-2"
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
                          Cancellation Cutoff Hours
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.cancellationCutoffHours || ''}
                          onChange={(e) => setFormData({ ...formData, cancellationCutoffHours: e.target.value ? parseInt(e.target.value) : undefined })}
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
                            {classType.name}
                          </h3>
                          <div
                            className="text-sm mb-2"
                            style={{
                              color: 'var(--color-text-muted)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {classType.durationMinutes} min • capacity {classType.defaultCapacity} • cutoff{' '}
                            {classType.cancellationCutoffHours !== null && classType.cancellationCutoffHours !== undefined
                              ? `${classType.cancellationCutoffHours} hours`
                              : 'none'}
                          </div>
                          {classType.description && (
                            <div
                              className="text-sm mb-2"
                              style={{
                                color: 'var(--color-text-muted)',
                                fontFamily: 'var(--font-body)',
                              }}
                            >
                              {classType.description}
                            </div>
                          )}
                          <div
                            className="text-sm uppercase"
                            style={{
                              color: classType.active ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {classType.active ? 'ACTIVE' : 'INACTIVE'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => startEdit(classType)}
                            className="text-sm py-2 px-4"
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => handleDelete(classType.id)}
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
