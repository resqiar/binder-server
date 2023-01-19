import { Test, TestingModule } from '@nestjs/testing';
import { Extension } from '../../entities/extension.entity';
import { ExtensionController } from '../../controllers/extension.controller';
import { ExtensionService } from '../../services/extension.service';
import { CanActivate, NotFoundException } from '@nestjs/common';
import { CreateExtInput } from '../../dtos/create-ext.input';
import { AdminGuard } from '../../guards/admin.guard';

describe('Extensions Controller', () => {
  let extController: ExtensionController;

  const mockExtService = {
    getAll: jest.fn(
      (take: number | undefined = 9, _: number | undefined = 0) => {
        const ext = new Extension();
        ext.title = 'example';

        const result = [
          ...Array(take)
            .fill(0)
            .map(() => ext),
        ];

        return Promise.resolve(result);
      },
    ),
    getOne: jest.fn((id: number) => {
      if (id !== 19) return null;
      const ext = new Extension();
      ext.id = 19;
      return Promise.resolve(ext);
    }),
    create: jest.fn((input: CreateExtInput) => {
      const ext = new Extension();
      ext.id = Math.floor(Math.random() * 100);
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

  const mockAdminGuard: CanActivate = {
    canActivate: jest.fn(() => true),
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
    })
      .overrideGuard(AdminGuard)
      .useValue(mockAdminGuard)
      .compile();
    extController = app.get<ExtensionController>(ExtensionController);
  });

  it('Should be defined', () => {
    expect(extController).toBeDefined();
  });

  describe('Get Extensions Endpoint', () => {
    const take: number | undefined = 5;
    const skip: number | undefined = 0;

    it('Should be defined', () => {
      expect(extController.getExtensions).toBeDefined();
    });

    it('Should return an array of Extensions', async () => {
      const res = expect.arrayContaining([expect.any(Extension)]);
      await expect(extController.getExtensions(take, skip)).resolves.toEqual(
        res,
      );
    });

    it('Should return 5 of Extensions when take is defined as 5', async () => {
      await expect(
        extController.getExtensions(take, skip),
      ).resolves.toHaveLength(5);
    });

    it('Should return default value of 9 Extensions when take is undefined', async () => {
      await expect(
        extController.getExtensions(undefined, skip),
      ).resolves.toHaveLength(9);
    });

    it('Should still return default value when take and skip is undefined', async () => {
      const res = expect.arrayContaining([expect.any(Extension)]);
      await expect(
        extController.getExtensions(undefined, undefined),
      ).resolves.toEqual(res);
      await expect(
        extController.getExtensions(undefined, undefined),
      ).resolves.toHaveLength(9);
    });
  });

  describe('Get Extension Endpoint', () => {
    const trueId = 19;
    const falseId = 999999;

    it('Should be defined', () => {
      expect(extController.getExtension).toBeDefined();
    });

    it('Should return an Extension based on its ID', async () => {
      const res = expect.objectContaining({ id: trueId });
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
        id: expect.any(Number),
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
