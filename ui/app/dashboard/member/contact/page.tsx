'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { getContactInfo } from '@/lib/api';
import type { ContactInfo } from '@/lib/api';

export default function MemberContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContactInfo();
      setContactInfo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load contact information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Contact" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div>
        <PageHeader title="Contact" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Contact information not available
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`Contact ${contactInfo.address.city || 'Average Joe\'s Gym'}`} />

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
        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Email</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-lg"
                style={{ color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}
              >
                {contactInfo.email}
              </a>
            </div>
            <button className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              ℹ️
            </button>
          </div>
        </div>

        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Phone</p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-lg"
                style={{ color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}
              >
                {contactInfo.phone}
              </a>
            </div>
            <button className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              ℹ️
            </button>
          </div>
        </div>

        <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Address</p>
              <div className="text-lg" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                <p>{contactInfo.address.street}</p>
                <p>{contactInfo.address.line2}</p>
                <p>{contactInfo.address.city}</p>
                <p>{contactInfo.address.county}</p>
                <p>{contactInfo.address.postalCode}</p>
                <p>{contactInfo.address.country}</p>
              </div>
            </div>
            <button className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              ℹ️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

