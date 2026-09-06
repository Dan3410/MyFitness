import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface AuthRequest {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() request: AuthRequest) {
    return this.authService.login(request);
  }

  @Post('register')
  register(@Body() request: AuthRequest) {
    return this.authService.register(request);
  }
}