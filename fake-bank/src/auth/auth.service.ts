import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/user.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/authResponse.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password.trim(), user.password);
    if (!isValid) return null;

    return user;
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.validateUser(input.email, input.password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new BadRequestException('An account with this email is already created.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.usersService.create({
      email: input.email,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
}
