'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getFamilyMembers, createChild, removeChild, inviteFamilyManager, removeFamilyManager } from '@/lib/api';
import type { FamilyMemberResponse, FamilyManagerResponse, CreateChildDto } from '@/lib/api';

export default function MemberFamilyPage() {
  const [children, setChildren] = useState<FamilyMemberResponse[]>([]);
  const [managers, setManagers] = useState<FamilyManagerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateChild, setShowCreateChild] = useState(false);
  const [showInviteManager, setShowInviteManager] = useState(false);
  const [childForm, setChildForm] = useState<CreateChildDto>({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
  });
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    loadFamily();
  }, []);

  const loadFamily = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFamilyMembers();
      setChildren(data.children);
      setManagers(data.managers);
    } catch (err: any) {
      setError(err.message || 'Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChild = async () => {
    try {
      setError(null);
      await createChild(childForm);
      setShowCreateChild(false);
      setChildForm({ name: '', email: '', password: '', dateOfBirth: '', gender: '' });
      loadFamily();
    } catch (err: any) {
      setError(err.message || 'Failed to create child account');
    }
  };

  const handleRemoveChild = async (childId: string) => {
    if (!confirm('Are you sure you want to remove this child from your family?')) {
      return;
    }

    try {
      setError(null);
      await removeChild(childId);
      loadFamily();
    } catch (err: any) {
      setError(err.message || 'Failed to remove child');
    }
  };

  const handleInviteManager = async () => {
    try {
      setError(null);
      await inviteFamilyManager(inviteEmail);
      setShowInviteManager(false);
      setInviteEmail('');
      loadFamily();
    } catch (err: any) {
      setError(err.message || 'Failed to invite family manager');
    }
  };

  const handleRemoveManager = async (invitationId: string) => {
    if (!confirm('Are you sure you want to remove this family manager?')) {
      return;
    }

    try {
      setError(null);
      await removeFamilyManager(invitationId);
      loadFamily();
    } catch (err: any) {
      setError(err.message || 'Failed to remove family manager');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Family" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Family" />

      {error && (
        <div
          className="mb-6 p-4"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-accent-primary)',
            color: 'var(--color-accent-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {error}
        </div>
      )}

      <div className="mb-6" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        Create and manage accounts for children/dependants using the same login to TeamUp. You can invite other people to manage this family with you.
      </div>

      {/* Children Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Children/Dependants
          </h2>
          <ActionButton variant="primary" onClick={() => setShowCreateChild(true)}>
            Add Child
          </ActionButton>
        </div>

        {showCreateChild && (
          <div className="mb-6 p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Create Child Account
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={childForm.name}
                  onChange={(e) => setChildForm({ ...childForm, name: e.target.value })}
                  className="w-full p-2 border"
                  style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={childForm.email}
                  onChange={(e) => setChildForm({ ...childForm, email: e.target.value })}
                  className="w-full p-2 border"
                  style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={childForm.password}
                  onChange={(e) => setChildForm({ ...childForm, password: e.target.value })}
                  className="w-full p-2 border"
                  style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={childForm.dateOfBirth}
                  onChange={(e) => setChildForm({ ...childForm, dateOfBirth: e.target.value })}
                  className="w-full p-2 border"
                  style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Gender
                </label>
                <select
                  value={childForm.gender}
                  onChange={(e) => setChildForm({ ...childForm, gender: e.target.value })}
                  className="w-full p-2 border"
                  style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2">
                <ActionButton variant="primary" onClick={handleCreateChild}>
                  Create
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => setShowCreateChild(false)}>
                  Cancel
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {children.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              No children/dependants added yet.
            </div>
          ) : (
            children.map((child) => (
              <div
                key={child.id}
                className="p-6"
                style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      {child.name || child.email}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                      {child.email}
                    </p>
                    {child.user.dateOfBirth && (
                      <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                        DOB: {formatDate(child.user.dateOfBirth)}
                      </p>
                    )}
                  </div>
                  <ActionButton variant="secondary" onClick={() => handleRemoveChild(child.id)}>
                    Remove
                  </ActionButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Family Managers Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Family Managers
          </h2>
          <ActionButton variant="primary" onClick={() => setShowInviteManager(true)}>
            Invite Manager
          </ActionButton>
        </div>

        {showInviteManager && (
          <div className="mb-6 p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Invite Family Manager
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2 border"
                  style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div className="flex gap-2">
                <ActionButton variant="primary" onClick={handleInviteManager}>
                  Send Invitation
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => setShowInviteManager(false)}>
                  Cancel
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {managers.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              No family managers invited yet.
            </div>
          ) : (
            managers.map((manager) => (
              <div
                key={manager.id}
                className="p-6"
                style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      {manager.invitedUser?.name || manager.invitedEmail}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                      {manager.invitedEmail}
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                      Status: {manager.status}
                      {manager.acceptedAt && ` (Accepted: ${formatDate(manager.acceptedAt)})`}
                    </p>
                  </div>
                  {manager.status !== 'REVOKED' && (
                    <ActionButton variant="secondary" onClick={() => handleRemoveManager(manager.id)}>
                      Remove
                    </ActionButton>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

