import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  // Explicitly reject role field if provided (security: prevent privilege escalation)
  // Note: class-validator will reject unknown properties if forbidNonWhitelisted is enabled
  // This field is documented here for clarity
}

