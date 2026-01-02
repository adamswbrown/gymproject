'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';

export default function FormsAndWaiversPage() {
  const forms = [
    {
      id: '1',
      name: 'Membership Agreement',
      description: 'Complete your membership agreement form',
      status: 'Available',
    },
    {
      id: '2',
      name: 'Health & Safety Waiver',
      description: 'Sign the health and safety waiver',
      status: 'Available',
    },
    {
      id: '3',
      name: 'Photo Release Form',
      description: 'Grant permission for photo usage',
      status: 'Available',
    },
  ];

  return (
    <div>
      <PageHeader title="Forms and Waivers" />

      <div className="mb-6" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        Please complete the following forms and waivers.
      </div>

      <div className="space-y-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="p-6"
            style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                  {form.name}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{form.description}</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Status: {form.status}
                </p>
              </div>
              <div className="flex-shrink-0">
                <ActionButton variant="primary">Start</ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

