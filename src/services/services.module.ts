import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { Extension } from '../entities/extension.entity';
import { AuthService } from './auth.service';
import { CodeRunnerService } from './code-runner.service';
import { ExtensionService } from './extension.service';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Extension, User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: '604800s', // 7 Days
      },
    }),
  ],
  providers: [
    ExtensionService,
    CodeRunnerService,
    AuthService,
    UserService,
    JwtStrategy,
  ],
  exports: [ExtensionService, CodeRunnerService, AuthService, UserService],
})
export class ServicesModule {}
