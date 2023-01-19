import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { AuthController } from './auth.controller';
import { CodeRunnerController } from './code-runner.controller';
import { ExtensionController } from './extension.controller';

@Module({
  imports: [ServicesModule],
  controllers: [ExtensionController, CodeRunnerController, AuthController],
})
export class ControllersModule {}
