import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseResponseDto, CourseRegistrationResponseDto } from './dto/course-response.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCourses(userId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { active: true },
      include: {
        registrations: {
          where: { userId },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
      active: course.active,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      isRegistered: course.registrations.length > 0,
      registrationStatus: course.registrations[0]?.status,
    }));
  }

  async registerForCourse(userId: string, courseId: string): Promise<CourseRegistrationResponseDto> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException({
        code: 'COURSE_NOT_FOUND',
        message: 'Course not found',
      });
    }

    if (!course.active) {
      throw new ConflictException({
        code: 'COURSE_NOT_ACTIVE',
        message: 'Course is not active',
      });
    }

    // Check if already registered
    const existingRegistration = await this.prisma.courseRegistration.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingRegistration && existingRegistration.status !== 'CANCELLED') {
      throw new ConflictException({
        code: 'ALREADY_REGISTERED',
        message: 'Already registered for this course',
      });
    }

    // Create or update registration
    const registration = existingRegistration
      ? await this.prisma.courseRegistration.update({
          where: { id: existingRegistration.id },
          data: {
            status: 'REGISTERED',
            registeredAt: new Date(),
            cancelledAt: null,
          },
        })
      : await this.prisma.courseRegistration.create({
          data: {
            userId,
            courseId,
            status: 'REGISTERED',
          },
        });

    return {
      id: registration.id,
      userId: registration.userId,
      courseId: registration.courseId,
      status: registration.status,
      registeredAt: registration.registeredAt,
      cancelledAt: registration.cancelledAt,
      course: {
        id: course.id,
        name: course.name,
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
        active: course.active,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      },
    };
  }

  async unregisterFromCourse(userId: string, courseId: string): Promise<CourseRegistrationResponseDto> {
    const registration = await this.prisma.courseRegistration.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!registration) {
      throw new NotFoundException({
        code: 'REGISTRATION_NOT_FOUND',
        message: 'Registration not found',
      });
    }

    if (registration.status === 'CANCELLED') {
      throw new ConflictException({
        code: 'ALREADY_CANCELLED',
        message: 'Registration is already cancelled',
      });
    }

    const updated = await this.prisma.courseRegistration.update({
      where: { id: registration.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
      include: {
        course: true,
      },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      courseId: updated.courseId,
      status: updated.status,
      registeredAt: updated.registeredAt,
      cancelledAt: updated.cancelledAt,
      course: {
        id: updated.course.id,
        name: updated.course.name,
        description: updated.course.description,
        startDate: updated.course.startDate,
        endDate: updated.course.endDate,
        active: updated.course.active,
        createdAt: updated.course.createdAt,
        updatedAt: updated.course.updatedAt,
      },
    };
  }
}

