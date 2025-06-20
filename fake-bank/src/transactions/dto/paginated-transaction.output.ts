import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Transaction } from '../entities/transaction.entity';

@ObjectType()
export class PaginatedTransactions {
  @Field(() => [Transaction])
  items: Transaction[];

  @Field(() => Int)
  total: number;

  @Field(() => Boolean)
  hasMore: boolean;
}
