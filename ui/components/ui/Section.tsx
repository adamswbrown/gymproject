interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Section({ children, title, className = '' }: SectionProps) {
  return (
    <section
      className={`p-6 md:p-8 ${className}`}
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {title && (
        <h2
          className="text-2xl font-bold mb-6"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}
