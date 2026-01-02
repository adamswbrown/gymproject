'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { useRequireRole } from '@/hooks/useRequireRole';
import { getAdminUsers, deleteAdminUser } from '@/lib/api';
import type { AdminUserResponse } from '@/lib/api';

export default function AdminUsersPage() {
  const { hasAccess, isLoading: roleLoading, accessDenied } = useRequireRole('ADMIN');
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'INSTRUCTOR' | 'MEMBER'>('all');

  useEffect(() => {
    if (hasAccess) {
      loadUsers();
    }
  }, [hasAccess]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setError(null);
      await deleteAdminUser(id);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchQuery || 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div>
        <PageHeader title="Users" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Users" />
        <Link href="/dashboard/admin/users/create">
          <ActionButton variant="primary">Create User</ActionButton>
        </Link>
      </div>

      {error && (
        <DismissibleError
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border"
          style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="p-2 border"
          style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="MEMBER">Member</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            No users found.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-6"
              style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {user.name || user.email}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    {user.email}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className="px-2 py-1 text-xs"
                      style={{
                        backgroundColor: 'var(--color-accent-primary)',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {user.role}
                    </span>
                    {user.phone && (
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/admin/users/${user.id}`}>
                    <ActionButton variant="secondary">Edit</ActionButton>
                  </Link>
                  <ActionButton variant="secondary" onClick={() => handleDelete(user.id)}>
                    Delete
                  </ActionButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

