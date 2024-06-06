import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMessageDto } from './create-chat-message.dto';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {}
