---
name: TeamUp-Style Booking Platform Evolution
overview: Transform the existing PHP/MySQL monolithic Sports Club Management System into a TeamUp-style booking platform with clean API boundaries, strong role separation, and mobile-ready architecture. The plan includes a comprehensive audit of current state, gap analysis, and a phased implementation approach.
todos: []
---

# Sports Club Management System - TeamUp Evolution Plan

## Step 1: Current State Audit

### A) Architecture Map

**Current Architecture:**

```javascript
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  - Plain HTML/CSS/JS (no framework)                     │
│  - jQuery-like vanilla JS (Script.js)                   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP POST/GET
                     ▼
┌─────────────────────────────────────────────────────────┐
│              PHP Monolithic Application                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Presentation Layer (PHP pages)                  │  │
│  │  - dashboard/admin/*.php (CRUD pages)            │  │
│  │  - dashboard/member/*.php (booking pages)         │  │
│  │  - dashboard/coach/*.php (instructor view)        │  │
│  │  - Business logic embedded in page files         │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Auth Layer                                      │  │
│  │  - secure_login.php (session-based)             │  │
│  │  - page_protect() in db_conn.php                │  │
│  │  - Role check: string comparison in login        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Data Access Layer                               │  │
│  │  - include/db_conn.php (mysqli connection)       │  │
│  │  - Direct SQL queries in page files              │  │
│  │  - No ORM, no prepared statements consistently   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ mysqli
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MySQL Database (sports_club_db)              │
│  - users, admin, instructors, class_types               │
│  - class_instances, bookings, coaches                    │
│  - Basic foreign keys, minimal constraints              │
└─────────────────────────────────────────────────────────┘
```



**Key Characteristics:**

- **Frontend**: No framework, plain PHP with inline HTML/CSS/JS

- **Backend**: PHP monolithic, no MVC, no service layer

- **Database**: MySQL with mysqli, minimal prepared statements

- **Auth**: Session-based (`$_SESSION`), role via string comparison

- **API**: None - direct page-to-page navigation

- **Validation**: Minimal - only `mysqli_real_escape_string` in login

### B) Domain Model Inventory

**Existing Entities:**

1. **users** (legacy member table)

- Fields: `userid` (PK), `username`, `gender`, `mobile`, `email`, `dob`, `joining_date`

- Relationships: FK to `address`, `health_status`, `enrolls_to`, `bookings`

2. **admin** (auth table - also used for members)

- Fields: `username` (PK), `pass_key`, `securekey`, `Full_name`

- Note: Members stored with `Full_name = 'MEMBER:{userid}'` hack

3. **instructors** (new)

- Fields: `instructor_id` (PK), `name`, `email`, `phone`, `specialization`, `active`

- Relationships: FK from `class_instances`, `coaches`

4. **class_types** (new - template)

- Fields: `class_type_id` (PK), `name`, `description`, `duration_minutes`, `default_capacity`, `active`

- Relationships: FK from `class_instances`

5. **class_instances** (new - scheduled sessions)

- Fields: `instance_id` (PK), `class_type_id`, `instructor_id`, `class_date`, `start_time`, `end_time`, `capacity`, `location`, `status`, `registration_opens`, `registration_closes`

- Relationships: FK to `class_types`, `instructors`; FK from `bookings`

- Indexes: `class_date_idx`, `class_type_idx`, `instructor_idx`

6. **bookings** (new)

- Fields: `booking_id` (PK), `instance_id`, `userid`, `booking_date`, `status`, `cancelled_at`

- Relationships: FK to `class_instances`, `users`

- Constraints: `UNIQUE (instance_id, userid, status)` - prevents duplicate active bookings

7. **coaches** (new - links users to instructors)

- Fields: `coach_id` (PK), `userid`, `instructor_id`

- Relationships: FK to `users`, `instructors`

- Constraints: `UNIQUE (userid, instructor_id)`

8. **plan** (legacy - subscription plans)

- Fields: `pid`, `planName`, `description`, `validity`, `amount`, `active`

9. **enrolls_to** (legacy - member subscriptions)

- Fields: `et_id`, `pid`, `uid`, `paid_date`, `expire`, `renewal`

10. **address**, **health_status** (legacy - member profile data)

**Missing Entities:**

- Waitlist table

- Booking cancellation rules/config

- Audit log (beyond basic `log_users`)

### C) Feature Inventory

| Feature Area | Status | Notes |

|-------------|--------|-------|

| **Public schedule browsing** | Missing | No public endpoint, requires auth |

| **Member registration/login** | Partial | Works but hacky (admin table with MEMBER: prefix) |

