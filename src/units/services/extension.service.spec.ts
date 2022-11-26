import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateExtInput } from '../../dtos/create-ext.input';
import { Extension } from '../../entities/extension.entity';
import { ExtensionService } from '../../services/extension.service';

describe('Extension Service', () => {
  let extService: ExtensionService;

  // Mock value used inside query builder.
  // This value is set in some case and always cleared afterward.
  let mockSelectedID: number | undefined;

  const mockQueryBuilder: any = {
    select: (_: string) => {
      return mockQueryBuilder;
    },
    where: (_: string, obj: { id: number }) => {
      mockSelectedID = obj.id;
      return mockQueryBuilder;
    },
    getRawOne: () => {
      if (mockSelectedID !== 19) return null;
      const ext = new Extension();
      ext.id = 19;
      return Promise.resolve(ext);
    },
  };

  const mockExtRepo = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    find: jest.fn(() => {
      const ext = new Extension();
      ext.title = 'example';
      return Promise.resolve([ext]);
    }),
    findOneBy: jest.fn((input: { id: string }) => {
      if (Number(input.id) !== 19) return null;
      const ext = new Extension();
      ext.id = 19;
      return Promise.resolve(ext);
    }),
    create: jest.fn((input: CreateExtInput) => {
      return input;
    }),
    save: jest.fn((input: Extension) => {
      const ext = new Extension();
      ext.id = Math.floor(Math.random() * 100);
      ext.title = input.title;
      return Promise.resolve(ext);
    }),
    update: jest.fn((_: number, __: CreateExtInput) => {
      return;
    }),
    delete: jest.fn((_: number) => {
      return;
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ExtensionService,

        {
          provide: getRepositoryToken(Extension),
          useValue: mockExtRepo,
        },
      ],
    }).compile();
    extService = app.get<ExtensionService>(ExtensionService);
  });

  afterEach(() => {
    // Reset the selected value after every test case
    mockSelectedID = undefined;
  });

  it('Should be defined', () => {
    expect(extService).toBeDefined();
  });

  describe('Get Extensions Service', () => {
    it('Should be defined', () => {
      expect(extService.getAll).toBeDefined();
    });

    it('Should return an array of Extensions', async () => {
      const res = expect.arrayContaining([expect.any(Extension)]);
      await expect(extService.getAll()).resolves.toEqual(res);
    });
  });

  describe('Get Extension Service', () => {
    const trueId = 19;
    const falseId = 999999;

    it('Should be defined', () => {
      expect(extService.getOne).toBeDefined();
    });

    it('Should return an Extension based on its ID', async () => {
      const res = expect.objectContaining({ id: trueId });
      await expect(extService.getOne(trueId)).resolves.toEqual(res);
    });

    it('Should return a null if the extension is not found', async () => {
      await expect(extService.getOne(falseId)).resolves.toEqual(null);
    });
  });

  describe('Create Extension Service', () => {
    it('Should be defined', () => {
      expect(extService.create).toBeDefined();
    });

    it('Should create and return an Extension', async () => {
      const input = new CreateExtInput();
      input.title = 'Test';

      const res = expect.objectContaining({
        id: expect.any(Number),
        title: input.title,
      });

      await expect(extService.create(input)).resolves.toEqual(res);
    });
  });

  describe('Update Extension Service', () => {
    const trueId = 19;
    const falseId = 999999;
    const input = new CreateExtInput();

    it('Should be defined', () => {
      expect(extService.update).toBeDefined();
    });

    it('Should update Extension and return a 200', async () => {
      await expect(extService.update(trueId, input)).resolves.toEqual(200);
    });

    it('Should throw an error if the ID is not found', async () => {
      await expect(extService.update(falseId, input)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Remove Extension Service', () => {
    const trueId = 19;
    const falseId = 999999;

    it('Should be defined', () => {
      expect(extService.remove).toBeDefined();
    });

    it('Should remove Extension and return a 200', async () => {
      await expect(extService.remove(trueId)).resolves.toEqual(200);
    });

    it('Should throw an error if the ID is not found', async () => {
      await expect(extService.remove(falseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
