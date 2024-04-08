import { DatabaseService, CreateActivityLogDto, constants } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getActivityLogsByLobbyId(userId: string, lobbyId: string) {
    return await this.databaseService.getActivityLogsByLobbyId(userId, lobbyId);
  }

  async createActivityLog(data: CreateActivityLogDto) {
    const user = await this.databaseService.getUserById(data.userId);

    // use special card
    if (data.action === constants.useSpecialCard) {
      if (data.payload.contestantId) {
        const contestant = await this.databaseService.getUserById(
          data.payload.contestantId,
        );
        data.payload['text'] =
          `${user.displayName} used special card: ${data.payload.specialCard.text} on ${contestant.displayName}.`;
      } else {
        data.payload['text'] =
          `${user.displayName} used special card: ${data.payload.specialCard.text}.`;
      }
    }

    // vote kick
    if (data.action === constants.voteKick) {
      data.payload['text'] = `${user.displayName} voted.`;
    }

    // reveal characteristic
    if (data.action === constants.revealChar) {
      data.payload['text'] =
        `${user.displayName} revealed characteristic: ${data.payload.char.text}.`;
    }

    return await this.databaseService.createActivityLog(data);
  }
}
