---
name: NestJS Gym Booking API Backend
overview: Create a new NestJS backend API for a TeamUp-like gym booking system with Prisma, MySQL, JWT auth, RBAC, and clean architecture. The backend will be API-first, reusable by web and mobile clients, with comprehensive booking business rules.
todos: []
---

# NestJS Gym Booking API Backend

## Project Structure

```javascript
gym-booking-api/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── decorators/
│   │       ├── roles.decorator.ts
│   │       └── current-user.decorator.ts
│   ├── bookings/
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   ├── bookings.module.ts
│   │   ├── dto/
│   │   │   ├── create-booking.dto.ts
│   │   │   └── booking-response.dto.ts
│   │   └── exceptions/
│   │       └── booking.exceptions.ts
│   ├── classes/
│   │   ├── classes.controller.ts
│   │   ├── classes.service.ts
│   │   ├── classes.module.ts
│   │   └── dto/
│   │       ├── create-class-type.dto.ts
│   │       ├── create-session.dto.ts
│   │       └── schedule-response.dto.ts
│   ├── instructors/
│   │   ├── instructors.controller.ts
│   │   ├── instructors.service.ts
│   │   ├── instructors.module.ts
│   │   └── dto/
│   │       ├── create-instructor.dto.ts
│   │       └── roster-response.dto.ts
│   ├── public/
│   │   ├── public.controller.ts
│   │   └── public.module.ts
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   └── decorators/
│   │       └── public.decorator.ts
│   ├── prisma/
│   │   └── prisma.service.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
│   ├── unit/
│   │   └── bookings.service.spec.ts
│   └── e2e/
│       ├── bookings.e2e-spec.ts
│       └── jest-e2e.json
├── scripts/
│   └── seed.ts
├── .env
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```



## Implementation Plan

### Phase 1: Project Setup & Configuration

**1.1 Initialize NestJS Project**

- Create directory: `/Users/adambrown/Developer/gym-booking-api`
- Run `nest new gym-booking-api` (or manual setup)
- Configure TypeScript, ESLint, Prettier

**1.2 Install Dependencies**

```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @prisma/client
npm install class-validator class-transformer
npm install --save-dev prisma @types/bcrypt @types/passport-jwt
```

**1.3 Configure Environment**

- Create `.env` and `.env.example`
- Database: `DATABASE_URL="mysql://root:root@localhost:8889/sports_club_db"`
- JWT: `JWT_SECRET`, `JWT_EXPIRES_IN`
- App: `PORT=3000`, `NODE_ENV`

**1.4 Setup Prisma**

- Initialize Prisma: `npx prisma init`
- Configure `schema.prisma` for MySQL
- Set provider: `provider = "mysql"`

**1.5 Global Configuration**

- Create `ConfigModule` with validation
- Setup global validation pipe (class-validator)
- Create global exception filter
- Response format: `{ ok: boolean, error?: { code: string, message: string, details?: any }, data?: any }`

**Files to Create:**

- `src/config/configuration.ts`
- `src/common/filters/http-exception.filter.ts`
- `src/app.module.ts` (with global pipes/filters)
- `.env.example`

### Phase 2: Prisma Schema & Database

**2.1 Prisma Schema Design**

