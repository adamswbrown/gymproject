interface StatLabelProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatLabel({ label, value, className = '' }: StatLabelProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-sm uppercase tracking-wide" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        {label}
      </span>
      <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
        {value}
      </span>
    </div>
  );
}

