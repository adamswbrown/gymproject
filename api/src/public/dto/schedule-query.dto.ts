import { IsOptional, IsUUID, IsDateString } from 'class-validator';

export class ScheduleQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsUUID()
  classTypeId?: string;

  @IsOptional()
  @IsUUID()
  instructorId?: string;
}


