import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ActivityGateway {
  @WebSocketServer()
  server: Server;

  notifyActivityStart(userId: number) {
    this.server.emit('activityStarted', { userId, timestamp: new Date() });
  }

  notifyActivityEnd(userId: number) {
    this.server.emit('activityEnded', { userId, timestamp: new Date() });
  }
}
