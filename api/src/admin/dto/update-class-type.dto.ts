import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateClassTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  defaultCapacity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cancellationCutoffHours?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

