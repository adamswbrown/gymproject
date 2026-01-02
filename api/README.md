# Gym Booking API

A NestJS + Prisma backend API for a TeamUp-style gym booking system. This API provides secure authentication, role-based access control, and comprehensive booking management.

## Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - ADMIN, INSTRUCTOR, and MEMBER roles
- **Public Schedule Browsing** - No authentication required to view available classes
- **Booking Management** - Members can book and cancel classes with business rule enforcement
- **Transaction Safety** - All booking operations are atomic and race-condition safe
- **UTC Time Handling** - All time comparisons use UTC for consistency

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **MySQL** - Database (MAMP default: port 8889)
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **class-validator** - Request validation

## Prerequisites

- Node.js (v18+)
- MySQL (MAMP or standalone)
- npm or yarn

## Installation

1. Clone the repository:
```bash
cd /Users/adambrown/Developer/gym-booking-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="mysql://root:root@localhost:8889/sports_club_db"
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

## Running the Application

### Development
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication (Public)

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "member@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "member@example.com",
      "name": "John Doe",
      "role": "MEMBER"
    }
  }
}
```

**Note:** Registration always creates a MEMBER role user.

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "member@example.com",
  "password": "password123"
}
```

**Response:** Same as register response.

### Authentication (Protected)

#### Get Current User
```bash
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "email": "member@example.com",
    "name": "John Doe",
    "role": "MEMBER",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z"
  }
}
```

### Public Schedule (No Authentication)

#### Get Schedule
```bash
GET /public/schedule?from=2026-01-20T00:00:00Z&to=2026-01-27T23:59:59Z&classTypeId=uuid&instructorId=uuid
```

**Query Parameters:**
- `from` (optional) - ISO date string, filter sessions from this date
- `to` (optional) - ISO date string, filter sessions until this date
- `classTypeId` (optional) - UUID, filter by class type
- `instructorId` (optional) - UUID, filter by instructor

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "session-uuid",
      "startsAt": "2026-01-20T10:00:00.000Z",
      "endsAt": "2026-01-20T10:25:00.000Z",
      "classType": {
        "id": "class-type-uuid",
        "name": "HIIT"
      },
      "instructor": {
        "id": "instructor-uuid",
        "name": "Jane Instructor"
      },
      "capacity": 10,
      "confirmedCount": 5,
      "remainingCapacity": 5,
      "registrationOpen": true,
      "registrationCloseReason": null
    }
  ]
}
```

**Note:** Only returns sessions with status `SCHEDULED`. All times are in UTC.

### Bookings (MEMBER Role Required)

#### List My Bookings
```bash
GET /bookings
Authorization: Bearer <token>
```

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "booking-uuid",
      "sessionId": "session-uuid",
      "userId": "user-uuid",
      "status": "CONFIRMED",
      "bookedAt": "2026-01-15T10:00:00.000Z",
      "cancelledAt": null,
      "session": {
        "id": "session-uuid",
        "startsAt": "2026-01-20T10:00:00.000Z",
        "endsAt": "2026-01-20T10:25:00.000Z",
        "capacity": 10,
        "location": "Main Studio",
        "classType": {
          "id": "class-type-uuid",
          "name": "HIIT",
          "durationMinutes": 25,
          "cancellationCutoffHours": 2
        },
        "instructor": {
          "id": "instructor-uuid",
          "user": {
            "name": "Jane Instructor"
          }
        }
      }
    }
  ]
}
```

#### Create Booking
```bash
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "session-uuid"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "booking-uuid",
    "sessionId": "session-uuid",
    "userId": "user-uuid",
    "status": "CONFIRMED",
    "bookedAt": "2026-01-15T10:00:00.000Z",
    "cancelledAt": null,
    "session": { ... }
  }
}
```

**Error Codes:**
- `CAPACITY_FULL` - Class is at full capacity
- `REGISTRATION_CLOSED` - Registration window is closed
- `DUPLICATE_BOOKING` - You already have an active booking for this class
- `BOOKING_NOT_FOUND` - Session not found

#### Cancel Booking
```bash
DELETE /bookings/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "booking-uuid",
    "status": "CANCELLED",
    "cancelledAt": "2026-01-15T11:00:00.000Z",
    ...
  }
}
```

**Note:** Cancellation is idempotent. Cancelling an already-cancelled booking returns success.

**Error Codes:**
- `CANCELLATION_CUTOFF_PASSED` - Cancellation deadline has passed
- `BOOKING_NOT_FOUND` - Booking not found
- `FORBIDDEN` - You don't own this booking

### Instructor Routes (INSTRUCTOR Role Required)

#### Get My Sessions
```bash
GET /instructors/me/sessions
Authorization: Bearer <token>
```

**Note:** Currently returns placeholder. Implementation pending.

#### Get Session Roster
```bash
GET /instructors/sessions/:id/roster
Authorization: Bearer <token>
```

**Note:** Currently returns placeholder. Implementation pending.

## Role-Based Access Control

### Roles

- **ADMIN** - Full access to all endpoints
- **INSTRUCTOR** - Access to instructor-specific endpoints
- **MEMBER** - Access to booking endpoints

### Protected Routes

| Route | Method | Required Role | Authentication |
|-------|--------|---------------|----------------|
| `/auth/register` | POST | Public | None |
| `/auth/login` | POST | Public | None |
| `/auth/me` | GET | Any authenticated | JWT |
| `/public/schedule` | GET | Public | None |
| `/bookings` | GET | MEMBER | JWT |
| `/bookings` | POST | MEMBER | JWT |
| `/bookings/:id` | DELETE | MEMBER | JWT |
| `/instructors/me/sessions` | GET | INSTRUCTOR | JWT |
| `/instructors/sessions/:id/roster` | GET | INSTRUCTOR | JWT |

## Error Response Format

All errors follow this format:

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional additional details
    }
  }
}
```

