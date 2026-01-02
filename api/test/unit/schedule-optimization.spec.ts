import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from '../../src/classes/classes.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SessionStatus, BookingStatus } from '@prisma/client';

describe('ClassesService - Schedule Optimization', () => {
  let service: ClassesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    classSession: {
      findMany: jest.fn(),
    },
    booking: {
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getPublicSchedule - Capacity Count Optimization', () => {
    it('should use groupBy to count bookings in a single query (O(1) DB round trips)', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          startsAt: new Date('2026-01-20T10:00:00Z'),
          endsAt: new Date('2026-01-20T10:25:00Z'),
          capacity: 10,
          classType: { id: 'type-1', name: 'HIIT' },
          instructor: { id: 'instructor-1', user: { name: 'John' } },
          registrationOpens: null,
          registrationCloses: null,
        },
        {
          id: 'session-2',
          startsAt: new Date('2026-01-21T10:00:00Z'),
          endsAt: new Date('2026-01-21T10:25:00Z'),
          capacity: 15,
          classType: { id: 'type-1', name: 'HIIT' },
          instructor: { id: 'instructor-1', user: { name: 'John' } },
          registrationOpens: null,
          registrationCloses: null,
        },
      ];

      const mockBookingCounts = [
        { sessionId: 'session-1', _count: { id: 5 } },
        { sessionId: 'session-2', _count: { id: 12 } },
      ];

      mockPrismaService.classSession.findMany.mockResolvedValue(mockSessions);
      mockPrismaService.booking.groupBy.mockResolvedValue(mockBookingCounts);

      const result = await service.getPublicSchedule({});

      // Verify findMany was called once (not per session)
      expect(mockPrismaService.classSession.findMany).toHaveBeenCalledTimes(1);

      // Verify groupBy was called once with all session IDs
      expect(mockPrismaService.booking.groupBy).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.booking.groupBy).toHaveBeenCalledWith({
        by: ['sessionId'],
        where: {
          sessionId: { in: ['session-1', 'session-2'] },
          status: BookingStatus.CONFIRMED,
        },
        _count: {
          id: true,
        },
      });

      // Verify confirmedCount is correct
      expect(result).toHaveLength(2);
      expect(result[0].confirmedCount).toBe(5);
      expect(result[0].remainingCapacity).toBe(5); // 10 - 5
      expect(result[1].confirmedCount).toBe(12);
      expect(result[1].remainingCapacity).toBe(3); // 15 - 12
    });

    it('should handle sessions with no bookings (confirmedCount = 0)', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          startsAt: new Date('2026-01-20T10:00:00Z'),
          endsAt: new Date('2026-01-20T10:25:00Z'),
          capacity: 10,
          classType: { id: 'type-1', name: 'HIIT' },
          instructor: { id: 'instructor-1', user: { name: 'John' } },
          registrationOpens: null,
          registrationCloses: null,
        },
      ];

      // No bookings for this session
      const mockBookingCounts: any[] = [];

      mockPrismaService.classSession.findMany.mockResolvedValue(mockSessions);
      mockPrismaService.booking.groupBy.mockResolvedValue(mockBookingCounts);

      const result = await service.getPublicSchedule({});

      expect(result).toHaveLength(1);
      expect(result[0].confirmedCount).toBe(0);
      expect(result[0].remainingCapacity).toBe(10);
    });

    it('should calculate remainingCapacity correctly', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          startsAt: new Date('2026-01-20T10:00:00Z'),
          endsAt: new Date('2026-01-20T10:25:00Z'),
          capacity: 10,
          classType: { id: 'type-1', name: 'HIIT' },
          instructor: { id: 'instructor-1', user: { name: 'John' } },
          registrationOpens: null,
          registrationCloses: null,
        },
      ];

      const mockBookingCounts = [
        { sessionId: 'session-1', _count: { id: 10 } }, // Full capacity
      ];

      mockPrismaService.classSession.findMany.mockResolvedValue(mockSessions);
      mockPrismaService.booking.groupBy.mockResolvedValue(mockBookingCounts);

      const result = await service.getPublicSchedule({});

      expect(result[0].confirmedCount).toBe(10);
      expect(result[0].remainingCapacity).toBe(0); // Math.max(0, 10 - 10)
    });
  });
});


