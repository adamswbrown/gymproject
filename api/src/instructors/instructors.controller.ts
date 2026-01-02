import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Roles(UserRole.INSTRUCTOR)
  @Get('me/sessions')
  async getMySessions(@CurrentUser() user: any): Promise<{ ok: true; data: any[] }> {
    const sessions = await this.instructorsService.getMySessions(user.id);
    return { ok: true, data: sessions };
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('sessions/:id/roster')
  async getSessionRoster(
    @CurrentUser() user: any,
    @Param('id') sessionId: string,
  ): Promise<{ ok: true; data: any }> {
    const roster = await this.instructorsService.getSessionRoster(user.id, sessionId);
    return { ok: true, data: roster };
  }
}


