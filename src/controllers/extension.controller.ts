import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateExtInput } from '../dtos/create-ext.input';
import { Extension } from '../entities/extension.entity';
import { ExtensionService } from '../services/extension.service';

@Controller('ext')
export class ExtensionController {
  constructor(private readonly extService: ExtensionService) {}

  @Get()
  async getExtensions(): Promise<Extension[]> {
    return await this.extService.getAll();
  }

  @Get(':id')
  async getExtension(@Param('id') id: number): Promise<Extension> {
    const targetExt = await this.extService.getOne(id);
    if (!targetExt) throw new NotFoundException();
    return targetExt;
  }

  @Post('create')
  async createExtension(
    @Body(new ValidationPipe()) createInput: CreateExtInput,
  ): Promise<Extension> {
    return await this.extService.create(createInput);
  }

  @Post('update/:id')
  async updateExtension(
    @Param('id') id: number,
    @Body(new ValidationPipe()) createInput: CreateExtInput,
  ): Promise<number> {
    return await this.extService.update(id, createInput);
  }

  @Post('remove/:id')
  async removeExtension(@Param('id') id: number): Promise<number> {
    return await this.extService.remove(id);
  }
}
