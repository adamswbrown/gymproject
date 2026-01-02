# Gym Booking UI - Hitsona Style

A Next.js web UI for the gym booking API, designed to match the dark, high-contrast, performance gym aesthetic of hitsona.com/bangor.

## Design System

### Color Palette
- **Background Primary**: `#0B0B0B` (near-black)
- **Background Secondary**: `#151515` (dark charcoal)
- **Text Primary**: `#FFFFFF` (white)
- **Text Muted**: `#B5B5B5` (grey)
- **Accent Primary**: `#E63946` (strong red)
- **Accent Hover**: `#FF4D5A` (brighter red)
- **Border Subtle**: `#2A2A2A` (subtle dark)

### Typography
- **Headings**: Oswald (condensed, bold, uppercase)
- **Body**: Inter (neutral sans-serif)

### Design Principles
- Dark, high-contrast aesthetic
- No rounded corners (square/slight rounding only)
- No shadows
- No gradients
- Bold, confident, minimal
- Performance gym aesthetic (NOT SaaS dashboard)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
gym-booking-ui/
├── app/
│   ├── (auth)/          # Auth routes (login, register)
│   ├── (public)/        # Public routes (schedule)
│   ├── dashboard/       # Protected dashboard routes
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # Reusable UI components
│   └── layout/          # Layout components (Navbar, Footer)
├── lib/
│   └── api.ts           # ALL API calls go through here
├── hooks/
│   └── useAuth.ts       # Auth state management hook
└── middleware.ts        # Route protection
```

## API Client

All API calls are centralized in `lib/api.ts`:

- `login(email, password)` - Authenticate user
- `register(email, password, name?)` - Create new user
- `getMe()` - Get current user profile
- `getPublicSchedule(filters)` - Get public class schedule
- `getMyBookings()` - Get user's bookings
- `createBooking(sessionId)` - Book a class
- `cancelBooking(bookingId)` - Cancel a booking
- `logout()` - Clear auth token

**Error Handling:**
- All API errors are thrown with `code` and `message` properties
- Frontend displays backend error messages verbatim
- No client-side business logic

## Authentication

- JWT tokens stored in `localStorage`
- `useAuth` hook provides auth state
- Route protection via middleware
- Automatic redirects based on auth status

## Pages

### Public Schedule (`/schedule`)
- View all available classes
- Filter by date, class type, instructor
- Book classes (redirects to login if not authenticated)
- Uses API data exactly (no client-side calculations)

### Login (`/login`)
- Email/password authentication
- Redirects to dashboard after login
- Supports `redirect` query parameter

### Register (`/register`)
- Create new member account
- Always creates MEMBER role (backend enforced)
- Redirects to dashboard after registration

### Member Dashboard (`/dashboard/member/bookings`)
- View all bookings
- Cancel bookings (with cutoff enforcement)
- Shows class details, instructor, status

### Instructor Dashboard (`/dashboard/instructor/sessions`)
- View own sessions (placeholder)

### Admin Dashboard (`/dashboard/admin/*`)
- Class types management (placeholder)
- Sessions management (placeholder)
- Instructors management (placeholder)

## Route Protection

- Unauthenticated users → blocked from `/dashboard/*`
- Authenticated users → blocked from `/login` and `/register`
- Role-based redirects from `/dashboard`

## Error Handling

Backend error messages are displayed verbatim. Common error codes:
- `CAPACITY_FULL` → "Class is full"
- `REGISTRATION_CLOSED` → Backend message
- `CANCELLATION_CUTOFF_PASSED` → Backend message
- `DUPLICATE_BOOKING` → Backend message

## Design Matching Notes

**How UI Matches hitsona.com/bangor:**

1. **Color Palette**: Dark backgrounds, high contrast, red accent
2. **Typography**: Condensed headings (Oswald), neutral body (Inter)
3. **Visual Style**: Square corners, no shadows, flat design
4. **Buttons**: Solid accent background, uppercase, bold
5. **Overall Tone**: Performance gym aesthetic, confident, minimal

## Development

```bash
# Development server
npm run dev

# Build
npm run build

# Production server
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000)
