import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes } from '@nestjs/common';
import { WsValidationPipe } from '../websocket/ws.validation-pipe';
import { LobbyManager } from './lobby/lobby.manager';
import { AuthenticatedSocket } from './types';
import { ServerException } from './server.exception';

import { ClientEvents } from './utils/ClientEvents';
import { ServerEvents } from './utils/ServerEvents';
import { SocketExceptions } from './utils/SocketExceptions';
import { ServerPayloads } from './utils/ServerPayloads';

import { LobbyCreateDto } from './dto/LobbyCreate';
import { LobbyJoinDto } from './dto/LobbyJoin';
import { RevealCardDto } from './dto/RevealCard';
import { ChatMessage } from './dto/ChatMessage';


@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(GameGateway.name);
  constructor(private readonly lobbyManager: LobbyManager) { }

  afterInit(server: Server): any {
    this.lobbyManager.server = server; // Pass server instance to managers
    this.logger.log('Game server initialized !');
  }
  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    this.lobbyManager.initializeSocket(client as AuthenticatedSocket); // Call initializers to set up socket
  }
  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    this.lobbyManager.terminateSocket(client); // Handle termination of socket
  }


  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: AuthenticatedSocket): void {
    this.logger.log('Ping Pong !');
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage('client.chat.message')
  onChatMessage(client: AuthenticatedSocket, data: ChatMessage) {
    this.logger.log(`server.chat.message ! ${JSON.stringify(data)}`);
    if (!client.data.lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'You are not in a lobby');
    }
    // return {
    //   event: ServerEvents.ChatMessage,
    //   data: data,
    // };
    // client.emit(ServerEvents.ChatMessage, data);
    client.data.lobby.instance.sendChatMessage(data, client);
  }

  @SubscribeMessage(ClientEvents.LobbyCreate)
  onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto): WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
    this.logger.log('LobbyCreate !');
    const lobby = this.lobbyManager.createLobby(data.mode);

    lobby.addClient(client, data.player);

    return {
      event: ServerEvents.GameMessage,
      data: {
        color: 'green',
        message: 'Lobby created',
      },
    };
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
    this.logger.log('onLobbyJoin');
    console.log(data);
    
    this.lobbyManager.joinLobby(data.lobbyId, client, data.player);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.GameRevealCard)
  onRevealCard(client: AuthenticatedSocket, data: RevealCardDto): void {
    if (!client.data.lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'You are not in a lobby');
    }

    client.data.lobby.instance.revealCard(data.cardIndex, client);
  }
}