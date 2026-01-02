import { BookingStatus } from '@prisma/client';

export class BookingResponseDto {
  id: string;
  sessionId: string;
  userId: string;
  status: BookingStatus;
  bookedAt: Date;
  cancelledAt?: Date;
  session?: {
    id: string;
    startsAt: Date;
    endsAt: Date;
    capacity: number;
    location: string;
    classType?: {
      id: string;
      name: string;
      durationMinutes: number;
      cancellationCutoffHours?: number;
    };
    instructor?: {
      id: string;
      user: {
        name?: string;
      };
    };
  };
}


