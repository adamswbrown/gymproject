import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserRole, SessionStatus } from '@prisma/client';

describe('PublicController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  let testClassType: any;
  let testInstructor: any;
  let testInstructorUser: any;
  let testSession: any;
  let testSessionPast: any;
  let testSessionCancelled: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    // Setup test data
    testInstructorUser = await prismaService.user.create({
      data: {
        email: 'test-instructor-public@example.com',
        passwordHash: 'hashed',
        role: UserRole.INSTRUCTOR,
        name: 'Test Instructor',
      },
    });

    testInstructor = await prismaService.instructorProfile.create({
      data: {
        userId: testInstructorUser.id,
        specialization: 'HIIT',
        active: true,
      },
    });

    testClassType = await prismaService.classType.create({
      data: {
        name: 'HIIT',
        description: 'High Intensity Interval Training',
        durationMinutes: 25,
        defaultCapacity: 10,
        cancellationCutoffHours: 2,
        active: true,
      },
    });

    // Future session
    testSession = await prismaService.classSession.create({
      data: {
        classTypeId: testClassType.id,
        instructorId: testInstructor.id,
        startsAt: new Date('2026-02-01T10:00:00Z'),
        endsAt: new Date('2026-02-01T10:25:00Z'),
        capacity: 10,
        location: 'Main Studio',
        status: SessionStatus.SCHEDULED,
      },
    });

    // Past session (should not appear)
    testSessionPast = await prismaService.classSession.create({
      data: {
        classTypeId: testClassType.id,
        instructorId: testInstructor.id,
        startsAt: new Date('2020-01-01T10:00:00Z'),
        endsAt: new Date('2020-01-01T10:25:00Z'),
        capacity: 10,
        location: 'Main Studio',
        status: SessionStatus.SCHEDULED,
      },
    });

    // Cancelled session (should not appear)
    testSessionCancelled = await prismaService.classSession.create({
      data: {
        classTypeId: testClassType.id,
        instructorId: testInstructor.id,
        startsAt: new Date('2026-02-02T10:00:00Z'),
        endsAt: new Date('2026-02-02T10:25:00Z'),
        capacity: 10,
        location: 'Main Studio',
        status: SessionStatus.CANCELLED,
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prismaService.classSession.deleteMany({
      where: {
        id: {
          in: [testSession.id, testSessionPast.id, testSessionCancelled.id],
        },
      },
    });
    await prismaService.classType.delete({ where: { id: testClassType.id } });
    await prismaService.instructorProfile.delete({ where: { id: testInstructor.id } });
    await prismaService.user.delete({ where: { id: testInstructorUser.id } });

    await app.close();
  });

  describe('GET /public/schedule', () => {
    it('should return schedule without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should only return SCHEDULED sessions', async () => {
      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .expect(200);

      const sessions = response.body.data;
      const cancelledSession = sessions.find((s: any) => s.id === testSessionCancelled.id);
      expect(cancelledSession).toBeUndefined();
    });

    it('should include capacity information', async () => {
      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .expect(200);

      const session = response.body.data.find((s: any) => s.id === testSession.id);
      expect(session).toBeDefined();
      expect(session).toHaveProperty('capacity');
      expect(session).toHaveProperty('confirmedCount');
      expect(session).toHaveProperty('remainingCapacity');
      expect(session).toHaveProperty('registrationOpen');
    });

    it('should filter by date range', async () => {
      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .query({
          from: '2026-01-01T00:00:00Z',
          to: '2026-02-15T23:59:59Z',
        })
        .expect(200);

      const sessions = response.body.data;
      expect(sessions.length).toBeGreaterThan(0);
      const foundSession = sessions.find((s: any) => s.id === testSession.id);
      expect(foundSession).toBeDefined();
    });

    it('should filter by classTypeId', async () => {
      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .query({
          classTypeId: testClassType.id,
        })
        .expect(200);

      const sessions = response.body.data;
      expect(sessions.every((s: any) => s.classType.id === testClassType.id)).toBe(true);
    });

    it('should filter by instructorId', async () => {
      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .query({
          instructorId: testInstructor.id,
        })
        .expect(200);

      const sessions = response.body.data;
      expect(sessions.every((s: any) => s.instructor.id === testInstructor.id)).toBe(true);
    });

    it('should not expose booking user data', async () => {
      // Create a booking
      const testUser = await prismaService.user.create({
        data: {
          email: 'test-booking-user@example.com',
          passwordHash: 'hashed',
          role: UserRole.MEMBER,
        },
      });

      await prismaService.booking.create({
        data: {
          sessionId: testSession.id,
          userId: testUser.id,
          status: 'CONFIRMED',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .expect(200);

      const session = response.body.data.find((s: any) => s.id === testSession.id);
      expect(session).toBeDefined();
      expect(session).not.toHaveProperty('bookings');
      expect(session).toHaveProperty('confirmedCount', 1);

      // Cleanup
      await prismaService.booking.deleteMany({
        where: { sessionId: testSession.id },
      });
      await prismaService.user.delete({ where: { id: testUser.id } });
    });
  });
});


