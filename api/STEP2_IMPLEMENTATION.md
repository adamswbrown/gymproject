# Step 2 Implementation Summary

## Schema Fixes (Completed)

### 1. Fixed Booking Uniqueness
**Change:** Removed `@@unique([sessionId, userId, status])` and replaced with `@@unique([sessionId, userId])`

**Reason:** Status must be mutable (CONFIRMED → CANCELLED), not separate rows. This ensures one booking row per user-session pair, allowing status transitions.

**Location:** `prisma/schema.prisma` line 117

### 2. Simplified Session Time Model
**Changes:**
- REMOVED: `sessionDate`, `startTime`, `endTime`
- ADDED: `startsAt DateTime`, `endsAt DateTime`

**Reason:** Eliminates redundant time fields. All time comparisons now use `startsAt` consistently.

**Location:** `prisma/schema.prisma` lines 84-85

### 3. Strong Typing for Session Status
**Change:** Replaced `status String @default("scheduled")` with `status SessionStatus @default(SCHEDULED)`

**Added Enum:**
```prisma
enum SessionStatus {
  SCHEDULED
  CANCELLED
}
```

**Reason:** Type safety prevents invalid status values and makes the domain model explicit.

**Location:** `prisma/schema.prisma` lines 25-28, 88

### 4. Kept Existing Enums
- `UserRole` (ADMIN, INSTRUCTOR, MEMBER) - unchanged
- `BookingStatus` (CONFIRMED, CANCELLED, NO_SHOW) - unchanged

## BookingService Implementation

### Core Methods

#### `createBooking(userId, sessionId)`
**Transaction Safety:** ✅ All operations run inside `prisma.$transaction()`

**Business Rules Implemented:**
1. ✅ Fetch session + classType (with relations)
2. ✅ Reject if `session.status != SCHEDULED`
3. ✅ Enforce registration window:
   - If `registrationOpens && now < registrationOpens` → `REGISTRATION_CLOSED`
   - If `registrationCloses && now > registrationCloses` → `REGISTRATION_CLOSED`
4. ✅ Count CONFIRMED bookings (inside transaction for race safety)
5. ✅ If `confirmedCount >= session.capacity` → `CAPACITY_FULL`
6. ✅ Check for existing booking:
   - If exists and `status == CONFIRMED` → `DUPLICATE_BOOKING`
   - If exists and `status == CANCELLED` → re-activate (set `status = CONFIRMED`, clear `cancelledAt`)
7. ✅ Create new booking with `status = CONFIRMED` if no existing booking
8. ✅ Log audit entry
9. ✅ Return booking DTO

**Location:** `src/bookings/bookings.service.ts` lines 20-120

#### `cancelBooking(userId, bookingId)`
**Transaction Safety:** ✅ All operations run inside `prisma.$transaction()`

**Business Rules Implemented:**
1. ✅ Verify booking exists
2. ✅ Verify `booking.userId == userId` (ownership check)
3. ✅ Fetch session + classType
4. ✅ Enforce cancellation cutoff:
   - If `classType.cancellationCutoffHours` is set:
     - `cutoffTime = session.startsAt - cutoffHours`
     - If `now > cutoffTime` → `CANCELLATION_CUTOFF_PASSED`
5. ✅ Update booking: `status = CANCELLED`, `cancelledAt = now`
6. ✅ Log audit entry
7. ✅ Return updated booking DTO

**Location:** `src/bookings/bookings.service.ts` lines 122-195

### Error Codes
All exceptions return consistent format:
```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { /* optional */ }
  }
}
```

**Implemented Error Codes:**
- `CAPACITY_FULL` - Class is at full capacity
- `REGISTRATION_CLOSED` - Registration window closed/not open
- `DUPLICATE_BOOKING` - Active booking already exists
- `CANCELLATION_CUTOFF_PASSED` - Cancellation deadline passed
- `FORBIDDEN` - User doesn't own the booking
- `BOOKING_NOT_FOUND` - Booking doesn't exist

