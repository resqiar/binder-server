import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExtInput } from '../dtos/create-ext.input';
import { Extension } from '../entities/extension.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExtensionService {
  constructor(
    @InjectRepository(Extension)
    private readonly extRepo: Repository<Extension>,
  ) {}

  async getAll(): Promise<Extension[]> {
    return await this.extRepo.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getOne(id: number): Promise<Extension | null> {
    return await this.extRepo.findOneBy({ id: id });
  }

  async create(createInput: CreateExtInput): Promise<Extension> {
    const createdExt = this.extRepo.create(createInput);
    return await this.extRepo.save(createdExt);
  }

  async update(id: number, createInput: CreateExtInput): Promise<number> {
    const targetExt = await this.extRepo.findOneBy({ id: id });
    if (!targetExt) throw new NotFoundException();
    await this.extRepo.update(id, Object.assign({}, createInput));
    return 200;
  }

  async remove(id: number): Promise<number> {
    const targetExt = await this.extRepo.findOneBy({ id: id });
    if (!targetExt) throw new NotFoundException();
    await this.extRepo.delete(targetExt.id);
    return 200;
  }
}
