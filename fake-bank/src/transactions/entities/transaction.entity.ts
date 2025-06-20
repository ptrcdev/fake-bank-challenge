import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
}

@ObjectType()
@Entity()
export class Transaction {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Field(() => Number)
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Field(() => Number)
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    postBalance: number;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
    user: User;
}
