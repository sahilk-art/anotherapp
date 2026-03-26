import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ScoringService } from './scoring.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'scoring',
})
export class ScoringGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly scoringService: ScoringService) {}

  @SubscribeMessage('joinMatch')
  handleJoinMatch(@MessageBody('matchId') matchId: string, @ConnectedSocket() client: Socket) {
    client.join(`match_${matchId}`);
    return { event: 'joinedMatch', data: matchId };
  }

  @SubscribeMessage('recordBall')
  async handleRecordBall(@MessageBody() data: any) {
    const updatedScore = await this.scoringService.recordBall(data);
    this.server.to(`match_${data.matchId}`).emit('scoreUpdate', updatedScore);
    return updatedScore;
  }
}
