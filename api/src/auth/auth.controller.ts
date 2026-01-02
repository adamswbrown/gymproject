import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ ok: true; data: AuthResponseDto }> {
    const result = await this.authService.register(registerDto);
    return { ok: true, data: result };
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ ok: true; data: AuthResponseDto }> {
    const result = await this.authService.login(loginDto);
    return { ok: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any): Promise<{ ok: true; data: UserResponseDto }> {
    const profile = await this.authService.getProfile(user.id);
    return { ok: true, data: profile };
  }
}


