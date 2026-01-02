export class ScheduleResponseDto {
  id: string;
  startsAt: Date; // UTC
  endsAt: Date; // UTC
  classType: {
    id: string;
    name: string;
  };
  instructor: {
    id: string;
    name?: string;
  };
  capacity: number;
  confirmedCount: number;
  remainingCapacity: number;
  registrationOpen: boolean;
  registrationCloseReason?: string;
}


