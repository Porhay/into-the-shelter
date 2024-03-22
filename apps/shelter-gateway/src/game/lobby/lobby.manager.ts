import { Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import { LOBBY_MAX_LIFETIME } from 'config';

import { Lobby } from './lobby';
import { AuthenticatedSocket } from '../types';
import { ServerException } from '../server.exception';
import { SocketExceptions } from '../utils/SocketExceptions';
import { ServerEvents } from '../utils/ServerEvents';
import { ServerPayloads } from '../utils/ServerPayloads';


export class LobbyManager {
  public server: Server;
  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();
  public initializeSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
  }
  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(maxClients: number): Lobby {
    const lobby = new Lobby(this.server, maxClients);
    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket, playerData: any): void {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    if (lobby.clients.size >= lobby.maxClients) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby already full');
    }

    playerData.socketId = client.id

    lobby.addClient(client, playerData);
  }

  // Periodically clean up lobbies
  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = (new Date()).getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
          color: 'blue',
          message: 'Game timed out',
        });

        lobby.instance.triggerFinish();

        this.lobbies.delete(lobby.id);
      }
    }
  }
}