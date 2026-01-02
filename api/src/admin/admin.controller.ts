import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Class Types endpoints
  @Get('class-types')
  async getAllClassTypes(): Promise<{ ok: true; data: ClassTypeResponseDto[] }> {
    const data = await this.adminService.getAllClassTypes();
    return { ok: true, data };
  }

  @Post('class-types')
  async createClassType(
    @Body() dto: CreateClassTypeDto,
  ): Promise<{ ok: true; data: ClassTypeResponseDto }> {
    const data = await this.adminService.createClassType(dto);
    return { ok: true, data };
  }

  @Patch('class-types/:id')
  async updateClassType(
    @Param('id') id: string,
    @Body() dto: UpdateClassTypeDto,
  ): Promise<{ ok: true; data: ClassTypeResponseDto }> {
    const data = await this.adminService.updateClassType(id, dto);
    return { ok: true, data };
  }

  @Delete('class-types/:id')
  async deleteClassType(@Param('id') id: string): Promise<{ ok: true; data: {} }> {
    await this.adminService.deleteClassType(id);
    return { ok: true, data: {} };
  }

  // Sessions endpoints
  @Get('sessions')
  async getAllSessions(): Promise<{ ok: true; data: SessionResponseDto[] }> {
    const data = await this.adminService.getAllSessions();
    return { ok: true, data };
  }

  @Post('sessions')
  async createSession(
    @Body() dto: CreateSessionDto,
  ): Promise<{ ok: true; data: SessionResponseDto }> {
    const data = await this.adminService.createSession(dto);
    return { ok: true, data };
  }

  @Patch('sessions/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
  ): Promise<{ ok: true; data: SessionResponseDto }> {
    const data = await this.adminService.updateSession(id, dto);
    return { ok: true, data };
  }

  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string): Promise<{ ok: true; data: {} }> {
    await this.adminService.deleteSession(id);
    return { ok: true, data: {} };
  }

  // Instructors endpoints
  @Get('instructors')
  async getAllInstructors(): Promise<{ ok: true; data: InstructorResponseDto[] }> {
    const data = await this.adminService.getAllInstructors();
    return { ok: true, data };
  }

  @Post('instructors')
  async createInstructor(
    @Body() dto: CreateInstructorDto,
  ): Promise<{ ok: true; data: InstructorResponseDto }> {
    const data = await this.adminService.createInstructor(dto);
    return { ok: true, data };
  }

  @Patch('instructors/:id')
  async updateInstructor(
    @Param('id') id: string,
    @Body() dto: UpdateInstructorDto,
  ): Promise<{ ok: true; data: InstructorResponseDto }> {
    const data = await this.adminService.updateInstructor(id, dto);
    return { ok: true, data };
  }

  @Delete('instructors/:id')
  async deleteInstructor(@Param('id') id: string): Promise<{ ok: true; data: {} }> {
    await this.adminService.deleteInstructor(id);
    return { ok: true, data: {} };
  }

  // Users endpoints
  @Get('users')
  async getAllUsers(): Promise<{ ok: true; data: UserResponseDto[] }> {
    const data = await this.adminService.getAllUsers();
    return { ok: true, data };
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<{ ok: true; data: UserResponseDto }> {
    const data = await this.adminService.getUserById(id);
    return { ok: true, data };
  }

  @Post('users')
  async createUser(@Body() dto: CreateUserDto): Promise<{ ok: true; data: UserResponseDto }> {
    const data = await this.adminService.createUser(dto);
    return { ok: true, data };
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<{ ok: true; data: UserResponseDto }> {
    const data = await this.adminService.updateUser(id, dto);
    return { ok: true, data };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string): Promise<{ ok: true; data: {} }> {
    await this.adminService.deleteUser(id);
    return { ok: true, data: {} };
  }

  // Products endpoints
  @Get('products')
  async getAllProducts(): Promise<{ ok: true; data: ProductResponseDto[] }> {
    const data = await this.adminService.getAllProducts();
    return { ok: true, data };
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string): Promise<{ ok: true; data: ProductResponseDto }> {
    const data = await this.adminService.getProductById(id);
    return { ok: true, data };
  }

  @Post('products')
  async createProduct(@Body() dto: CreateProductDto): Promise<{ ok: true; data: ProductResponseDto }> {
    const data = await this.adminService.createProduct(dto);
    return { ok: true, data };
  }

  @Patch('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<{ ok: true; data: ProductResponseDto }> {
    const data = await this.adminService.updateProduct(id, dto);
    return { ok: true, data };
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string): Promise<{ ok: true; data: {} }> {
    await this.adminService.deleteProduct(id);
    return { ok: true, data: {} };
  }
}

