'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getProfile, updateProfile, updatePassword, updateContact, updateEmergencyContact } from '@/lib/api';
import type { ProfileResponse, UpdateProfileDto } from '@/lib/api';

export default function MemberProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateProfileDto>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: string) => {
    setEditing(section);
    if (section === 'profile') {
      setFormData({
        name: profile?.name,
        email: profile?.email,
        phone: profile?.phone,
        dateOfBirth: profile?.dateOfBirth,
        gender: profile?.memberProfile?.gender,
      });
    } else if (section === 'contact') {
      setFormData({
        phone: profile?.phone,
        addressStreet: profile?.memberProfile?.addressStreet,
        addressCity: profile?.memberProfile?.addressCity,
        addressPostalCode: profile?.memberProfile?.addressPostalCode,
        addressCountry: profile?.memberProfile?.addressCountry,
      });
    } else if (section === 'emergency') {
      setFormData({
        emergencyContactName: profile?.memberProfile?.emergencyContactName,
        emergencyContactPhone: profile?.memberProfile?.emergencyContactPhone,
        emergencyContactRelationship: profile?.memberProfile?.emergencyContactRelationship,
      });
    }
  };

  const handleSave = async (section: string) => {
    try {
      setError(null);
      let updated: ProfileResponse;

      if (section === 'profile') {
        updated = await updateProfile(formData);
      } else if (section === 'contact') {
        updated = await updateContact(formData);
      } else if (section === 'emergency') {
        updated = await updateEmergencyContact(formData);
      } else {
        return;
      }

      setProfile(updated);
      setEditing(null);
      setFormData({});
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      await updatePassword(currentPassword, newPassword);
      alert('Password updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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

  if (loading) {
    return (
      <div>
        <PageHeader title="Profile" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <PageHeader title="Profile" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Profile not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={profile.name || 'Profile'} />

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

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-6" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}
          >
            {getInitials(profile.name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              {profile.name || 'User'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{profile.email}</p>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            User Info
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Name</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'profile' ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="p-2 border"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    />
                  ) : (
                    profile.name || 'Not set'
                  )}
                </p>
              </div>
              {editing === 'profile' ? (
                <div className="flex gap-2">
                  <ActionButton variant="primary" onClick={() => handleSave('profile')}>
                    Save
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={() => setEditing(null)}>
                    Cancel
                  </ActionButton>
                </div>
              ) : (
                <ActionButton variant="secondary" onClick={() => handleEdit('profile')}>
                  Edit
                </ActionButton>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Email</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'profile' ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="p-2 border"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    />
                  ) : (
                    profile.email
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Password</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>*********</p>
              </div>
              <ActionButton variant="secondary" onClick={() => {
                const current = prompt('Enter current password:');
                const newPass = prompt('Enter new password:');
                const confirm = prompt('Confirm new password:');
                if (newPass === confirm && current && newPass) {
                  handlePasswordChange(current, newPass);
                }
              }}>
                Edit
              </ActionButton>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>SMS Account</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {profile.phone || 'Not set'} {!profile.smsVerified && profile.phone && <span className="text-sm text-yellow-600">Pending Verification</span>}
                </p>
              </div>
              <ActionButton variant="secondary" onClick={() => handleEdit('contact')}>
                Edit
              </ActionButton>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Date of Birth</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'profile' ? (
                    <input
                      type="date"
                      value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="p-2 border"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    />
                  ) : (
                    formatDate(profile.dateOfBirth) || 'Not set'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signup Form Section */}
        {profile.memberProfile?.gender && (
          <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Signup Form
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Gender</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'profile' ? (
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="p-2 border"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    profile.memberProfile.gender
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form Section */}
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Contact Form
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Address</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'contact' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Street"
                        value={formData.addressStreet || ''}
                        onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                        className="p-2 border w-full"
                        style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.addressCity || ''}
                        onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                        className="p-2 border w-full"
                        style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={formData.addressPostalCode || ''}
                        onChange={(e) => setFormData({ ...formData, addressPostalCode: e.target.value })}
                        className="p-2 border w-full"
                        style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={formData.addressCountry || ''}
                        onChange={(e) => setFormData({ ...formData, addressCountry: e.target.value })}
                        className="p-2 border w-full"
                        style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                  ) : (
                    [
                      profile.memberProfile?.addressStreet,
                      profile.memberProfile?.addressCity,
                      profile.memberProfile?.addressPostalCode,
                      profile.memberProfile?.addressCountry,
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Not set'
                  )}
                </p>
              </div>
              {editing === 'contact' ? (
                <div className="flex gap-2 ml-4">
                  <ActionButton variant="primary" onClick={() => handleSave('contact')}>
                    Save
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={() => setEditing(null)}>
                    Cancel
                  </ActionButton>
                </div>
              ) : (
                <ActionButton variant="secondary" onClick={() => handleEdit('contact')}>
                  Edit
                </ActionButton>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Phone</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'contact' ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="p-2 border"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    />
                  ) : (
                    profile.phone || 'Not set'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Emergency Contact Form
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Emergency Contact Name</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'emergency' ? (
                    <input
                      type="text"
                      value={formData.emergencyContactName || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="p-2 border w-full"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    />
                  ) : (
                    profile.memberProfile?.emergencyContactName || 'Not set'
                  )}
                </p>
              </div>
              {editing === 'emergency' ? (
                <div className="flex gap-2 ml-4">
                  <ActionButton variant="primary" onClick={() => handleSave('emergency')}>
                    Save
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={() => setEditing(null)}>
                    Cancel
                  </ActionButton>
                </div>
              ) : (
                <ActionButton variant="secondary" onClick={() => handleEdit('emergency')}>
                  Edit
                </ActionButton>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Emergency Contact Phone</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'emergency' ? (
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="p-2 border"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    />
                  ) : (
                    profile.memberProfile?.emergencyContactPhone || 'Not set'
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Emergency Contact Relationship</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                  {editing === 'emergency' ? (
                    <input
                      type="text"
                      value={formData.emergencyContactRelationship || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                      className="p-2 border"
                      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                    />
                  ) : (
                    profile.memberProfile?.emergencyContactRelationship || 'Not set'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

