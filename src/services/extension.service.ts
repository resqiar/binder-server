import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExtInput } from 'src/dtos/create-ext.input';
import { Extension } from 'src/entities/extension.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExtensionService {
  constructor(
    @InjectRepository(Extension)
    private readonly extRepo: Repository<Extension>,
  ) {}

  async getAll(): Promise<Extension[]> {
    return await this.extRepo.find();
  }

  async create(createInput: CreateExtInput): Promise<Extension> {
    const createdExt = this.extRepo.create(createInput);
    return await this.extRepo.save(createdExt);
  }
}
