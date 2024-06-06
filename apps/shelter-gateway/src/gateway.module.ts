import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, FirebaseModule, AIModule } from '@app/common';
import { StatusModule } from './status/status.module';
import { UploadsModule } from './uploads/uploads.module';
import { GameGateway } from './game/game.gateway';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LobbyManager } from './game/lobby/lobby.manager';
import { LobbiesModule } from './lobbies/lobbies.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { ActivityLogsService } from './activity-logs/activity-logs.service';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import config from 'config';

@Module({
  imports: [
    StatusModule,
    UploadsModule,
    GameModule,
    LobbiesModule,
    ActivityLogsModule,
    ChatMessagesModule,

    DatabaseModule,
    FirebaseModule,
    AIModule,

    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [GameGateway, LobbyManager, ActivityLogsService],
})
export class GatewayModule {}
