'use client';

import { PageHeader } from '@/components/ui/PageHeader';

export default function InstructorSessionsPage() {
  return (
    <div>
      <PageHeader title="My Sessions" />
      <div className="p-8 text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Instructor session listing coming soon.
        </p>
      </div>
    </div>
  );
}

