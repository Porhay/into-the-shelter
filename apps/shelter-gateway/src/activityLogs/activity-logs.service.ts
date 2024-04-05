import { DatabaseService, CreateActivityLogDto } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getActivityLogsByLobbyId(userId: string, lobbyId: string) {
    return await this.databaseService.getActivityLogsByLobbyId(userId, lobbyId);
  }

  async createActivityLog(activityLog: CreateActivityLogDto) {
    return await this.databaseService.createActivityLog(activityLog);
  }
}
