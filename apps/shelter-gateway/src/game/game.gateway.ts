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

import { LobbyCreateDto } from './dto/LobbyCreate';
import { LobbyJoinDto } from './dto/LobbyJoin';
import { ChatMessage } from './dto/ChatMessage';
import { DatabaseService } from '@app/common';
import { ActivityLogsService } from '../activityLogs/activity-logs.service';

@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(GameGateway.name);
  constructor(
    private readonly lobbyManager: LobbyManager,
    private readonly databaseService: DatabaseService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

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
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage('client.chat.message')
  onChatMessage(client: AuthenticatedSocket, data: ChatMessage) {
    if (!client.data.lobby) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'You are not in a lobby',
      );
    }
    client.data.lobby.instance.sendChatMessage(data, client);
  }

  @SubscribeMessage(ClientEvents.LobbyCreate)
  async onLobbyCreate(
    client: AuthenticatedSocket,
    data: LobbyCreateDto,
  ): Promise<
    WsResponse<{ message: string; color?: 'green' | 'red' | 'blue' | 'orange' }>
  > {
    const lobby = this.lobbyManager.createLobby(data.maxClients);

    // data.player.socketId = client.id  // Cannot set properties of undefined (setting 'socketId')
    lobby.addClient(client);

    // store lobby in database
    const context = {
      key: lobby.id,
      organizatorId: data.organizatorId,
      settings: { maxClients: data.maxClients, isPrivate: true },
    };
    await this.databaseService.createLobby(context);

    return {
      event: ServerEvents.GameMessage,
      data: {
        color: 'green',
        message: 'Lobby created',
      },
    };
  }

  @SubscribeMessage(ClientEvents.LobbyUpdate)
  async onLobbyUpdate(client: AuthenticatedSocket, data: any): Promise<any> {
    let isPrivate, maxClients;
    if (data.isPrivate !== null || data.isPrivate !== undefined) {
      client.data.lobby.instance.isPrivate = data.isPrivate;
      isPrivate = data.isPrivate;
    }
    if (data.maxClients !== null || data.maxClients !== undefined) {
      client.data.lobby.instance.maxClients = data.maxClients;
      maxClients = data.maxClients;
    }

    // store lobby in database
    await this.databaseService.updateLobbyByKey(data.key, {
      settings: { isPrivate, maxClients },
    });

    return {
      event: ServerEvents.GameMessage,
      data: {
        color: 'green',
        message: 'Lobby updated',
      },
    };
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
    this.lobbyManager.joinLobby(data.lobbyId, client, data.player);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.GameStart)
  onGameStart(client: AuthenticatedSocket, data: any): void {
    client.data.lobby.instance.triggerStart(data, client);
  }

  @SubscribeMessage(ClientEvents.GameVoteKick)
  onVoteKick(client: AuthenticatedSocket, data: any): void {
    if (!client.data.lobby) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'You are not in a lobby',
      );
    }

    client.data.lobby.instance.voteKick(data, client);
  }

  @SubscribeMessage(ClientEvents.GameUseSpecialCard)
  async onUseSpecialCard(
    client: AuthenticatedSocket,
    data: any,
  ): Promise<void> {
    if (!client.data.lobby) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'You are not in a lobby',
      );
    }

    client.data.lobby.instance.useSpecialCard(data, client);
    console.log(5, data);

    // TODO: fix
    const user = client.data.lobby.instance.players.find(
      (player) => player.userId === data.userId,
    );
    let text: string = '';
    if (data.contestantId) {
      const contestant = client.data.lobby.instance.players.find(
        (player) => player.userId === data.contestantId,
      );
      text = `${user.displayName} used special card: ${data.specialCard.text} on ${contestant.displayName}`;
    } else {
      text = `${user.displayName} used special card: ${data.specialCard.text}`;
    }

    await this.activityLogsService.createActivityLog({
      userId: data.userId,
      lobbyId: client.data.lobby.id,
      action: 'specialCardUsed',
      payload: text,
    });
  }

  @SubscribeMessage(ClientEvents.GameRevealChar)
  onRevealChar(client: AuthenticatedSocket, data: any): void {
    if (!client.data.lobby) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'You are not in a lobby',
      );
    }

    client.data.lobby.instance.revealChar(data, client);
  }
}
