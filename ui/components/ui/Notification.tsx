'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Notification({ message, type, isVisible, onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'var(--color-accent-primary)';
      case 'error':
        return '#EF4444';
      case 'info':
        return '#3B82F6';
      default:
        return 'var(--color-bg-secondary)';
    }
  };

  const getTextColor = () => {
    return type === 'success' ? 'var(--color-text-dark)' : '#FFFFFF';
  };

  const notificationContent = (
    <div
      className="fixed"
      style={{
        top: '16px',
        right: '16px',
        zIndex: 10000,
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <div
        className="px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 min-w-[300px] max-w-md"
        style={{
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex-1">
          <p
            className="font-medium"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}
          >
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-sm transition-colors"
          style={{
            color: getTextColor(),
            opacity: 0.8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  // Use portal to render at document body level
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(notificationContent, document.body);
  }
  
  return null;
}