| **Member profile** | Partial | Basic user table, no dedicated profile page |

| **Member booking flow** | Implemented | Basic: book_class.php, cancel_booking.php |

| **Capacity enforcement** | Implemented | Checked in book_class.php (line 40) |

| **Cancellation rules + cut-off** | Missing | No time-based restrictions, no cut-off logic |

| **Waitlist** | Missing | No waitlist table or logic |

| **Registration windows** | Partial | Fields exist (`registration_opens/closes`) but not enforced |

| **Instructor dashboard** | Partial | my_classes.php exists but instructor lookup is fragile |

| **Admin CRUD class types** | Implemented | Full CRUD: add/edit/delete class_types |

| **Admin schedule sessions** | Implemented | schedule_class.php, save_class_schedule.php |

| **Admin manage instructors** | Implemented | Full CRUD: add/edit/delete instructors |

| **Admin view bookings** | Implemented | view_class_bookings.php |

| **Notifications (email)** | Missing | No email system |

| **Audit/logging** | Partial | Basic `log_users` trigger, no booking audit |

| **API endpoints** | Missing | No REST API, all page-to-page |

| **Input validation** | Partial | Minimal - only login uses `mysqli_real_escape_string` |

| **SQL injection protection** | Partial | Inconsistent use of prepared statements |

| **Error handling** | Partial | Basic alerts, no standardized error responses |

### D) API Quality Check

**Current State:**

- ❌ No API layer exists

- ❌ All interactions are page-to-page (form POST → PHP page → redirect)

- ❌ No request/response standardization

- ❌ No validation framework (zod/joi equivalent)

- ❌ Error handling via JavaScript alerts

- ❌ Business logic in page files (e.g., `book_class.php` lines 14-55)

**Examples of Business Logic in Pages:**

- `dashboard/member/book_class.php`: Capacity check, duplicate check, booking creation all inline

- `dashboard/admin/save_class_schedule.php`: Direct SQL insert with minimal validation

- `dashboard/member/cancel_booking.php`: Direct SQL update, no cancellation rules

## Step 2: Gap Analysis

| Area | Current State | Target State | Effort | Risk |

|------|--------------|--------------|--------|------|

| **Session vs Instance Split** | ✅ Exists | ✅ Correct | - | Low |

| **Booking Rules** | ❌ None | ✅ Time-based cutoffs, cancellation windows | M | Med |

| **Booking Statuses** | ⚠️ Basic (confirmed/cancelled) | ✅ confirmed/cancelled/waitlist/no-show | S | Low |

| **Role Enforcement** | ⚠️ String check in login | ✅ Middleware/service layer | M | Med |

| **API Separation** | ❌ None | ✅ REST API with JSON responses | L | High |

| **Public Schedule** | ❌ Requires auth | ✅ Public endpoint, no auth | S | Low |

| **Data Integrity** | ⚠️ Basic FKs | ✅ Unique constraints, indexes, check constraints | S | Low |

| **Input Validation** | ⚠️ Minimal | ✅ Server-side validation layer | M | Med |

| **Error Handling** | ⚠️ Alerts | ✅ Standardized JSON error responses | S | Low |

| **Waitlist System** | ❌ Missing | ✅ Waitlist table + logic | M | Med |

| **Registration Windows** | ⚠️ Fields exist, not enforced | ✅ Enforced in booking logic | S | Low |

| **Instructor Auth** | ⚠️ Fragile email lookup | ✅ Proper coaches table usage | S | Low |

| **Observability** | ⚠️ Basic triggers | ✅ Booking audit log, error logging | S | Low |

| **Prepared Statements** | ⚠️ Inconsistent | ✅ All queries use prepared statements | M | High |

| **Service Layer** | ❌ None | ✅ Business logic in services, not pages | L | High |

## Step 3: Phased Implementation Plan

### Phase 0: Cleanup & Foundation (Week 1-2)

**Goal:** Remove technical debt and establish patterns**Tasks:**

1. **SQL Injection Fix**

- Convert all direct SQL to prepared statements

- Files: `dashboard/member/book_class.php`, `dashboard/admin/save_class_schedule.php`, `dashboard/member/cancel_booking.php`, `dashboard/member/classes.php`, `dashboard/admin/view_schedule.php`

- Create helper: `include/db_helpers.php` with `executeQuery()`, `fetchOne()`, `fetchAll()`

2. **Input Validation Layer**

- Create `include/validation.php` with validation functions

- Add validation to all POST endpoints

- Sanitize all user inputs

3. **Error Handling Standardization**

