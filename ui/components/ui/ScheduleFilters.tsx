'use client';

import { useState } from 'react';

interface ClassType {
  id: string;
  name: string;
}

interface Instructor {
  id: string;
  name: string;
}

interface ScheduleFiltersProps {
  classTypes: ClassType[];
  instructors: Instructor[];
  selectedClassTypes: string[];
  selectedInstructors: string[];
  onClassTypeToggle: (id: string) => void;
  onInstructorToggle: (id: string) => void;
  onClearFilters: () => void;
}

// Filter icon SVG
const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 4H14M4 8H12M6 12H10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Chevron icon SVG
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ScheduleFilters({
  classTypes,
  instructors,
  selectedClassTypes,
  selectedInstructors,
  onClassTypeToggle,
  onInstructorToggle,
  onClearFilters,
}: ScheduleFiltersProps) {
  const [coachesOpen, setCoachesOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);

  const hasActiveFilters = selectedClassTypes.length > 0 || selectedInstructors.length > 0;

  return (
    <div
      className="w-64 flex-shrink-0 h-full overflow-y-auto"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Filter Header */}
      <div
        className="p-4 border-b flex items-center gap-2"
        style={{
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        <FilterIcon />
        <h3
          className="font-semibold"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-dark)',
            fontSize: '16px',
          }}
        >
          Filter
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto text-xs px-2 py-1 rounded-sm transition-colors"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-light-gray)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Coaches Section */}
      <div>
        <button
          onClick={() => setCoachesOpen(!coachesOpen)}
          className="w-full p-4 border-b flex items-center justify-between transition-colors"
          style={{
            borderColor: 'var(--color-border-subtle)',
            backgroundColor: coachesOpen ? 'var(--color-bg-primary)' : 'transparent',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!coachesOpen) {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!coachesOpen) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-dark)',
              fontSize: '14px',
            }}
          >
            Coaches
          </span>
          <ChevronIcon isOpen={coachesOpen} />
        </button>

        {coachesOpen && (
          <div className="p-2">
            {instructors.length === 0 ? (
              <div
                className="p-3 text-sm"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                No instructors available
              </div>
            ) : (
              <div className="space-y-1">
                {instructors.map((instructor) => {
                  const isSelected = selectedInstructors.includes(instructor.id);
                  return (
                    <label
                      key={instructor.id}
                      className="flex items-center gap-3 p-2 rounded-sm cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--color-bg-light-gray)'
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onInstructorToggle(instructor.id)}
                        className="w-4 h-4 cursor-pointer"
                        style={{
                          accentColor: 'var(--color-accent-primary)',
                        }}
                      />
                      <span
                        className="text-sm flex-1"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-dark)',
                        }}
                      >
                        {instructor.name || 'Instructor'}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Events Section */}
      <div>
        <button
          onClick={() => setEventsOpen(!eventsOpen)}
          className="w-full p-4 border-b flex items-center justify-between transition-colors"
          style={{
            borderColor: 'var(--color-border-subtle)',
            backgroundColor: eventsOpen ? 'var(--color-bg-primary)' : 'transparent',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!eventsOpen) {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!eventsOpen) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-dark)',
              fontSize: '14px',
            }}
          >
            Events
          </span>
          <ChevronIcon isOpen={eventsOpen} />
        </button>

        {eventsOpen && (
          <div className="p-2">
            {classTypes.length === 0 ? (
              <div
                className="p-3 text-sm"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                No class types available
              </div>
            ) : (
              <div className="space-y-1">
                {classTypes.map((classType) => {
                  const isSelected = selectedClassTypes.includes(classType.id);
                  return (
                    <label
                      key={classType.id}
                      className="flex items-center gap-3 p-2 rounded-sm cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--color-bg-light-gray)'
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onClassTypeToggle(classType.id)}
                        className="w-4 h-4 cursor-pointer"
                        style={{
                          accentColor: 'var(--color-accent-primary)',
                        }}
                      />
                      <span
                        className="text-sm flex-1"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-dark)',
                        }}
                      >
                        {classType.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

