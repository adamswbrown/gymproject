interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <h1
        className="font-bold mb-4"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-dark)',
          fontSize: 'var(--font-size-h1)',
          lineHeight: 'var(--line-height-h1)',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="max-w-2xl"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-body)',
            lineHeight: 'var(--line-height-body)',
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
