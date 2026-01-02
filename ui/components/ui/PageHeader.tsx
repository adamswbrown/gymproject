interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <h1
        className="text-4xl md:text-5xl font-bold uppercase mb-4"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="text-base max-w-2xl"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
