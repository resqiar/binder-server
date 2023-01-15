import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterInput } from 'src/dtos/register.input';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('debug')
  async debug() {
    return await this.authService.debug();
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) registerInput: RegisterInput) {
    const isDuplicate = await this.authService.findByUsername(
      registerInput.username,
    );

    if (isDuplicate) throw new BadRequestException('Username Already Exist');

    return await this.authService.register(registerInput);
  }
}
