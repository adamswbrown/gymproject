# Gym Booking System

A full-stack gym booking application with NestJS backend and Next.js frontend.

## Structure

- `api/` - NestJS backend API
- `ui/` - Next.js frontend application

## Getting Started

### Backend (API)

```bash
cd api
npm install
npm run start:dev
```

### Frontend (UI)

```bash
cd ui
npm install
npm run dev
```

## Tech Stack

- **Backend**: NestJS, Prisma, MySQL
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS

## Test Users

The following test accounts are available for development and testing:

### Member Account

A member account has been created for testing class bookings:

- **Email:** `member@example.com`
- **Password:** `password123`
- **Name:** Test Member
- **Role:** MEMBER
- **User ID:** `83e0fc9b-cd5e-414e-8c02-d4a9e894e5db`

**Usage:**
1. Navigate to `http://localhost:3000/login`
2. Log in with the credentials above
3. Browse the schedule at `http://localhost:3000/schedule`
4. Book available classes by clicking the "Book" button

### Creating Additional Test Users

You can create additional test users via the registration API:

```bash
# Create a new member account
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password",
    "name": "Your Name"
  }'
```

**Note:** All users registered via the `/auth/register` endpoint are automatically assigned the `MEMBER` role. To create ADMIN or INSTRUCTOR accounts, you'll need to update the user role directly in the database or use admin endpoints (if available).

### User Roles

- **MEMBER** - Can view schedules and book/cancel classes
- **INSTRUCTOR** - Can view their assigned sessions and rosters
- **ADMIN** - Full access to all endpoints and administrative functions
