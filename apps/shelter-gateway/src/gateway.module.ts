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
import { ActivityLogsModule } from './activityLogs/activity-logs.module';
import config from 'config';
import { ActivityLogsService } from './activityLogs/activity-logs.service';

@Module({
  imports: [
    StatusModule,
    UploadsModule,
    GameModule,
    LobbiesModule,
    ActivityLogsModule,

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
