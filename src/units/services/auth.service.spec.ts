import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../services/user.service';
import { User } from '../../entities/user.entity';
import { RegisterInput } from '../../dtos/register.input';
import { AuthService } from '../../services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn((_payload: any) => {
      return 'random-signed-jwt-string';
    }),
  };

  const mockUserService = {
    login: jest.fn((input: RegisterInput) => {
      if (
        input.username !== 'correct-username' ||
        input.password !== 'correct-password'
      )
        return null;

      return Promise.resolve({
        key: 'random-jwt-key',
      });
    }),
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
    create: jest.fn((input: RegisterInput) => {
      const createdUser = new User();

      createdUser.id = 'example-id';
      createdUser.username = input.username;

      return Promise.resolve(createdUser);
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Register Endpoint', () => {
    it('should be defined', () => {
      expect(authService.register).toBeDefined();
    });

    it('should create and return object of JWT key', async () => {
      const input: RegisterInput = {
        username: 'not-registered-username',
        password: 'example',
      };

      const res = expect.objectContaining({
        key: expect.any(String),
      });

      await expect(authService.register(input)).resolves.toEqual(res);
    });
  });

  describe('Login Endpoint', () => {
    it('should be defined', () => {
      expect(authService.login).toBeDefined();
    });

    it('should match username & password and return JWT key', async () => {
      const input: RegisterInput = {
        username: 'correct-username',
        password: 'correct-password',
      };

      const res = expect.objectContaining({
        key: expect.any(String),
      });

      await expect(authService.login(input)).resolves.toEqual(res);
    });

    it('should return null if username not match)', async () => {
      const input: RegisterInput = {
        username: 'wrong-username',
        password: 'correct-password',
      };

      await expect(authService.login(input)).resolves.toBe(null);
    });

    it('should return null if password not match)', async () => {
      const input: RegisterInput = {
        username: 'correct-username',
        password: 'wrong-password',
      };

      await expect(authService.login(input)).resolves.toBe(null);
    });
  });

  describe('Generate Token Service', () => {
    it('should be defined', () => {
      expect(authService.generateToken).toBeDefined();
    });

    it('should generate JWT key', () => {
      const userId = 'example-id';
      expect(authService.generateToken(userId)).toEqual(expect.anything());
    });
  });
});
