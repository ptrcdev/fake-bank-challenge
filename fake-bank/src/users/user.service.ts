import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterInput } from 'src/auth/dto/register.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(input: RegisterInput): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: input.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const user = this.userRepo.create({ email: input.email, password: input.password });
    return await this.userRepo.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async updateBalance(newBalance: number, userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.balance = newBalance;
    return await this.userRepo.save(user);
  }
}
