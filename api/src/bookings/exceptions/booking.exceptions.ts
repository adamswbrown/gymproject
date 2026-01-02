import { HttpException, HttpStatus } from '@nestjs/common';

export class CapacityFullException extends HttpException {
  constructor(details?: { available: number; capacity: number }) {
    super(
      {
        code: 'CAPACITY_FULL',
        message: 'Class is at full capacity',
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RegistrationClosedException extends HttpException {
  constructor(message: string = 'Registration is closed for this class') {
    super(
      {
        code: 'REGISTRATION_CLOSED',
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DuplicateBookingException extends HttpException {
  constructor() {
    super(
      {
        code: 'DUPLICATE_BOOKING',
        message: 'You already have an active booking for this class',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CancellationCutoffPassedException extends HttpException {
  constructor(details?: { cutoffTime: Date; currentTime: Date }) {
    super(
      {
        code: 'CANCELLATION_CUTOFF_PASSED',
        message: 'Cancellation deadline has passed',
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BookingNotFoundException extends HttpException {
  constructor() {
    super(
      {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ForbiddenBookingException extends HttpException {
  constructor() {
    super(
      {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}


