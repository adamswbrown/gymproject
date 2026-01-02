import 'dotenv/config';
// @ts-ignore - mysql2 types not available but module works at runtime
import * as mysql from 'mysql2/promise';
import { PrismaClient, UserRole, SessionStatus } from '@prisma/client';

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error('Please ensure .env file exists with DATABASE_URL');
  process.exit(1);
}

// Parse DATABASE_URL (format: mysql://user:password@host:port/database)
function parseDatabaseUrl(url: string): { host: string; port: number; user: string; password: string; database: string } {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
  };
}

let dbConnection: mysql.Connection | null = null;
let prismaClient: PrismaClient | null = null;

// Get database connection using mysql2 (bypasses PrismaClient initialization issue)
export async function getDbConnection(): Promise<mysql.Connection> {
  if (!dbConnection) {
    const config = parseDatabaseUrl(process.env.DATABASE_URL!);
    dbConnection = await (mysql as any).createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    console.log('Database connection established via mysql2');
  }
  return dbConnection;
}

// Get PrismaClient for type-safe queries (only if needed)
// This will fail with Prisma 7.2.0, but we can use raw SQL instead
export async function getPrisma(): Promise<any> {
  // Try to use PrismaClient, but fall back to raw SQL if it fails
  if (!prismaClient) {
    try {
      prismaClient = new PrismaClient();
      await prismaClient.$connect();
      console.log('PrismaClient connected successfully');
      return prismaClient;
    } catch (error) {
      console.warn('PrismaClient initialization failed, using raw SQL instead');
      return null;
    }
  }
  return prismaClient;
}

// Cleanup function
export async function cleanup() {
  if (dbConnection) {
    await dbConnection.end();
    dbConnection = null;
  }
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}

// Export enums for use in scripts
export { UserRole, SessionStatus };
