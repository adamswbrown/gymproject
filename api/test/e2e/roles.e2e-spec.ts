import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

describe('Role Enforcement (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  let memberUser: any;
  let memberToken: string;
  let instructorUser: any;
  let instructorToken: string;

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

    // Create member user
    const bcrypt = require('bcrypt');
    const memberPasswordHash = await bcrypt.hash('password123', 10);

    memberUser = await prismaService.user.create({
      data: {
        email: 'test-member-roles@example.com',
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
        name: 'Test Member',
      },
    });

    // Create instructor user
    const instructorPasswordHash = await bcrypt.hash('password123', 10);

    instructorUser = await prismaService.user.create({
      data: {
        email: 'test-instructor-roles@example.com',
        passwordHash: instructorPasswordHash,
        role: UserRole.INSTRUCTOR,
        name: 'Test Instructor',
      },
    });

    // Get tokens
    const memberLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test-member-roles@example.com',
        password: 'password123',
      });

    memberToken = memberLogin.body.data?.accessToken;

    const instructorLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test-instructor-roles@example.com',
        password: 'password123',
      });

    instructorToken = instructorLogin.body.data?.accessToken;

    // If login fails, create tokens manually
    if (!memberToken) {
      const jwt = require('jsonwebtoken');
      memberToken = jwt.sign(
        { sub: memberUser.id, role: memberUser.role },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      );
    }

    if (!instructorToken) {
      const jwt = require('jsonwebtoken');
      instructorToken = jwt.sign(
        { sub: instructorUser.id, role: instructorUser.role },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      );
    }
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: {
        email: {
          in: ['test-member-roles@example.com', 'test-instructor-roles@example.com'],
        },
      },
    });

    await app.close();
  });

  describe('MEMBER role access', () => {
    it('should allow MEMBER to access /bookings', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .set('Authorization', `Bearer ${memberToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
    });

    it('should allow MEMBER to POST /bookings', async () => {
      // This will fail due to missing session, but should pass auth
      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ sessionId: 'non-existent' })
        .expect(404); // Not 403, so auth passed

      expect(response.body).toHaveProperty('ok', false);
    });

    it('should prevent MEMBER from accessing instructor routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/instructors/me/sessions')
        .set('Authorization', `Bearer ${memberToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'FORBIDDEN');
    });
  });

  describe('INSTRUCTOR role access', () => {
    it('should allow INSTRUCTOR to access instructor routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/instructors/me/sessions')
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
    });

    it('should prevent INSTRUCTOR from accessing member booking routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'FORBIDDEN');
    });
  });

  describe('Unauthenticated access', () => {
    it('should prevent unauthenticated access to protected routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .expect(401);

      expect(response.body).toHaveProperty('ok', false);
    });

    it('should allow unauthenticated access to public routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/public/schedule')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
    });
  });

  describe('Invalid token', () => {
    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('ok', false);
    });

    it('should return 401 for malformed token', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .set('Authorization', 'Bearer not.a.valid.jwt')
        .expect(401);

      expect(response.body).toHaveProperty('ok', false);
    });
  });
});


