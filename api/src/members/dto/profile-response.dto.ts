export class ProfileResponseDto {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  smsVerified: boolean;
  dateOfBirth?: Date;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  memberProfile?: {
    gender?: string;
    addressStreet?: string;
    addressCity?: string;
    addressPostalCode?: string;
    addressCountry?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
  };
}

