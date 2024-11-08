import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUp } from './dto/sign-up-auth.dto';
import { UsersRepository } from 'src/users/users.repository';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(payload: SignUp) {
    const hasUser = await this.usersRepository.findByUsername(payload.username);
    if (hasUser) {
      throw new ConflictException('This user already exists');
    }
    const password = await this.hashPassword(payload.password);
    const result = await this.usersRepository.createUser({
      ...payload,
      role: Role.USER,
      password,
    });
    console.log(result);
    return {
      ...result,
      access_token: await this.generateJwt(result),
      refresh_token: await this.generateJwt(result),
    };
  }

  private async generateJwt(user: any) {
    return this.jwt.signAsync(user, {
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
      secret: this.config.get('JWT_SECRET'),
    });
  }

  private async generateRefreshToken(user: any) {
    try {
      const refreshToken = await this.jwt.signAsync(
        { user: user.id },
        {
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
          secret: this.config.get('JWT_REFRESH_SECRET'),
        },
      );

      return refreshToken;
    } catch (error) {
      throw error;
    }
  }
  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private comparePasswords(password: string, storePassword: string) {
    return bcrypt.compare(password, storePassword);
  }
  async login(payload: LoginDto) {
    const hasUser = await this.usersRepository.findByUsername(payload.username);
    if (!hasUser) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await this.comparePasswords(
      payload.password,
      hasUser.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException(`Invalid credentials`);
    }
    return {
      ...hasUser,
      access_token: await this.generateJwt(hasUser),
      refresh_token: await this.generateJwt(hasUser),
    };
  }
}
