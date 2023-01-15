import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterInput } from 'src/dtos/register.input';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) registerInput: RegisterInput) {
    const isDuplicate = await this.userService.findByUsername(
      registerInput.username,
    );

    // If the input is already exist in database
    if (isDuplicate) throw new BadRequestException('Username Already Exist');

    return await this.authService.register(registerInput);
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) registerInput: RegisterInput,
  ): Promise<{ key: string }> {
    const key = await this.authService.login(registerInput);
    if (!key)
      throw new BadRequestException('Username or password is not correct');
    return key;
  }
}