- Create `include/errors.php` with error constants and handlers

- Replace JavaScript alerts with proper error responses

- Add error logging

4. **Database Constraints**

- Add missing indexes on `bookings.booking_date`, `class_instances.status`

- Add check constraint: `bookings.status IN ('confirmed', 'cancelled', 'waitlist', 'no-show')`

- Add check constraint: `class_instances.capacity > 0`

**Definition of Done:**

- All SQL queries use prepared statements

- All user inputs validated

- Error responses standardized

- Database constraints in place

### Phase 1: API + Domain Hardening (Week 3-4)

**Goal:** Extract business logic and create API foundation**Tasks:**

1. **Service Layer Creation**

- Create `services/BookingService.php`:

    - `createBooking($userid, $instance_id)` - with capacity check, duplicate check, registration window check

    - `cancelBooking($userid, $instance_id)` - with cancellation rules

    - `getUserBookings($userid)`

- Create `services/ClassService.php`:

    - `getAvailableClasses($filters)`

    - `getClassDetails($instance_id)`

    - `checkCapacity($instance_id)`

- Create `services/AuthService.php`:

    - `authenticate($username, $password)` - returns user object with role

    - `requireRole($requiredRole)` - middleware helper

2. **Booking Rules Implementation**

- Add `cancellation_cutoff_hours` to `class_types` table

- Implement cancellation check in `BookingService::cancelBooking()`

- Enforce registration windows in `BookingService::createBooking()`

3. **Booking Status Expansion**

- Update `bookings.status` enum/check constraint

- Add status transitions in `BookingService`

4. **REST API Foundation**

- Create `api/` directory structure

- Create `api/auth.php` - login endpoint (POST /api/auth/login)

- Create `api/classes.php` - public schedule (GET /api/classes)

- Create `api/bookings.php` - member bookings (GET/POST/DELETE /api/bookings)

- Use JSON responses, proper HTTP status codes

**Files to Create:**

- `services/BookingService.php`

- `services/ClassService.php`

- `services/AuthService.php`

- `api/auth.php`

- `api/classes.php`

- `api/bookings.php`

- `include/middleware.php` (role checking)

**Files to Refactor:**

- `dashboard/member/book_class.php` → calls `BookingService::createBooking()`

- `dashboard/member/cancel_booking.php` → calls `BookingService::cancelBooking()`

- `dashboard/member/classes.php` → calls `ClassService::getAvailableClasses()`

**Definition of Done:**

- All business logic in services

- REST API endpoints return JSON

- Booking rules enforced
- Service layer unit tested (basic tests)

### Phase 2: Web UX Polish (Week 5-6)

**Goal:** Improve member and public experience

**Tasks:**

1. **Public Schedule Page**

- Create `public/schedule.php` - no auth required

- Display upcoming classes with filters (date, class type, instructor)

- Link to login for booking

2. **Member Booking UX**

- Enhance `dashboard/member/classes.php`:

    - Better filtering (date range, class type, instructor)
    - Show registration window status

    - Show cancellation cutoff info

- Add AJAX booking (call API instead of page redirect)

- Real-time capacity updates

3. **Registration Window Enforcement**

- Show "Registration opens on..." for future classes

- Disable booking button if outside window

- Display in UI

4. **Cancellation Rules UI**

- Show "Cancel by..." deadline on booking cards

- Disable cancel button if past cutoff

- Clear messaging

**Files to Create:**

- `public/schedule.php`

- `js/booking.js` (AJAX booking handlers)

**Files to Enhance:**

- `dashboard/member/classes.php`
- `dashboard/member/my_bookings.php`

**Definition of Done:**

- Public schedule accessible without login

- AJAX booking works

- Registration windows visible and enforced

- Cancellation cutoffs displayed

### Phase 3: Instructor/Admin Tooling (Week 7-8)

**Goal:** Complete instructor and admin workflows

**Tasks:**

1. **Instructor Auth Fix**

- Update `secure_login.php` to properly check `coaches` table

- Create `services/InstructorService.php`:

    - `getInstructorClasses($instructor_id, $filters)`

    - `getClassRoster($instance_id)`

2. **Instructor Dashboard**

- Enhance `dashboard/coach/my_classes.php`:

    - Show roster for each class
    - Filter by date range

    - Mark attendance (future: no-show status)

3. **Admin Schedule Management**

- Enhance `dashboard/admin/view_schedule.php`:

    - Bulk operations

    - Copy/repeat schedule patterns

    - Better filtering

4. **Admin Booking Management**

