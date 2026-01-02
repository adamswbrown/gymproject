'use client';

import { useState, useMemo } from 'react';
import { DatePicker } from './DatePicker';
import { ClassDetailModal } from './ClassDetailModal';
import { Notification } from './Notification';
import type { ScheduleResponse } from '@/lib/api';

// Calendar icon SVG component
const CalendarIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    {isActive ? (
      // Filled version for active state
      <>
        <path
          d="M12 2H4C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14H12C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2Z"
          fill="currentColor"
        />
        <path
          d="M2 6H14"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6 2V6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 2V6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ) : (
      // Outline version for inactive state
      <>
        <path
          d="M12 2H4C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14H12C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M2 6H14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6 2V6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 2V6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

type ViewMode = 'month' | 'week' | 'day';

interface CalendarViewProps {
  sessions: ScheduleResponse[];
  onBook?: (sessionId: string) => void;
  isAuthenticated: boolean;
}

export function CalendarView({ sessions, onBook, isAuthenticated }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedSession, setSelectedSession] = useState<ScheduleResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, ScheduleResponse[]> = {};
    sessions.forEach((session) => {
      const dateKey = new Date(session.startsAt).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(session);
    });
    return grouped;
  }, [sessions]);

  // Get calendar days for month view
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the Monday of the week containing the first day
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    // End on the Sunday of the week containing the last day
    const endDate = new Date(lastDay);
    const lastDayOfWeek = lastDay.getDay();
    const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    endDate.setDate(lastDay.getDate() + daysToAdd);
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  // Get week days for week view
  const weekDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    
    const firstDayOfWeek = new Date(year, month, date);
    const dayOfWeek = firstDayOfWeek.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    firstDayOfWeek.setDate(date - daysToSubtract);
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  }, [currentDate]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSessionClick = (session: ScheduleResponse) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleBook = async (sessionId: string) => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/schedule`;
      return;
    }

    try {
      setIsBooking(true);
      if (onBook) {
        await onBook(sessionId);
      }
      setNotification({
        message: 'Successfully booked class!',
        type: 'success',
      });
      // Close modal after successful booking
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error: any) {
      setNotification({
        message: error.message || 'Failed to book class. Please try again.',
        type: 'error',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const monthYearLabel = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderDayCell = (date: Date, isHeader = false) => {
    const dateKey = formatDateKey(date);
    const daySessions = sessionsByDate[dateKey] || [];
    const dayNumber = date.getDate();
    const isTodayDate = isToday(date);
    const isCurrentMonthDate = isCurrentMonth(date);

    return (
      <div
        key={dateKey}
        className={`flex flex-col ${
          isHeader ? 'border-b' : 'border-r border-b'
        }`}
        style={{
          borderColor: 'var(--color-border-subtle)',
          minHeight: isHeader ? 'auto' : '180px',
          backgroundColor: isHeader ? 'var(--color-bg-secondary)' : 'var(--color-bg-primary)',
        }}
      >
        {!isHeader && (
          <div
            className="px-3 py-2.5 text-base font-semibold border-b"
            style={{
              color: isTodayDate 
                ? 'var(--color-accent-primary)' 
                : isCurrentMonthDate 
                  ? 'var(--color-text-dark)' 
                  : 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
              fontWeight: isTodayDate ? 700 : 600,
              borderColor: 'var(--color-border-subtle)',
              backgroundColor: isTodayDate ? 'rgba(0, 255, 0, 0.05)' : 'transparent',
            }}
          >
            {dayNumber}
          </div>
        )}
        <div className="flex-1 px-2.5 pb-3 pt-2 space-y-2 overflow-y-auto" style={{ minHeight: '140px' }}>
          {daySessions.length === 0 ? (
            <div
              className="text-sm text-center py-6"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                opacity: 0.5,
              }}
            >
              No Events
            </div>
          ) : (
            daySessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                disabled={false}
                className="w-full text-left p-3 rounded transition-all duration-150"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: `1px solid var(--color-border-subtle)`,
                  color: 'var(--color-text-dark)',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  opacity: 1,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-light-gray)';
                  e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="font-bold mb-1.5 uppercase tracking-wide"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text-dark)',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    fontWeight: 700,
                  }}
                >
                  {session.classType.name}
                </div>
                <div
                  className="text-sm mb-1"
                  style={{ 
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    lineHeight: '1.5',
                  }}
                >
                  {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
                </div>
                <div
                  className="text-sm"
                  style={{ 
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    lineHeight: '1.5',
                  }}
                >
                  {session.instructor.name || 'Instructor'}
                </div>
                {session.remainingCapacity > 0 && session.registrationOpen && (
                  <div
                    className="text-xs mt-1.5"
                    style={{ 
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {session.remainingCapacity} available
                  </div>
                )}
                {!session.registrationOpen && session.registrationCloseReason && (
                  <div
                    className="text-xs mt-1.5 font-medium"
                    style={{ 
                      color: 'var(--color-accent-primary)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {session.registrationCloseReason}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Calendar Controls */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-5 py-2.5 uppercase font-medium rounded-sm transition-colors"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-dark)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
            }}
          >
            Today
          </button>
          <div 
            className="flex items-center" 
            style={{ 
              borderRadius: '6px', 
              overflow: 'hidden', 
              border: '1px solid var(--color-border-subtle)',
              backgroundColor: 'var(--color-bg-primary)',
            }}
          >
            {(['month', 'week', 'day'] as ViewMode[]).map((mode, index) => {
              const isFirst = index === 0;
              const isLast = index === (['month', 'week', 'day'] as ViewMode[]).length - 1;
              const isActive = viewMode === mode;
              
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="flex items-center gap-1.5 px-4 py-2.5 uppercase font-medium transition-all duration-150"
                  style={{
                    backgroundColor: isActive 
                      ? '#4A5568' // Dark blue-gray like in the image
                      : 'transparent',
                    borderLeft: !isFirst && !isActive ? '1px solid var(--color-border-subtle)' : 'none',
                    borderRight: !isLast && !isActive ? '1px solid var(--color-border-subtle)' : 'none',
                    color: isActive 
                      ? '#FFFFFF' 
                      : 'var(--color-text-dark)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: isActive ? 600 : 500,
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <CalendarIcon isActive={isActive} />
                  <span>{mode}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevious}
            className="px-4 py-2.5 rounded-sm transition-colors"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-dark)',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-light-gray)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }}
          >
            ←
          </button>
          <DatePicker
            value={currentDate}
            onChange={(date) => {
              setCurrentDate(date);
            }}
          />
          <button
            onClick={handleNext}
            className="px-4 py-2.5 rounded-sm transition-colors"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-dark)',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-light-gray)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div 
        className="border rounded-sm overflow-hidden" 
        style={{ 
          borderColor: 'var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg-primary)',
        }}
      >
        {/* Day Headers */}
        <div className="grid grid-cols-7">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="px-4 py-3 text-center font-semibold uppercase text-sm"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderRight: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-dark)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        {viewMode === 'month' && (
          <div className="grid grid-cols-7" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            {calendarDays.map((date) => renderDayCell(date))}
          </div>
        )}

        {viewMode === 'week' && (
          <div className="grid grid-cols-7" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            {weekDays.map((date) => renderDayCell(date))}
          </div>
        )}

        {viewMode === 'day' && (
          <div className="grid grid-cols-7" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            {[currentDate].map((date) => renderDayCell(date))}
          </div>
        )}
      </div>

      {/* Class Detail Modal */}
      <ClassDetailModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBook={handleBook}
        isAuthenticated={isAuthenticated}
        isBooking={isBooking}
      />

      {/* Notification - Always render, visibility controlled by isVisible prop */}
      <Notification
        message={notification?.message || ''}
        type={notification?.type || 'info'}
        isVisible={!!notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

