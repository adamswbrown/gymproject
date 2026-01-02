import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from '../../src/bookings/bookings.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import {
  CapacityFullException,
  RegistrationClosedException,
  DuplicateBookingException,
  CancellationCutoffPassedException,
  BookingNotFoundException,
  ForbiddenBookingException,
} from '../../src/bookings/exceptions/booking.exceptions';
import { BookingStatus, SessionStatus } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    booking: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    classSession: {
      findUnique: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    const userId = 'user-1';
    const sessionId = 'session-1';
    const createBookingDto = { sessionId };

    const mockSession = {
      id: sessionId,
      status: SessionStatus.SCHEDULED,
      capacity: 10,
      startsAt: new Date('2026-01-15T10:00:00Z'),
      endsAt: new Date('2026-01-15T10:25:00Z'),
      registrationOpens: null,
      registrationCloses: null,
      classType: {
        id: 'class-type-1',
        name: 'HIIT',
        durationMinutes: 25,
        cancellationCutoffHours: 2,
      },
      instructor: {
        id: 'instructor-1',
        user: { name: 'John Doe' },
      },
    };

    it('should create a booking successfully', async () => {
      const mockBooking = {
        id: 'booking-1',
        sessionId,
        userId,
        status: BookingStatus.CONFIRMED,
        bookedAt: new Date(),
        cancelledAt: null,
        session: mockSession,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          classSession: {
            findUnique: jest.fn().mockResolvedValue(mockSession),
          },
          booking: {
            count: jest.fn().mockResolvedValue(5),
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockBooking),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      const result = await service.createBooking(userId, createBookingDto);

      expect(result).toBeDefined();
      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw CapacityFullException when capacity is full', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          classSession: {
            findUnique: jest.fn().mockResolvedValue(mockSession),
          },
          booking: {
            count: jest.fn().mockResolvedValue(10), // At capacity
            findUnique: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(tx);
      });

      await expect(service.createBooking(userId, createBookingDto)).rejects.toThrow(
        CapacityFullException,
      );
    });

    it('should throw RegistrationClosedException when registration not open', async () => {
      const sessionWithRegistration = {
        ...mockSession,
        registrationOpens: new Date('2026-01-15T09:00:00Z'),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          classSession: {
            findUnique: jest.fn().mockResolvedValue(sessionWithRegistration),
          },
        };
        return callback(tx);
      });

      // Mock current time to be before registration opens
      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2026-01-15T08:00:00Z') as any);

      await expect(service.createBooking(userId, createBookingDto)).rejects.toThrow(
        RegistrationClosedException,
      );

      jest.restoreAllMocks();
    });

    it('should throw RegistrationClosedException when registration closed', async () => {
      const sessionWithRegistration = {
        ...mockSession,
        registrationCloses: new Date('2026-01-15T09:00:00Z'),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          classSession: {
            findUnique: jest.fn().mockResolvedValue(sessionWithRegistration),
          },
        };
        return callback(tx);
      });

      // Mock current time to be after registration closes
      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2026-01-15T10:00:00Z') as any);

      await expect(service.createBooking(userId, createBookingDto)).rejects.toThrow(
        RegistrationClosedException,
      );

      jest.restoreAllMocks();
    });

    it('should throw DuplicateBookingException when booking already exists with CONFIRMED status', async () => {
      const existingBooking = {
        id: 'booking-1',
        sessionId,
        userId,
        status: BookingStatus.CONFIRMED,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          classSession: {
            findUnique: jest.fn().mockResolvedValue(mockSession),
          },
          booking: {
            count: jest.fn().mockResolvedValue(5),
            findUnique: jest.fn().mockResolvedValue(existingBooking),
          },
        };
        return callback(tx);
      });

      await expect(service.createBooking(userId, createBookingDto)).rejects.toThrow(
        DuplicateBookingException,
      );
    });

    it('should re-activate cancelled booking', async () => {
      const cancelledBooking = {
        id: 'booking-1',
        sessionId,
        userId,
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      };

      const reactivatedBooking = {
        ...cancelledBooking,
        status: BookingStatus.CONFIRMED,
        cancelledAt: null,
        bookedAt: new Date(),
        session: mockSession,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          classSession: {
            findUnique: jest.fn().mockResolvedValue(mockSession),
          },
          booking: {
            count: jest.fn().mockResolvedValue(5),
            findUnique: jest.fn().mockResolvedValue(cancelledBooking),
            update: jest.fn().mockResolvedValue(reactivatedBooking),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      const result = await service.createBooking(userId, createBookingDto);

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(result.cancelledAt).toBeNull();
    });

    it('should throw error when session is not SCHEDULED', async () => {
      const cancelledSession = {
        ...mockSession,
        status: SessionStatus.CANCELLED,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          classSession: {
            findUnique: jest.fn().mockResolvedValue(cancelledSession),
          },
        };
        return callback(tx);
      });

      await expect(service.createBooking(userId, createBookingDto)).rejects.toThrow(
        RegistrationClosedException,
      );
    });
  });

  describe('cancelBooking', () => {
    const userId = 'user-1';
    const bookingId = 'booking-1';
    const sessionId = 'session-1';

    const mockBooking = {
      id: bookingId,
      sessionId,
      userId,
      status: BookingStatus.CONFIRMED,
      bookedAt: new Date('2026-01-14T10:00:00Z'),
      cancelledAt: null,
      session: {
        id: sessionId,
        startsAt: new Date('2026-01-15T10:00:00Z'),
        endsAt: new Date('2026-01-15T10:25:00Z'),
        classType: {
          id: 'class-type-1',
          name: 'HIIT',
          cancellationCutoffHours: 2,
        },
        instructor: {
          id: 'instructor-1',
          user: { name: 'John Doe' },
        },
      },
    };

    it('should cancel booking successfully before cutoff', async () => {
      const cancelledBooking = {
        ...mockBooking,
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date('2026-01-15T07:00:00Z'),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          booking: {
            findUnique: jest.fn().mockResolvedValue(mockBooking),
            update: jest.fn().mockResolvedValue(cancelledBooking),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      // Mock current time to be before cutoff (2 hours before session start)
      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2026-01-15T07:00:00Z') as any);

      const result = await service.cancelBooking(userId, bookingId);

      expect(result.status).toBe(BookingStatus.CANCELLED);
      expect(result.cancelledAt).toBeDefined();

      jest.restoreAllMocks();
    });

    it('should throw CancellationCutoffPassedException when cancelling after cutoff', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          booking: {
            findUnique: jest.fn().mockResolvedValue(mockBooking),
          },
        };
        return callback(tx);
      });

      // Mock current time to be after cutoff (less than 2 hours before session start)
      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2026-01-15T09:00:00Z') as any);

      await expect(service.cancelBooking(userId, bookingId)).rejects.toThrow(
        CancellationCutoffPassedException,
      );

      jest.restoreAllMocks();
    });

    it('should throw BookingNotFoundException when booking does not exist', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          booking: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(tx);
      });

      await expect(service.cancelBooking(userId, bookingId)).rejects.toThrow(
        BookingNotFoundException,
      );
    });

    it('should throw ForbiddenBookingException when user does not own booking', async () => {
      const otherUserBooking = {
        ...mockBooking,
        userId: 'user-2',
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          booking: {
            findUnique: jest.fn().mockResolvedValue(otherUserBooking),
          },
        };
        return callback(tx);
      });

      await expect(service.cancelBooking(userId, bookingId)).rejects.toThrow(
        ForbiddenBookingException,
      );
    });

    it('should allow cancellation when cancellationCutoffHours is null', async () => {
      const bookingWithoutCutoff = {
        ...mockBooking,
        session: {
          ...mockBooking.session,
          classType: {
            ...mockBooking.session.classType,
            cancellationCutoffHours: null,
          },
        },
      };

      const cancelledBooking = {
        ...bookingWithoutCutoff,
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          booking: {
            findUnique: jest.fn().mockResolvedValue(bookingWithoutCutoff),
            update: jest.fn().mockResolvedValue(cancelledBooking),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      const result = await service.cancelBooking(userId, bookingId);

      expect(result.status).toBe(BookingStatus.CANCELLED);
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings', async () => {
      const userId = 'user-1';
      const mockBookings = [
        {
          id: 'booking-1',
          sessionId: 'session-1',
          userId,
          status: BookingStatus.CONFIRMED,
          bookedAt: new Date(),
          cancelledAt: null,
          session: null,
        },
      ];

      mockPrismaService.booking.findMany.mockResolvedValue(mockBookings);

      const result = await service.getUserBookings(userId);

      expect(result).toHaveLength(1);
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: expect.any(Object),
        orderBy: { bookedAt: 'desc' },
      });
    });
  });

  describe('getBookingDetails', () => {
    it('should return booking details', async () => {
      const bookingId = 'booking-1';
      const mockBooking = {
        id: bookingId,
        sessionId: 'session-1',
        userId: 'user-1',
        status: BookingStatus.CONFIRMED,
        bookedAt: new Date(),
        cancelledAt: null,
        session: null,
      };

      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await service.getBookingDetails(bookingId);

      expect(result).toBeDefined();
      expect(mockPrismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: expect.any(Object),
      });
    });

    it('should throw BookingNotFoundException when booking does not exist', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.getBookingDetails('non-existent')).rejects.toThrow(
        BookingNotFoundException,
      );
    });
  });
});


