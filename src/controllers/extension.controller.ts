import { Controller, Get } from '@nestjs/common';
import { Extension } from 'src/entities/extension.entity';
import { ExtensionService } from 'src/services/extension.service';

@Controller('ext')
export class ExtensionController {
  constructor(private readonly extService: ExtensionService) {}

  @Get()
  async getExtensions(): Promise<Extension[]> {
    return await this.extService.getAll();
  }
}
