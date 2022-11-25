import { Test, TestingModule } from '@nestjs/testing';
import { Extension } from '../../entities/extension.entity';
import { ExtensionController } from '../../controllers/extension.controller';
import { ExtensionService } from '../../services/extension.service';
import { NotFoundException } from '@nestjs/common';
import { CreateExtInput } from '../../dtos/create-ext.input';

describe('Extensions Controller', () => {
  let extController: ExtensionController;

  const mockExtService = {
    getAll: jest.fn(() => {
      const ext = new Extension();
      ext.title = 'example';
      return Promise.resolve([ext]);
    }),
    getOne: jest.fn((id: number) => {
      if (id !== 19) return null;
      const ext = new Extension();
      ext.id = '19';
      return Promise.resolve(ext);
    }),
    create: jest.fn((input: CreateExtInput) => {
      const ext = new Extension();
      ext.id = Math.floor(Math.random() * 100).toString();
      ext.title = input.title;
      return Promise.resolve(ext);
    }),
    update: jest.fn((id: number, _: CreateExtInput) => {
      if (id !== 19) throw new NotFoundException();
      return Promise.resolve(200);
    }),
    remove: jest.fn((id: number) => {
      if (id !== 19) throw new NotFoundException();
      return Promise.resolve(200);
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExtensionController],
      providers: [
        {
          provide: ExtensionService,
          useValue: mockExtService,
        },
      ],
    }).compile();
    extController = app.get<ExtensionController>(ExtensionController);
  });

  it('Should be defined', () => {
    expect(extController).toBeDefined();
  });

  describe('Get Extensions Endpoint', () => {
    it('Should be defined', () => {
      expect(extController.getExtensions).toBeDefined();
    });

    it('Should return an array of Extensions', async () => {
      const res = expect.arrayContaining([expect.any(Extension)]);
      await expect(extController.getExtensions()).resolves.toEqual(res);
    });
  });

  describe('Get Extension Endpoint', () => {
    const trueId = 19;
    const falseId = 999999;

    it('Should be defined', () => {
      expect(extController.getExtension).toBeDefined();
    });

    it('Should return an Extension based on its ID', async () => {
      const res = expect.objectContaining({ id: trueId.toString() });
      await expect(extController.getExtension(trueId)).resolves.toEqual(res);
    });

    it('Should return an Error if the extension is not found', async () => {
      await expect(extController.getExtension(falseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Create Extension Endpoint', () => {
    it('Should be defined', () => {
      expect(extController.createExtension).toBeDefined();
    });

    it('Should create and return an Extension', async () => {
      const input = new CreateExtInput();
      input.title = 'Test';

      const res = expect.objectContaining({
        id: expect.any(String),
        title: input.title,
      });
      await expect(extController.createExtension(input)).resolves.toEqual(res);
    });
  });

  describe('Update Extension Endpoint', () => {
    const trueId = 19;
    const falseId = 999999;
    const input = new CreateExtInput();

    it('Should be defined', () => {
      expect(extController.updateExtension).toBeDefined();
    });

    it('Should update Extension and return a 200', async () => {
      await expect(
        extController.updateExtension(trueId, input),
      ).resolves.toEqual(200);
    });

    it('Should throw an error if the ID is not found', async () => {
      await expect(
        extController.updateExtension(falseId, input),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Remove Extension Endpoint', () => {
    const trueId = 19;
    const falseId = 999999;

    it('Should be defined', () => {
      expect(extController.removeExtension).toBeDefined();
    });

    it('Should remove Extension and return a 200', async () => {
      await expect(extController.removeExtension(trueId)).resolves.toEqual(200);
    });

    it('Should throw an error if the ID is not found', async () => {
      await expect(extController.removeExtension(falseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
