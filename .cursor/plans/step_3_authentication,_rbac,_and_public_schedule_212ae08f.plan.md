---
name: "Step 3: Authentication, RBAC, and Public Schedule"
overview: Implement JWT authentication, role-based access control, public schedule endpoint, and wire real user context into existing booking controllers. This completes the secure API foundation without modifying the existing BookingService business logic.
todos: []
---

#Step 3: Authentication, RBAC, and Public Schedule

## Overview

Implement complete JWT authentication system, role-based access control, public schedule browsing, and wire real user context into existing controllers. All time comparisons use UTC.

## Implementation Tasks

### A. Authentication Module (JWT)

#### A1. Auth DTOs

**Files to create:**

- `src/auth/dto/register.dto.ts`
- `email: string` (validated)
- `password: string` (min length 8)
- `name?: string`
- Role always MEMBER (enforced in service)
- `src/auth/dto/login.dto.ts`
- `email: string`
- `password: string`
- `src/auth/dto/auth-response.dto.ts`
- `accessToken: string`
- `user: { id, email, name, role }` (no passwordHash)
- `src/auth/dto/user-response.dto.ts`
- `id: string`
- `email: string`
- `name?: string`
- `role: UserRole`
- `createdAt: Date`
- `updatedAt: Date`

#### A2. Auth Service

**File:** `src/auth/auth.service.ts`**Methods:**

- `register(registerDto: RegisterDto)`: 
- Hash password with bcrypt
- Create user with role=MEMBER
- Generate JWT token
- Return AuthResponseDto
- `login(loginDto: LoginDto)`:
- Find user by email
- Verify password with bcrypt
- Generate JWT token
- Return AuthResponseDto
- `validateUser(userId: string)`:
- Used by JWT strategy
- Return user without passwordHash
- `getProfile(userId: string)`:
- Return current user details
- Used by GET /auth/me

**JWT Payload:**

```typescript
{
  sub: userId,
  role: UserRole
}
```



#### A3. JWT Strategy

**File:** `src/auth/strategies/jwt.strategy.ts`

- Extract token from `Authorization: Bearer <token>` header
- Validate token using JWT_SECRET
- Extract payload (sub, role)
- Call `validateUser(sub)` to get full user object
- Attach user to `request.user`

#### A4. Auth Guards

**File:** `src/auth/guards/jwt-auth.guard.ts`

- Extends `AuthGuard('jwt')`
- Validates JWT and sets `req.user`

**File:** `src/auth/guards/roles.guard.ts`

- Reads `@Roles()` decorator metadata
- Checks if `req.user.role` matches required roles
- Throws `ForbiddenException` if no match
- Allows if user role is in required roles array

#### A5. Auth Decorators

**File:** `src/auth/decorators/roles.decorator.ts`

- `@Roles(...roles: UserRole[])` - Sets metadata for required roles

**File:** `src/auth/decorators/current-user.decorator.ts`

- `@CurrentUser()` - Extracts `req.user` from request

**File:** `src/common/decorators/public.decorator.ts`

- `@Public()` - Marks route as public (bypasses JWT guard)

#### A6. Auth Controller

**File:** `src/auth/auth.controller.ts`**Endpoints:**

- `POST /auth/register`
- `@Public()`
- Role always MEMBER
- Returns `{ ok: true, data: AuthResponseDto }`
- `POST /auth/login`
- `@Public()`
- Returns `{ ok: true, data: AuthResponseDto }`
- `GET /auth/me`
- Protected (JwtAuthGuard)
- Uses `@CurrentUser()`
- Returns `{ ok: true, data: UserResponseDto }`

#### A7. Auth Module

**File:** `src/auth/auth.module.ts`

- Imports: `JwtModule`, `PassportModule`, `PrismaModule`
- Configures JwtModule with secret and expiresIn from env
- Exports: `JwtModule`, `JwtAuthGuard`, `RolesGuard`
- Providers: `AuthService`, `JwtStrategy`

### B. Role-Based Access Control

#### B1. Update BookingsController

**File:** `src/bookings/bookings.controller.ts`**Changes:**

- Import `@UseGuards(JwtAuthGuard, RolesGuard)`
- Import `@Roles(UserRole.MEMBER)`
- Import `@CurrentUser()`
- Replace `@Request() req: any` with `@CurrentUser() user`
- Replace `req.user?.id` with `user.id`
- Apply guards and roles to all routes

**Protected Routes:**

- `GET /bookings` - MEMBER only
- `POST /bookings` - MEMBER only
- `DELETE /bookings/:id` - MEMBER only

#### B2. Update BookingService (Idempotent Cancel)

**File:** `src/bookings/bookings.service.ts`**Change in `cancelBooking`:**

- If booking status is already CANCELLED, return success (idempotent)
- Do not throw error for already-cancelled bookings

#### B3. Instructor Routes (Placeholder)

**File:** `src/instructors/instructors.controller.ts` (create if needed)

- `GET /instructors/me/sessions` - INSTRUCTOR only
- `GET /instructors/sessions/:id/roster` - INSTRUCTOR only

### C. Public Schedule Endpoint

#### C1. Schedule DTOs

**File:** `src/public/dto/schedule-query.dto.ts`

- `from?: string` (ISO date string, validated)
- `to?: string` (ISO date string, validated)
- `classTypeId?: string` (UUID, optional)
- `instructorId?: string` (UUID, optional)

