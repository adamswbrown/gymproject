import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class UpdateInstructorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

