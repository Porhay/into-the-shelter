import { DatabaseService, CreateActivityLogDto, constants } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getActivityLogsByLobbyId(userId: string, lobbyId: string) {
    return await this.databaseService.getActivityLogsByLobbyId(userId, lobbyId);
  }

  // await this.activityLogsService.createActivityLog({
  //   userId: data.userId,
  //   lobbyId: client.data.lobby.id,
  //   action: 'useSpecialCard',
  //   payload: text,
  // });

  async createActivityLog(data: CreateActivityLogDto) {
    if (data.action === constants.useSpecialCard) {
      const user = await this.databaseService.getUserById(data.userId);
      if (data.contestantId) {
        const contestant = await this.databaseService.getUserById(
          data.contestantId,
        );
        data.payload['text'] =
          `${user.displayName} used special card: ${data.payload.specialCard.text} on ${contestant.displayName}`;
      } else {
        data.payload['text'] =
          `${user.displayName} used special card: ${data.payload.specialCard.text}`;
      }
    }

    return await this.databaseService.createActivityLog(data);
  }
}
