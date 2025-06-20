import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transaction.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/user.service';

const mockTxRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  updateBalance: jest.fn(),
};

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@test.com',
    password: 'hashed',
    balance: 100,
    transactions: [],
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: 'TransactionRepository', useValue: mockTxRepo },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  describe('deposit', () => {
    it('should create a deposit transaction and update user balance', async () => {
      const amount = 50;
      const newBalance = mockUser.balance + amount;

      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        balance: mockUser.balance,
      });

      mockUsersService.updateBalance.mockResolvedValue({
        ...mockUser,
        balance: newBalance,
      });

      mockTxRepo.create.mockReturnValue({
        user: mockUser,
        type: 'DEPOSIT',
        amount,
        postBalance: newBalance,
      });

      mockTxRepo.save.mockResolvedValue({
        id: 'tx1',
        user: mockUser,
        type: 'DEPOSIT',
        amount,
        postBalance: newBalance,
        createdAt: new Date(),
      });

      const transaction = await transactionsService.deposit(mockUser, amount);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockUsersService.updateBalance).toHaveBeenCalledWith(newBalance, mockUser.id);
      expect(mockTxRepo.create).toHaveBeenCalledWith({
        user: mockUser,
        type: 'DEPOSIT',
        amount,
        postBalance: newBalance,
      });
      expect(mockTxRepo.save).toHaveBeenCalled();

      expect(transaction).toMatchObject({
        type: 'DEPOSIT',
        amount,
        postBalance: newBalance,
      });

      expect(transaction.user.balance).toBe(mockUser.balance);
    });
  });
});
