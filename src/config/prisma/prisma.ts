import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Pass any Prisma options here
    super();
  }

  // Called when the module is initialized
  async onModuleInit() {
    await this.$connect();
  }

  // Called when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
