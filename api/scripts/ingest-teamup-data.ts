import { UserRole, SessionStatus } from '@prisma/client';
import { getDbConnection, cleanup } from './prisma.script';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore - mysql2 types not available but module works at runtime
import * as mysql from 'mysql2/promise';
import * as crypto from 'crypto';

// Read TeamUp data from JSON file
const TEAMUP_DATA_FILE = process.env.TEAMUP_DATA_FILE || path.join(__dirname, '../../teamupdata.json');

interface TeamUpInstructor {
  id: string;
  name: string;
  email?: string;
}

interface TeamUpOfferingType {
  id: string;
  name: string;
  max_allowed_age?: number;
  min_allowed_age?: number;
}

interface TeamUpVenue {
  id: string;
  name: string;
}

interface TeamUpActiveRegistrationStatus {
  current_status?: string | null;
  restriction_codes?: string[];
  suggested_action?: string | null;
  registrations_open_at?: string;
  registrations_close_at?: string;
  late_cancels_after?: string;
}

interface TeamUpEvent {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  max_occupancy: number;
  occupancy?: number;
  attending_count?: number;
  instructors: TeamUpInstructor[];
  offering_type: TeamUpOfferingType;
  venue: TeamUpVenue;
  active_registration_status?: TeamUpActiveRegistrationStatus;
  description?: string;
}

interface TeamUpEventsResponse {
  results: TeamUpEvent[];
  next?: string;
  previous?: string;
  count?: number;
}

// Load events from JSON file
function loadEventsFromFile(): TeamUpEvent[] {
  console.log(`Loading events from ${TEAMUP_DATA_FILE}...`);
  
  if (!fs.existsSync(TEAMUP_DATA_FILE)) {
    throw new Error(`TeamUp data file not found: ${TEAMUP_DATA_FILE}`);
  }

  const fileContent = fs.readFileSync(TEAMUP_DATA_FILE, 'utf-8');
  const data: TeamUpEventsResponse = JSON.parse(fileContent);

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error('Invalid TeamUp data file format: missing results array');
  }

  console.log(`Loaded ${data.results.length} events from file`);
  return data.results;
}

