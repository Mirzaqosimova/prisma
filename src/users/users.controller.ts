import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from 'src/config/const/enums';
import { Roles } from 'src/config/decorators/roles.decorator';
import { Public } from 'src/config/decorators/is-public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Post()
  async createUser(
    @Body()
    createUserDto: {
      username: string;
      password: string;
      role: 'ADMIN' | 'USER';
      full_name: string;
    },
  ) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }
}
