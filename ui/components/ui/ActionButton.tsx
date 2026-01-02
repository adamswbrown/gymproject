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
  const baseClasses = 'font-bold disabled:opacity-50 disabled:cursor-not-allowed';
  
  const style = variant === 'primary'
    ? {
        backgroundColor: 'var(--color-button-primary-bg)',
        color: 'var(--color-button-primary-text)',
        fontFamily: 'var(--font-body)',
        fontSize: '16px',
        fontWeight: '600',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderRadius: '4px',
        textTransform: 'none',
        border: 'none',
        cursor: 'pointer',
      }
    : {
        backgroundColor: 'var(--color-button-secondary-bg)',
        color: 'var(--color-button-secondary-text)',
        fontFamily: 'var(--font-body)',
        fontSize: '16px',
        fontWeight: '600',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderRadius: '4px',
        textTransform: 'none',
        border: 'none',
        cursor: 'pointer',
      };
  
  const hoverStyle = variant === 'primary'
    ? { backgroundColor: 'var(--color-accent-hover)', opacity: 1 }
    : { opacity: 0.85 };

  return (
    <button
      className={`${baseClasses} ${className}`}
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
