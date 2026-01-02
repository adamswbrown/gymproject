export class RegistrationResponseDto {
  id: string;
  type: 'CLASS' | 'COURSE';
  sessionId?: string;
  courseId?: string;
  status: string;
  registeredAt: Date;
  cancelledAt?: Date;
  session?: {
    id: string;
    startsAt: Date;
    endsAt: Date;
    classType: {
      id: string;
      name: string;
    };
    instructor: {
      id: string;
      user: {
        name?: string;
      };
    };
    location: string;
  };
  course?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };
}

