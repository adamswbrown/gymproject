import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, SessionStatus } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import {
  CapacityFullException,
  RegistrationClosedException,
  DuplicateBookingException,
  CancellationCutoffPassedException,
  BookingNotFoundException,
  ForbiddenBookingException,
} from './exceptions/booking.exceptions';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    const { sessionId } = createBookingDto;
    const now = new Date();

    // Use transaction to ensure atomicity
    return await this.prisma.$transaction(async (tx) => {
      // Fetch session with classType
      const session = await tx.classSession.findUnique({
        where: { id: sessionId },
        include: {
          classType: true,
          instructor: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!session) {
        throw new BookingNotFoundException();
      }

      // Reject if session.status != SCHEDULED
      if (session.status !== SessionStatus.SCHEDULED) {
        throw new RegistrationClosedException('This class has been cancelled');
      }

      // Enforce registration window
      if (session.registrationOpens && now < session.registrationOpens) {
        throw new RegistrationClosedException('Registration not yet open');
      }
      if (session.registrationCloses && now > session.registrationCloses) {
        throw new RegistrationClosedException('Registration closed');
      }

      // Count CONFIRMED bookings (inside transaction for race safety)
      const confirmedCount = await tx.booking.count({
        where: {
          sessionId,
          status: BookingStatus.CONFIRMED,
        },
      });

      // Check capacity
      if (confirmedCount >= session.capacity) {
        throw new CapacityFullException({
          available: 0,
          capacity: session.capacity,
        });
      }

      // Check for existing booking (same sessionId + userId)
      const existingBooking = await tx.booking.findUnique({
        where: {
          sessionId_userId: {
            sessionId,
            userId,
          },
        },
      });

      let booking;

      if (existingBooking) {
        if (existingBooking.status === BookingStatus.CONFIRMED) {
          throw new DuplicateBookingException();
        } else if (existingBooking.status === BookingStatus.CANCELLED) {
          // Re-activate cancelled booking
          booking = await tx.booking.update({
            where: { id: existingBooking.id },
            data: {
              status: BookingStatus.CONFIRMED,
              cancelledAt: null,
              bookedAt: now, // Update bookedAt to reflect re-booking
            },
            include: {
              session: {
                include: {
                  classType: true,
                  instructor: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          });
        }
      } else {
        // Create new booking
        booking = await tx.booking.create({
          data: {
            sessionId,
            userId,
            status: BookingStatus.CONFIRMED,
          },
          include: {
            session: {
              include: {
                classType: true,
                instructor: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        });
      }

      // Log audit entry
      await tx.auditLog.create({
        data: {
          userId,
          action: 'BOOKING_CREATED',
          entityType: 'booking',
          entityId: booking.id,
          details: {
            sessionId,
            status: booking.status,
          },
        },
      });

      return this.mapToResponseDto(booking);
    });
  }

  async cancelBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const now = new Date();

    return await this.prisma.$transaction(async (tx) => {
      // Verify booking exists
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          session: {
            include: {
              classType: true,
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!booking) {
        throw new BookingNotFoundException();
      }

      // Verify ownership (or admin override later - for now just check userId)
      if (booking.userId !== userId) {
        throw new ForbiddenBookingException();
      }

      // Idempotent: if already cancelled, return success
      if (booking.status === BookingStatus.CANCELLED) {
        return this.mapToResponseDto(booking);
      }

      // Fetch session + classType (already included above)
      const session = booking.session;
      const classType = session.classType;

      // Enforce cancellation cutoff
      if (classType.cancellationCutoffHours !== null && classType.cancellationCutoffHours !== undefined) {
        const cutoffTime = new Date(session.startsAt);
        cutoffTime.setHours(cutoffTime.getHours() - classType.cancellationCutoffHours);

        if (now > cutoffTime) {
          throw new CancellationCutoffPassedException({
            cutoffTime,
            currentTime: now,
          });
        }
      }

      // Update booking
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: now,
        },
        include: {
          session: {
            include: {
              classType: true,
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      // Log audit entry
      await tx.auditLog.create({
        data: {
          userId,
          action: 'BOOKING_CANCELLED',
          entityType: 'booking',
          entityId: bookingId,
          details: {
            sessionId: session.id,
            cancelledAt: now,
          },
        },
      });

      return this.mapToResponseDto(updatedBooking);
    });
  }

  async getUserBookings(userId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        session: {
          include: {
            classType: true,
            instructor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        bookedAt: 'desc',
      },
    });

    return bookings.map((booking) => this.mapToResponseDto(booking));
  }

  async getBookingDetails(bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        session: {
          include: {
            classType: true,
            instructor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new BookingNotFoundException();
    }

    return this.mapToResponseDto(booking);
  }

  private mapToResponseDto(booking: any): BookingResponseDto {
    return {
      id: booking.id,
      sessionId: booking.sessionId,
      userId: booking.userId,
      status: booking.status,
      bookedAt: booking.bookedAt,
      cancelledAt: booking.cancelledAt,
      session: booking.session
        ? {
            id: booking.session.id,
            startsAt: booking.session.startsAt,
            endsAt: booking.session.endsAt,
            capacity: booking.session.capacity,
            location: booking.session.location,
            classType: booking.session.classType
              ? {
                  id: booking.session.classType.id,
                  name: booking.session.classType.name,
                  durationMinutes: booking.session.classType.durationMinutes,
                  cancellationCutoffHours: booking.session.classType.cancellationCutoffHours,
                }
              : undefined,
            instructor: booking.session.instructor
              ? {
                  id: booking.session.instructor.id,
                  user: {
                    name: booking.session.instructor.user?.name,
                  },
                }
              : undefined,
          }
        : undefined,
    };
  }
}

