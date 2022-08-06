import { Controller, Get } from '@nestjs/common';
import { ExtensionService } from 'src/services/extension.service';

@Controller('ext')
export class ExtensionController {
  constructor(private readonly extService: ExtensionService) {}

  @Get()
  createExtension(): string {
    return this.extService.get();
  }
}
