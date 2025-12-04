import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
  })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.create(dto);

    return {
      data: data,
      message: 'User registered successfully',
    };
  }

  @Post('/login')
  @ApiOkResponse({
    description: 'User logged in successfully',
  })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);

    return {
      data: data,
      message: 'User logged in successfully',
    };
  }

  // TODO: implement other methods auth (forgot password, reset password, etc.)
}
