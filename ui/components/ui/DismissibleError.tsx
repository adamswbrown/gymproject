'use client';

import { useState } from 'react';

interface DismissibleErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function DismissibleError({ message, onDismiss }: DismissibleErrorProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className="mb-6 p-4 relative"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-accent-primary)',
        color: 'var(--color-accent-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--color-accent-primary)' }}
        aria-label="Dismiss error"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {message}
    </div>
  );
}

