import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, UpdatePasswordDto, UpdateContactDto, UpdateEmergencyContactDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';
import { CreateChildDto, InviteFamilyManagerDto, FamilyMemberResponseDto, FamilyManagerResponseDto } from './dto/family-response.dto';
import { UserRole, FamilyRelationshipType, FamilyManagerInvitationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberProfile: true,
      },
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
      phone: user.phone,
      smsVerified: user.smsVerified,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      memberProfile: user.memberProfile ? {
        gender: user.memberProfile.gender,
        addressStreet: user.memberProfile.addressStreet,
        addressCity: user.memberProfile.addressCity,
        addressPostalCode: user.memberProfile.addressPostalCode,
        addressCountry: user.memberProfile.addressCountry,
        emergencyContactName: user.memberProfile.emergencyContactName,
        emergencyContactPhone: user.memberProfile.emergencyContactPhone,
        emergencyContactRelationship: user.memberProfile.emergencyContactRelationship,
      } : undefined,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { memberProfile: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    // Check if email is being changed and if it's already taken
    if (dto.email && dto.email !== user.email) {
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

    // Update user and member profile in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined;

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          dateOfBirth,
        },
      });

      // Create or update member profile
      const memberProfileData = {
        gender: dto.gender,
        addressStreet: dto.addressStreet,
        addressCity: dto.addressCity,
        addressPostalCode: dto.addressPostalCode,
        addressCountry: dto.addressCountry,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
        emergencyContactRelationship: dto.emergencyContactRelationship,
      };

      const updatedProfile = user.memberProfile
        ? await tx.memberProfile.update({
            where: { userId },
            data: memberProfileData,
          })
        : await tx.memberProfile.create({
            data: {
              userId,
              ...memberProfileData,
            },
          });

      return { user: updatedUser, memberProfile: updatedProfile };
    });

    return this.getProfile(userId);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'INVALID_PASSWORD',
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(dto.newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return { message: 'Password updated successfully' };
  }

  async updateContact(userId: string, dto: UpdateContactDto): Promise<ProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { memberProfile: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    await this.prisma.$transaction(async (tx) => {
      if (dto.phone !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: { phone: dto.phone },
        });
      }

      const profileData = {
        addressStreet: dto.addressStreet,
        addressCity: dto.addressCity,
        addressPostalCode: dto.addressPostalCode,
        addressCountry: dto.addressCountry,
      };

      if (user.memberProfile) {
        await tx.memberProfile.update({
          where: { userId },
          data: profileData,
        });
      } else {
        await tx.memberProfile.create({
          data: {
            userId,
            ...profileData,
          },
        });
      }
    });

    return this.getProfile(userId);
  }

  async updateEmergencyContact(userId: string, dto: UpdateEmergencyContactDto): Promise<ProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { memberProfile: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    const profileData = {
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      emergencyContactRelationship: dto.emergencyContactRelationship,
    };

    if (user.memberProfile) {
      await this.prisma.memberProfile.update({
        where: { userId },
        data: profileData,
      });
    } else {
      await this.prisma.memberProfile.create({
        data: {
          userId,
          ...profileData,
        },
      });
    }

    return this.getProfile(userId);
  }

  async getAllRegistrations(userId: string): Promise<RegistrationResponseDto[]> {
    const [bookings, courseRegistrations] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        include: {
          session: {
            include: {
              classType: true,
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { bookedAt: 'desc' },
      }),
      this.prisma.courseRegistration.findMany({
        where: { userId },
        include: {
          course: true,
        },
        orderBy: { registeredAt: 'desc' },
      }),
    ]);

    const registrations: RegistrationResponseDto[] = [];

    // Map bookings to registrations
    bookings.forEach((booking) => {
      registrations.push({
        id: booking.id,
        type: 'CLASS',
        sessionId: booking.sessionId,
        status: booking.status,
        registeredAt: booking.bookedAt,
        cancelledAt: booking.cancelledAt,
        session: booking.session
          ? {
              id: booking.session.id,
              startsAt: booking.session.startsAt,
              endsAt: booking.session.endsAt,
              classType: {
                id: booking.session.classType.id,
                name: booking.session.classType.name,
              },
              instructor: {
                id: booking.session.instructor.id,
                user: {
                  name: booking.session.instructor.user?.name,
                },
              },
              location: booking.session.location,
            }
          : undefined,
      });
    });

    // Map course registrations
    courseRegistrations.forEach((registration) => {
      registrations.push({
        id: registration.id,
        type: 'COURSE',
        courseId: registration.courseId,
        status: registration.status,
        registeredAt: registration.registeredAt,
        cancelledAt: registration.cancelledAt,
        course: {
          id: registration.course.id,
          name: registration.course.name,
          startDate: registration.course.startDate,
          endDate: registration.course.endDate,
        },
      });
    });

    // Sort by registeredAt descending
    return registrations.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime());
  }

  async getUpcomingRegistrations(userId: string): Promise<RegistrationResponseDto[]> {
    const now = new Date();
    const allRegistrations = await this.getAllRegistrations(userId);

    return allRegistrations.filter((reg) => {
      if (reg.type === 'CLASS' && reg.session) {
        return reg.session.startsAt >= now && reg.status !== 'CANCELLED';
      } else if (reg.type === 'COURSE' && reg.course) {
        return reg.course.startDate >= now && reg.status !== 'CANCELLED';
      }
      return false;
    });
  }

  async getClassRegistrations(userId: string): Promise<RegistrationResponseDto[]> {
    const allRegistrations = await this.getAllRegistrations(userId);
    return allRegistrations.filter((reg) => reg.type === 'CLASS');
  }

  async getCourseRegistrations(userId: string): Promise<RegistrationResponseDto[]> {
    const allRegistrations = await this.getAllRegistrations(userId);
    return allRegistrations.filter((reg) => reg.type === 'COURSE');
  }

  async getDocuments(userId: string): Promise<any[]> {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    return documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
      uploadedAt: doc.uploadedAt,
    }));
  }

  async getNotificationSettings(userId: string): Promise<any> {
    const preferences = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Create default preferences
      return await this.prisma.notificationPreferences.create({
        data: {
          userId,
          receiptsEmail: true,
          waitlistEmail: true,
          classNotificationsEmail: true,
          courseNotificationsEmail: true,
        },
      });
    }

    return preferences;
  }

  async updateNotificationSettings(userId: string, settings: any): Promise<any> {
    const preferences = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
    });

    if (preferences) {
      return await this.prisma.notificationPreferences.update({
        where: { userId },
        data: {
          receiptsEmail: settings.receiptsEmail,
          waitlistEmail: settings.waitlistEmail,
          classNotificationsEmail: settings.classNotificationsEmail,
          courseNotificationsEmail: settings.courseNotificationsEmail,
        },
      });
    } else {
      return await this.prisma.notificationPreferences.create({
        data: {
          userId,
          receiptsEmail: settings.receiptsEmail ?? true,
          waitlistEmail: settings.waitlistEmail ?? true,
          classNotificationsEmail: settings.classNotificationsEmail ?? true,
          courseNotificationsEmail: settings.courseNotificationsEmail ?? true,
        },
      });
    }
  }

  async getContactInfo(): Promise<any> {
    // Return business contact information (read-only)
    // This could be stored in config or database
    return {
      email: 'g.cunningham@hitsona.com',
      phone: '07769859348',
      address: {
        street: '54 Dunlop Commercial Park',
        line2: 'Balloo Drive',
        city: 'Bangor',
        county: 'County Down',
        postalCode: 'BT19 7HJ',
        country: 'GB',
      },
    };
  }

  async getFamilyMembers(userId: string): Promise<{ children: FamilyMemberResponseDto[]; managers: FamilyManagerResponseDto[] }> {
    const [children, invitations] = await Promise.all([
      this.prisma.familyRelationship.findMany({
        where: { parentUserId: userId },
        include: {
          childUser: true,
        },
      }),
      this.prisma.familyManagerInvitation.findMany({
        where: { familyOwnerId: userId },
        include: {
          invitedUser: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      children: children.map((rel) => ({
        id: rel.childUserId,
        name: rel.childUser.name,
        email: rel.childUser.email,
        relationshipType: rel.relationshipType,
        isChild: true,
        user: {
          id: rel.childUser.id,
          name: rel.childUser.name,
          email: rel.childUser.email,
          dateOfBirth: rel.childUser.dateOfBirth,
        },
      })),
      managers: invitations.map((inv) => ({
        id: inv.id,
        invitedEmail: inv.invitedEmail,
        invitedUserId: inv.invitedUserId,
        status: inv.status,
        createdAt: inv.createdAt,
        acceptedAt: inv.acceptedAt,
        invitedUser: inv.invitedUser
          ? {
              id: inv.invitedUser.id,
              name: inv.invitedUser.name,
              email: inv.invitedUser.email,
            }
          : undefined,
      })),
    };
  }

  async createChild(userId: string, dto: CreateChildDto): Promise<FamilyMemberResponseDto> {
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

    const dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined;

    // Create child user and relationship in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const childUser = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          role: UserRole.MEMBER,
          dateOfBirth,
        },
      });

      // Create member profile if gender is provided
      if (dto.gender) {
        await tx.memberProfile.create({
          data: {
            userId: childUser.id,
            gender: dto.gender,
          },
        });
      }

      // Create family relationship
      await tx.familyRelationship.create({
        data: {
          parentUserId: userId,
          childUserId: childUser.id,
          relationshipType: FamilyRelationshipType.CHILD,
        },
      });

      return childUser;
    });

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      relationshipType: FamilyRelationshipType.CHILD,
      isChild: true,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        dateOfBirth: result.dateOfBirth,
      },
    };
  }

  async removeChild(userId: string, childUserId: string): Promise<{ message: string }> {
    const relationship = await this.prisma.familyRelationship.findFirst({
      where: {
        parentUserId: userId,
        childUserId,
      },
    });

    if (!relationship) {
      throw new NotFoundException({
        code: 'RELATIONSHIP_NOT_FOUND',
        message: 'Family relationship not found',
      });
    }

    await this.prisma.familyRelationship.delete({
      where: { id: relationship.id },
    });

    return { message: 'Child removed from family' };
  }

  async inviteFamilyManager(userId: string, dto: InviteFamilyManagerDto): Promise<FamilyManagerResponseDto> {
    // Check if user exists
    const invitedUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Check for existing invitation
    const existingInvitation = await this.prisma.familyManagerInvitation.findFirst({
      where: {
        familyOwnerId: userId,
        invitedEmail: dto.email,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    if (existingInvitation) {
      throw new ConflictException({
        code: 'INVITATION_EXISTS',
        message: 'An invitation already exists for this email',
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await this.prisma.familyManagerInvitation.create({
      data: {
        familyOwnerId: userId,
        invitedEmail: dto.email,
        invitedUserId: invitedUser?.id,
        token,
        status: FamilyManagerInvitationStatus.PENDING,
        expiresAt,
      },
      include: {
        invitedUser: true,
      },
    });

    // TODO: Send invitation email with token
    // In a real implementation, you would send an email here

    return {
      id: invitation.id,
      invitedEmail: invitation.invitedEmail,
      invitedUserId: invitation.invitedUserId,
      status: invitation.status,
      createdAt: invitation.createdAt,
      acceptedAt: invitation.acceptedAt,
      invitedUser: invitation.invitedUser
        ? {
            id: invitation.invitedUser.id,
            name: invitation.invitedUser.name,
            email: invitation.invitedUser.email,
          }
        : undefined,
    };
  }

  async acceptFamilyManagerInvitation(token: string, userId: string): Promise<{ message: string }> {
    const invitation = await this.prisma.familyManagerInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException({
        code: 'INVITATION_NOT_FOUND',
        message: 'Invitation not found',
      });
    }

    if (invitation.status !== FamilyManagerInvitationStatus.PENDING) {
      throw new BadRequestException({
        code: 'INVITATION_ALREADY_PROCESSED',
        message: 'Invitation has already been processed',
      });
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException({
        code: 'INVITATION_EXPIRED',
        message: 'Invitation has expired',
      });
    }

    // Verify email matches
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.email !== invitation.invitedEmail) {
      throw new UnauthorizedException({
        code: 'EMAIL_MISMATCH',
        message: 'Email does not match invitation',
      });
    }

    await this.prisma.familyManagerInvitation.update({
      where: { id: invitation.id },
      data: {
        status: FamilyManagerInvitationStatus.ACCEPTED,
        invitedUserId: userId,
        acceptedAt: new Date(),
      },
    });

    return { message: 'Family manager invitation accepted' };
  }

  async removeFamilyManager(userId: string, invitationId: string): Promise<{ message: string }> {
    const invitation = await this.prisma.familyManagerInvitation.findFirst({
      where: {
        id: invitationId,
        familyOwnerId: userId,
      },
    });

    if (!invitation) {
      throw new NotFoundException({
        code: 'INVITATION_NOT_FOUND',
        message: 'Invitation not found',
      });
    }

    if (invitation.status === FamilyManagerInvitationStatus.ACCEPTED) {
      // Revoke accepted invitation
      await this.prisma.familyManagerInvitation.update({
        where: { id: invitationId },
        data: {
          status: FamilyManagerInvitationStatus.REVOKED,
        },
      });
    } else {
      // Delete pending invitation
      await this.prisma.familyManagerInvitation.delete({
        where: { id: invitationId },
      });
    }

    return { message: 'Family manager removed' };
  }
}

