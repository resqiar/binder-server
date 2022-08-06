import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/services/services.module';
import { ExtensionController } from './extension.controller';

@Module({
  imports: [ServicesModule],
  controllers: [ExtensionController],
})
export class ControllersModule {}
