---
name: Fix PrismaClient Script Initialization
overview: Fix PrismaClient initialization error in Node scripts by creating a shared script factory that explicitly configures the datasource URL, and updating the ingestion script to use it.
todos: []
---

# Fix Pri

smaClient Initialization for Node Scripts

## Problem

Prisma 7.x requires explicit datasource configuration when `PrismaClient` is instantiated outside NestJS DI context. Scripts fail with:

```javascript
PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid PrismaClientOptions`
```



## Solution

Create a shared Prisma client factory for scripts that explicitly provides the datasource URL.

## Implementation

### Step 1: Create Script Prisma Client Factory

**File**: `api/src/prisma/prisma.script.ts`

- Import `PrismaClient` from `@prisma/client`

- Import `dotenv/config` to ensure environment variables are loaded

- Validate `process.env.DATABASE_URL` exists, exit with error if missing

- Create and export a singleton `PrismaClient` instance with explicit datasource:

  ```typescript
    new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  ```

- Export the instance as `prisma`

### Step 2: Update Ingestion Script

**File**: `api/scripts/ingest-teamup-data.ts`

- Remove direct `PrismaClient` import (keep `UserRole`, `SessionStatus` enums)

- Remove `dotenv` import and `dotenv.config()` call (handled by factory)

- Remove `getPrisma()` function and lazy initialization pattern

- Remove DATABASE_URL validation (handled by factory)

- Import `prisma` from `../src/prisma/prisma.script`

- Replace all `getPrisma()` calls with direct `prisma` usage

- Update `main()` function's finally block to use `prisma.$disconnect()` directly

### Step 3: Validation

- Run `TEST_MODE=true npm run ingest:teamup` to verify:
- PrismaClient initializes successfully

- Script reaches database queries

- No initialization errors

## Files to Modify

1. **Create**: `api/src/prisma/prisma.script.ts` - Script Prisma client factory

2. **Modify**: `api/scripts/ingest-teamup-data.ts` - Use factory instead of direct instantiation

## Notes

- Do NOT modify `api/src/prisma/prisma.service.ts` (NestJS service remains unchanged)

- Do NOT change Prisma version

- Do NOT modify ingestion logic, only PrismaClient initialization