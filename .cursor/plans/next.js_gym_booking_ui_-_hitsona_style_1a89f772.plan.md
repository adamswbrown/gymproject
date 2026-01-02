---
name: Next.js Gym Booking UI - Hitsona Style
overview: Build a Next.js web UI for the existing NestJS gym booking API, matching the dark, high-contrast, performance gym aesthetic of hitsona.com/bangor. Implement design system, API client, auth state management, and role-based dashboards.
todos: []
---

# Next.js Gy

m Booking UI - Hitsona Style

## Overview

Build a Next.js web UI that matches the dark, high-contrast, performance gym aesthetic of hitsona.com/bangor. The UI must be bold, minimal, and confident - NOT a SaaS dashboard look.

## Design System Analysis (from hitsona.com/bangor)

**Visual Characteristics Observed:**

- Dark backgrounds (near-black, charcoal)

- High contrast text (white on dark)

- Bold, condensed typography for headings

- Minimal, functional design

- Strong accent colors (red/orange)

- No rounded corners, no shadows, no gradients

- Performance gym aesthetic - confident and bold

## Implementation Plan

### Phase 1: Project Setup & Design System

#### 1.1 Next.js Project Structure

```javascript
gym-booking-ui/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (public)/
│   │   └── schedule/
│   ├── dashboard/
│   │   ├── member/
│   │   │   └── bookings/
│   │   ├── instructor/
│   │   │   └── sessions/
│   │   └── admin/
│   │       ├── class-types/
│   │       ├── sessions/
│   │       └── instructors/
│   ├── layout.tsx
│   └── page.tsx (home/redirect)
├── components/
│   ├── ui/
│   │   ├── PageHeader.tsx
│   │   ├── Section.tsx
│   │   ├── ActionButton.tsx
│   │   ├── ScheduleCard.tsx
│   │   └── StatLabel.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── api.ts (ALL API calls)
│   └── auth.ts (auth state management)
├── hooks/
│   └── useAuth.ts
├── styles/
│   └── globals.css
├── tailwind.config.ts
└── next.config.js
```



#### 1.2 Design System Implementation

**Tailwind Configuration:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0B0B',    // near-black
          secondary: '#151515',  // dark charcoal
        },
        text: {
          primary: '#FFFFFF',    // white
          muted: '#B5B5B5',      // grey
        },
        accent: {
          primary: '#E63946',    // strong red
          hover: '#FF4D5A',      // brighter red
        },
        border: {
          subtle: '#2A2A2A',     // subtle dark
        },
      },
      fontFamily: {
        heading: ['Oswald', 'Anton', 'sans-serif'], // condensed, strong
        body: ['Inter', 'Roboto', 'sans-serif'],     // neutral sans-serif
      },
    },
  },
}
```



**CSS Variables (Alternative/Additional):**

```css
:root {
  --bg-primary: #0B0B0B;
  --bg-secondary: #151515;
  --text-primary: #FFFFFF;
  --text-muted: #B5B5B5;
  --accent-primary: #E63946;
  --accent-hover: #FF4D5A;
  --border-subtle: #2A2A2A;
}
```

**Typography:**

- Headings: `font-heading` (Oswald/Anton) - bold, condensed, uppercase

- Body: `font-body` (Inter/Roboto) - regular weight

- Large weight contrast between headings and body

**Button Style:**

- Solid accent background (`bg-accent-primary`)

- Square or very slight rounding (`rounded-sm` or `rounded-none`)

- Bold uppercase labels (`uppercase font-bold`)

- No gradients, minimal icons

- Hover: `bg-accent-hover`

### Phase 2: API Client & Auth

#### 2.1 API Client (`lib/api.ts`)

**Structure:**

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper: Get auth token from storage
// Helper: Make request with auth header
// Helper: Handle API response (throw if ok=false)

// Functions:
- login(email, password) → { accessToken, user }
- register(email, password, name?) → { accessToken, user }
- getMe() → UserResponseDto
- getPublicSchedule(filters) → ScheduleResponseDto[]
- getMyBookings() → BookingResponseDto[]
- createBooking(sessionId) → BookingResponseDto
- cancelBooking(bookingId) → BookingResponseDto
```



**Error Handling:**

- If API returns `{ ok: false, error: { code, message } }` → throw error

- Error object includes `code` and `message` for display

#### 2.2 Auth State Management (`lib/auth.ts`)

**Implementation:**

