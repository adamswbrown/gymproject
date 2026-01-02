import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { MembersService } from './members.service';
import { ClassesService } from '../classes/classes.service';
import { UpdateProfileDto, UpdatePasswordDto, UpdateContactDto, UpdateEmergencyContactDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { UpdateNotificationSettingsDto } from './dto/notification-settings.dto';
import { CreateChildDto, InviteFamilyManagerDto, FamilyMemberResponseDto, FamilyManagerResponseDto } from './dto/family-response.dto';
import { ScheduleQueryDto } from '../public/dto/schedule-query.dto';
import { ScheduleResponseDto } from '../public/dto/schedule-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MEMBER)
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly classesService: ClassesService,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any): Promise<{ ok: true; data: ProfileResponseDto }> {
    const profile = await this.membersService.getProfile(user.id);
    return { ok: true, data: profile };
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ): Promise<{ ok: true; data: ProfileResponseDto }> {
    const profile = await this.membersService.updateProfile(user.id, dto);
    return { ok: true, data: profile };
  }

  @Patch('profile/password')
  async updatePassword(
    @CurrentUser() user: any,
    @Body() dto: UpdatePasswordDto,
  ): Promise<{ ok: true; data: { message: string } }> {
    const result = await this.membersService.updatePassword(user.id, dto);
    return { ok: true, data: result };
  }

  @Patch('profile/contact')
  async updateContact(
    @CurrentUser() user: any,
    @Body() dto: UpdateContactDto,
  ): Promise<{ ok: true; data: ProfileResponseDto }> {
    const profile = await this.membersService.updateContact(user.id, dto);
    return { ok: true, data: profile };
  }

  @Patch('profile/emergency-contact')
  async updateEmergencyContact(
    @CurrentUser() user: any,
    @Body() dto: UpdateEmergencyContactDto,
  ): Promise<{ ok: true; data: ProfileResponseDto }> {
    const profile = await this.membersService.updateEmergencyContact(user.id, dto);
    return { ok: true, data: profile };
  }

  @Get('registrations')
  async getAllRegistrations(@CurrentUser() user: any): Promise<{ ok: true; data: RegistrationResponseDto[] }> {
    const registrations = await this.membersService.getAllRegistrations(user.id);
    return { ok: true, data: registrations };
  }

  @Get('registrations/upcoming')
  async getUpcomingRegistrations(@CurrentUser() user: any): Promise<{ ok: true; data: RegistrationResponseDto[] }> {
    const registrations = await this.membersService.getUpcomingRegistrations(user.id);
    return { ok: true, data: registrations };
  }

  @Get('registrations/classes')
  async getClassRegistrations(@CurrentUser() user: any): Promise<{ ok: true; data: RegistrationResponseDto[] }> {
    const registrations = await this.membersService.getClassRegistrations(user.id);
    return { ok: true, data: registrations };
  }

  @Get('registrations/courses')
  async getCourseRegistrations(@CurrentUser() user: any): Promise<{ ok: true; data: RegistrationResponseDto[] }> {
    const registrations = await this.membersService.getCourseRegistrations(user.id);
    return { ok: true, data: registrations };
  }

  @Get('schedule')
  async getSchedule(
    @Query() query: ScheduleQueryDto,
  ): Promise<{ ok: true; data: ScheduleResponseDto[] }> {
    const schedule = await this.classesService.getPublicSchedule(query);
    return { ok: true, data: schedule };
  }

  @Get('registrations/calendar-export')
  async exportCalendar(@CurrentUser() user: any, @Res() res: Response): Promise<void> {
    const registrations = await this.membersService.getUpcomingRegistrations(user.id);
    
    // Generate iCal content
    let icalContent = 'BEGIN:VCALENDAR\r\n';
    icalContent += 'VERSION:2.0\r\n';
    icalContent += 'PRODID:-//Gym Booking//EN\r\n';
    icalContent += 'CALSCALE:GREGORIAN\r\n';
    icalContent += 'METHOD:PUBLISH\r\n';

    registrations.forEach((reg) => {
      if (reg.type === 'CLASS' && reg.session) {
        const start = reg.session.startsAt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const end = reg.session.endsAt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const summary = reg.session.classType.name;
        const location = reg.session.location;
        const description = `Instructor: ${reg.session.instructor.user?.name || 'TBA'}`;

        icalContent += 'BEGIN:VEVENT\r\n';
        icalContent += `UID:${reg.id}@gym-booking\r\n`;
        icalContent += `DTSTART:${start}\r\n`;
        icalContent += `DTEND:${end}\r\n`;
        icalContent += `SUMMARY:${summary}\r\n`;
        icalContent += `LOCATION:${location}\r\n`;
        icalContent += `DESCRIPTION:${description}\r\n`;
        icalContent += 'END:VEVENT\r\n';
      }
    });

    icalContent += 'END:VCALENDAR\r\n';

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.ics"');
    res.send(icalContent);
  }


  @Get('notifications/settings')
  async getNotificationSettings(@CurrentUser() user: any): Promise<{ ok: true; data: any }> {
    const settings = await this.membersService.getNotificationSettings(user.id);
    return { ok: true, data: settings };
  }

  @Patch('notifications/settings')
  async updateNotificationSettings(
    @CurrentUser() user: any,
    @Body() dto: UpdateNotificationSettingsDto,
  ): Promise<{ ok: true; data: any }> {
    const settings = await this.membersService.updateNotificationSettings(user.id, dto);
    return { ok: true, data: settings };
  }

  @Get('contact')
  async getContactInfo(): Promise<{ ok: true; data: any }> {
    const contactInfo = await this.membersService.getContactInfo();
    return { ok: true, data: contactInfo };
  }

  @Get('family')
  async getFamilyMembers(@CurrentUser() user: any): Promise<{ ok: true; data: { children: FamilyMemberResponseDto[]; managers: FamilyManagerResponseDto[] } }> {
    const family = await this.membersService.getFamilyMembers(user.id);
    return { ok: true, data: family };
  }

  @Post('family/children')
  async createChild(
    @CurrentUser() user: any,
    @Body() dto: CreateChildDto,
  ): Promise<{ ok: true; data: FamilyMemberResponseDto }> {
    const child = await this.membersService.createChild(user.id, dto);
    return { ok: true, data: child };
  }

  @Delete('family/children/:id')
  async removeChild(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: { message: string } }> {
    const result = await this.membersService.removeChild(user.id, id);
    return { ok: true, data: result };
  }

  @Post('family/managers/invite')
  async inviteFamilyManager(
    @CurrentUser() user: any,
    @Body() dto: InviteFamilyManagerDto,
  ): Promise<{ ok: true; data: FamilyManagerResponseDto }> {
    const invitation = await this.membersService.inviteFamilyManager(user.id, dto);
    return { ok: true, data: invitation };
  }

  @Get('family/managers')
  async getFamilyManagers(@CurrentUser() user: any): Promise<{ ok: true; data: FamilyManagerResponseDto[] }> {
    const family = await this.membersService.getFamilyMembers(user.id);
    return { ok: true, data: family.managers };
  }

  @Delete('family/managers/:id')
  async removeFamilyManager(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: { message: string } }> {
    const result = await this.membersService.removeFamilyManager(user.id, id);
    return { ok: true, data: result };
  }

  @Public()
  @Post('family/managers/accept/:token')
  async acceptFamilyManagerInvitation(
    @Param('token') token: string,
    @CurrentUser() user: any,
  ): Promise<{ ok: true; data: { message: string } }> {
    const result = await this.membersService.acceptFamilyManagerInvitation(token, user.id);
    return { ok: true, data: result };
  }
}

