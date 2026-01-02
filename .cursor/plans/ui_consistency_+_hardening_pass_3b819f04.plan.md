---
name: UI Consistency + Hardening Pass
overview: Standardize UI patterns, remove style drift, fix auth edge cases, and ensure API consistency across all Next.js pages without introducing new components or design changes.
todos:
  - id: standardize-state-blocks
    content: Standardize Loading/Error/Empty state blocks across all 7 pages (schedule, member bookings, admin class-types, admin sessions, admin instructors, instructor sessions, instructor roster)
    status: completed
  - id: remove-alert-calls
    content: Replace alert() calls in schedule/page.tsx and member/bookings/page.tsx with in-page error state blocks
    status: completed
  - id: fix-actionbutton-hover
    content: "Verify ActionButton hover behavior: disabled state never changes, secondary variant hover does not change border color"
    status: completed
  - id: fix-navbar-hover
    content: Replace imperative onMouseEnter/onMouseLeave in Navbar with Tailwind hover classes using CSS variables
    status: completed
  - id: standardize-inputs
    content: Verify input styling consistency across all forms (px-4 py-2, border colors, focus behavior)
    status: completed
  - id: schedule-filters-todo
    content: Add TODO comments to schedule filters for classTypeId and instructorId explaining why text inputs are used (no public endpoints)
    status: completed
  - id: standardize-api-naming
    content: "Rename API functions to getAdmin* pattern: getClassTypes → getAdminClassTypes, getSessions → getAdminSessions, remove duplicate getInstructors, update all imports"
    status: completed
  - id: standardize-empty-states
    content: "Update empty state text to blunt format: 'No sessions scheduled.', 'No bookings.', etc."
    status: completed
  - id: verify-route-protection
    content: Verify middleware handles all route protection and remove any client-side role checks that could cause content flashing
    status: completed
---

# UI Consistency + Hardening Pass

## Overview

This is a discipline and correctness sweep to standardize state rendering, remove inline style drift, fix auth/role edge cases, and unify API naming. No new components, animations, icons, toasts, or modals.

## Files to Update

### Pages

- `ui/app/schedule/page.tsx` - Public schedule with filters
- `ui/app/dashboard/member/bookings/page.tsx` - Member bookings
- `ui/app/dashboard/admin/class-types/page.tsx` - Admin class types
- `ui/app/dashboard/admin/sessions/page.tsx` - Admin sessions
- `ui/app/dashboard/admin/instructors/page.tsx` - Admin instructors
- `ui/app/dashboard/instructor/sessions/page.tsx` - Instructor sessions (placeholder)
- `ui/app/dashboard/instructor/sessions/[sessionId]/roster/page.tsx` - Instructor roster

### Components

- `ui/components/ui/ActionButton.tsx` - Fix hover behavior
- `ui/components/layout/Navbar.tsx` - Replace imperative hover with Tailwind

### API

- `ui/lib/api.ts` - Standardize function naming

## Implementation Details

### A) Standardize State Blocks

**Loading State Pattern** (apply to all pages):

```tsx
{loading && (
  <div 
    className="text-center py-12" 
    style={{ 
      color: 'var(--color-text-muted)', 
      fontFamily: 'var(--font-body)',
      opacity: 0.7,
    }}
  >
    Loading …
  </div>
)}
```

**Error State Pattern** (apply to all pages):

```tsx
{error && (
  <div 
    className="mb-6 p-4" 
    style={{ 
      backgroundColor: 'var(--color-bg-secondary)', 
      border: '1px solid var(--color-accent-primary)', 
      color: 'var(--color-accent-primary)', 
      fontFamily: 'var(--font-body)' 
    }}
  >
    {error}
  </div>
)}
```

**Empty State Pattern** (apply to all pages):

```tsx
{!loading && !error && items.length === 0 && (
  <div 
    className="text-center py-12" 
    style={{ 
      color: 'var(--color-text-muted)', 
      fontFamily: 'var(--font-body)',
      opacity: 0.7,
    }}
  >
    No [items] [action/state].
  </div>
)}
```

