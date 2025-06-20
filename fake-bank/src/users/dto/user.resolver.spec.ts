import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './user.resolver';
import { UsersService } from '../user.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../entities/user.entity';
import { AuthResponse } from 'src/auth/dto/authResponse.type';
import { BadRequestException } from '@nestjs/common';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: { findByEmail: jest.Mock };
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };

    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  describe('login', () => {
    it('should call authService.login and return AuthResponse', async () => {
      const input = { email: 'test@example.com', password: 'password' };
      const authResponse: AuthResponse = {
        accessToken: 'token',
        user: new User(),
      };

      authService.login.mockResolvedValue(authResponse);

      const result = await resolver.login(input);

      expect(authService.login).toHaveBeenCalledWith(input);
      expect(result).toBe(authResponse);
    });
  });

  describe('me', () => {
    it('should return user data', async () => {
      const user = new User();
      user.email = 'test@example.com';

      usersService.findByEmail.mockResolvedValue(user);

      const result = await resolver.me(user);

      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user);
    });
  });

  describe('getBalance', () => {
    it('should return user balance', async () => {
      const user = new User();
      user.email = 'test@example.com';
      user.balance = 100;

      usersService.findByEmail.mockResolvedValue(user);

      const result = await resolver.getBalance(user);

      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user.balance);
    });

    it('should throw BadRequestException if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(resolver.getBalance({ email: 'no@user.com' } as User))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});
