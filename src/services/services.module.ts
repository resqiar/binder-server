import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Extension } from '../entities/extension.entity';
import { AuthService } from './auth.service';
import { CodeRunnerService } from './code-runner.service';
import { ExtensionService } from './extension.service';

@Module({
  imports: [TypeOrmModule.forFeature([Extension, User])],
  providers: [ExtensionService, CodeRunnerService, AuthService],
  exports: [ExtensionService, CodeRunnerService, AuthService],
})
export class ServicesModule {}
