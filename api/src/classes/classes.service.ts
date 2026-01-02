import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionStatus, BookingStatus } from '@prisma/client';
import { ScheduleQueryDto } from '../public/dto/schedule-query.dto';
import { ScheduleResponseDto } from '../public/dto/schedule-response.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicSchedule(query: ScheduleQueryDto): Promise<ScheduleResponseDto[]> {
    const now = new Date(); // UTC

    // Build where clause
    const where: any = {
      status: SessionStatus.SCHEDULED,
    };

    // Date range filter
    if (query.from || query.to) {
      where.startsAt = {};
      if (query.from) {
        where.startsAt.gte = new Date(query.from);
      }
      if (query.to) {
        where.startsAt.lte = new Date(query.to);
      }
    }

    // Class type filter
    if (query.classTypeId) {
      where.classTypeId = query.classTypeId;
    }

    // Instructor filter
    if (query.instructorId) {
      where.instructorId = query.instructorId;
    }

    // Fetch sessions with relations (optimized: don't include bookings to avoid N+1)
    const sessions = await this.prisma.classSession.findMany({
      where,
      include: {
        classType: true,
        instructor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
    });

    // Get session IDs for booking count query
    const sessionIds = sessions.map((s) => s.id);

    // Optimize: Count confirmed bookings per session in a single query (O(1) DB round trips)
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

    // Map to response DTOs
    return sessions.map((session) => {
      // Get confirmed count from map (0 if not found)
      const confirmedCount = bookingCountMap.get(session.id) || 0;
      const remainingCapacity = Math.max(0, session.capacity - confirmedCount);

      // Determine registration status (all time comparisons use UTC)
      let registrationOpen = true;
      let registrationCloseReason: string | undefined;

      if (session.registrationOpens && now < session.registrationOpens) {
        registrationOpen = false;
        registrationCloseReason = 'Registration not yet open';
      } else if (session.registrationCloses && now > session.registrationCloses) {
        registrationOpen = false;
        registrationCloseReason = 'Registration closed';
      }

      return {
        id: session.id,
        startsAt: session.startsAt, // UTC
        endsAt: session.endsAt, // UTC
        classType: {
          id: session.classType.id,
          name: session.classType.name,
        },
        instructor: {
          id: session.instructor.id,
          name: session.instructor.user?.name,
        },
        capacity: session.capacity,
        confirmedCount,
        remainingCapacity,
        registrationOpen,
        registrationCloseReason,
      };
    });
  }
}

