'use client';

import { useState, useEffect } from 'react';
import type { ScheduleResponse } from '@/lib/api';

interface ClassDetailModalProps {
  session: ScheduleResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onBook?: (sessionId: string) => void;
  isAuthenticated: boolean;
  isBooking?: boolean;
}

type TabType = 'overview' | 'venue' | 'coach';

// Icons - Matching TeamUp style
const OverviewIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M10 2L3 7V18H8V12H12V18H17V7L10 2Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={isActive ? 'currentColor' : 'none'}
      opacity={isActive ? 0.2 : 1}
    />
    <path 
      d="M10 2V7H17" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const VenueIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M10 10C11.3807 10 12.5 8.88071 12.5 7.5C12.5 6.11929 11.3807 5 10 5C8.61929 5 7.5 6.11929 7.5 7.5C7.5 8.88071 8.61929 10 10 10Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
      fill={isActive ? 'currentColor' : 'none'}
      opacity={isActive ? 0.2 : 1}
    />
    <path 
      d="M10 18.3333C13.3333 15 16.6667 11.6667 16.6667 7.5C16.6667 4.46243 14.2043 2 11.1667 2H8.83333C5.79577 2 3.33333 4.46243 3.33333 7.5C3.33333 11.6667 6.66667 15 10 18.3333Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
);

const CoachIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
      fill={isActive ? 'currentColor' : 'none'}
      opacity={isActive ? 0.2 : 1}
    />
    <path 
      d="M0 20C0 15.5817 4.47715 12 10 12C15.5228 12 20 15.5817 20 20" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function ClassDetailModal({ session, isOpen, onClose, onBook, isAuthenticated, isBooking = false }: ClassDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        style={{ 
          maxHeight: '90vh',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-start justify-between"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex-1">
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-dark)',
              }}
            >
              {session.classType.name}
            </h2>
            <div className="space-y-1">
              <p
                className="text-base"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {formatDate(session.startsAt)}, {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
              </p>
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-muted)',
                }}
              >
                All times Europe/London
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors ml-4"
            style={{
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="px-6 border-b flex gap-1"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          {(['overview', 'venue', 'coach'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-3 flex items-center gap-2 transition-colors relative"
              style={{
                fontFamily: 'var(--font-body)',
                color: activeTab === tab ? 'var(--color-text-dark)' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? 'var(--color-bg-secondary)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-light-gray)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab === 'overview' && <OverviewIcon isActive={activeTab === tab} />}
              {tab === 'venue' && <VenueIcon isActive={activeTab === tab} />}
              {tab === 'coach' && <CoachIcon isActive={activeTab === tab} />}
              <span className="capitalize">{tab}</span>
              {activeTab === tab && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: 'var(--color-accent-primary)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            {/* Left Panel */}
            <div className="flex-1 p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Coach Section */}
                  <div>
                    <h3
                      className="font-semibold mb-3"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-text-dark)',
                        fontSize: '16px',
                      }}
                    >
                      Coach:
                    </h3>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 600,
                          fontSize: '16px',
                        }}
                      >
                        {session.instructor.name ? getInitials(session.instructor.name) : 'IN'}
                      </div>
                      <p
                        className="text-base"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-dark)',
                        }}
                      >
                        {session.instructor.name || 'Instructor'}
                      </p>
                    </div>
                  </div>

                  {/* Event Details Section */}
                  <div>
                    <h3
                      className="font-semibold mb-3"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-text-dark)',
                        fontSize: '16px',
                      }}
                    >
                      Event Details:
                    </h3>
                    <p
                      className="text-base"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.6',
                      }}
                    >
                      25-minute coach led small group sessions
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Capacity:
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {session.confirmedCount} / {session.capacity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Available:
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {session.remainingCapacity} spots
                        </span>
                      </div>
                      {!session.registrationOpen && session.registrationCloseReason && (
                        <div className="mt-2">
                          <span
                            className="text-sm font-medium"
                            style={{ color: 'var(--color-accent-primary)' }}
                          >
                            {session.registrationCloseReason}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'venue' && (
                <div className="space-y-4">
                  <h3
                    className="font-semibold mb-3"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text-dark)',
                      fontSize: '16px',
                    }}
                  >
                    Venue Information:
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p
                        className="text-base font-medium mb-1"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-dark)',
                        }}
                      >
                        Main Studio
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Unit 54, 3 Balloo Dr, Bangor BT19 7QY
                      </p>
                    </div>
                    <div className="mt-4">
                      <p
                        className="text-sm mb-2"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Facilities:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li
                          className="text-sm"
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          Fully equipped fitness studio
                        </li>
                        <li
                          className="text-sm"
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          Changing rooms and showers
                        </li>
                        <li
                          className="text-sm"
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          Parking available
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'coach' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: '24px',
                      }}
                    >
                      {session.instructor.name ? getInitials(session.instructor.name) : 'IN'}
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-lg mb-1"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: 'var(--color-text-dark)',
                        }}
                      >
                        {session.instructor.name || 'Instructor'}
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Certified Fitness Instructor
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p
                      className="text-base"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.6',
                      }}
                    >
                      Experienced coach specializing in high-intensity interval training and small group fitness sessions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Registration Options */}
            <div
              className="w-80 p-6 border-l"
              style={{
                borderColor: 'var(--color-border-subtle)',
                backgroundColor: 'var(--color-bg-secondary)',
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-dark)',
                  fontSize: '16px',
                }}
              >
                Registration Options
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Membership
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-sm"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                    }}
                  >
                    <option>12 Month Membership</option>
                    <option>6 Month Membership</option>
                    <option>3 Month Membership</option>
                    <option>Drop-in Class</option>
                  </select>
                </div>
                {!session.registrationOpen && (
                  <div
                    className="p-3 rounded-sm mb-4"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-accent-primary)',
                    }}
                  >
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-accent-primary)',
                      }}
                    >
                      {session.registrationCloseReason || 'Registration is currently closed'}
                    </p>
                  </div>
                )}
                {session.registrationOpen && (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        window.location.href = `/login?redirect=/schedule`;
                        return;
                      }
                      if (onBook) {
                        onBook(session.id);
                      }
                    }}
                    disabled={isBooking || !session.registrationOpen}
                    className="w-full py-3 px-4 rounded-sm font-semibold uppercase transition-all duration-150"
                    style={{
                      backgroundColor: isBooking 
                        ? 'var(--color-bg-light-gray)' 
                        : 'var(--color-text-dark)',
                      color: isBooking 
                        ? 'var(--color-text-muted)' 
                        : '#FFFFFF',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      cursor: isBooking || !session.registrationOpen ? 'not-allowed' : 'pointer',
                      opacity: isBooking || !session.registrationOpen ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isBooking && session.registrationOpen) {
                        e.currentTarget.style.backgroundColor = '#333333';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isBooking && session.registrationOpen) {
                        e.currentTarget.style.backgroundColor = 'var(--color-text-dark)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {isBooking ? 'Booking...' : 'Book Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

