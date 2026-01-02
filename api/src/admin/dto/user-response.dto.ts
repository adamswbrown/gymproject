import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

