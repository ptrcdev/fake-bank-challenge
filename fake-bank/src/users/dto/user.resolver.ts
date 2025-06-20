import { Resolver, Mutation, Query, Args, Float } from '@nestjs/graphql';
import { UsersService } from '../user.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../entities/user.entity';
import { AuthResponse } from 'src/auth/dto/authResponse.type';
import { LoginInput } from 'src/auth/dto/login.input';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User | null> {
    return await this.usersService.findByEmail(user.email);
  }

  @Query(() => Float)
  @UseGuards(GqlAuthGuard)
  async getBalance(@CurrentUser() user: User): Promise<number> {
    const userData = await this.usersService.findByEmail(user.email);
    if (!userData) throw new BadRequestException('User not found');

    return  userData.balance;
  }
}
