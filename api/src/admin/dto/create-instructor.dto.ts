import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsBoolean()
  active: boolean;
}

