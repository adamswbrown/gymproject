import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;
}


