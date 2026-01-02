'use client';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'scheduled' | 'cancelled';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      color: '#4A7C4A',
      bgColor: 'rgba(74, 124, 74, 0.15)',
      defaultLabel: 'Active',
    },
    inactive: {
      color: 'var(--color-text-muted)',
      bgColor: 'rgba(107, 107, 107, 0.15)',
      defaultLabel: 'Inactive',
    },
    scheduled: {
      color: '#4A7C4A',
      bgColor: 'rgba(74, 124, 74, 0.15)',
      defaultLabel: 'Scheduled',
    },
    cancelled: {
      color: '#A03A2D',
      bgColor: 'rgba(160, 58, 45, 0.15)',
      defaultLabel: 'Cancelled',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className="inline-block px-3 py-1 text-xs font-semibold"
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        fontFamily: 'var(--font-body)',
        borderRadius: '3px',
      }}
    >
      {label || config.defaultLabel}
    </span>
  );
}

