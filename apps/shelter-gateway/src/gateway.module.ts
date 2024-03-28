import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, FirebaseModule } from '@app/common';
import { StatusModule } from './status/status.module';
import { UploadsModule } from './uploads/uploads.module';
import { GameGateway } from './game/game.gateway';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LobbyManager } from './game/lobby/lobby.manager';
import { LobbiesController } from './lobbies/lobbies.controller';
import { LobbiesModule } from './lobbies/lobbies.module';
import config from 'config';

@Module({
  imports: [
    StatusModule,
    UploadsModule,
    GameModule,
    LobbiesModule,

    DatabaseModule,
    FirebaseModule,

    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [GameGateway, LobbyManager],
})
export class GatewayModule {}
