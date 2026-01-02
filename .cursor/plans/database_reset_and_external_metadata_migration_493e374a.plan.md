---
name: Database Reset and External Metadata Migration
overview: Reset database to create Prisma schema tables, then add external metadata fields (externalSource, externalId, externalMetadata) to ClassType, ClassSession, and InstructorProfile models for TeamUp and future system traceability.
todos: []
---

# Database Reset and External M

etadata Migration

## Overview

1. Reset database to create Prisma schema tables (with user consent)

2. Add external metadata fields to support data ingestion traceability

3. Generate and apply migration

## Implementation Steps

### Step 1: Reset Database Schema

**Action**: Run `npx prisma db push --force-reset` with user consent

- This will drop existing tables and create Prisma schema tables

- User has explicitly consented to proceed

- Use environment variable: `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` with user's consent message

### Step 2: Add External Metadata to ClassType Model

**File**: `api/prisma/schema.prisma`

Add to ClassType model (after existing fields, before `@@map`):

```prisma
externalSource   String?   @map("external_source")
externalId       String?   @map("external_id")
externalMetadata Json?     @map("external_metadata")
```



Add composite index (after existing `@@index`):

```prisma
@@index([externalSource, externalId])
```



### Step 3: Add External Metadata to ClassSession Model

**File**: `api/prisma/schema.prisma`

Add to ClassSession model (after existing fields, before `@@map`):

```prisma
externalSource   String?   @map("external_source")
externalId       String?   @map("external_id")
externalMetadata Json?     @map("external_metadata")
```



Add composite index (after existing `@@index`):

```prisma
@@index([externalSource, externalId])
```



### Step 4: Add External Metadata to InstructorProfile Model

**File**: `api/prisma/schema.prisma`

Add to InstructorProfile model (after existing fields, before `@@map`):

```prisma
externalSource   String?   @map("external_source")
externalId       String?   @map("external_id")
externalMetadata Json?     @map("external_metadata")
```



Add composite index (after existing `@@index`):

```prisma
@@index([externalSource, externalId])
```



### Step 5: Generate and Apply Migration

**Commands**:

1. `npx prisma migrate dev --name add_external_metadata_support`

2. Verify migration file created in `prisma/migrations/`

3. Confirm Prisma client regenerates successfully

### Step 6: Verify Schema

- Confirm all three models have the new optional fields

- Confirm composite indexes are created

- Verify no existing queries break (schema is backward compatible)

## Files to Modify

1. **`api/prisma/schema.prisma`** - Add external metadata fields and indexes to:

- ClassType model

- ClassSession model  

- InstructorProfile model

2. **Migration file** (auto-generated) - `prisma/migrations/YYYYMMDDHHMMSS_add_external_metadata_support/migration.sql`

## Validation

After completion:

- Print updated model sections showing new fields

- Confirm migration name

- Verify database tables have new columns