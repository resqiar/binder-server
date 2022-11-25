import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { CodeRunnerController } from './code-runner.controller';
import { ExtensionController } from './extension.controller';

@Module({
  imports: [ServicesModule],
  controllers: [ExtensionController, CodeRunnerController],
})
export class ControllersModule {}
