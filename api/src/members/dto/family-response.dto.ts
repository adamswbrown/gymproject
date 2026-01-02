export class FamilyMemberResponseDto {
  id: string;
  name?: string;
  email: string;
  relationshipType: string;
  isChild: boolean;
  user: {
    id: string;
    name?: string;
    email: string;
    dateOfBirth?: Date;
  };
}

export class FamilyManagerResponseDto {
  id: string;
  invitedEmail: string;
  invitedUserId?: string;
  status: string;
  createdAt: Date;
  acceptedAt?: Date;
  invitedUser?: {
    id: string;
    name?: string;
    email: string;
  };
}

export class CreateChildDto {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
}

export class InviteFamilyManagerDto {
  email: string;
}

