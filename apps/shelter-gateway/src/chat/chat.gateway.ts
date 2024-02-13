import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    this.server.emit('message', 'New client connected');
  }

  handleDisconnect(client: Socket) {
    this.server.emit('message', 'Client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { sender: string, message: string }) {
    this.server.emit('message', payload);
  }
}