// Map TeamUp instructor to User + InstructorProfile
async function mapInstructor(teamUpInstructor: TeamUpInstructor, db: mysql.Connection) {
  const instructorName = teamUpInstructor.name.trim();
  if (!instructorName) {
    return null;
  }

  // Check if user already exists by name
  const [existingUsers] = await db.execute(
    `SELECT u.id, u.email, ip.id as profile_id 
     FROM users u 
     LEFT JOIN instructor_profiles ip ON ip.user_id = u.id 
     WHERE u.name = ? AND u.role = ?`,
    [instructorName, UserRole.INSTRUCTOR]
  ) as any[];

  if (existingUsers.length > 0 && existingUsers[0].profile_id) {
    const profileId = existingUsers[0].profile_id;
    // Update external metadata if not already set
    const [existingProfile] = await db.execute(
      `SELECT external_source FROM instructor_profiles WHERE id = ?`,
      [profileId]
    ) as any[];
    if (!existingProfile[0]?.external_source) {
      const externalMetadata = JSON.stringify(teamUpInstructor);
      await db.execute(
        `UPDATE instructor_profiles 
         SET external_source = ?, external_id = ?, external_metadata = ?, updated_at = NOW() 
         WHERE id = ?`,
        ['TEAMUP', teamUpInstructor.id, externalMetadata, profileId]
      );
    }
    return { id: profileId };
  }

  // Generate email if not provided
  const email = teamUpInstructor.email || `${instructorName.toLowerCase().replace(/\s+/g, '.')}@hitsona.local`;

  // Check if email already exists
  const [existingByEmail] = await db.execute(
    `SELECT u.id, ip.id as profile_id 
     FROM users u 
     LEFT JOIN instructor_profiles ip ON ip.user_id = u.id 
     WHERE u.email = ?`,
    [email]
  ) as any[];

  if (existingByEmail.length > 0 && existingByEmail[0].profile_id) {
    const profileId = existingByEmail[0].profile_id;
    // Update external metadata if not already set
    const [existingProfile] = await db.execute(
      `SELECT external_source FROM instructor_profiles WHERE id = ?`,
      [profileId]
    ) as any[];
    if (!existingProfile[0]?.external_source) {
      const externalMetadata = JSON.stringify(teamUpInstructor);
      await db.execute(
        `UPDATE instructor_profiles 
         SET external_source = ?, external_id = ?, external_metadata = ?, updated_at = NOW() 
         WHERE id = ?`,
        ['TEAMUP', teamUpInstructor.id, externalMetadata, profileId]
      );
    }
    return { id: profileId };
  }

  // Create new user and instructor profile
  const userId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const passwordHash = 'PLACEHOLDER_PASSWORD_HASH'; // Instructors will need to reset password

  await db.execute(
    `INSERT INTO users (id, email, password_hash, role, name, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [userId, email, passwordHash, UserRole.INSTRUCTOR, instructorName]
  );

  const externalMetadata = JSON.stringify(teamUpInstructor);
  await db.execute(
    `INSERT INTO instructor_profiles (id, user_id, active, external_source, external_id, external_metadata, created_at, updated_at) 
     VALUES (?, ?, true, ?, ?, ?, NOW(), NOW())`,
    [profileId, userId, 'TEAMUP', teamUpInstructor.id, externalMetadata]
  );

  console.log(`  Created instructor: ${instructorName} (${email})`);
  return { id: profileId };
}

// Map TeamUp offering type to ClassType
async function mapClassType(
  className: string,
  offeringType: TeamUpOfferingType | undefined,
  db: mysql.Connection,
  sampleDuration?: number
) {
  const trimmedName = className.trim();
  if (!className) {
    return null;
  }

  // Check if class type already exists
  const [existing] = await db.execute(
    `SELECT id, duration_minutes, external_source FROM class_types WHERE name = ?`,
    [className]
  ) as any[];

  if (existing.length > 0) {
    const existingType = existing[0];
    // Update duration if we have a sample and it's different
    if (sampleDuration && existingType.duration_minutes !== sampleDuration) {
      await db.execute(
        `UPDATE class_types SET duration_minutes = ?, updated_at = NOW() WHERE id = ?`,
        [sampleDuration, existingType.id]
      );
      console.log(`  Updated class type ${className} duration to ${sampleDuration} minutes`);
    }
    // Update external metadata if not already set and we have offering type data
    if (!existingType.external_source && offeringType) {
      const externalMetadata = JSON.stringify(offeringType);
      // Use offering_type.id if available, otherwise use class name as external_id
      const externalId = offeringType.id || className;
      await db.execute(
        `UPDATE class_types 
         SET external_source = ?, external_id = ?, external_metadata = ?, updated_at = NOW() 
         WHERE id = ?`,
        ['TEAMUP', externalId, externalMetadata, existingType.id]
      );
    }
    return { id: existingType.id };
  }

  // Calculate duration from sample or use default 25 minutes
  const durationMinutes = sampleDuration || 25;
  const defaultCapacity = 10;
  const classTypeId = crypto.randomUUID();
  
  const externalSource = 'TEAMUP';
  // Use offering_type.id if available, otherwise use class name as external_id
  const externalId = offeringType?.id || className;
  const externalMetadata = offeringType ? JSON.stringify(offeringType) : JSON.stringify({ name: className });

  await db.execute(
    `INSERT INTO class_types (id, name, duration_minutes, default_capacity, active, external_source, external_id, external_metadata, created_at, updated_at) 
     VALUES (?, ?, ?, ?, true, ?, ?, ?, NOW(), NOW())`,
    [classTypeId, className, durationMinutes, defaultCapacity, externalSource, externalId, externalMetadata]
  );

  console.log(`  Created class type: ${className} (${durationMinutes} min)`);
  return { id: classTypeId };
}

// Map TeamUp event to ClassSession
async function mapSession(
  event: TeamUpEvent,
  classTypeId: string,
  instructorProfileId: string,
  db: mysql.Connection
) {
  const startsAt = new Date(event.starts_at);
  const endsAt = new Date(event.ends_at);

  // Check for duplicate session (same start time + instructor)
  const [existing] = await db.execute(
    `SELECT id, external_source FROM class_sessions WHERE starts_at = ? AND instructor_id = ?`,
    [startsAt, instructorProfileId]
  ) as any[];

  if (existing.length > 0) {
    const existingId = existing[0].id;
    // Update external metadata if not already set
    if (!existing[0].external_source) {
      const externalSource = 'TEAMUP';
      const externalId = event.id;
      const externalMetadata = JSON.stringify({
        id: event.id,
        name: event.name,
        venue: event.venue,
        offering_type: event.offering_type,
        active_registration_status: event.active_registration_status,
        description: event.description,
      });
      await db.execute(
        `UPDATE class_sessions 
         SET external_source = ?, external_id = ?, external_metadata = ?, updated_at = NOW() 
         WHERE id = ?`,
        [externalSource, externalId, externalMetadata, existingId]
      );
    }
    return { id: existingId };
  }

  // Parse registration windows from active_registration_status
  let registrationOpens: Date | null = null;
  let registrationCloses: Date | null = null;

  if (event.active_registration_status) {
    if (event.active_registration_status.registrations_open_at) {
      registrationOpens = new Date(event.active_registration_status.registrations_open_at);
    }
    if (event.active_registration_status.registrations_close_at) {
      registrationCloses = new Date(event.active_registration_status.registrations_close_at);
    }
  }

  // Map venue name to location
  const location = event.venue?.name || 'Main Studio';
  const sessionId = crypto.randomUUID();
  const capacity = event.max_occupancy || 10;
  
  // Prepare external metadata
  const externalSource = 'TEAMUP';
  const externalId = event.id;
  const externalMetadata = JSON.stringify({
    id: event.id,
    name: event.name,
    venue: event.venue,
    offering_type: event.offering_type,
    active_registration_status: event.active_registration_status,
    description: event.description,
  });

  await db.execute(
    `INSERT INTO class_sessions 
     (id, class_type_id, instructor_id, starts_at, ends_at, capacity, location, status, registration_opens, registration_closes, external_source, external_id, external_metadata, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      sessionId,
      classTypeId,
      instructorProfileId,
      startsAt,
      endsAt,
      capacity,
      location,
      SessionStatus.SCHEDULED,
      registrationOpens,
      registrationCloses,
      externalSource,
      externalId,
      externalMetadata,
    ]
  );

  return { id: sessionId };
}


