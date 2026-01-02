import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipResponseDto } from './dto/membership-response.dto';

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserMemberships(userId: string): Promise<MembershipResponseDto[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    return memberships.map((membership) => ({
      id: membership.id,
      userId: membership.userId,
      membershipType: membership.membershipType,
      status: membership.status,
      startDate: membership.startDate,
      endDate: membership.endDate,
      autoRenew: membership.autoRenew,
      paymentMethod: membership.paymentMethod,
      lastPaymentDate: membership.lastPaymentDate,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    }));
  }

  async getMembershipDetails(userId: string, membershipId: string): Promise<MembershipResponseDto> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        id: membershipId,
        userId,
      },
    });

    if (!membership) {
      throw new NotFoundException({
        code: 'MEMBERSHIP_NOT_FOUND',
        message: 'Membership not found',
      });
    }

    return {
      id: membership.id,
      userId: membership.userId,
      membershipType: membership.membershipType,
      status: membership.status,
      startDate: membership.startDate,
      endDate: membership.endDate,
      autoRenew: membership.autoRenew,
      paymentMethod: membership.paymentMethod,
      lastPaymentDate: membership.lastPaymentDate,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    };
  }
}

