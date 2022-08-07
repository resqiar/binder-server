import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateExtInput } from 'src/dtos/create-ext.input';
import { Extension } from 'src/entities/extension.entity';
import { ExtensionService } from 'src/services/extension.service';

@Controller('ext')
export class ExtensionController {
  constructor(private readonly extService: ExtensionService) {}

  @Get()
  async getExtensions(): Promise<Extension[]> {
    return await this.extService.getAll();
  }

  @Post('create')
  async createExtension(
    @Body(new ValidationPipe()) createInput: CreateExtInput,
  ): Promise<Extension> {
    return await this.extService.create(createInput);
  }
}
