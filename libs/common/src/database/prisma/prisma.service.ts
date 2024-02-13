import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

export class PrismaService {
  constructor() {
    prisma.$connect();
  }

  users = prisma.users;

  async disconnect() {
    await prisma.$disconnect();
  }
}