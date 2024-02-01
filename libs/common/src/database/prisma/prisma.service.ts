import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

export class PrismaService {
  constructor() {
    prisma.$connect();
  }

  user = prisma.user;

  async disconnect() {
    await prisma.$disconnect();
  }
}