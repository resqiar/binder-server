import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extension } from 'src/entities/extension.entity';
import { CodeRunnerService } from './code-runner.service';
import { ExtensionService } from './extension.service';

@Module({
  imports: [TypeOrmModule.forFeature([Extension])],
  providers: [ExtensionService, CodeRunnerService],
  exports: [ExtensionService, CodeRunnerService],
})
export class ServicesModule {}
