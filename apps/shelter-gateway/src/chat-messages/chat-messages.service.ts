import { DatabaseService, constants } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessagesService {
  constructor(private readonly databaseService: DatabaseService) {}

  // TODO: add caching
  async getAllByLobbyId(lobbyId: string) {
    const messages = // id, userId, lobbyId, text, mentionId, replyTo, created_at, updated_at
      await this.databaseService.getChatMessagesByLobbyId(lobbyId);

    // to avoid useless db calls
    const userMap: { [userId: string]: any } = {};

    const res: any[] = [];
    for (const m of messages) {
      if (!userMap[m.userId]) {
        let user: any = await this.databaseService.getUserByIdOrNull(m.userId);
        // means that user is bot
        if (user) {
          userMap[user.id] = user;
        } else {
          user = constants.allBots.find((bot) => bot.userId === m.userId);
          userMap[user.userId] = user;
        }
      }
      const message = {
        sender: userMap[m.userId].displayName,
        senderId: m.userId,
        message: m.text,
        avatar: userMap[m.userId].avatar,
        timeSent: parseTimeStr(m.createdAt),
      };
      res.push(message);
    }
    return res; // return in chat message format
  }
}

function parseTimeStr(date: Date) {
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hour}:${minute}`;
  return timeStr;
}