// Main ingestion function
async function ingestData() {
  console.log('Starting TeamUp data ingestion from JSON file...');
  console.log('');

  // Initialize database connection using mysql2 (bypasses PrismaClient issue)
  const db = await getDbConnection();
  console.log('Database connection established\n');

  try {
    // Step 1: Load all events from JSON file
    const events = loadEventsFromFile();
    console.log(`\nTotal events loaded: ${events.length}`);

    if (events.length === 0) {
      console.log('No events found. Exiting.');
      return;
    }

    // Step 2: Extract unique instructors and class types
    const uniqueInstructors = new Map<string, TeamUpInstructor>();
    const uniqueClassTypes = new Map<string, TeamUpOfferingType>();

    for (const event of events) {
      for (const instructor of event.instructors || []) {
        if (instructor.name && !uniqueInstructors.has(instructor.name)) {
          uniqueInstructors.set(instructor.name, instructor);
        }
      }
      // Extract class type from event name (event.name contains the class type name)
      // Use offering_type if available, otherwise use event name
      const className = event.name || event.offering_type?.name;
      if (className) {
        if (!uniqueClassTypes.has(className)) {
          uniqueClassTypes.set(className, event.offering_type || { id: '', name: className });
        }
      }
    }

    console.log(`\nFound ${uniqueInstructors.size} unique instructors`);
    console.log(`Found ${uniqueClassTypes.size} unique class types`);

    // Step 3: Map instructors
    console.log('\nMapping instructors...');
    const instructorMap = new Map<string, string>(); // TeamUp name -> InstructorProfile ID
    
    for (const [name, instructor] of uniqueInstructors) {
      try {
        const profile = await mapInstructor(instructor, db);
        if (profile) {
          instructorMap.set(name, profile.id);
        }
      } catch (error) {
        console.error(`Error mapping instructor ${name}:`, error);
      }
    }

    // Step 4: Map class types (with duration calculation from actual sessions)
    console.log('\nMapping class types...');
    const classTypeMap = new Map<string, string>(); // TeamUp name -> ClassType ID
    const classTypeDurations = new Map<string, number>(); // TeamUp name -> average duration
    
    // Calculate average durations from actual events
    for (const event of events) {
      // Extract class type name from event name (since offering_type.name might not be in JSON)
      const className = event.name || event.offering_type?.name;
      if (className && event.starts_at && event.ends_at) {
        const startsAt = new Date(event.starts_at);
        const endsAt = new Date(event.ends_at);
        const durationMinutes = Math.round((endsAt.getTime() - startsAt.getTime()) / (1000 * 60));
        
        if (durationMinutes > 0) {
          const className = event.name || event.offering_type?.name;
          if (!className) continue;
          const existing = classTypeDurations.get(className);
          if (!existing) {
            classTypeDurations.set(className, durationMinutes);
          } else {
            // Average with existing
            const avg = Math.round((existing + durationMinutes) / 2);
            classTypeDurations.set(className, avg);
          }
        }
      }
    }
    
    for (const [name, offeringType] of uniqueClassTypes) {
      try {
        const sampleDuration = classTypeDurations.get(name);
        const mapped = await mapClassType(name, offeringType, db, sampleDuration);
        if (mapped) {
          classTypeMap.set(name, mapped.id);
        }
      } catch (error) {
        console.error(`Error mapping class type ${name}:`, error);
      }
    }

    // Step 5: Map sessions
    console.log('\nMapping sessions...');
    let sessionsCreated = 0;
    let sessionsSkipped = 0;

    for (const event of events) {
      try {
        // Get class type ID (use event name as fallback)
        const classTypeName = event.name || event.offering_type?.name;
        if (!classTypeName || !classTypeMap.has(classTypeName)) {
          console.warn(`  Skipping event ${event.id}: unknown class type "${classTypeName}"`);
          sessionsSkipped++;
          continue;
        }
        const classTypeId = classTypeMap.get(classTypeName)!;

        // Get instructor ID (use first instructor)
        const instructor = event.instructors?.[0];
        if (!instructor || !instructor.name || !instructorMap.has(instructor.name)) {
          console.warn(`  Skipping event ${event.id}: no valid instructor`);
          sessionsSkipped++;
          continue;
        }
        const instructorProfileId = instructorMap.get(instructor.name)!;

        // Check if session already exists
        const startsAt = new Date(event.starts_at);
        const [existing] = await db.execute(
          `SELECT id, external_source FROM class_sessions WHERE starts_at = ? AND instructor_id = ?`,
          [startsAt, instructorProfileId]
        ) as any[];

        if (existing.length > 0) {
          // Update external metadata if not already set
          if (!existing[0].external_source) {
            const externalSource = 'TEAMUP';
            const externalId = event.id;
            const externalMetadata = JSON.stringify({
              id: event.id,
              name: event.name,
              venue: event.venue,
              offering_type: event.offering_type,
              active_registration_status: event.active_registration_status,
              description: event.description,
            });
            await db.execute(
              `UPDATE class_sessions 
               SET external_source = ?, external_id = ?, external_metadata = ?, updated_at = NOW() 
               WHERE id = ?`,
              [externalSource, externalId, externalMetadata, existing[0].id]
            );
          }
          sessionsSkipped++;
          continue;
        }

        // Create session
        await mapSession(event, classTypeId, instructorProfileId, db);
        sessionsCreated++;

        if (sessionsCreated % 50 === 0) {
          console.log(`  Created ${sessionsCreated} sessions...`);
        }
      } catch (error) {
        console.error(`Error mapping session ${event.id}:`, error);
        sessionsSkipped++;
      }
    }

    console.log(`\nIngestion complete!`);
    console.log(`  Sessions created: ${sessionsCreated}`);
    console.log(`  Sessions skipped: ${sessionsSkipped}`);
    console.log(`  Instructors: ${instructorMap.size}`);
    console.log(`  Class types: ${classTypeMap.size}`);

  } catch (error) {
    console.error('Fatal error during ingestion:', error);
    throw error;
  }
}

// Run the script
async function main() {
  try {
    await ingestData();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

main();

