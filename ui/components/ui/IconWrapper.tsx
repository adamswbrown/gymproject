'use client';

interface IconWrapperProps {
  children: React.ReactNode;
  size?: number;
  className?: string;
}

export function IconWrapper({ children, size = 30, className = '' }: IconWrapperProps) {
  return (
    <div 
      className={`flex-shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {children}
    </div>
  );
}

