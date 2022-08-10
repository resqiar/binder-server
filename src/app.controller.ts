import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageKitSignature } from './types/image-kit';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/auth-imagekit')
  getSignatureIK(): ImageKitSignature {
    return this.appService.getSignatureIK();
  }
}
