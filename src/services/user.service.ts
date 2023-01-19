import { InjectRepository } from '@nestjs/typeorm';
import { RegisterInput } from '../dtos/register.input';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(registerInput: RegisterInput): Promise<User> {
    const createdUser = this.userRepo.create(registerInput);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(registerInput.password, 12);
    createdUser.password = hashedPassword;

    return await this.userRepo.save(createdUser);
  }

  async login(registerInput: RegisterInput): Promise<Partial<User> | null> {
    const user = await this.userRepo.findOne({
      where: {
        username: registerInput.username,
      },
      select: ['id', 'username', 'password'],
    });

    if (!user) return null;

    // Compare plain and hashed password
    const isMatch = await bcrypt.compare(registerInput.password, user.password);

    if (!isMatch) return null;

    // Exclude the password and return back
    const { password, ...rest } = user;
    return rest;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOneBy({
      username: username,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        id: id,
      },
      cache: true,
      select: ['id', 'username', 'is_admin', 'profile_url', 'created_at'],
    });
  }

  async findAdminById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        id: id,
        is_admin: true,
      },
    });
  }
}
