import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsResolver } from './transaction.resolver';
import { TransactionsService } from '../transaction.service';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from '../entities/transaction.entity';

describe('TransactionsResolver', () => {
  let resolver: TransactionsResolver;
  let transactionsService: Partial<TransactionsService>;

  beforeEach(async () => {
    transactionsService = {
      deposit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsResolver,
        { provide: TransactionsService, useValue: transactionsService },
      ],
    }).compile();

    resolver = module.get<TransactionsResolver>(TransactionsResolver);
  });

  it('should call deposit and return transaction', async () => {
    const mockUser = { id: 'user1' } as User;
    const mockTransaction = {
      id: 'tx1',
      amount: 50,
      postBalance: 150,
      user: mockUser,
      type: 'DEPOSIT',
      createdAt: new Date(),
    } as Transaction;

    (transactionsService.deposit as jest.Mock).mockResolvedValue(mockTransaction);

    const result = await resolver.deposit(mockUser, 50);

    expect(transactionsService.deposit).toHaveBeenCalledWith(mockUser, 50);
    expect(result).toBe(mockTransaction);
  });
});
