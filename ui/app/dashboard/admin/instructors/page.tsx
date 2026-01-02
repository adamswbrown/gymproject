'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { ActionButton } from '@/components/ui/ActionButton';
import {
  getAdminInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  type AdminInstructor,
  type CreateInstructorDto,
} from '@/lib/api';

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<AdminInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateInstructorDto>({
    name: '',
    email: '',
    bio: '',
    active: true,
  });

  useEffect(() => {
    loadInstructors();
  }, []);

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

  const handleUpdate = async (id: string, data: CreateInstructorDto) => {
    try {
      setError(null);
      await updateInstructor(id, data);
      setEditingId(null);
      loadInstructors();
    } catch (err: any) {
      setError(err.message || 'Failed to update instructor');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteInstructor(id);
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

  return (
    <div>
      <PageHeader title="INSTRUCTORS" />

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
          Loading instructors…
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
              CREATE INSTRUCTOR
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
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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

          {/* Instructors List */}
          <div className="space-y-6">
            {instructors.length === 0 ? (
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                  opacity: 0.7,
                }}
              >
                No instructors.
              </div>
            ) : (
              instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="pb-6 border-b"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  {editingId === instructor.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(instructor.id, formData);
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
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                          Bio
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                            {instructor.name}
                          </h3>
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
                              className="text-sm mb-2"
                              style={{
                                color: 'var(--color-text-muted)',
                                fontFamily: 'var(--font-body)',
                              }}
                            >
                              {instructor.bio}
                            </div>
                          )}
                          <div
                            className="text-sm uppercase"
                            style={{
                              color: instructor.active ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {instructor.active ? 'ACTIVE' : 'INACTIVE'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => startEdit(instructor)}
                            className="text-sm py-2 px-4"
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => handleDelete(instructor.id)}
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