**Remove alert() calls**:

- Replace `alert()` in `schedule/page.tsx` (line 57) with local error state
- Replace `alert()` in `member/bookings/page.tsx` (line 40) with local error state
- Replace `confirm()` in `member/bookings/page.tsx` (line 32) - keep for now as it's a confirmation, not an error display

### B) Fix ActionButton Hover Behavior

In `ActionButton.tsx`:

- Ensure disabled state never changes on hover (already handled, verify)
- Ensure secondary variant hover does NOT change border color (currently changes bg only, which is correct)
- Verify styles revert correctly in all cases

### C) Replace Navbar Imperative Hover

In `Navbar.tsx`:

- Remove `onMouseEnter`/`onMouseLeave` from Link components (lines 39-40, 53-54)
- Add Tailwind `hover:` classes using CSS variables
- Use `hover:[color:var(--color-accent-primary)]` pattern

### D) Standardize Input Styling

Across all forms, ensure:

- `px-4 py-2` padding (already consistent)
- Same border color: `var(--color-border-subtle)`
- Same focus border color: `var(--color-accent-primary)`
- Same font: `var(--font-body)`
- Remove any extra helper text or verbose placeholders

**Note**: All inputs already use `onFocus`/`onBlur` for border color changes. This is acceptable as it's consistent across all forms.

### E) Schedule Filter Correctness

In `schedule/page.tsx`:

- Current: Text inputs for `classTypeId` and `instructorId` (lines 140-180)
- **Backend check**: `/public/schedule` exists, but no public endpoints for class types or instructors
- `/admin/class-types` and `/admin/instructors` require authentication
- **Action**: Keep text filters for now, add TODO comments:
  ```tsx
      // TODO: Replace with dropdown when public endpoints are available
      // Backend currently requires auth for /admin/class-types and /admin/instructors
  ```




### F) API Function Naming Consistency

In `lib/api.ts`:

- Current inconsistency:
- `getClassTypes()` - admin endpoint
- `getSessions()` - admin endpoint
- `getInstructors()` - admin endpoint (returns `Instructor[]`)
- `getAdminInstructors()` - admin endpoint (returns `AdminInstructor[]`)
- **Decision**: Standardize to Option 1 (with "Admin" prefix for clarity):
- `getAdminClassTypes()` (rename from `getClassTypes`)
- `getAdminSessions()` (rename from `getSessions`)
- `getAdminInstructors()` (keep, but remove duplicate `getInstructors`)
- Update all imports across pages

### G) Route Protection Verification

In `middleware.ts`:

- Already handles unauthenticated users → `/login` redirect
- Already handles authenticated users on `/login`/`register` → `/dashboard` redirect
- `/dashboard` page uses client-side redirect by role (acceptable for UX)

**Check for client-side role checks in pages**:

- Remove any client-side role checks that could cause content flashing
- Middleware + backend must handle access control

### H) Empty State Text Standardization

Update all empty states to use blunt copy:

- "No sessions scheduled." (not "No classes scheduled for this period.")
- "No bookings." (not "You have no bookings yet.")
- "No class types." (already correct)
- "No instructors." (already correct)

## Summary of Changes

1. **State Blocks**: Standardize Loading/Error/Empty across 7 pages
2. **Remove alert()**: Replace 2 instances with in-page error state
3. **ActionButton**: Verify hover behavior (likely no changes needed)
4. **Navbar**: Replace imperative hover with Tailwind classes
5. **Inputs**: Verify consistency (likely already consistent)
6. **Schedule Filters**: Add TODO comments for future dropdown implementation
7. **API Naming**: Rename functions to `getAdmin*` pattern, update imports
8. **Empty States**: Standardize copy to blunt format
9. **Route Protection**: Verify no client-side role checks causing flash

## Missing Endpoints (Documented)