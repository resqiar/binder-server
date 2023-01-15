import { InjectRepository } from '@nestjs/typeorm';
import { RegisterInput } from 'src/dtos/register.input';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async register(registerInput: RegisterInput) {
    const createdUser = this.userRepo.create(registerInput);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(registerInput.password, 12);
    createdUser.password = hashedPassword;

    return await this.userRepo.save(createdUser);
  }

  async findByUsername(username: string) {
    return await this.userRepo.findOneBy({
      username: username,
    });
  }

  async debug() {
    return await this.userRepo.find();
  }
}
