import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should throw if email already exists', async () => {
      userRepo.findOne.mockResolvedValue({ id: 'existing' });

      await expect(
        usersService.create({ email: 'exists@test.com', password: 'pwd' } as any)
      ).rejects.toThrow(BadRequestException);
    });

    it('should save new user with hashed password', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(null);
      const hashedPassword = 'already-hashed-password';
    
      (userRepo.create as jest.Mock).mockReturnValue({ email: 'test@test.com', password: hashedPassword });
      (userRepo.save as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com', password: hashedPassword });
    
      const result = await usersService.create({ email: 'test@test.com', password: hashedPassword } as any);
    
      expect(userRepo.create).toHaveBeenCalledWith({ email: 'test@test.com', password: hashedPassword });
      expect(userRepo.save).toHaveBeenCalled();
      expect(result.email).toBe('test@test.com');
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const user = { id: '1', email: 'a@b.com' };
      userRepo.findOne.mockResolvedValue(user);

      const result = await usersService.findById('1');

      expect(result).toBe(user);
    });

    it('should throw NotFoundException if not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(usersService.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      const user = { id: '1', email: 'a@b.com' };
      userRepo.findOne.mockResolvedValue(user);

      const result = await usersService.findByEmail('a@b.com');

      expect(result).toBe(user);
    });

    it('should return null if not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await usersService.findByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });
});
