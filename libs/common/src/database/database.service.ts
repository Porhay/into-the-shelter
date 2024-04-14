import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { updateUserRequest } from 'apps/shelter-accounts/src/users/dto/updateUser.request';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { CreateLobbyContestantDto } from './dto/create-lobby-contestant.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  //  -----------
  //  USERS TABLE
  //  -----------

  async createUser(user: CreateUserDto) {
    return this.prisma.users.create({
      data: user,
    });
  }

  async updateUser(userId: string, data: updateUserRequest) {
    return await this.prisma.users.update({
      where: { id: userId },
      data: data,
    });
  }

  async deleteUser(userId: string) {
    // Check if the user exists
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Delete the user
    return this.prisma.users.delete({
      where: { id: userId },
    });
  }

  async getUserById(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      new Error(`User with email ${email} not found`);
    }

    return user || null;
  }

  //  -----------
  //  FILES TABLE
  //  -----------

  async createFile(file: CreateFileDto) {
    return this.prisma.files.create({
      data: file,
    });
  }

  async deleteFile(fileId: string) {
    const file = await this.prisma.files.findUnique({ where: { id: fileId } });
    if (!file) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    return this.prisma.files.delete({
      where: { id: fileId },
    });
  }

  async getFileById(fileId: string) {
    const file = await this.prisma.files.findUnique({ where: { id: fileId } });
    if (!file) {
      throw new Error(`File with ID ${fileId} not found`);
    }
    return file;
  }

  async getFilesByUserId(userId: string, type: string = null) {
    const files = await this.prisma.files.findMany({
      where: { userId: userId, type: type },
    });
    if (!files) {
      return null;
    }
    return files;
  }

  //  -----------
  //  LOBBIES TABLE
  //  -----------

  async createLobby(lobby: CreateLobbyDto) {
    const data = {
      key: lobby.key,
      organizatorId: lobby.organizatorId,
      settings: JSON.stringify(lobby.settings),
    };
    return this.prisma.lobbies.create({
      data: data,
    });
  }

  async updateLobbyByKey(key: string, data: any) {
    const lobbyByKey = await this.getLobbyByKeyOrNull(key);
    if (!lobbyByKey) {
      throw new Error(`Lobby with key ${key} not found`);
    }

    const lobby = await this.getLobbyByIdOrNull(lobbyByKey.id);

    // Merge objects manually
    const newSettings = {
      maxClients:
        data.settings.maxClients !== undefined
          ? data.settings.maxClients
          : lobby.settings.maxClients,
      isPrivate:
        data.settings.isPrivate !== undefined
          ? data.settings.isPrivate
          : lobby.settings.isPrivate,
      timer:
        data.settings.timer !== undefined
          ? data.settings.timer
          : lobby.settings.timer,
      isAllowBots:
        data.settings.isAllowBots !== undefined
          ? data.settings.isAllowBots
          : lobby.settings.isAllowBots,
    };

    // Update lobby settings with the merged object
    lobby.settings = JSON.stringify(newSettings);

    return await this.prisma.lobbies.update({
      where: { id: lobby.id },
      data: lobby,
    });
  }

  async deleteLobby(lobbyId: string) {
    const lobby = await this.prisma.lobbies.findUnique({
      where: { id: lobbyId },
    });
    if (!lobby) {
      throw new Error(`Lobby with ID ${lobbyId} not found`);
    }

    return this.prisma.lobbies.delete({
      where: { id: lobbyId },
    });
  }

  async getLobbyByIdOrNull(lobbyId: string): Promise<any> {
    const lobby = await this.prisma.lobbies.findUnique({
      where: { id: lobbyId },
    });
    if (!lobby) {
      return null;
    }
    lobby.settings = JSON.parse(lobby.settings);
    return lobby;
  }

  async getLobbyByKeyOrNull(key: string): Promise<any> {
    const lobby = await this.prisma.lobbies.findFirst({
      where: { key: key },
    });
    if (!lobby) {
      return null;
    }
    lobby.settings = JSON.parse(lobby.settings);
    return lobby;
  }

  async getAllPublicLobbis() {
    const lobbies = await this.prisma.lobbies.findMany();
    const res = lobbies.filter(
      (lobby) => JSON.parse(lobby.settings).isPrivate === false,
    );
    return res;
  }

  //  -----------
  //  LOBBY_CONTESTANTS TABLE
  //  -----------

  async createLobbyConstantent(lobbyContestant: CreateLobbyContestantDto) {
    return this.prisma.lobbyContestants.create({
      data: lobbyContestant,
    });
  }

  async deleteLobbyConstantent(contestantId: string) {
    const contestant = await this.prisma.lobbyContestants.findUnique({
      where: { id: contestantId },
    });
    if (!contestant) {
      throw new Error(`Contestant with ID ${contestantId} not found`);
    }

    return this.prisma.lobbyContestants.delete({
      where: { id: contestantId },
    });
  }

  async getLobbyConstantentById(contestantId: string) {
    const contestant = await this.prisma.lobbyContestants.findUnique({
      where: { id: contestantId },
    });
    if (!contestant) {
      throw new Error(`Contestant with ID ${contestantId} not found`);
    }
    return contestant;
  }

  //  -----------
  //  CHAR_MESSAGES TABLE
  //  -----------

  async createChatMessage(message: CreateChatMessageDto) {
    return this.prisma.chatMessages.create({
      data: message,
    });
  }

  async deleteChatMessage(messageId: string) {
    const message = await this.prisma.chatMessages.findUnique({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error(`Message with ID ${messageId} not found`);
    }

    return this.prisma.chatMessages.delete({
      where: { id: messageId },
    });
  }

  async deleteChatMessagesByLobbyId(lobbyId: string) {
    const messages = await this.prisma.chatMessages.findMany({
      where: { userId: lobbyId },
    });
    if (!messages || messages.length === 0) {
      return null;
    }
    return messages;
  }

  async getChatMessageById(messageId: string) {
    const message = await this.prisma.chatMessages.findUnique({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error(`Message with ID ${messageId} not found`);
    }
    return message;
  }

  //  -----------
  //  ACTIVITY_LOGS TABLE
  //  -----------

  async createActivityLog(activityLog: CreateActivityLogDto) {
    activityLog.payload = JSON.stringify(activityLog.payload);
    return this.prisma.activityLogs.create({
      data: activityLog,
    });
  }

  async getActivityLogsByLobbyId(userId: string, lobbyId: string) {
    const activityLogs = await this.prisma.activityLogs.findMany({
      where: { lobbyId: lobbyId },
    });
    if (activityLogs.length === 0) {
      return [];
    }

    for (const log of activityLogs) {
      log.payload = JSON.parse(log.payload);
    }
    return activityLogs;
  }
}
