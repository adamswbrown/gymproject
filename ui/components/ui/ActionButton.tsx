interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function ActionButton({ 
  children, 
  variant = 'primary',
  className = '',
  disabled,
  ...props 
}: ActionButtonProps) {
  const baseClasses = 'px-6 py-3 font-bold uppercase tracking-wide';
  const variantClasses = variant === 'primary'
    ? 'disabled:opacity-50 disabled:cursor-not-allowed'
    : 'border disabled:opacity-50 disabled:cursor-not-allowed';
  const rounding = 'rounded-sm';
  
  const style = variant === 'primary'
    ? {
        backgroundColor: 'var(--color-accent-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
      }
    : {
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        borderColor: 'var(--color-border-subtle)',
        fontFamily: 'var(--font-body)',
      };
  
  const hoverStyle = variant === 'primary'
    ? { backgroundColor: 'var(--color-accent-hover)' }
    : { backgroundColor: 'var(--color-bg-primary)' };

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${rounding} ${className}`}
      style={style}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, style);
        }
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
