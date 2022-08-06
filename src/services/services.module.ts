import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extension } from 'src/entities/extension.entity';
import { ExtensionService } from './extension.service';

@Module({
  imports: [TypeOrmModule.forFeature([Extension])],
  providers: [ExtensionService],
  exports: [ExtensionService],
})
export class ServicesModule {}
