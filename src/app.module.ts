import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { ControllersModule } from './controllers/controllers.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [DbModule, ControllersModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
