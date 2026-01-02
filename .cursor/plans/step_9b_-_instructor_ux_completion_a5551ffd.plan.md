---
name: Step 9B - Instructor UX Completion
overview: Replace instructor placeholder page with real sessions list, ensure roster page consistency with Step 9A patterns, and add missing API functions for instructor endpoints.
todos:
  - id: add-instructor-api
    content: Add getInstructorMySessions() function to lib/api.ts calling /instructors/me/sessions
    status: pending
  - id: replace-sessions-placeholder
    content: Replace instructor sessions placeholder page with real data-driven list using Step 9A patterns
    status: pending
    dependencies:
      - add-instructor-api
  - id: fix-roster-consistency
    content: "Ensure roster page follows Step 9A patterns: move metadata outside Section, fix error block className order"
    status: pending
  - id: add-roster-navigation
    content: Add Link-wrapped ActionButton for VIEW ROSTER navigation in sessions list
    status: pending
    dependencies:
      - replace-sessions-placeholder
---

# Step 9B - Instructor UX Completion

## Overview

Complete the instructor UX by replacing the placeholder sessions page with a real data-driven list, ensuring roster page consistency with Step 9A patterns, and adding missing API functions.

## Files to Update

### Pages

- `ui/app/dashboard/instructor/sessions/page.tsx` - Replace placeholder with real sessions list

- `ui/app/dashboard/instructor/sessions/[sessionId]/roster/page.tsx` - Ensure Step 9A consistency

### API

- `ui/lib/api.ts` - Add `getInstructorMySessions()` function if missing

## Implementation Details

### A) Instructor Sessions Page

**File**: `ui/app/dashboard/instructor/sessions/page.tsx`

**Structure**:

- PageHeader with title: "MY SESSIONS"

- One Section wrapping the list

- Standard Loading/Error/Empty state blocks (Step 9A pattern)

**Data Loading**:

- Add `getInstructorMySessions()` to `lib/api.ts` calling `/instructors/me/sessions`

- Use `useState` and `useEffect` for data loading

- Use `useAuth()` only for token presence, no role checks

- No direct `fetch()` calls

**Rendering** (flat vertical list):

Each session item displays:

- Class name (bold, heading font)
- Metadata line (muted, body font):

`<DATE> <START–END> • capacity <N> • <STATUS>`

- Location on separate line (if present, muted)

- Registration window on separate line (if present, muted)

- ActionButton wrapped in Link:

  ```tsx
    <Link href={`/dashboard/instructor/sessions/${session.id}/roster`}>
      <ActionButton variant="secondary">VIEW ROSTER</ActionButton>
    </Link>
  ```



**States**:

- Loading: "Loading …" (text-center py-12, opacity 0.7)

- Error: Backend message verbatim (mb-6 p-4, bg-secondary, border accent-primary)

- Empty: "No sessions scheduled." (text-center py-12, opacity 0.7)

### B) Instructor Roster Page

**File**: `ui/app/dashboard/instructor/sessions/[sessionId]/roster/page.tsx`**Changes**:

1. Move session metadata outside Section (directly under PageHeader)

- Format: `<Class Name> • <DATE> • <START–END>`

- Muted text, body font

2. Section contains only roster list

3. Ensure Error state uses Step 9A pattern (mb-6 p-4, not p-4 mb-6 border)

4. Empty state: "No members booked." (already correct)

**Current state**: Already mostly compliant, needs minor adjustments:

- Error block className order (should be `mb-6 p-4` not `p-4 mb-6 border`)

- Session metadata should be outside Section

### C) API Function Addition

**File**: `ui/lib/api.ts`

**Add function**:

```typescript
export async function getInstructorMySessions(): Promise<Session[]> {
  return request<Session[]>('/instructors/me/sessions');
}
```



**Notes**:

- Uses existing `/instructors/me/sessions` endpoint (backend TODO, but route exists)

- Returns `Session[]` type (same as admin sessions)

- Uses same `request()` helper with JWT token from storage

- Error handling matches existing pattern

### D) Date/Time Formatting

Reuse existing formatting patterns from admin sessions page:

- `formatDate()`: weekday, month, day

- `formatTime()`: hour:minute AM/PM

- `formatDateTime()`: for registration windows

## Backend Endpoint Status

**Existing endpoints** (routes exist, implementations are TODOs):

- `/instructors/me/sessions` - Returns empty array (TODO in backend)

- `/instructors/sessions/:id/roster` - Returns empty object (TODO in backend)

**Action**: Use these endpoints as-is. UI will work once backend implements them.

## Summary of Changes

1. **Instructor Sessions Page**: Replace placeholder with real list using `/instructors/me/sessions`

2. **Roster Page**: Minor adjustments for Step 9A consistency

3. **API Function**: Add `getInstructorMySessions()` to `lib/api.ts`

4. **Navigation**: Use Next.js `<Link>` component for roster navigation

5. **State Blocks**: Enforce Step 9A standardized patterns

## Constraints

- No new UI components

- No cards, tables, icons, modals, toasts, animations