import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  let usersService: {
    findByEmail: jest.Mock;
    create?: jest.Mock;
  };

  let jwtService: {
    sign: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(() => 'fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      const user = { email: 'test@test.com', password: 'hashed-password' };
      usersService.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('test@test.com', 'plaintext');

      expect(result).toBe(user);
    });

    it('should return null if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser('test@test.com', 'plaintext');

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = { email: 'test@test.com', password: 'hashed-password' };
      usersService.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authService.validateUser('test@test.com', 'wrongpass');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return AuthResponse on successful login', async () => {
      const user = { id: '123', email: 'test@test.com' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user as any);

      const result = await authService.login({ email: 'test@test.com', password: 'pwd' });

      expect(result.accessToken).toBe('fake-jwt-token');
      expect(result.user).toBe(user);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, email: user.email });
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authService.login({ email: 'test@test.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user and return AuthResponse', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create!.mockResolvedValue({ id: 'new-id', email: 'new@test.com' });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await authService.register({ email: 'new@test.com', password: 'pwd' });

      expect(usersService.create).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'hashedPassword',
      });

      expect(result.accessToken).toBe('fake-jwt-token');
      expect(result.user.email).toBe('new@test.com');
    });

    it('should throw BadRequestException if email already exists', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(authService.register({ email: 'exist@test.com', password: 'pwd' }))
        .rejects.toThrow('An account with this email is already created.');
    });
  });
});
