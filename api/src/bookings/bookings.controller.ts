import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MEMBER)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: any,
  ): Promise<{ ok: true; data: BookingResponseDto }> {
    const booking = await this.bookingsService.createBooking(user.id, createBookingDto);
    return { ok: true, data: booking };
  }

  @Get()
  async findAll(@CurrentUser() user: any): Promise<{ ok: true; data: BookingResponseDto[] }> {
    const bookings = await this.bookingsService.getUserBookings(user.id);
    return { ok: true, data: bookings };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<{ ok: true; data: BookingResponseDto }> {
    const booking = await this.bookingsService.cancelBooking(user.id, id);
    return { ok: true, data: booking };
  }
}

