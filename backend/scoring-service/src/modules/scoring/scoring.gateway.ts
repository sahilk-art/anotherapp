import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/scoring',
  cors: { origin: '*' },
})
export class ScoringGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
    } catch (e) {
      client.disconnect();
    }
  }

  @SubscribeMessage('join-match')
  handleJoinMatch(@ConnectedSocket() client: Socket, @MessageBody() data: { matchId: string }) {
    client.join(data.matchId);
    return { event: 'joined-match', data: data.matchId };
  }

  @SubscribeMessage('leave-match')
  handleLeaveMatch(@ConnectedSocket() client: Socket, @MessageBody() data: { matchId: string }) {
    client.leave(data.matchId);
    return { event: 'left-match', data: data.matchId };
  }

  broadcastScoreUpdate(matchId: string, data: any) {
    this.server.to(matchId).emit('score-update', data);
  }

  broadcastWicket(matchId: string, data: any) {
    this.server.to(matchId).emit('wicket-fallen', data);
  }

  broadcastMatchEnd(matchId: string, data: any) {
    this.server.to(matchId).emit('match-ended', data);
  }
}
