import { Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import { LOBBY_MAX_LIFETIME } from 'config';
import { Lobby } from './lobby';
import { AuthenticatedSocket } from '../types';
import { ServerException } from '../server.exception';
import { SocketExceptions } from '../utils/SocketExceptions';
import { ServerEvents } from '../utils/ServerEvents';
import { ServerPayloads } from '../utils/ServerPayloads';
import { DatabaseService } from '@app/common';

export class LobbyManager {
  constructor(private readonly databaseService: DatabaseService) {}
  public server: Server;
  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();
  public initializeSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
  }
  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(
    maxClients: number,
    databaseService,
    AIService,
    activityLogsService,
  ): Lobby {
    const lobby = new Lobby(
      this.server,
      maxClients,
      databaseService,
      AIService,
      activityLogsService,
    );
    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  public joinLobby(
    lobbyId: string,
    client: AuthenticatedSocket,
    playerData: any,
  ): void {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    if (lobby.clients.size > lobby.maxClients) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Lobby already full',
      );
    }

    // TODO: Game already started check here
    // if (lobby.instance.hasStarted) {
    //   throw new ServerException(
    //     SocketExceptions.LobbyError,
    //     'Game already started',
    //   );
    // }

    playerData.socketId = client.id;

    lobby.addClient(client, playerData);
  }

  /**
   * Periodically clean up lobbies
   * 1. 1h late and no users connected. If has users -> +1h
   * 2. no users and 10 min late
   */
  @Cron('*/10 * * * * *') // Runs every 1 minutes
  private async lobbiesCleaner(): Promise<void> {
    console.log('[GC] Lobbies cleaner has started!');
    console.log(this.lobbies);
    // console.log(await this.databaseService.getAllPublicLobbis());

    for (const [lobbyId, lobby] of this.lobbies) {
      if (lobby.clients.size > 0) {
        return;
      }

      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        //
      }
    }
    console.log('[GC] Lobbies cleaner has finished!');
  }

  private async deleteLobby(lobby: Lobby) {
    lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game timed out',
      },
    );
    lobby.instance.triggerFinish();

    // delete lobby

    this.lobbies.delete(lobby.id);
    console.log(`Lobby, id:${lobby.id} has deleted!`);
  }
}
