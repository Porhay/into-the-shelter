import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DatabaseService } from './database.service';

@Module({
  providers: [PrismaService, DatabaseService],
  exports: [PrismaService, DatabaseService],
})
export class DatabaseModule {}
