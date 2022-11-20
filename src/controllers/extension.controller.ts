import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateExtInput } from 'src/dtos/create-ext.input';
import { Extension } from 'src/entities/extension.entity';
import { ExtensionService } from 'src/services/extension.service';

@Controller('ext')
export class ExtensionController {
  constructor(private readonly extService: ExtensionService) {}

  @Get()
  async getExtensions(
    @Query('take') take: number | undefined,
    @Query('skip') skip: number | undefined,
  ): Promise<Extension[]> {
    return await this.extService.getAll(take, skip);
  }

  @Get(':id')
  async getExtension(@Param('id') id: number): Promise<Extension> {
    // If the ID given is not a number then we need to throw some error
    if (isNaN(id)) throw new BadRequestException('ID is not a number');

    const targetExt = await this.extService.getOne(id);

    // If not found then throw an error
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
