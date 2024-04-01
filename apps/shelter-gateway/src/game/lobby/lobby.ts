import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types';
import { Instance } from '../instance/instance';
import { ServerEvents } from '../utils/ServerEvents';
import { ServerPayloads } from '../utils/ServerPayloads';
import { generateSixSymbolHash } from 'helpers';

export class Lobby {
  public readonly id: string = generateSixSymbolHash();
  public readonly createdAt: Date = new Date();
  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();
  public readonly instance: Instance = new Instance(this);
  public isPrivate: boolean = true;

  constructor(
    private readonly server: Server,
    public readonly maxClients: number,
  ) {}

  public addClient(client: AuthenticatedSocket, playerData: any = {}): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    let players = this.instance.players;
    const index = players.findIndex(
      (obj: { socketId: any }) => obj.socketId === playerData.id,
    );
    if (index !== -1) {
      players[index] = { ...playerData };
    } else {
      players.push({ ...playerData, isOrganizator: true }); // TODO: FIX !!!
    }
    players = players.filter((obj: object) => Object.keys(obj).length > 1);
    players = Array.from(
      new Map(
        players.map((obj: { userId: any }) => [obj.userId, obj]),
      ).values(),
    ); // remove dublicates
    this.instance.players = players;

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    // If player leave then the game isn't worth to play anymore
    this.instance.triggerFinish();

    // Alert the remaining player that client left lobby
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Opponent left lobby',
      },
    );

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      maxClients: this.maxClients,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      playersCount: this.clients.size,
      isSuspended: this.instance.isSuspended,
      players: this.instance.players,
      characteristics: this.instance.characteristics,
      conditions: this.instance.conditions,
      isPrivate: this.isPrivate,
      currentStage: this.instance.currentStage,
      stages: this.instance.stages,
      revealPlayerId: this.instance.revealPlayerId,
      voteKickList: this.instance.voteKickList,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
