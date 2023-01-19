import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterInput } from '../../dtos/register.input';
import { User } from '../../entities/user.entity';
import { UserService } from '../../services/user.service';

describe('User Service', () => {
  let userService: UserService;

  const mockUserRepo = {
    findOne: jest.fn((opt: any) => {
      if (!opt.where) return Promise.resolve(new User());
      if (opt.where.username === 'correct-username') {
        const user = new User();

        user.id = 'example-id';
        user.username = opt.where.username;
        user.password =
          '$2a$12$FoS.0R9BAjAljB7Ac9bTPupNBKGIPLUwf.CqgtNmKz9q/M1GTs5HW'; // hashed string of "correct-password"

        return Promise.resolve(user);
      }

      if (opt.where.id === 'correct-id') {
        const user = new User();

        user.id = opt.where.id;
        user.username = 'example-username';

        return Promise.resolve(user);
      }

      if (opt.where.id === 'admin-id' && opt.where.is_admin) {
        const user = new User();

        user.id = opt.where.id;
        user.username = 'example-username';
        user.is_admin = true;

        return Promise.resolve(user);
      }

      return Promise.resolve(null);
    }),
    findOneBy: jest.fn((opt: any) => {
      if (opt.username && opt.username === 'correct-username') {
        const user = new User();

        user.id = 'example-id';
        user.username = opt.username;

        return Promise.resolve(user);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn((input: RegisterInput) => {
      return input;
    }),
    save: jest.fn((input: User) => {
      const savedUser = new User();

      savedUser.id = 'example-id';
      savedUser.username = input.username;

      return Promise.resolve(savedUser);
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Create User Service', () => {
    it('Should be defined', () => {
      expect(userService.create).toBeDefined();
    });

    it('Should create and return a new User', async () => {
      const input: RegisterInput = {
        username: 'example-username',
        password: 'example-password',
      };

      const res = expect.objectContaining({
        id: expect.any(String),
        username: input.username,
      });

      await expect(userService.create(input)).resolves.toEqual(res);
    });
  });

  describe('Login Service', () => {
    it('Should be defined', () => {
      expect(userService.login).toBeDefined();
    });

    it('Should match user credentials and return a User obj', async () => {
      const input: RegisterInput = {
        username: 'correct-username',
        password: 'correct-password',
      };

      const res = expect.objectContaining({
        id: expect.any(String),
        username: input.username,
      });

      await expect(userService.login(input)).resolves.toEqual(res);
    });

    it('Should return null if no username is found', async () => {
      const input: RegisterInput = {
        username: 'wrong-username',
        password: 'correct-password',
      };

      await expect(userService.login(input)).resolves.toEqual(null);
    });

    it('Should return null if the password is not correct', async () => {
      const input: RegisterInput = {
        username: 'correct-username',
        password: 'wrong-password',
      };

      await expect(userService.login(input)).resolves.toEqual(null);
    });
  });

  describe('Find By Username Service', () => {
    it('Should be defined', () => {
      expect(userService.findByUsername).toBeDefined();
    });

    it('Should return a User based on defined username', async () => {
      const res = expect.objectContaining({ username: 'correct-username' });
      await expect(
        userService.findByUsername('correct-username'),
      ).resolves.toEqual(res);
    });

    it('Should return a null if the User is not found', async () => {
      await expect(
        userService.findByUsername('wrong-username'),
      ).resolves.toEqual(null);
    });
  });

  describe('Find By Id Service', () => {
    it('Should be defined', () => {
      expect(userService.findById).toBeDefined();
    });

    it('Should return a User based on defined id', async () => {
      const id = 'correct-id';
      const res = expect.objectContaining({ id: id });
      await expect(userService.findById(id)).resolves.toEqual(res);
    });

    it('Should return a null if the User is not found', async () => {
      await expect(userService.findById('wrong-id')).resolves.toEqual(null);
    });
  });

  describe('Find Admin By Id Service', () => {
    it('Should be defined', () => {
      expect(userService.findAdminById).toBeDefined();
    });

    it('Should return an administrator User based on defined id', async () => {
      const id = 'admin-id';
      const res = expect.objectContaining({ id: id, is_admin: true });
      await expect(userService.findAdminById(id)).resolves.toEqual(res);
    });

    it('Should return a null if the admin User is not found', async () => {
      await expect(userService.findAdminById('not-admin-id')).resolves.toEqual(
        null,
      );
    });
  });
});