- Token stored in `localStorage` + React state

- `useAuth` hook for auth state
- Login/logout functions

- Token refresh handling (if needed)

- Auth-aware navigation guards

**Hook:**

```typescript
// hooks/useAuth.ts
- user: User | null
- token: string | null
- login(email, password)
- register(email, password, name?)
- logout()
- isAuthenticated: boolean
- isLoading: boolean
```



### Phase 3: Reusable Components

#### 3.1 UI Components

**PageHeader.tsx:**

- Large, bold heading

- Optional subtitle

- Dark background

- Condensed font

**Section.tsx:**

- Container with dark background

- Padding/spacing

- Optional title

**ActionButton.tsx:**

- Solid accent background

- Square/slight rounding

- Uppercase, bold text

- Hover state

- Disabled state

**ScheduleCard.tsx:**

- Flat rectangular card

- Dark background

- Border (subtle)

- Class name, time, instructor

- Capacity info (from API)

- Primary action button

- No shadows, no rounded corners

**StatLabel.tsx:**

- Small label for capacity/status
- Muted text color

- Clear value display

### Phase 4: Pages Implementation

#### 4.1 Public Schedule (`/schedule`)

**Design:**

- Dark background (`bg-bg-primary`)

- Large heading: "CLASS SCHEDULE" (condensed, uppercase)

- Minimal horizontal filters:

- Date range (from/to)

- Class type dropdown

- Instructor dropdown

- Flat rectangular schedule cards

- Each card shows:

- Class name (bold)

- Time (startsAt - endsAt)

- Instructor name

- Capacity: "X / Y spots" (from API)

- Status: registrationOpen/closed

- Primary "BOOK" button

**Behavior:**

- If unauthenticated → "BOOK" redirects to `/login?redirect=/schedule`

- Use API data exactly (no client-side capacity calculation)

- Display error messages from API verbatim

**Implementation:**

- Server component for initial data fetch

- Client component for filters and booking actions

- Error boundary for API errors

#### 4.2 Auth Pages

**Login (`/login`):**

- Centered, minimal layout

- Dark background

- Strong heading: "LOG IN"

- Form:

- Email input

- Password input
- Primary "LOG IN" button

- Error message display (from API)

- Link to register

- Redirect after login (check `redirect` query param)

**Register (`/register`):**

- Similar to login

- Heading: "JOIN US"

- Form:

- Email input

- Password input (min 8 chars)

- Name input (optional)

- Primary "REGISTER" button

- Error message display

- Link to login

#### 4.3 Member Dashboard

**Route:** `/dashboard/member/bookings`

**Design:**

- Dark background

- Heading: "MY BOOKINGS"

- List of bookings as flat blocks

- Each booking shows:

- Class name (bold)

- Date/time (formatted)

- Instructor name

- Status (CONFIRMED/CANCELLED)

- Cancel deadline (if applicable)

- Cancel button (enabled/disabled as UX hint only)

- Empty state if no bookings

**Behavior:**

- Cancel button:

- Enabled/disabled based on cancellation cutoff (UX hint)

- Backend is source of truth (may still reject)

- Display backend error messages verbatim

#### 4.4 Instructor Dashboard

**Route:** `/dashboard/instructor/sessions`**Design:**

- Dark background

- Heading: "MY SESSIONS"

- List of own sessions

- Each session shows:

- Class name
- Date/time

- Capacity info
- "VIEW ROSTER" button

- Click to view roster (modal or separate page)

- Roster shows:

- Member names only

- No extra data

#### 4.5 Admin Dashboard

**Routes:**

- `/dashboard/admin/class-types`

- `/dashboard/admin/sessions`

- `/dashboard/admin/instructors`

**Design:**

- Functional, not flashy

- Same dark aesthetic

- Flat lists

- Inline actions (Edit/Delete)

- Basic CRUD forms

- Minimal styling

### Phase 5: Navigation & Layout

#### 5.1 Layout Components

**Navbar:**

- Dark background

- Logo/brand name
- Navigation links (role-based)

- Auth status (Login/Logout)

- Minimal, functional

**Footer:**

- Dark background
- Minimal content

- Contact info (if needed)

#### 5.2 Route Protection

**Middleware/Guards:**

- Unauthenticated users → blocked from `/dashboard/*`

- Authenticated users → blocked from `/login` and `/register`

- Role-based redirects:

- `/dashboard` → redirect to role-specific dashboard
- MEMBER → `/dashboard/member/bookings`

