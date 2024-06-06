import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';

describe('ChatMessagesController', () => {
  let controller: ChatMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessagesController],
      providers: [ChatMessagesService],
    }).compile();

    controller = module.get<ChatMessagesController>(ChatMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
