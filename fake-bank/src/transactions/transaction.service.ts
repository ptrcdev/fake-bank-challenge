import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/user.service';
import { PaginatedTransactions } from './dto/paginated-transaction.output';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly userService: UsersService,
  ) { }

  async getUserTransactionsPaginated(
    user: User,
    limit = 10,
    offset = 0,
    type?: TransactionType,
  ): Promise<PaginatedTransactions> {
    const where: any = { user: { id: user.id } };
    if (type) where.type = type;
  
    const [items, total] = await this.txRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
      relations: ['user'],
    });
  
    return {
      items,
      total,
      hasMore: offset + limit < total,
    };
  }
  

  
  async getUserTransactions(user: User): Promise<Transaction[]> {
    return this.txRepo.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['user']
    });
  }

  async deposit(user: User, amount: number): Promise<Transaction> {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const foundUser = await this.userService.findByEmail(user.email);
    if (!foundUser) throw new BadRequestException('User not found');


    const lastBalance = parseFloat(foundUser.balance.toString()); // ORM will return it in a string format so we parse this here to make sure there's no errors.

    const newBalance = lastBalance + amount;

    const transaction = this.txRepo.create({
      user,
      type: TransactionType.DEPOSIT,
      amount,
      postBalance: newBalance,
    });

    await this.userService.updateBalance(newBalance, foundUser.id);


    return this.txRepo.save(transaction);
  }

  async withdraw(user: User, amount: number): Promise<Transaction> {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const foundUser = await this.userService.findByEmail(user.email);
    if (!foundUser) throw new BadRequestException('User not found');

    const lastBalance = parseFloat(foundUser.balance.toString()); // ORM will return it in a string format.

    if (amount > lastBalance)
      throw new BadRequestException('Insufficient funds');

    const newBalance = lastBalance - amount;

    const transaction = this.txRepo.create({
      user,
      type: TransactionType.WITHDRAWAL,
      amount,
      postBalance: newBalance,
    });

    await this.userService.updateBalance(newBalance, foundUser.id);

    return this.txRepo.save(transaction);
  }
}
