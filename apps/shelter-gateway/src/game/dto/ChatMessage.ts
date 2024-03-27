import { IsString } from 'class-validator';

export class ChatMessage {
  @IsString()
  sender: string;

  @IsString()
  message: string;

  @IsString()
  avatar: string;

  @IsString()
  timeSent: string;
}
