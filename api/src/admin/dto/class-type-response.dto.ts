export class ClassTypeResponseDto {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  defaultCapacity: number;
  cancellationCutoffHours?: number;
  active: boolean;
}

