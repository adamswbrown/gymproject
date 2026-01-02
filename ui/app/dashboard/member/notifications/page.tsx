'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getNotificationSettings, updateNotificationSettings } from '@/lib/api';
import type { NotificationSettings } from '@/lib/api';

export default function MemberNotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotificationSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field: keyof NotificationSettings) => {
    if (!settings) return;

    const newValue = !settings[field];
    const updated = { ...settings, [field]: newValue };

    try {
      setSaving(true);
      setError(null);
      const data = await updateNotificationSettings({ [field]: newValue });
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to update notification settings');
      // Revert on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Notifications" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div>
        <PageHeader title="Notifications" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Settings not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Notifications" />

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
        {/* Receipts for purchases */}
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Receipts for purchases
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.receiptsEmail}
                onChange={() => handleToggle('receiptsEmail')}
                disabled={saving}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 bg-gray-300"
              ></div>
            </label>
          </div>
          <div className="mt-2">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Email</p>
          </div>
        </div>

        {/* Waitlist Announcements */}
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Waitlist Announcements (spots reserved, expired, accepted, rejected)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.waitlistEmail}
                onChange={() => handleToggle('waitlistEmail')}
                disabled={saving}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 bg-gray-300"
              ></div>
            </label>
          </div>
          <div className="mt-2">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Email</p>
          </div>
        </div>

        {/* Class/Appointments/Rentals Notifications */}
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Class/Appointments/Rentals Notifications (Registration emails include calendar appointment attachment)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.classNotificationsEmail}
                onChange={() => handleToggle('classNotificationsEmail')}
                disabled={saving}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 bg-gray-300"
              ></div>
            </label>
          </div>
          <div className="mt-2">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Email</p>
          </div>
        </div>

        {/* Course attendance notifications */}
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Course attendance notifications (Registration emails include calendar appointment attachment)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.courseNotificationsEmail}
                onChange={() => handleToggle('courseNotificationsEmail')}
                disabled={saving}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 bg-gray-300"
              ></div>
            </label>
          </div>
          <div className="mt-2">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