```prisma
enum UserRole {
  ADMIN
  INSTRUCTOR
  MEMBER
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  NO_SHOW
}

model User {
  id            String          @id @default(uuid())
  email         String          @unique
  passwordHash  String          @map("password_hash")
  role          UserRole
  name          String?
  createdAt     DateTime        @default(now()) @map("created_at")
  updatedAt     DateTime        @updatedAt @map("updated_at")
  
  instructorProfile InstructorProfile?
  bookings         Booking[]
  auditLogs        AuditLog[]
  
  @@map("users")
  @@index([email])
  @@index([role])
}

model InstructorProfile {
  id            String   @id @default(uuid())
  userId        String   @unique @map("user_id")
  specialization String?
  phone         String?
  active        Boolean  @default(true)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  classSessions ClassSession[]
  
  @@map("instructor_profiles")
}

model ClassType {
  id                      String   @id @default(uuid())
  name                    String
  description             String?
  durationMinutes         Int      @default(25) @map("duration_minutes")
  defaultCapacity         Int      @default(10) @map("default_capacity")
  cancellationCutoffHours Int?     @map("cancellation_cutoff_hours")
  active                  Boolean  @default(true)
  createdAt               DateTime @default(now()) @map("created_at")
  updatedAt               DateTime @updatedAt @map("updated_at")
  
  classSessions ClassSession[]
  
  @@map("class_types")
  @@index([active])
}

model ClassSession {
  id                String    @id @default(uuid())
  classTypeId       String    @map("class_type_id")
  instructorId      String    @map("instructor_id")
  sessionDate       DateTime  @map("session_date")
  startTime         DateTime  @map("start_time")
  endTime           DateTime  @map("end_time")
  capacity          Int       @default(10)
  location          String    @default("Main Studio")
  status            String    @default("scheduled")
  registrationOpens DateTime? @map("registration_opens")
  registrationCloses DateTime? @map("registration_closes")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  
  classType ClassType         @relation(fields: [classTypeId], references: [id], onDelete: Cascade)
  instructor InstructorProfile @relation(fields: [instructorId], references: [id], onDelete: Restrict)
  bookings   Booking[]
  
  @@map("class_sessions")
  @@index([sessionDate])
  @@index([classTypeId])
  @@index([instructorId])
  @@index([status])
}

model Booking {
  id          String        @id @default(uuid())
  sessionId   String        @map("session_id")
  userId      String        @map("user_id")
  status      BookingStatus @default(CONFIRMED)
  bookedAt    DateTime      @default(now()) @map("booked_at")
  cancelledAt DateTime?     @map("cancelled_at")
  
  session ClassSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  user    User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("bookings")
  @@unique([sessionId, userId, status])
  @@index([userId])
  @@index([sessionId])
  @@index([status])
  @@index([bookedAt])
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  action    String
  entityType String? @map("entity_type")
  entityId  String?  @map("entity_id")
  details   Json?
  createdAt DateTime @default(now()) @map("created_at")
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("audit_logs")
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

**2.2 Generate Migration**

- Run `npx prisma migrate dev --name init`
- Verify schema matches requirements
- Add indexes for performance

**2.3 Prisma Service**

- Create `src/prisma/prisma.service.ts`
- Extend PrismaClient with lifecycle hooks
- Export for dependency injection

**Files to Create:**

- `prisma/schema.prisma`
- `src/prisma/prisma.service.ts`
- `src/prisma/prisma.module.ts`

### Phase 3: Authentication & Authorization

**3.1 Auth Module Setup**

- Create `AuthModule` with `JwtModule` and `PassportModule`
- Configure JWT strategy
- Setup password hashing service

**3.2 DTOs**

- `RegisterDto`: email, password, name, role (MEMBER only for public)
- `LoginDto`: email, password
- `AuthResponseDto`: accessToken, user (without password)

**3.3 Auth Service**

- `register()`: hash password, create user, return JWT
- `login()`: validate credentials, return JWT
- `validateUser()`: for JWT strategy
- `getProfile()`: return current user

**3.4 JWT Strategy**

- Extract token from Authorization header
- Validate and return user payload
- Set `req.user` with user object

**3.5 Guards**

- `JwtAuthGuard`: validates JWT, sets user
- `RolesGuard`: checks user role against required roles
- `@Roles()` decorator for route-level role enforcement
- `@Public()` decorator for public routes

**3.6 Controllers**

- `POST /auth/register` - public, role=MEMBER only
- `POST /auth/login` - public
- `GET /auth/me` - protected, returns current user

**Files to Create:**

- `src/auth/auth.module.ts`
- `src/auth/auth.service.ts`
- `src/auth/auth.controller.ts`
- `src/auth/dto/register.dto.ts`
- `src/auth/dto/login.dto.ts`
- `src/auth/dto/auth-response.dto.ts`
- `src/auth/strategies/jwt.strategy.ts`
- `src/auth/guards/jwt-auth.guard.ts`
- `src/auth/guards/roles.guard.ts`
- `src/auth/decorators/roles.decorator.ts`
- `src/auth/decorators/current-user.decorator.ts`
- `src/common/decorators/public.decorator.ts`

### Phase 4: Booking Business Logic

**4.1 Booking Service**

- `createBooking(userId, sessionId)`: 
- Check capacity (count confirmed bookings)
- Check duplicate (unique constraint handles, but validate first)
- Check registration window (if set)
- Create booking with status CONFIRMED
- Log audit
- `cancelBooking(userId, bookingId)`:
- Verify ownership
- Check cancellation cutoff (ClassType.cancellationCutoffHours)
- Update status to CANCELLED
- Set cancelledAt timestamp
- Log audit
- `getUserBookings(userId, filters)`: return user's bookings
- `getBookingDetails(bookingId)`: return booking with session details

**4.2 Booking Exceptions**

- Custom exceptions with error codes:
- `CAPACITY_FULL`
- `REGISTRATION_CLOSED`
- `DUPLICATE_BOOKING`
- `CANCELLATION_CUTOFF_PASSED`
- `FORBIDDEN`
- `BOOKING_NOT_FOUND`

**4.3 Booking DTOs**

- `CreateBookingDto`: sessionId
- `BookingResponseDto`: booking with session and class type details

**4.4 Booking Controller**

- `GET /bookings` - protected, MEMBER role, returns user bookings
- `POST /bookings` - protected, MEMBER role, creates booking
- `DELETE /bookings/:id` - protected, MEMBER role, cancels booking

**Files to Create:**

- `src/bookings/bookings.module.ts`
- `src/bookings/bookings.service.ts`
- `src/bookings/bookings.controller.ts`
- `src/bookings/dto/create-booking.dto.ts`
- `src/bookings/dto/booking-response.dto.ts`
- `src/bookings/exceptions/booking.exceptions.ts`

### Phase 5: Classes & Sessions Management

**5.1 Classes Service**

- `getAvailableClasses(filters)`: public schedule with filters
- `getClassDetails(sessionId)`: session with capacity info
- `createClassType()`: admin only
- `updateClassType()`: admin only
- `deleteClassType()`: admin only
- `createSession()`: admin only
- `updateSession()`: admin only
- `deleteSession()`: admin only
- `getSessions(filters)`: admin view

**5.2 Classes DTOs**

- `CreateClassTypeDto`: name, description, durationMinutes, defaultCapacity, cancellationCutoffHours
- `CreateSessionDto`: classTypeId, instructorId, sessionDate, startTime, endTime, capacity, location, registrationOpens, registrationCloses
- `ScheduleResponseDto`: session with class type, instructor, capacity info

**5.3 Classes Controllers**

- `GET /public/schedule` - public, no auth
- `GET /classes/:id` - public, session details
- `GET /admin/class-types` - admin, list class types
- `POST /admin/class-types` - admin, create
- `PATCH /admin/class-types/:id` - admin, update
- `DELETE /admin/class-types/:id` - admin, delete
- `GET /admin/sessions` - admin, list sessions
- `POST /admin/sessions` - admin, create
- `PATCH /admin/sessions/:id` - admin, update
- `DELETE /admin/sessions/:id` - admin, delete

**Files to Create:**

- `src/classes/classes.module.ts`
- `src/classes/classes.service.ts`
- `src/classes/classes.controller.ts`
- `src/classes/dto/create-class-type.dto.ts`
- `src/classes/dto/create-session.dto.ts`
- `src/classes/dto/schedule-response.dto.ts`
- `src/public/public.module.ts`
- `src/public/public.controller.ts`

### Phase 6: Instructors Management

**6.1 Instructors Service**

- `createInstructor()`: admin only, creates user + profile
- `updateInstructor()`: admin only
- `deleteInstructor()`: admin only
- `getInstructorSessions(instructorId, filters)`: instructor's own sessions
- `getSessionRoster(sessionId)`: list of bookings for a session

**6.2 Instructors DTOs**

- `CreateInstructorDto`: email, password, name, specialization, phone
- `RosterResponseDto`: session with list of bookings (user names)

**6.3 Instructors Controllers**

- `GET /admin/instructors` - admin, list instructors
- `POST /admin/instructors` - admin, create
- `PATCH /admin/instructors/:id` - admin, update
- `DELETE /admin/instructors/:id` - admin, delete
- `GET /instructors/me/sessions` - instructor, own sessions
- `GET /instructors/sessions/:id/roster` - instructor, session roster

**Files to Create:**

- `src/instructors/instructors.module.ts`
- `src/instructors/instructors.service.ts`
- `src/instructors/instructors.controller.ts`
- `src/instructors/dto/create-instructor.dto.ts`
- `src/instructors/dto/roster-response.dto.ts`

### Phase 7: Testing

**7.1 Unit Tests**

- `bookings.service.spec.ts`:
- Test capacity enforcement
- Test duplicate prevention
- Test registration window enforcement
- Test cancellation cutoff enforcement
- Test status transitions

**7.2 E2E Tests**

- `bookings.e2e-spec.ts`:
- POST /bookings success flow
- POST /bookings capacity full error
- POST /bookings duplicate error
- DELETE /bookings cancellation success
- DELETE /bookings cancellation cutoff error

**Files to Create:**

- `test/unit/bookings.service.spec.ts`
- `test/e2e/bookings.e2e-spec.ts`
- `test/e2e/jest-e2e.json`

### Phase 8: Seed Script & Documentation

**8.1 Seed Script**

- Create admin user (email: admin@test.com, password: admin123)
- Create instructor user + profile (email: instructor@test.com)
- Create member user (email: member@test.com, password: member123)
- Create 2 class types (HIIT, CORE)
- Create 4 sessions in next 7 days with various instructors

**8.2 README**

- Setup instructions
- Environment variables
- Database migration steps
- Running the app
- Example curl requests for all endpoints
- Testing instructions

**Files to Create:**

- `scripts/seed.ts`
- `README.md`

## Key Implementation Details

### Error Response Format

All errors return:

```json
{
  "ok": false,
  "error": {
    "code": "CAPACITY_FULL",
    "message": "Class is at full capacity",
    "details": { "available": 0, "capacity": 10 }
  }
}
```

Success responses:

```json
{
  "ok": true,
  "data": { ... }
}
```



### Booking Business Rules Implementation

**Capacity Check:**

```typescript
const confirmedCount = await this.prisma.booking.count({
  where: { sessionId, status: 'CONFIRMED' }
});
if (confirmedCount >= session.capacity) {
  throw new CapacityFullException();
}
```

**Registration Window:**

```typescript
const now = new Date();
if (session.registrationOpens && now < session.registrationOpens) {
  throw new RegistrationClosedException('Registration not yet open');
}
if (session.registrationCloses && now > session.registrationCloses) {
  throw new RegistrationClosedException('Registration closed');
}
```

**Cancellation Cutoff:**

```typescript
const cutoffTime = new Date(session.startTime);
cutoffTime.setHours(cutoffTime.getHours() - classType.cancellationCutoffHours);
if (now > cutoffTime) {
  throw new CancellationCutoffPassedException();
}
```



### Database Connection

- Use existing MySQL: `mysql://root:root@localhost:8889/sports_club_db`
- Prisma will create new tables (won't conflict with existing PHP tables)
- Consider separate database or namespace if needed

## Definition of Done

- [ ] NestJS app runs on port 3000
- [ ] Prisma schema deployed to MySQL
- [ ] All endpoints return consistent JSON format
- [ ] JWT auth works for all protected routes
- [ ] Role guards enforce ADMIN/INSTRUCTOR/MEMBER
- [ ] Booking rules fully implemented and tested
- [ ] Seed script creates test data