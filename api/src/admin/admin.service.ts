import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassTypeDto } from './dto/create-class-type.dto';
import { UpdateClassTypeDto } from './dto/update-class-type.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClassTypeResponseDto } from './dto/class-type-response.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { InstructorResponseDto } from './dto/instructor-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ProductResponseDto } from '../store/dto/product-response.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Class Types CRUD
  async getAllClassTypes(): Promise<ClassTypeResponseDto[]> {
    const classTypes = await this.prisma.classType.findMany({
      orderBy: { name: 'asc' },
    });

    return classTypes.map(this.mapClassTypeToResponse);
  }

  async createClassType(dto: CreateClassTypeDto): Promise<ClassTypeResponseDto> {
    const classType = await this.prisma.classType.create({
      data: {
        name: dto.name,
        description: dto.description,
        durationMinutes: dto.durationMinutes,
        defaultCapacity: dto.defaultCapacity,
        cancellationCutoffHours: dto.cancellationCutoffHours,
        active: dto.active,
      },
    });

    return this.mapClassTypeToResponse(classType);
  }

  async updateClassType(id: string, dto: UpdateClassTypeDto): Promise<ClassTypeResponseDto> {
    const existing = await this.prisma.classType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'CLASS_TYPE_NOT_FOUND',
        message: 'Class type not found',
      });
    }

    const classType = await this.prisma.classType.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        durationMinutes: dto.durationMinutes,
        defaultCapacity: dto.defaultCapacity,
        cancellationCutoffHours: dto.cancellationCutoffHours,
        active: dto.active,
      },
    });

    return this.mapClassTypeToResponse(classType);
  }

  async deleteClassType(id: string): Promise<void> {
    const existing = await this.prisma.classType.findUnique({
      where: { id },
      include: {
        classSessions: {
          take: 1,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'CLASS_TYPE_NOT_FOUND',
        message: 'Class type not found',
      });
    }

    // Check if there are existing sessions
    if (existing.classSessions.length > 0) {
      throw new ConflictException({
        code: 'CLASS_TYPE_HAS_SESSIONS',
        message: 'Cannot delete class type with existing sessions',
      });
    }

    await this.prisma.classType.delete({
      where: { id },
    });
  }

  // Sessions CRUD
  async getAllSessions(): Promise<SessionResponseDto[]> {
    const sessions = await this.prisma.classSession.findMany({
      include: {
        classType: {
          select: {
            id: true,
            name: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { startsAt: 'asc' },
    });

    return sessions.map(this.mapSessionToResponse);
  }

  async createSession(dto: CreateSessionDto): Promise<SessionResponseDto> {
    // Validate classTypeId exists
    const classType = await this.prisma.classType.findUnique({
      where: { id: dto.classTypeId },
    });

    if (!classType) {
      throw new NotFoundException({
        code: 'CLASS_TYPE_NOT_FOUND',
        message: 'Class type not found',
      });
    }

    // Validate instructorId exists
    const instructor = await this.prisma.instructorProfile.findUnique({
      where: { id: dto.instructorId },
    });

    if (!instructor) {
      throw new NotFoundException({
        code: 'INSTRUCTOR_NOT_FOUND',
        message: 'Instructor not found',
      });
    }

    // Validate dates
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException({
        code: 'INVALID_DATES',
        message: 'End time must be after start time',
      });
    }

    const session = await this.prisma.classSession.create({
      data: {
        classTypeId: dto.classTypeId,
        instructorId: dto.instructorId,
        startsAt,
        endsAt,
        capacity: dto.capacity,
        location: dto.location,
        status: dto.status,
        registrationOpens: dto.registrationOpens ? new Date(dto.registrationOpens) : null,
        registrationCloses: dto.registrationCloses ? new Date(dto.registrationCloses) : null,
      },
      include: {
        classType: {
          select: {
            id: true,
            name: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return this.mapSessionToResponse(session);
  }

  async updateSession(id: string, dto: UpdateSessionDto): Promise<SessionResponseDto> {
    const existing = await this.prisma.classSession.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }

    // Validate classTypeId if provided
    if (dto.classTypeId) {
      const classType = await this.prisma.classType.findUnique({
        where: { id: dto.classTypeId },
      });

      if (!classType) {
        throw new NotFoundException({
          code: 'CLASS_TYPE_NOT_FOUND',
          message: 'Class type not found',
        });
      }
    }

    // Validate instructorId if provided
    if (dto.instructorId) {
      const instructor = await this.prisma.instructorProfile.findUnique({
        where: { id: dto.instructorId },
      });

      if (!instructor) {
        throw new NotFoundException({
          code: 'INSTRUCTOR_NOT_FOUND',
          message: 'Instructor not found',
        });
      }
    }

    // Validate dates if provided
    const startsAt = dto.startsAt ? new Date(dto.startsAt) : existing.startsAt;
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : existing.endsAt;

    if (endsAt <= startsAt) {
      throw new BadRequestException({
        code: 'INVALID_DATES',
        message: 'End time must be after start time',
      });
    }

    // Check capacity if being reduced
    if (dto.capacity !== undefined && dto.capacity < existing.capacity) {
      const confirmedBookings = await this.prisma.booking.count({
        where: {
          sessionId: id,
          status: 'CONFIRMED',
        },
      });

      if (dto.capacity < confirmedBookings) {
        throw new BadRequestException({
          code: 'CAPACITY_TOO_LOW',
          message: `Cannot reduce capacity below ${confirmedBookings} confirmed bookings`,
        });
      }
    }

    const session = await this.prisma.classSession.update({
      where: { id },
      data: {
        classTypeId: dto.classTypeId,
        instructorId: dto.instructorId,
        startsAt,
        endsAt,
        capacity: dto.capacity,
        location: dto.location,
        status: dto.status,
        registrationOpens: dto.registrationOpens ? new Date(dto.registrationOpens) : undefined,
        registrationCloses: dto.registrationCloses ? new Date(dto.registrationCloses) : undefined,
      },
      include: {
        classType: {
          select: {
            id: true,
            name: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return this.mapSessionToResponse(session);
  }

  async deleteSession(id: string): Promise<void> {
    const existing = await this.prisma.classSession.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }

    // Cancel all bookings for this session
    await this.prisma.booking.updateMany({
      where: {
        sessionId: id,
        status: 'CONFIRMED',
      },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    await this.prisma.classSession.delete({
      where: { id },
    });
  }

  // Instructors CRUD
  async getAllInstructors(): Promise<InstructorResponseDto[]> {
    const instructors = await this.prisma.instructorProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    return instructors.map((instructor) => ({
      id: instructor.id,
      name: instructor.user.name || 'Unknown',
      email: instructor.user.email,
      bio: instructor.specialization || undefined,
      active: instructor.active,
    }));
  }

  async createInstructor(dto: CreateInstructorDto): Promise<InstructorResponseDto> {
    // Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        instructorProfile: true,
      },
    });

    if (existingUser) {
      if (existingUser.instructorProfile) {
        throw new ConflictException({
          code: 'INSTRUCTOR_ALREADY_EXISTS',
          message: 'Instructor with this email already exists',
        });
      }
      // User exists but is not an instructor - update role and create profile
      const instructorProfile = await this.prisma.instructorProfile.create({
        data: {
          userId: existingUser.id,
          specialization: dto.bio,
          active: dto.active,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Update user role to INSTRUCTOR
      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: UserRole.INSTRUCTOR,
          name: dto.name,
        },
      });

      return {
        id: instructorProfile.id,
        name: dto.name,
        email: dto.email,
        bio: instructorProfile.specialization || undefined,
        active: instructorProfile.active,
      };
    }

    // Create new user and instructor profile in transaction
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('temp-password-' + Date.now(), saltRounds);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          role: UserRole.INSTRUCTOR,
        },
      });

      const instructorProfile = await tx.instructorProfile.create({
        data: {
          userId: user.id,
          specialization: dto.bio,
          active: dto.active,
        },
      });

      return { user, instructorProfile };
    });

    return {
      id: result.instructorProfile.id,
      name: result.user.name || 'Unknown',
      email: result.user.email,
      bio: result.instructorProfile.specialization || undefined,
      active: result.instructorProfile.active,
    };
  }

  async updateInstructor(id: string, dto: UpdateInstructorDto): Promise<InstructorResponseDto> {
    const existing = await this.prisma.instructorProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'INSTRUCTOR_NOT_FOUND',
        message: 'Instructor not found',
      });
    }

    // Check email uniqueness if email is being updated
    if (dto.email && dto.email !== existing.user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email is already registered',
        });
      }
    }

    // Update user and instructor profile
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: existing.userId },
        data: {
          name: dto.name,
          email: dto.email,
        },
      });

      const instructorProfile = await tx.instructorProfile.update({
        where: { id },
        data: {
          specialization: dto.bio,
          active: dto.active,
        },
      });

      return { user, instructorProfile };
    });

    return {
      id: result.instructorProfile.id,
      name: result.user.name || 'Unknown',
      email: result.user.email,
      bio: result.instructorProfile.specialization || undefined,
      active: result.instructorProfile.active,
    };
  }

  async deleteInstructor(id: string): Promise<void> {
    const existing = await this.prisma.instructorProfile.findUnique({
      where: { id },
      include: {
        classSessions: {
          take: 1,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'INSTRUCTOR_NOT_FOUND',
        message: 'Instructor not found',
      });
    }

    // Check if instructor has sessions
    if (existing.classSessions.length > 0) {
      throw new ConflictException({
        code: 'INSTRUCTOR_HAS_SESSIONS',
        message: 'Cannot delete instructor with existing sessions',
      });
    }

    // Delete instructor profile (user will be deleted via cascade)
    await this.prisma.instructorProfile.delete({
      where: { id },
    });
  }

  // Mapper methods
  private mapClassTypeToResponse(classType: any): ClassTypeResponseDto {
    return {
      id: classType.id,
      name: classType.name,
      description: classType.description,
      durationMinutes: classType.durationMinutes,
      defaultCapacity: classType.defaultCapacity,
      cancellationCutoffHours: classType.cancellationCutoffHours,
      active: classType.active,
    };
  }

  private mapSessionToResponse(session: any): SessionResponseDto {
    return {
      id: session.id,
      classTypeId: session.classTypeId,
      instructorId: session.instructorId,
      startsAt: session.startsAt.toISOString(),
      endsAt: session.endsAt.toISOString(),
      capacity: session.capacity,
      location: session.location,
      status: session.status,
      registrationOpens: session.registrationOpens?.toISOString(),
      registrationCloses: session.registrationCloses?.toISOString(),
      classType: session.classType
        ? {
            id: session.classType.id,
            name: session.classType.name,
          }
        : undefined,
      instructor: session.instructor
        ? {
            id: session.instructor.id,
            user: {
              name: session.instructor.user?.name,
            },
          }
        : undefined,
    };
  }

  // User Management CRUD
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email is already registered',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    // Check if email is being changed and if it's already taken
    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email is already registered',
        });
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deleteUser(id: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    // Cascade delete will handle related records
    await this.prisma.user.delete({
      where: { id },
    });
  }

  // Product Management CRUD
  async getAllProducts(): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      });
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async createProduct(dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        active: dto.active ?? true,
      },
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      });
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        active: dto.active,
      },
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: {
          take: 1,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      });
    }

    // Check if product has orders
    if (existing.orderItems.length > 0) {
      throw new ConflictException({
        code: 'PRODUCT_HAS_ORDERS',
        message: 'Cannot delete product with existing orders',
      });
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }
}

