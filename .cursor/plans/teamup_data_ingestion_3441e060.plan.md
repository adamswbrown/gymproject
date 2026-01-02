---
name: TeamUp Data Ingestion (HTTP API)
overview: Fetch schedule items and coaches from TeamUp API using HTTP requests and import into database
todos: []
---

# TeamUp Data Ingestion Plan (HTTP API)

## Overview

Fetch schedule items and coaches from TeamUp API (Hitsona Bangor) using HTTP requests and import them into the gym booking database. Data range: today until July 2026.

## Data Sources

**API Endpoint**: `https://goteamup.com/api/v2/events`

**Key Headers Required**:

- `authorization: Token pLCQp5GdjVe6K9itv85L9NyHIvQxWg` (may need to be refreshed)
- `teamup-provider-id: 5289026`
- `teamup-request-mode: customer`
- `accept: application/json`

**Instructors identified**:

- Clare Cuming
- Conor Bates
- Gav Cunningham
- Jacki Montgomery
- Josh Bunting
- Rory Stephens

**Class Types identified**:

- CORE
- HIIT
- PT Session
- Sports Day!

## Implementation Approach

### A) Create Data Ingestion Script

**File**: `api/scripts/ingest-teamup-data.ts`

**Script structure**:

1. Use HTTP requests (fetch/axios) to TeamUp API
2. Fetch events in date range chunks (handle pagination)
3. Fetch instructors from API (if separate endpoint available)
4. Map TeamUp JSON data to our schema
5. Import into database using Prisma

### B) API Request Strategy

**Events Endpoint**:

```
GET https://goteamup.com/api/v2/events?
  starts_at_gte={start_date}T00:00+00:00&
  starts_at_lte={end_date}T23:59+00:00&
  page_size=100&
  sort=start&
  status=active&
  expand=instructors,active_registration_status,category,offering_type,venue&
  fields=id,name,max_occupancy,starts_at,ends_at,venue,instructors,offering_type,active_registration_status
```

**Pagination**:

- Use `page_size=100` (max per request)
- Check response for pagination metadata
- Loop through pages until all data retrieved

**Date Range Strategy**:

- Split into monthly chunks (today to July 2026)
- Process each month separately
- Handle pagination within each month

### C) Data Mapping

**Instructors Mapping**:

- TeamUp instructor object → Our `User` + `InstructorProfile`
- Create User with:
  - role=INSTRUCTOR
  - name from TeamUp `instructors[].name`
  - email (if available in API response, else generate placeholder like `{name.lower}@hitsona.local`)
- Create InstructorProfile linked to User
- Handle duplicates by checking existing users by name

**Class Types Mapping**:

- TeamUp `offering_type.name` → Our `ClassType`
- Map: CORE, HIIT, PT Session, Sports Day!
- Set defaults:
  - durationMinutes: Calculate from `starts_at` and `ends_at` (or default 25)
  - defaultCapacity: Use `max_occupancy` from API or default 10
  - active: true
- Handle duplicates by checking existing class types by name

**Sessions Mapping**:

- TeamUp event → Our `ClassSession`
- Map fields:
  - `starts_at` → `startsAt` (already in ISO format, convert to UTC if needed)
  - `ends_at` → `endsAt` (already in ISO format)
  - `max_occupancy` → `capacity`
  - `venue.name` → `location` (or "Main Studio" if not available)
  - `active_registration_status` → parse `registrationOpens`/`registrationCloses`
  - `offering_type.name` → link to ClassType
  - `instructors[0].name` → link to InstructorProfile
- Handle duplicates by checking existing sessions by `startsAt` + `instructorId`

### D) Date/Time Handling

**API Response Format**:

- Dates are in ISO 8601 format: `2025-12-29T07:00:00+00:00`
- Timezone appears to be UTC in API response
- No conversion needed if API returns UTC

**Registration Windows**:

- Parse from `active_registration_status` object if available
- Or calculate from registration rules if provided
- Set `registrationOpens` and `registrationCloses` accordingly

### E) Script Implementation

**HTTP Client**:

- Use Node.js `fetch` or `axios`
- Set required headers from CURL example
- Handle rate limiting (add delays between requests)
- Handle authentication token refresh if needed

**Error Handling**:

- Handle missing data gracefully
- Skip duplicates (check existing records)
- Log errors but continue processing
- Validate data before insertion
- Handle API rate limits (429 responses)

### F) Script Execution

- Run via: `npx ts-node api/scripts/ingest-teamup-data.ts`
- Or add to package.json scripts
- Should be idempotent (safe to run multiple times)
- Progress logging for long-running imports

## Prisma Schema Mapping

**TeamUp API → Our Schema**:

| TeamUp Field | Our Model | Our Field | Notes |

|-------------|-----------|-----------|-------|

| `instructors[].name` | User | name | Direct mapping |

| `instructors[].email` | User | email | If available, else placeholder |

| `offering_type.name` | ClassType | name | Direct mapping |

| `starts_at` | ClassSession | startsAt | ISO format, convert to Date |

| `ends_at` | ClassSession | endsAt | ISO format, convert to Date |

| `max_occupancy` | ClassSession | capacity | Direct mapping |

| `venue.name` | ClassSession | location | "Hitsona Bangor" → "Main Studio" |

| `active_registration_status` | ClassSession | registrationOpens/Closes | Parse from object |

| Calculated | ClassType | durationMinutes | From starts_at - ends_at |

## Implementation Steps

1. Create script file with HTTP client setup
2. Implement API request function with proper headers
3. Implement pagination handling
4. Implement date range chunking (monthly)
5. Implement instructor extraction and mapping
6. Implement class type extraction and mapping
7. Implement session extraction and mapping
8. Implement timezone handling (verify API timezone)
9. Implement database insertion with deduplication
10. Add error handling and logging
11. Test with small date range first
12. Run full import (today to July 2026)

## Notes

- API requires authorization token (may need to be refreshed periodically)
- API uses pagination (page_size=100)
- Dates in API response appear to be UTC already
- `max_occupancy` available in API (better than scraping)
- `active_registration_status` object may contain registration window info
- Need to handle rate limiting gracefully
- Token from CURL may expire - may need to extract from browser session