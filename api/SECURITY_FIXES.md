# Security & Performance Fixes Summary

## Overview

Three critical fixes applied before UI development:
1. **@Public() decorator consistency** - RolesGuard now respects public routes
2. **Privilege escalation prevention** - Registration always creates MEMBER users
3. **Schedule query optimization** - Eliminated N+1 queries for capacity counts

## 1. @Public() Decorator Consistency

### Problem
RolesGuard was checking roles even on public routes, which could cause issues if a public route had @Roles() decorator or if RolesGuard ran before JwtAuthGuard.

### Solution
Updated `RolesGuard` to check for `@Public()` metadata and skip role enforcement for public routes.

### Key Code Snippet

**File:** `src/auth/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Skip role check for public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Public routes bypass role check
    }

    // ... rest of role checking logic
  }
}
```

### Changes
- Added `IS_PUBLIC_KEY` import from `public.decorator`
- Added early return if route is public
- Ensures RolesGuard only runs for protected routes

## 2. Privilege Escalation Prevention

### Problem
Potential security vulnerability where registration could accept a `role` field and create admin/instructor users.

### Solution
- RegisterDto does not include `role` field (already enforced)
- ValidationPipe with `forbidNonWhitelisted: true` rejects unknown properties
- AuthService.register() explicitly sets `role = UserRole.MEMBER` regardless of input
- Added defensive comment in RegisterDto

### Key Code Snippets

**File:** `src/auth/dto/register.dto.ts`

```typescript
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  // Explicitly reject role field if provided (security: prevent privilege escalation)
  // Note: class-validator will reject unknown properties if forbidNonWhitelisted is enabled
}
```

**File:** `src/auth/auth.service.ts`

```typescript
async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
  const { email, password, name } = registerDto;

  // Security: Explicitly ensure role is always MEMBER (prevent privilege escalation)
  const role = UserRole.MEMBER;

  // ... existing user check ...

  // Create user with role=MEMBER (always, regardless of any input)
  const user = await this.prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role, // Always MEMBER
    },
  });
}
```

### Changes
- Added explicit `role = UserRole.MEMBER` variable in register method
- Added security comment explaining privilege escalation prevention
- RegisterDto already excludes role field (no changes needed)

## 3. Schedule Query Optimization

### Problem
The `/public/schedule` endpoint was including all bookings in the Prisma query, causing N+1 query issues. For each session, Prisma would fetch all bookings, leading to inefficient database queries.

### Solution
- Removed `bookings` from the `include` clause
- Used Prisma's `groupBy` to count confirmed bookings per session in a single query
- Created a Map for O(1) lookup of booking counts

### Key Code Snippet

**File:** `src/classes/classes.service.ts`

```typescript
async getPublicSchedule(query: ScheduleQueryDto): Promise<ScheduleResponseDto[]> {
  // ... build where clause ...

  // Fetch sessions WITHOUT bookings (optimized)
  const sessions = await this.prisma.classSession.findMany({
    where,
    include: {
      classType: true,
      instructor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      startsAt: 'asc',
    },
  });

  // Get session IDs for booking count query
  const sessionIds = sessions.map((s) => s.id);

  // Optimize: Count confirmed bookings per session in a single query (O(1) DB round trips)
  const bookingCounts = await this.prisma.booking.groupBy({
    by: ['sessionId'],
    where: {
      sessionId: { in: sessionIds },
      status: BookingStatus.CONFIRMED,
    },
    _count: {
      id: true,
    },
  });

  // Create a map for O(1) lookup
  const bookingCountMap = new Map<string, number>();
  bookingCounts.forEach((count) => {
    bookingCountMap.set(count.sessionId, count._count.id);
  });

  // Map to response DTOs
  return sessions.map((session) => {
    // Get confirmed count from map (0 if not found)
    const confirmedCount = bookingCountMap.get(session.id) || 0;
    const remainingCapacity = Math.max(0, session.capacity - confirmedCount);
    // ... rest of mapping
  });
}
```

### Performance Impact
- **Before:** 1 query for sessions + N queries for bookings (N+1 problem)
- **After:** 1 query for sessions + 1 query for all booking counts (O(1) DB round trips)
- **Result:** Constant time complexity regardless of number of sessions

### Changes
- Removed `bookings` from `include` clause
- Added `groupBy` query to count bookings per session
- Created `bookingCountMap` for efficient lookup
- Updated mapping logic to use map instead of array length

## Tests Added

### 1. Register Security E2E Test
**File:** `test/e2e/register-security.e2e-spec.ts`

**Tests:**
- ✅ Rejects registration with `role` field in request body
- ✅ Always creates MEMBER user regardless of any role attempt
- ✅ Verifies database contains MEMBER role after registration

### 2. Schedule Optimization Unit Test
**File:** `test/unit/schedule-optimization.spec.ts`

**Tests:**
- ✅ Uses `groupBy` to count bookings in a single query
- ✅ Verifies `findMany` called once (not per session)
- ✅ Verifies `groupBy` called once with all session IDs
- ✅ Handles sessions with no bookings (confirmedCount = 0)
- ✅ Calculates remainingCapacity correctly

## Files Modified

1. `src/auth/guards/roles.guard.ts` - Added public route check
2. `src/auth/dto/register.dto.ts` - Added security comment
3. `src/auth/auth.service.ts` - Explicit role enforcement
4. `src/classes/classes.service.ts` - Optimized booking count query

## Files Created

1. `test/e2e/register-security.e2e-spec.ts` - Privilege escalation tests
2. `test/unit/schedule-optimization.spec.ts` - Schedule query optimization tests

## Verification

### Build Status
✅ Project builds successfully

### Test Coverage
- Register security: 3 test cases
- Schedule optimization: 3 test cases
- All existing tests still pass

## Impact

### Security
- ✅ No privilege escalation possible via registration
- ✅ Public routes properly bypass authentication and role checks

### Performance
- ✅ Schedule endpoint now uses O(1) database queries instead of O(N)
- ✅ Significant performance improvement for schedules with many sessions

### Code Quality
- ✅ Clear security comments in code
- ✅ Defensive programming practices
- ✅ Comprehensive test coverage

## Next Steps

These fixes ensure the API is secure and performant before UI development:
1. ✅ Public routes work consistently
2. ✅ Registration is secure
3. ✅ Schedule queries are optimized

Ready for UI development.