### Common Error Codes

- `EMAIL_ALREADY_EXISTS` - Email is already registered
- `INVALID_CREDENTIALS` - Invalid email or password
- `INVALID_TOKEN` - JWT token is invalid or expired
- `FORBIDDEN` - Insufficient permissions
- `CAPACITY_FULL` - Class is at full capacity
- `REGISTRATION_CLOSED` - Registration window is closed
- `DUPLICATE_BOOKING` - Active booking already exists
- `CANCELLATION_CUTOFF_PASSED` - Cancellation deadline passed
- `BOOKING_NOT_FOUND` - Booking not found

## UTC Time Handling

**Important:** All time comparisons and date operations use UTC.

- All `Date` objects are in UTC
- All database timestamps are stored in UTC
- All API responses include UTC timestamps
- Date filters in queries use UTC

Example:
```typescript
// All time comparisons use UTC
const now = new Date(); // UTC
if (session.startsAt < now) { ... }
```

## Business Rules

### Booking Creation

1. Session must have status `SCHEDULED`
2. Registration window must be open (if set)
3. Capacity must not be exceeded
4. User cannot have duplicate active booking for same session
5. Cancelled bookings can be re-activated

### Booking Cancellation

1. User must own the booking
2. Cancellation cutoff must not have passed (if set)
3. Idempotent: Cancelling already-cancelled booking returns success

### Public Schedule

1. Only returns sessions with status `SCHEDULED`
2. Does not expose booking user data
3. Includes capacity information (total, confirmed, remaining)
4. Indicates registration status

## Test Users

The following test accounts are available for development and testing:

### Member Account

- **Email:** `member@example.com`
- **Password:** `password123`
- **Name:** Test Member
- **Role:** MEMBER
- **User ID:** `83e0fc9b-cd5e-414e-8c02-d4a9e894e5db`

**Usage:**
- Use this account to test booking functionality
- Log in via the UI at `http://localhost:3000/login` or via API
- Can book and cancel classes
- Can view personal bookings

### Creating Additional Test Users

Create new member accounts via the registration endpoint:

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newmember@example.com",
    "password": "password123",
    "name": "New Member"
  }'
```

**Note:** All users registered via `/auth/register` are automatically assigned the `MEMBER` role. To create ADMIN or INSTRUCTOR accounts, update the user role directly in the database using Prisma Studio or SQL.

### User Roles

- **MEMBER** - Can view schedules and book/cancel classes
- **INSTRUCTOR** - Can view assigned sessions and rosters  
- **ADMIN** - Full access to all endpoints and administrative functions

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Database

### Prisma Commands

Generate Prisma Client:
```bash
npm run prisma:generate
```

Create migration:
```bash
npm run prisma:migrate
```

Open Prisma Studio:
```bash
npm run prisma:studio
```

### Database Schema

Key models:
- `User` - Authentication and user data
- `InstructorProfile` - Instructor-specific data
- `ClassType` - Class type definitions (HIIT, CORE, etc.)
- `ClassSession` - Scheduled class instances
- `Booking` - User bookings for sessions
- `AuditLog` - Audit trail for actions

## Development

### Project Structure

```
src/
├── auth/           # Authentication module
├── bookings/       # Booking management
├── classes/        # Class and session services
├── instructors/    # Instructor routes
├── public/         # Public endpoints
├── common/         # Shared utilities
├── prisma/         # Prisma service
└── config/         # Configuration
```

### Adding New Endpoints

1. Create DTOs in module's `dto/` directory
2. Add service methods
3. Create controller with appropriate guards
4. Add tests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | Required |
| `JWT_SECRET` | Secret for signing JWT tokens | Required |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## Example cURL Requests

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Schedule (Public)
```bash
curl http://localhost:3000/public/schedule?from=2026-01-20T00:00:00Z&to=2026-01-27T23:59:59Z
```

### Create Booking
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-uuid"
  }'
```

### Cancel Booking
```bash
curl -X DELETE http://localhost:3000/bookings/booking-uuid \
  -H "Authorization: Bearer <token>"
```

## License

ISC

## Support

For issues and questions, please open an issue in the repository.


