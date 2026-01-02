'use client';

interface ModalFooterProps {
  children: React.ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div
      className="flex items-center justify-end gap-4 pt-6 mt-6 border-t"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      {children}
    </div>
  );
}

