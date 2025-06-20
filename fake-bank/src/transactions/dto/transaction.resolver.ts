import { Resolver, Query, Mutation, Args, Int, registerEnumType } from '@nestjs/graphql';
import { TransactionsService } from '../transaction.service';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginatedTransactions } from './paginated-transaction.output';

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly txService: TransactionsService) { }

  @Query(() => PaginatedTransactions)
  @UseGuards(GqlAuthGuard)
  async myTransactions(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('type', { type: () => TransactionType, nullable: true }) type?: TransactionType,
  ): Promise<PaginatedTransactions> {
    return this.txService.getUserTransactionsPaginated(user, limit, offset, type);
  }

  @Mutation(() => Transaction)
  @UseGuards(GqlAuthGuard)
  async deposit(
    @CurrentUser() user: User,
    @Args('amount') amount: number,
  ): Promise<Transaction> {
    return this.txService.deposit(user, amount);
  }

  @Mutation(() => Transaction)
  @UseGuards(GqlAuthGuard)
  async withdraw(
    @CurrentUser() user: User,
    @Args('amount') amount: number,
  ): Promise<Transaction> {
    return this.txService.withdraw(user, amount);
  }
}
