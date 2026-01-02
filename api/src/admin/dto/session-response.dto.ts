export class SessionResponseDto {
  id: string;
  classTypeId: string;
  instructorId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  location: string;
  status: 'SCHEDULED' | 'CANCELLED';
  registrationOpens?: string;
  registrationCloses?: string;
  classType?: {
    id: string;
    name: string;
  };
  instructor?: {
    id: string;
    user: {
      name?: string;
    };
  };
}

