import { Module } from '@nestjs/common';
// import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';

@Module({
  providers: [
    // GameGateway,
    LobbyManager,
  ],
})
export class GameModule {}
