'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { useRequireRole } from '@/hooks/useRequireRole';
import { createAdminUser } from '@/lib/api';
import type { CreateUserDto } from '@/lib/api';

export default function CreateUserPage() {
  const router = useRouter();
  const { hasAccess, isLoading: roleLoading, accessDenied } = useRequireRole('ADMIN');
  const [formData, setFormData] = useState<CreateUserDto>({
    email: '',
    password: '',
    name: '',
    role: 'MEMBER',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await createAdminUser(formData);
      router.push('/dashboard/admin/users');
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

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
      <PageHeader title="Create User" />

      {error && (
        <DismissibleError
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border"
              style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
              Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border"
              style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border"
              style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
              Role *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full p-2 border"
              style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            >
              <option value="MEMBER">Member</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex gap-2">
            <ActionButton type="submit" variant="primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create User'}
            </ActionButton>
            <ActionButton type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </ActionButton>
          </div>
        </div>
      </form>
    </div>
  );
}

