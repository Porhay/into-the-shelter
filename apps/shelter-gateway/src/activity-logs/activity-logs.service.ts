import { DatabaseService, CreateActivityLogDto, constants } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getActivityLogsByLobbyId(userId: string, lobbyId: string) {
    return await this.databaseService.getActivityLogsByLobbyId(userId, lobbyId);
  }

  async createActivityLog(data: CreateActivityLogDto) {
    let user: { displayName: string } =
      await this.databaseService.getUserByIdOrNull(data.userId);
    if (!user) {
      user = { displayName: 'bot' };
    }

    // use special card
    if (data.action === constants.useSpecialCard) {
      if (data.payload.contestantId) {
        const contestant = await this.databaseService.getUserByIdOrNull(
          data.payload.contestantId,
        );
        data.payload['text'] =
          `Player ${user.displayName} used special card: ${data.payload.specialCard.text} on ${contestant.displayName}.`;
      } else {
        data.payload['text'] =
          `Player ${user.displayName} used special card: ${data.payload.specialCard.text}.`;
      }
    }

    // vote kick
    if (data.action === constants.voteKick) {
      data.payload['text'] = `Player ${user.displayName} voted.`;
    }

    // reveal characteristic
    if (data.action === constants.revealChar) {
      data.payload['text'] =
        `Player ${user.displayName} revealed characteristic: ${data.payload.char.text}.`;
    }

    // player kicked
    if (data.action === constants.playerKicked) {
      let kickedUser: { displayName: string } =
        await this.databaseService.getUserByIdOrNull(data.payload.userId);
      if (!kickedUser) {
        kickedUser = { displayName: 'bot' };
      }
      data.payload['text'] = `Player ${kickedUser.displayName} is kicked.`;
    }

    // next stage started
    if (data.action === constants.nextStageStarted) {
      data.payload['text'] = `Stage ${data.payload.currentStage} is started.`;
    }

    return await this.databaseService.createActivityLog(data);
  }
}
