import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class InstructorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMySessions(userId: string) {
    // Find instructor profile by user ID
    const instructorProfile = await this.prisma.instructorProfile.findUnique({
      where: { userId },
    });

    if (!instructorProfile) {
      throw new ForbiddenException({
        code: 'INSTRUCTOR_PROFILE_NOT_FOUND',
        message: 'Instructor profile not found',
      });
    }

    // Fetch sessions for this instructor
    const sessions = await this.prisma.classSession.findMany({
      where: {
        instructorId: instructorProfile.id,
      },
      include: {
        classType: {
          select: {
            id: true,
            name: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
    });

    // Get session IDs for booking count query
    const sessionIds = sessions.map((s) => s.id);

    // Count confirmed bookings per session in a single query
    const bookingCounts = await this.prisma.booking.groupBy({
      by: ['sessionId'],
      where: {
        sessionId: { in: sessionIds },
        status: BookingStatus.CONFIRMED,
      },
      _count: {
        id: true,
      },
    });

    // Create a map for O(1) lookup
    const bookingCountMap = new Map<string, number>();
    bookingCounts.forEach((count) => {
      bookingCountMap.set(count.sessionId, count._count.id);
    });

    // Map to response format matching frontend Session interface
    return sessions.map((session) => {
      const confirmedCount = bookingCountMap.get(session.id) || 0;
      const remainingCapacity = session.capacity - confirmedCount;

      return {
        id: session.id,
        classTypeId: session.classTypeId,
        instructorId: session.instructorId,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        capacity: session.capacity,
        location: session.location,
        status: session.status,
        registrationOpens: session.registrationOpens,
        registrationCloses: session.registrationCloses,
        classType: {
          id: session.classType.id,
          name: session.classType.name,
        },
        instructor: {
          id: session.instructor.id,
          user: {
            id: session.instructor.user.id,
            name: session.instructor.user.name,
          },
        },
        confirmedCount,
        remainingCapacity,
      };
    });
  }

  async getSessionRoster(userId: string, sessionId: string) {
    // Find instructor profile by user ID
    const instructorProfile = await this.prisma.instructorProfile.findUnique({
      where: { userId },
    });

    if (!instructorProfile) {
      throw new ForbiddenException({
        code: 'INSTRUCTOR_PROFILE_NOT_FOUND',
        message: 'Instructor profile not found',
      });
    }

    // Fetch session with classType
    const session = await this.prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        classType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }

    // Ownership check: session must belong to this instructor
    if (session.instructorId !== instructorProfile.id) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You do not have access to this session',
      });
    }

    // Fetch CONFIRMED bookings for this session
    const bookings = await this.prisma.booking.findMany({
      where: {
        sessionId: session.id,
        status: BookingStatus.CONFIRMED,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        bookedAt: 'asc',
      },
    });

    // Map to response format matching frontend RosterResponse
    return {
      session: {
        id: session.id,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        classType: {
          name: session.classType.name,
        },
      },
      members: bookings.map((booking) => ({
        id: booking.user.id,
        name: booking.user.name || 'Unknown',
      })),
    };
  }
}

