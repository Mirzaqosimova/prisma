import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(data: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.usersRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async findByUsername(username: string) {
    return this.usersRepository.findByUsername(username);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }
}
