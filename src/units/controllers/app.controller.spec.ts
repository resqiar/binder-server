import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getHello: jest.fn(() => {
      return 'Hello World!';
    }),
    getSignatureIK: jest.fn(() => {
      return {
        token: 'a11ca8b6-8f9d-41b5-a617-XXXXXXXXX',
        expire: 1669044135,
        signature: '9395c59b667cec60ded1ab5359e59883XXXXXXX',
      };
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('Auth ImageKit', () => {
    it('Should return a token from ImageKit', () => {
      const result = {
        token: expect.any(String),
        expire: expect.any(Number),
        signature: expect.any(String),
      };
      expect(appController.getSignatureIK()).toEqual(result);
    });
  });
});
