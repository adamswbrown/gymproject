import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('instructors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstructorsController {
  @Roles(UserRole.INSTRUCTOR)
  @Get('me/sessions')
  async getMySessions(@CurrentUser() user: any): Promise<{ ok: true; data: any[] }> {
    // TODO: Implement instructor sessions listing
    return { ok: true, data: [] };
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('sessions/:id/roster')
  async getSessionRoster(@Param('id') sessionId: string): Promise<{ ok: true; data: any }> {
    // TODO: Implement session roster listing
    return { ok: true, data: {} };
  }
}


