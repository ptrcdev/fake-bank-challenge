import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Field(() => Float)
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: number;

    @Field(() => [Transaction])
    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;
}