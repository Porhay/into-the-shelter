import { DatabaseService, CreateActivityLogDto } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getActivityLogsByLobbyId(userId: string, lobbyId: string) {
    // suggest that client could send lobby key instead of uuid
    // const lobby = await this.databaseService.getLobbyByKeyOrNull(lobbyId);
    // if (!lobby) {
    //   return await this.databaseService.getActivityLogsByLobbyId(
    //     userId,
    //     lobbyId,
    //   );
    // }
    // return await this.databaseService.getActivityLogsByLobbyId(
    //   userId,
    //   lobby.id,
    // );
    return await this.databaseService.getActivityLogsByLobbyId(userId, lobbyId);
  }

  async createActivityLog(activityLog: CreateActivityLogDto) {
    return await this.databaseService.createActivityLog(activityLog);
  }
}
