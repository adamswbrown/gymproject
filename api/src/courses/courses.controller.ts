import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseResponseDto, CourseRegistrationResponseDto } from './dto/course-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('members/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MEMBER)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getUserCourses(@CurrentUser() user: any): Promise<{ ok: true; data: CourseResponseDto[] }> {
    const courses = await this.coursesService.getUserCourses(user.id);
    return { ok: true, data: courses };
  }

  @Post(':id/register')
  async registerForCourse(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: CourseRegistrationResponseDto }> {
    const registration = await this.coursesService.registerForCourse(user.id, id);
    return { ok: true, data: registration };
  }

  @Delete(':id/register')
  async unregisterFromCourse(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: CourseRegistrationResponseDto }> {
    const registration = await this.coursesService.unregisterFromCourse(user.id, id);
    return { ok: true, data: registration };
  }
}

