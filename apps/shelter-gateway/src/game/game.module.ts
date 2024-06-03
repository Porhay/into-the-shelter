import { Module } from '@nestjs/common';
// import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';
import { DatabaseModule } from '@app/common';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [ActivityLogsModule],
  providers: [
    // GameGateway,
    DatabaseModule,
    ActivityLogsModule,
    LobbyManager,
  ],
})
export class GameModule {}
