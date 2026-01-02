import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { SessionStatus } from '@prisma/client';

export class CreateSessionDto {
  @IsString()
  classTypeId: string;

  @IsString()
  instructorId: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsString()
  location: string;

  @IsEnum(SessionStatus)
  status: SessionStatus;

  @IsOptional()
  @IsDateString()
  registrationOpens?: string;

  @IsOptional()
  @IsDateString()
  registrationCloses?: string;
}

