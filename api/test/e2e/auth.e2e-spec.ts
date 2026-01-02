import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

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
  });

  afterAll(async () => {
    // Cleanup test users
    await prismaService.user.deleteMany({
      where: {
        email: {
          in: ['test-register@example.com', 'test-login@example.com', 'test-me@example.com'],
        },
      },
    });

    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test-register@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe('test-register@example.com');
      expect(response.body.data.user.role).toBe(UserRole.MEMBER);

      // Cleanup
      await prismaService.user.delete({
        where: { email: 'test-register@example.com' },
      });
    });

    it('should return error for duplicate email', async () => {
      // Create user first
      await prismaService.user.create({
        data: {
          email: 'duplicate@example.com',
          passwordHash: 'hashed',
          role: UserRole.MEMBER,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
        })
        .expect(409);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'EMAIL_ALREADY_EXISTS');

      // Cleanup
      await prismaService.user.delete({
        where: { email: 'duplicate@example.com' },
      });
    });

    it('should validate request body', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'short', // Too short
        })
        .expect(400);

      expect(response.body).toHaveProperty('ok', false);
    });
  });

  describe('POST /auth/login', () => {
    let testUser: any;
    const testPassword = 'password123';

    beforeAll(async () => {
      // Create test user with hashed password
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash(testPassword, 10);

      testUser = await prismaService.user.create({
        data: {
          email: 'test-login@example.com',
          passwordHash,
          role: UserRole.MEMBER,
          name: 'Test Login User',
        },
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test-login@example.com',
          password: testPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user.email).toBe('test-login@example.com');
    });

    it('should return error for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testPassword,
        })
        .expect(401);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'INVALID_CREDENTIALS');
    });

    it('should return error for invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.error).toHaveProperty('code', 'INVALID_CREDENTIALS');
    });
  });

  describe('GET /auth/me', () => {
    let testUser: any;
    let accessToken: string;

    beforeAll(async () => {
      // Create test user
      testUser = await prismaService.user.create({
        data: {
          email: 'test-me@example.com',
          passwordHash: 'hashed',
          role: UserRole.MEMBER,
          name: 'Test Me User',
        },
      });

      // Login to get token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test-me@example.com',
          password: 'password123',
        });

      // If login fails, create token manually for testing
      if (loginResponse.status === 200) {
        accessToken = loginResponse.body.data.accessToken;
      } else {
        // Create token manually using JWT service
        const jwt = require('jsonwebtoken');
        accessToken = jwt.sign(
          { sub: testUser.id, role: testUser.role },
          process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        );
      }
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('id', testUser.id);
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data).not.toHaveProperty('passwordHash');
    });

    it('should return unauthorized without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('ok', false);
    });

    it('should return unauthorized with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('ok', false);
    });
  });
});