**File:** `src/public/dto/schedule-response.dto.ts`

- `id: string`
- `startsAt: Date` (UTC)
- `endsAt: Date` (UTC)
- `classType: { id, name }`
- `instructor: { id, name }`
- `capacity: number`
- `confirmedCount: number`
- `remainingCapacity: number`
- `registrationOpen: boolean`
- `registrationCloseReason?: string`

#### C2. Classes Service (Read-only Method)

**File:** `src/classes/classes.service.ts`**Method:**

- `getPublicSchedule(query: ScheduleQueryDto)`
- Filter: `status = SCHEDULED`
- Filter by date range (from/to)
- Filter by classTypeId (optional)
- Filter by instructorId (optional)
- Count confirmed bookings per session
- Calculate remainingCapacity
- Determine registrationOpen status
- Set registrationCloseReason if closed
- Do NOT expose booking user data
- All time comparisons use UTC

#### C3. Public Controller

**File:** `src/public/public.controller.ts`**Endpoint:**

- `GET /public/schedule`
- `@Public()`
- Query params: from, to, classTypeId, instructorId
- Returns `{ ok: true, data: ScheduleResponseDto[] }`

#### C4. Public Module

**File:** `src/public/public.module.ts`

- Imports: `PrismaModule`, `ClassesModule` (or creates service)
- Exports: `PublicController`

### D. Wire Auth into App

#### D1. Update AppModule

**File:** `src/app.module.ts`

- Import `AuthModule`
- Import `PublicModule`
- Ensure `JwtModule` is globally available (via AuthModule exports)

#### D2. Update Main.ts

**File:** `src/main.ts`

- Ensure global guards are NOT applied (use per-route)
- Keep validation pipe

### E. Tests

#### E1. Auth E2E Tests

**File:** `test/e2e/auth.e2e-spec.ts`**Tests:**

- POST /auth/register - success
- POST /auth/register - duplicate email error
- POST /auth/login - success
- POST /auth/login - invalid credentials
- GET /auth/me - success (with token)
- GET /auth/me - unauthorized (no token)

#### E2. Public Schedule E2E Tests

**File:** `test/e2e/public.e2e-spec.ts`**Tests:**

- GET /public/schedule - no auth required
- GET /public/schedule - with date filters
- GET /public/schedule - with classTypeId filter
- GET /public/schedule - only returns SCHEDULED sessions
- GET /public/schedule - includes capacity info

#### E3. Role Enforcement E2E Tests

**File:** `test/e2e/roles.e2e-spec.ts`**Tests:**

- MEMBER can access /bookings
- MEMBER cannot access admin routes
- Unauthenticated cannot access protected routes
- Invalid token returns 401

### F. Configuration

#### F1. Environment Variables

**File:** `.env`

- `JWT_SECRET` - Secret for signing tokens
- `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")

#### F2. Update README

**File:** `README.md`

- Document UTC time handling
- Add auth endpoints documentation
- Add example curl requests with tokens
- Document role requirements per endpoint

## Implementation Order

1. **Auth Module** (A1-A7)

- DTOs → Service → Strategy → Guards → Decorators → Controller → Module

2. **RBAC Integration** (B1-B3)

- Update BookingsController
- Make cancelBooking idempotent
- Create placeholder instructor routes

3. **Public Schedule** (C1-C4)

- DTOs → Service method → Controller → Module

4. **Wire Everything** (D1-D2)

- Update AppModule
- Verify main.ts

5. **Tests** (E1-E3)

- Auth tests
- Public schedule tests
- Role enforcement tests

6. **Documentation** (F1-F2)

- Update .env.example
- Update README

## Key Implementation Details

### UTC Time Handling

- All `new Date()` operations use UTC
- All time comparisons use UTC
- Document in code comments and README

### Idempotent Cancellation

```typescript
// In cancelBooking
if (booking.status === BookingStatus.CANCELLED) {
  return this.mapToResponseDto(booking); // Already cancelled, return success
}
```



### JWT Configuration

```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
})
```



### Public Decorator

```typescript
// Set metadata to bypass JWT guard
SetMetadata('isPublic', true)
```



## Protected Routes Summary

| Route | Method | Roles | Guard ||-------|--------|-------|-------|| /auth/register | POST | Public | None || /auth/login | POST | Public | None || /auth/me | GET | Any authenticated | JwtAuthGuard || /bookings | GET | MEMBER | JwtAuthGuard, RolesGuard || /bookings | POST | MEMBER | JwtAuthGuard, RolesGuard || /bookings/:id | DELETE | MEMBER | JwtAuthGuard, RolesGuard || /public/schedule | GET | Public | None || /instructors/me/sessions | GET | INSTRUCTOR | JwtAuthGuard, RolesGuard || /instructors/sessions/:id/roster | GET | INSTRUCTOR | JwtAuthGuard, RolesGuard |

## Definition of Done

- [ ] JWT authentication fully implemented
- [ ] All auth endpoints working (register, login, me)
- [ ] RolesGuard enforces role requirements
- [ ] @CurrentUser() decorator works
- [ ] BookingsController uses real user context
- [ ] Public schedule endpoint returns correct data
- [ ] All time comparisons use UTC
- [ ] cancelBooking is idempotent