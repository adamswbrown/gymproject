export class CourseResponseDto {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  isRegistered?: boolean;
  registrationStatus?: string;
}

export class CourseRegistrationResponseDto {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  registeredAt: Date;
  cancelledAt?: Date;
  course: CourseResponseDto;
}