- Enhance `dashboard/admin/view_class_bookings.php`:
    - Export roster

    - Manual booking management

    - Override capacity (with audit)

**Files to Create:**

- `services/InstructorService.php`

**Files to Enhance:**

- `dashboard/coach/my_classes.php`
- `dashboard/admin/view_schedule.php`

- `dashboard/admin/view_class_bookings.php`

- `secure_login.php` (instructor routing)

**Definition of Done:**

- Instructors can view their classes and rosters

- Admin can manage schedule efficiently

- All role-based routing works correctly

### Phase 4: Mobile Readiness (Week 9-10)

**Goal:** Ensure API is mobile-ready**Tasks:**

1. **API Completeness**

- Complete all CRUD operations via API:

    - `GET /api/classes` - public schedule

    - `GET /api/classes/:id` - class details

    - `POST /api/bookings` - create booking

    - `GET /api/bookings` - user bookings

    - `DELETE /api/bookings/:id` - cancel booking

    - `GET /api/instructors` - instructor list

    - `GET /api/instructors/:id/classes` - instructor schedule

2. **API Standards**

- Consistent response format: `{success: bool, data: {}, error: string}`

- Proper HTTP status codes (200, 201, 400, 401, 404, 500)

- Request validation with clear error messages

- Pagination for list endpoints (`?page=1&limit=50`)

3. **CORS Configuration**

- Add CORS headers for mobile app domains

- Create `include/cors.php` middleware

4. **API Documentation**

- Create `api/README.md` with endpoint documentation

- Include request/response examples

5. **Auth for API**

- JWT token support (optional, can keep sessions for web)

- Or session-based with proper cookie handling

- API key for public endpoints (optional)

**Files to Create:**

- `api/instructors.php`
- `include/cors.php`

- `api/README.md`

- `include/api_response.php` (standardized response helper)

**Files to Enhance:**

- All existing API files

**Definition of Done:**

- All operations available via API
- CORS configured

- API documented

- Pagination implemented

- Consistent error handling

## Highest Leverage Fixes (Priority Order)

1. **SQL Injection Prevention** (Critical)

- Convert to prepared statements immediately

- Risk: High security vulnerability

- Files: All PHP files with SQL queries

2. **Service Layer Extraction** (Foundation)

- Move business logic out of pages

- Enables API creation and testing

- Files: Create `services/` directory, refactor booking logic

3. **Input Validation** (Security)

- Prevent invalid data and attacks

- Files: Create `include/validation.php`, add to all endpoints

4. **Booking Rules Implementation** (Business Logic)

- Cancellation cutoffs and registration windows

- Core TeamUp feature

- Files: `services/BookingService.php`, update `class_types` table

5. **Public Schedule Endpoint** (User Experience)

- Enable public browsing

- Low effort, high value

- Files: `public/schedule.php`, `api/classes.php`

6. **Role-Based Routing Fix** (Architecture)

- Proper instructor/member/admin separation

- Fixes fragile email lookup
- Files: `secure_login.php`, use `coaches` table properly

7. **Waitlist System** (Feature Gap)

- Add waitlist table and logic

- Files: Migration, `services/BookingService.php`

8. **Error Handling Standardization** (UX)

- Replace alerts with proper errors

- Files: `include/errors.php`, update all pages

9. **Database Constraints** (Data Integrity)

- Add missing indexes and check constraints

- Files: Migration script

10. **API Foundation** (Mobile Readiness)

    - Create REST API structure

    - Files: `api/` directory, JSON response helpers

## Architecture Evolution Target

```javascript
┌─────────────────────────────────────────────────────────┐
│              Web UI (PHP Pages)                         │
│  - dashboard/admin/*.php                                │
│  - dashboard/member/*.php                               │
│  - dashboard/coach/*.php                                │
│  - public/schedule.php                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              REST API Layer (api/*.php)                 │
│  - api/auth.php                                         │
│  - api/classes.php                                      │
│  - api/bookings.php                                     │
│  - api/instructors.php                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Service Layer (services/*.php)             │
│  - BookingService.php                                   │
│  - ClassService.php                                     │
│  - AuthService.php                                      │
│  - InstructorService.php                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Data Access Layer                          │
│  - include/db_conn.php                                  │
│  - include/db_helpers.php (prepared statement helpers) │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MySQL Database                             │
└─────────────────────────────────────────────────────────┘
```



## Risk Mitigation

- **SQL Injection**: Address in Phase 0 (highest priority)

- **Breaking Changes**: Maintain backward compatibility during refactor

- **Data Loss**: Backup database before migrations
- **Performance**: Add indexes before Phase 1