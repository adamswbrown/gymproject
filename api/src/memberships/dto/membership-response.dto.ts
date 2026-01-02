export class MembershipResponseDto {
  id: string;
  userId: string;
  membershipType: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

