import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { BookingsService } from '../../src/bookings/bookings.service';
import { UserRole, BookingStatus, SessionStatus } from '@prisma/client';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let bookingsService: BookingsService;

  // Test data
  let testUser: any;
  let testClassType: any;
  let testInstructor: any;
  let testInstructorUser: any;
  let testSession: any;

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
    bookingsService = moduleFixture.get<BookingsService>(BookingsService);

    await app.init();

    // Setup test data
    testUser = await prismaService.user.create({
      data: {
        email: 'test-member@example.com',
        passwordHash: 'hashed-password',
        role: UserRole.MEMBER,
        name: 'Test Member',
      },
    });

    testInstructorUser = await prismaService.user.create({
      data: {
        email: 'test-instructor@example.com',
        passwordHash: 'hashed-password',
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

    testSession = await prismaService.classSession.create({
      data: {
        classTypeId: testClassType.id,
        instructorId: testInstructor.id,
        startsAt: new Date('2026-01-20T10:00:00Z'),
        endsAt: new Date('2026-01-20T10:25:00Z'),
        capacity: 10,
        location: 'Main Studio',
        status: SessionStatus.SCHEDULED,
      },
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prismaService.booking.deleteMany({
      where: { userId: testUser.id },
    });
    await prismaService.auditLog.deleteMany({
      where: { userId: testUser.id },
    });
    await prismaService.classSession.delete({
      where: { id: testSession.id },
    });
    await prismaService.classType.delete({
      where: { id: testClassType.id },
    });
    await prismaService.instructorProfile.delete({
      where: { id: testInstructor.id },
    });
    await prismaService.user.delete({
      where: { id: testInstructorUser.id },
    });
    await prismaService.user.delete({
      where: { id: testUser.id },
    });

    await app.close();
  });

  describe('POST /bookings', () => {
    it('should create a booking successfully', async () => {
      // Mock user in request (in real app, this comes from JWT)
      const mockRequest = { user: { id: testUser.id } };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send({ sessionId: testSession.id })
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe(BookingStatus.CONFIRMED);
      expect(response.body.data.sessionId).toBe(testSession.id);
      expect(response.body.data.userId).toBe(testUser.id);

      // Cleanup
      await prismaService.booking.delete({
        where: { id: response.body.data.id },
      });
    });

    it('should return error when capacity is full', async () => {
      // Fill up the session capacity
      const bookings = [];
      for (let i = 0; i < testSession.capacity; i++) {
        const user = await prismaService.user.create({
          data: {
            email: `capacity-test-${i}@example.com`,
            passwordHash: 'hashed',
            role: UserRole.MEMBER,
          },
        });
        bookings.push(
          await prismaService.booking.create({
            data: {
              sessionId: testSession.id,
              userId: user.id,
              status: BookingStatus.CONFIRMED,
            },
          }),
        );
      }

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send({ sessionId: testSession.id })
        .expect(400);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'CAPACITY_FULL');

      // Cleanup
      for (const booking of bookings) {
        const user = await prismaService.user.findUnique({
          where: { id: booking.userId },
        });
        await prismaService.booking.delete({ where: { id: booking.id } });
        await prismaService.user.delete({ where: { id: user.id } });
      }
    });

    it('should return error for duplicate booking', async () => {
      // Create first booking
      const booking = await prismaService.booking.create({
        data: {
          sessionId: testSession.id,
          userId: testUser.id,
          status: BookingStatus.CONFIRMED,
        },
      });

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send({ sessionId: testSession.id })
        .expect(400);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'DUPLICATE_BOOKING');

      // Cleanup
      await prismaService.booking.delete({ where: { id: booking.id } });
    });

    it('should return error for invalid sessionId', async () => {
      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send({ sessionId: 'non-existent-id' })
        .expect(404);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'BOOKING_NOT_FOUND');
    });

    it('should validate request body', async () => {
      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('ok', false);
    });
  });

  describe('DELETE /bookings/:id', () => {
    it('should cancel booking successfully before cutoff', async () => {
      // Create a booking for a future session
      const futureSession = await prismaService.classSession.create({
        data: {
          classTypeId: testClassType.id,
          instructorId: testInstructor.id,
          startsAt: new Date('2026-02-01T10:00:00Z'), // Far in future
          endsAt: new Date('2026-02-01T10:25:00Z'),
          capacity: 10,
          location: 'Main Studio',
          status: SessionStatus.SCHEDULED,
        },
      });

      const booking = await prismaService.booking.create({
        data: {
          sessionId: futureSession.id,
          userId: testUser.id,
          status: BookingStatus.CONFIRMED,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/bookings/${booking.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data.status).toBe(BookingStatus.CANCELLED);
      expect(response.body.data.cancelledAt).toBeDefined();

      // Cleanup
      await prismaService.classSession.delete({ where: { id: futureSession.id } });
    });

    it('should return error when cancellation cutoff passed', async () => {
      // Create a session that starts very soon (within cutoff)
      const soonSession = await prismaService.classSession.create({
        data: {
          classTypeId: testClassType.id,
          instructorId: testInstructor.id,
          startsAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          endsAt: new Date(Date.now() + 55 * 60 * 1000),
          capacity: 10,
          location: 'Main Studio',
          status: SessionStatus.SCHEDULED,
        },
      });

      const booking = await prismaService.booking.create({
        data: {
          sessionId: soonSession.id,
          userId: testUser.id,
          status: BookingStatus.CONFIRMED,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/bookings/${booking.id}`)
        .expect(400);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'CANCELLATION_CUTOFF_PASSED');

      // Cleanup
      await prismaService.booking.delete({ where: { id: booking.id } });
      await prismaService.classSession.delete({ where: { id: soonSession.id } });
    });

    it('should return error for non-existent booking', async () => {
      const response = await request(app.getHttpServer())
        .delete('/bookings/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'BOOKING_NOT_FOUND');
    });
  });

  describe('GET /bookings', () => {
    it('should return user bookings', async () => {
      // Create a test booking
      const booking = await prismaService.booking.create({
        data: {
          sessionId: testSession.id,
          userId: testUser.id,
          status: BookingStatus.CONFIRMED,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/bookings')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      // Cleanup
      await prismaService.booking.delete({ where: { id: booking.id } });
    });
  });
});


