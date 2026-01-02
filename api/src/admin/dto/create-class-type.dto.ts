import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateClassTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsNumber()
  @Min(1)
  defaultCapacity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cancellationCutoffHours?: number;

  @IsBoolean()
  active: boolean;
}

