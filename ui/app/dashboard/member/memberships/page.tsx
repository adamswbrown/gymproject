'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getMemberships, getMembershipDetails } from '@/lib/api';
import type { MembershipResponse } from '@/lib/api';

export default function MemberMembershipsPage() {
  const [memberships, setMemberships] = useState<MembershipResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMemberships();
      setMemberships(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'var(--color-accent-primary)';
      case 'EXPIRED':
        return 'var(--color-text-muted)';
      case 'CANCELLED':
        return 'var(--color-text-muted)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Memberships" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Memberships" />

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

      <div className="space-y-4">
        {memberships.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            No memberships found.
          </div>
        ) : (
          memberships.map((membership) => (
            <div
              key={membership.id}
              className="p-6"
              style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      {membership.membershipType}
                    </h3>
                    <span
                      className="px-3 py-1 text-sm font-semibold"
                      style={{
                        backgroundColor: getStatusColor(membership.status),
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {membership.status}
                    </span>
                  </div>
                  <div className="space-y-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    <p>
                      {formatDate(membership.startDate)} {membership.endDate && `- ${formatDate(membership.endDate)}`}
                    </p>
                    {membership.paymentMethod && (
                      <p>
                        Credit Card payment via card ending in {membership.paymentMethod.slice(-4)}
                        {membership.lastPaymentDate && ` (Last payment: ${formatDate(membership.lastPaymentDate)})`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <ActionButton variant="secondary" onClick={() => window.location.href = `/dashboard/member/memberships/${membership.id}`}>
                    Details
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