**Location:** `src/bookings/exceptions/booking.exceptions.ts`

## API Contract

### Endpoints
- `POST /bookings` - Create booking
- `DELETE /bookings/:id` - Cancel booking
- `GET /bookings` - List user bookings

### Response Format
**Success:**
```json
{
  "ok": true,
  "data": { /* booking object */ }
}
```

**Error:**
```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { /* optional */ }
  }
}
```

**Location:** 
- Controller: `src/bookings/bookings.controller.ts`
- Exception Filter: `src/common/filters/http-exception.filter.ts`

## Tests

### Unit Tests
**File:** `test/unit/bookings.service.spec.ts`

**Coverage:**
- ✅ Capacity enforcement (race-safe)
- ✅ Duplicate booking prevention
- ✅ Re-activating cancelled booking
- ✅ Registration window enforcement (opens/closes)
- ✅ Cancellation cutoff enforcement
- ✅ Session status validation
- ✅ Ownership verification
- ✅ Error handling for all exception types

### E2E Tests
**File:** `test/e2e/bookings.e2e-spec.ts`

**Coverage:**
- ✅ Successful booking creation
- ✅ Booking when capacity full
- ✅ Duplicate booking error
- ✅ Cancel before cutoff (success)
- ✅ Cancel after cutoff (error)
- ✅ Non-existent booking errors
- ✅ Request validation

## Migration

To apply the schema changes, run:
```bash
npm run prisma:migrate
```

This will create a new migration with the schema fixes.

## Files Created/Modified

### Created
- `prisma/schema.prisma` - Fixed schema with Step 2 corrections
- `src/bookings/bookings.service.ts` - Core booking logic with transactions
- `src/bookings/exceptions/booking.exceptions.ts` - Custom exceptions
- `src/bookings/dto/create-booking.dto.ts` - Request DTO
- `src/bookings/dto/booking-response.dto.ts` - Response DTO
- `src/bookings/bookings.controller.ts` - API endpoints
- `src/bookings/bookings.module.ts` - Module definition
- `src/common/filters/http-exception.filter.ts` - Global exception handler
- `src/prisma/prisma.service.ts` - Prisma client service
- `src/prisma/prisma.module.ts` - Prisma module
- `src/app.module.ts` - Main app module
- `src/main.ts` - Application entry point
- `test/unit/bookings.service.spec.ts` - Unit tests
- `test/e2e/bookings.e2e-spec.ts` - E2E tests

### Configuration
- `prisma.config.ts` - Prisma 7 configuration (URL moved here)
- `.env` - Environment variables
- `package.json` - Scripts and dependencies
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest configuration

## Assumptions & TODOs for Step 3

### Assumptions
1. **Authentication:** Controllers currently use placeholder `req.user?.id`. In Step 3, implement:
   - JWT authentication
   - `@CurrentUser()` decorator
   - `JwtAuthGuard` and `RolesGuard`

2. **User Context:** The service methods accept `userId` as parameter. Once auth is implemented, this will come from the JWT token.

3. **Admin Override:** The `cancelBooking` method checks ownership. For Step 3, consider adding admin override capability.

### TODOs for Step 3 (UI/Additional Features)
1. Implement full authentication module (JWT, guards, decorators)
2. Add role-based access control (ADMIN can override ownership checks)
3. Implement public schedule endpoint (`GET /public/schedule`)
4. Add class types and sessions management (admin CRUD)
5. Add instructor management
6. Implement instructor roster endpoint
7. Add comprehensive seed script
8. Update README with curl examples

## Running the Application

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run start:dev

# Run tests
npm test
npm run test:e2e
```

## Database Connection

The application is configured to use MySQL:
- Host: `localhost`
- Port: `8889` (MAMP default)
- Database: `sports_club_db`
- User: `root`
- Password: `root`

Connection string: `mysql://root:root@localhost:8889/sports_club_db`

**Note:** Prisma will create new tables that won't conflict with existing PHP tables in the same database.


