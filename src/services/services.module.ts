import { Module } from '@nestjs/common';
import { ExtensionService } from './extension.service';

@Module({
  providers: [ExtensionService],
  exports: [ExtensionService],
})
export class ServicesModule {}
