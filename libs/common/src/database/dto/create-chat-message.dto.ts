export class CreateChatMessageDto {
  userId: string;
  lobbyId: string;
  text: string;
  mentionId?: string;
  replyTo?: string;
}
