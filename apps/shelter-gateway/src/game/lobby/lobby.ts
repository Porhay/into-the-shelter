import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types';
import { Instance } from '../instance/instance';
import { ServerEvents } from '../utils/ServerEvents';
import { ServerPayloads } from '../utils/ServerPayloads';
import { generateSixSymbolHash } from 'helpers'

export class Lobby {
  public readonly id: string = generateSixSymbolHash();
  public readonly createdAt: Date = new Date();
  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();
  public readonly instance: Instance = new Instance(this);

  constructor(
    private readonly server: Server,
    public readonly maxClients: number,
  ) { }

  public addClient(client: AuthenticatedSocket, playerData: any = {}): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    if (this.clients.size >= this.maxClients) {
      this.instance.triggerStart();
    }

    const index = this.instance.players.findIndex((obj: { id: any; }) => obj.id === playerData.id);
    if (index !== -1) {
      this.instance.players[index] = playerData;
    } else {
      this.instance.players.push(playerData)
    }
    this.instance.players = this.instance.players.filter(obj => Object.keys(obj).length > 0)

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    // If player leave then the game isn't worth to play anymore
    this.instance.triggerFinish();

    // Alert the remaining player that client left lobby
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Opponent left lobby',
    });

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      mode: this.maxClients === 1 ? 'solo' : 'duo',
      delayBetweenRounds: this.instance.delayBetweenRounds,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      currentRound: this.instance.currentRound,
      playersCount: this.clients.size,
      cards: this.instance.cards.map(card => card.toDefinition()),
      isSuspended: this.instance.isSuspended,
      scores: this.instance.scores,
      players: this.instance.players
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}