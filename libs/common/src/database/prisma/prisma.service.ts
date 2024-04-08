import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

export class PrismaService {
  constructor() {
    prisma.$connect();
  }

  users = prisma.users;
  files = prisma.files;
  lobbies = prisma.lobbies;
  lobbyContestants = prisma.lobbyContestants;
  chatMessages = prisma.chatMessages;
  activityLogs = prisma.activityLogs;

  async disconnect() {
    await prisma.$disconnect();
  }
}