- INSTRUCTOR → `/dashboard/instructor/sessions`

- ADMIN → `/dashboard/admin/class-types`

### Phase 6: Error Handling

#### 6.1 Error Display

**Error Message Component:**

- Display backend error messages verbatim

- Map error codes to simple copy:

- `CAPACITY_FULL` → "Class is full"

- `REGISTRATION_CLOSED` → Use backend message

- `CANCELLATION_CUTOFF_PASSED` → Use backend message

- `DUPLICATE_BOOKING` → Use backend message

- Red accent color for errors

- Clear, minimal styling

**Error Boundaries:**

- Catch API errors

- Display user-friendly messages

- Log errors for debugging

## Implementation Order

1. **Setup & Design System** (Phase 1)

- Initialize Next.js project

- Configure Tailwind with design system

- Set up folder structure

- Create base components

2. **API Client & Auth** (Phase 2)

- Implement `lib/api.ts`

- Implement `lib/auth.ts` and `useAuth` hook

- Test API connectivity

3. **Reusable Components** (Phase 3)

- Build all UI components

- Ensure they match Hitsona aesthetic

4. **Public Schedule** (Phase 4.1)

- Implement `/schedule` page

- Test with real API

- Handle errors

5. **Auth Pages** (Phase 4.2)

- Implement login/register

- Test auth flow

- Implement redirects

6. **Member Dashboard** (Phase 4.3)

- Implement bookings page

- Test booking/cancellation

7. **Instructor Dashboard** (Phase 4.4)

- Basic implementation

- Session listing

- Roster view

8. **Admin Dashboard** (Phase 4.5)

- Basic CRUD for class types

- Basic CRUD for sessions

- Basic CRUD for instructors

9. **Navigation & Polish** (Phase 5)

- Implement navbar/footer

- Route protection

- Final styling adjustments

## Design Matching Notes

**How UI Matches hitsona.com/bangor:**

1. **Color Palette:**

- Dark backgrounds (near-black, charcoal) ✅

- High contrast text (white on dark) ✅

- Strong accent color (red/orange) ✅

- No blue, no pastels ✅

2. **Typography:**

- Condensed, bold headings (Oswald/Anton) ✅

- Neutral body font (Inter/Roboto) ✅

- Large weight contrast ✅

3. **Visual Style:**

- No rounded corners (square/slight rounding) ✅

- No shadows ✅

- No gradients ✅

- Flat, minimal design ✅

- Bold, confident aesthetic ✅

4. **Buttons:**

- Solid accent background ✅

- Uppercase, bold labels ✅

- Square/slight rounding ✅

- No icons unless necessary ✅

5. **Overall Tone:**

- Performance gym aesthetic ✅

- Confident, bold, minimal ✅

- NOT SaaS dashboard ✅

- NOT enterprise software ✅

## Key Files to Create

### Core Files

- `lib/api.ts` - All API calls

- `lib/auth.ts` - Auth utilities

- `hooks/useAuth.ts` - Auth hook

- `tailwind.config.ts` - Design system

- `app/layout.tsx` - Root layout

### Components

- `components/ui/PageHeader.tsx`

- `components/ui/Section.tsx`

- `components/ui/ActionButton.tsx`

- `components/ui/ScheduleCard.tsx`

- `components/ui/StatLabel.tsx`

- `components/layout/Navbar.tsx`

- `components/layout/Footer.tsx`

### Pages

- `app/schedule/page.tsx`
- `app/login/page.tsx`

- `app/register/page.tsx`

- `app/dashboard/member/bookings/page.tsx`

- `app/dashboard/instructor/sessions/page.tsx`

- `app/dashboard/admin/class-types/page.tsx`

- `app/dashboard/admin/sessions/page.tsx`

- `app/dashboard/admin/instructors/page.tsx`

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```



## Testing Strategy

- Test API client with mock responses
- Test auth flow (login/logout)

- Test route protection

- Test error handling

- Visual testing against Hitsona reference

## Definition of Done

- [ ] Design system implemented and matches Hitsona aesthetic

- [ ] API client handles all endpoints

- [ ] Auth state management working

- [ ] Public schedule page functional

- [ ] Login/register pages working

- [ ] Member dashboard functional

- [ ] Instructor dashboard functional

- [ ] Admin dashboard functional (basic CRUD)

- [ ] Route protection working

- [ ] Error handling displays backend messages