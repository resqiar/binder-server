import { RegisterInput } from '../dtos/register.input';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<{ key: string }> {
    // Create the user and saved it inside the database
    const createdUser = await this.userService.create(registerInput);

    return {
      key: this.generateToken(createdUser.id),
    };
  }

  async login(registerInput: RegisterInput): Promise<{ key: string } | null> {
    const user = await this.userService.login(registerInput);

    if (!user) return null;

    return {
      key: this.generateToken(user.id as string),
    };
  }

  generateToken(id: string): string {
    // Create a JWT payload
    const payload = { id: id };

    // Generate JWT token using @nestjs/jwt package
    return this.jwtService.sign(payload);
  }
}
