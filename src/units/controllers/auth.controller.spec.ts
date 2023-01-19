import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../services/user.service';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user.entity';
import { RegisterInput } from 'src/dtos/register.input';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn((input: RegisterInput) => {
      if (
        input.username !== 'correct-username' ||
        input.password !== 'correct-password'
      )
        throw new BadRequestException();

      return Promise.resolve({
        key: 'random-jwt-key',
      });
    }),
    register: jest.fn(() => {
      return Promise.resolve({
        key: 'random-jwt-key',
      });
    }),
  };

  const mockUserService = {
    findById: jest.fn((id: string) => {
      if (id !== 'example-id') return Promise.resolve(null);
      const currentUser = new User();

      currentUser.id = id;
      currentUser.username = 'example-username';

      return Promise.resolve(currentUser);
    }),
    findByUsername: jest.fn((username: string) => {
      // If the user is not registered (not found in the database)
      if (username === 'not-registered-username') return Promise.resolve(null);

      const currentUser = new User();

      currentUser.id = 'example-id';
      currentUser.username = username;

      return Promise.resolve(currentUser);
    }),
    // create: jest.fn((input: RegisterInput) => {
    //   const createdUser = new User();

    //   createdUser.id = 'example-id';
    //   createdUser.username = input.username;

    //   return Promise.resolve(createdUser);
    // }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Check Auth Status Endpoint', () => {
    const req: Partial<ProtectedRequest> = {
      user: {
        id: 'example-id',
      },
    };

    it('should be defined', () => {
      expect(authController.currentUser).toBeDefined();
    });

    it('should return User with the correct id', async () => {
      const res = expect.objectContaining({
        id: req.user?.id,
      });

      await expect(
        authController.currentUser(req as ProtectedRequest),
      ).resolves.toEqual(res);
    });

    it('should return null if the correct user not found', async () => {
      const customReq: Partial<ProtectedRequest> = {
        user: {
          id: 'not-found-id',
        },
      };

      await expect(
        authController.currentUser(customReq as ProtectedRequest),
      ).resolves.toBe(null);
    });
  });

  describe('Register Endpoint', () => {
    it('should be defined', () => {
      expect(authController.register).toBeDefined();
    });

    it('should create and return object of JWT key', async () => {
      const input: RegisterInput = {
        username: 'not-registered-username',
        password: 'example',
      };

      const res = expect.objectContaining({
        key: expect.any(String),
      });

      await expect(authController.register(input)).resolves.toEqual(res);
    });

    it('should return error if the username already exist', async () => {
      const input: RegisterInput = {
        username: 'registered-username',
        password: 'example',
      };

      await expect(authController.register(input)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Login Endpoint', () => {
    it('should be defined', () => {
      expect(authController.login).toBeDefined();
    });

    it('should match username & password and return JWT key', async () => {
      const input: RegisterInput = {
        username: 'correct-username',
        password: 'correct-password',
      };

      const res = expect.objectContaining({
        key: expect.any(String),
      });

      await expect(authController.login(input)).resolves.toEqual(res);
    });

    it('should return error if username not match)', async () => {
      const input: RegisterInput = {
        username: 'wrong-username',
        password: 'correct-password',
      };

      await expect(authController.login(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return error if password not match)', async () => {
      const input: RegisterInput = {
        username: 'correct-username',
        password: 'wrong-password',
      };

      await expect(authController.login(input)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
