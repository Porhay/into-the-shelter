import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

export class PrismaService {
  constructor() {
    prisma.$connect();
  }

  users = prisma.users;
  files = prisma.files;

  async disconnect() {
    await prisma.$disconnect();
  }
}
