import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipResponseDto } from './dto/membership-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('members/memberships')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MEMBER)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  async getUserMemberships(@CurrentUser() user: any): Promise<{ ok: true; data: MembershipResponseDto[] }> {
    const memberships = await this.membershipsService.getUserMemberships(user.id);
    return { ok: true, data: memberships };
  }

  @Get(':id')
  async getMembershipDetails(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: MembershipResponseDto }> {
    const membership = await this.membershipsService.getMembershipDetails(user.id, id);
    return { ok: true, data: membership };
  }
}

