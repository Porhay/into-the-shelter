import { Controller, Get, Param } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';

@Controller('lobbies/:lobbyId/chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Get('')
  getAllByLobbyId(@Param('lobbyId') lobbyId: string) {
    return this.chatMessagesService.getAllByLobbyId(lobbyId);
  }
}
