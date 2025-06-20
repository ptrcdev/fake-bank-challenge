import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;

  let authService: {
    login: jest.Mock;
    register: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
  });

  describe('login', () => {
    it('should call authService.login and return AuthResponse', async () => {
      const loginDto = { email: 'test@test.com', password: 'pwd' };
      const mockResponse = { accessToken: 'token', user: { id: '1', email: 'test@test.com' } };

      authService.login.mockResolvedValue(mockResponse);

      const result = await authResolver.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(mockResponse);
    });

    it('should throw UnauthorizedException on failed login', async () => {
      authService.login.mockRejectedValue(new UnauthorizedException());

      await expect(authResolver.login({ email: 'bad@test.com', password: 'bad' }))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should call authService.register and return AuthResponse', async () => {
      const registerDto = { email: 'new@test.com', password: 'pwd' };
      const mockResponse = { accessToken: 'token', user: { id: '2', email: 'new@test.com' } };

      authService.register.mockResolvedValue(mockResponse);

      const result = await authResolver.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toBe(mockResponse);
    });
  });
});
